import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/app/context/AuthContext";
import { useBlockchain } from "@/app/context/BlockchainContext";
import api from "@/shared/services/api";

const EXPLORER_BASE_URL = import.meta.env.VITE_BLOCKCHAIN_EXPLORER_BASE_URL || 'https://polygonscan.com';

const getMockLaporanDetail = (id) => {
  return {
    id,
    nama_perusahaan: "Data dari Blockchain (Loading...)",
    error: "Silakan tunggu atau cek blockchain connection"
  };
};

export const useVerification = () => {
  const [scanResult, setScanResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState(null);
  const [deviceId, setDeviceId] = useState("");
  const [devices, setDevices] = useState([]);
  const [parsedData, setParsedData] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [scannerReady, setScannerReady] = useState(false);
  const [useManualInput, setUseManualInput] = useState(false);
  const [manualQRCode, setManualQRCode] = useState("");
  const [laporanDetail, setLaporanDetail] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [loadingLaporan, setLoadingLaporan] = useState(false);
  const [blockchainReady, setBlockchainReady] = useState(false);
  const [blockchainError, setBlockchainError] = useState(null);
  const [blockchainData, setBlockchainData] = useState(null);
  const [qrDataParsed, setQrDataParsed] = useState(null);
  const [cameraStarted, setCameraStarted] = useState(false);

  const { isAuthenticated } = useAuth();
  const blockchainContext = useBlockchain();
  const videoRef = useRef(null);

  const playBeepSound = (type = 'success') => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      if (type === 'success') {
        oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.25);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.25);
      } else if (type === 'warning') {
        oscillator.frequency.value = 660;
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.15);
      } else if (type === 'triple') {
        oscillator.frequency.value = 800;
        gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.25, audioContext.currentTime + 0.08);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.08);
        gainNode.gain.setValueAtTime(0.25, audioContext.currentTime + 0.12);
        gainNode.gain.setValueAtTime(0.25, audioContext.currentTime + 0.20);
        gainNode.gain.setValueAtTime(0, audioContext.currentTime + 0.20);
        gainNode.gain.setValueAtTime(0.25, audioContext.currentTime + 0.24);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.32);
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.32);
      }
    } catch (err) {
      console.log('[useVerification] Beep sound not available:', err.message);
    }
  };

  useEffect(() => {
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => {
          track.stop();
        });
        videoRef.current.srcObject = null;
      }
      setScanning(false);
    };
  }, []);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setScanning(false);
        if (videoRef.current?.srcObject) {
          videoRef.current.srcObject.getTracks().forEach(track => track.stop());
          videoRef.current.srcObject = null;
        }
      } else {
        if (scanResult && laporanDetail) {
          return;
        }
        if (scannerReady && !useManualInput && cameraStarted) {
          setScanning(true);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [scannerReady, useManualInput, scanResult, laporanDetail, cameraStarted]);

  useEffect(() => {
    const loadScanner = async () => {
      try {
        setScannerReady(true);
        console.log('[useVerification] Scanner ready (using browser API)');
      } catch (err) {
        console.error('[useVerification] Failed to load scanner component:', err);
        setError('❌ QR Scanner tidak tersedia. Gunakan input manual atau upload gambar.');
        setUseManualInput(true);
      }
    };

    loadScanner();
  }, []);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const allDevices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = allDevices.filter(d => d.kind === 'videoinput');
        setDevices(videoDevices);

        if (videoDevices.length > 0) {
          const backCamera = videoDevices.find(d => d.label.toLowerCase().includes('back'));
          setDeviceId(backCamera?.deviceId || videoDevices[0].deviceId);

          if (scannerReady && !useManualInput) {
            setScanning(true);
          }
        }
      } catch (err) {
        console.error('[useVerification] Error getting devices:', err);
        setError('❌ Tidak dapat mengakses kamera.');
        setUseManualInput(true);
      }
    };

    if (scannerReady) {
      getDevices();
    }
  }, [scannerReady]);

  useEffect(() => {
    if (!scanning || !scannerReady) return;

    let isActive = true;

    const startCamera = async () => {
      try {
        // Wait for video element to mount
        for (let i = 0; i < 20; i++) {
          if (videoRef.current) break;
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        if (!isActive || !videoRef.current) return;

        const constraints = {
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 }
          },
          audio: false
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const video = videoRef.current;

        if (video) {
          video.srcObject = stream;
          await video.play().catch(err => {
            console.error('[useVerification] Video play error:', err);
          });
        }

        setError(null);
      } catch (err) {
        console.error('[useVerification] Camera access error:', err);
        handleError(err);
      }
    };

    startCamera();

    return () => {
      isActive = false;
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => {
          track.stop();
        });
      }
    };
  }, [scanning, scannerReady, deviceId]);

  useEffect(() => {
    if (!scanning || !scannerReady) return;

    let animationFrameId = null;
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    let lastScannedData = null;
    let scannedCount = 0;

    const scanFrame = async () => {
      try {
        const video = videoRef.current;
        if (!video || !video.srcObject) {
          scannedCount++;
          if (scannedCount < 100) {
            animationFrameId = requestAnimationFrame(scanFrame);
          }
          return;
        }

        if (video.readyState === video.HAVE_ENOUGH_DATA) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

          try {
            const { default: jsQR } = await import('jsqr');
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

            if (code && code.data && code.data !== lastScannedData) {
              lastScannedData = code.data;
              await processQRData(code.data);
              return;
            }
          } catch (err) {
          }
        }

        animationFrameId = requestAnimationFrame(scanFrame);
      } catch (err) {
        animationFrameId = requestAnimationFrame(scanFrame);
      }
    };

    animationFrameId = requestAnimationFrame(scanFrame);

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [scanning, scannerReady]);

  useEffect(() => {
    if (blockchainContext?.isReady) {
      setBlockchainReady(true);
      setBlockchainError(null);
    } else {
      setBlockchainReady(false);
    }
  }, [blockchainContext?.isReady]);

  const handleError = (error) => {
    console.error('[useVerification] Scan error:', error);

    if (error?.name === 'NotAllowedError') {
      setError('❌ Izin kamera ditolak. Silakan izinkan akses kamera di pengaturan browser.');
    } else if (error?.name === 'NotFoundError') {
      setError('❌ Kamera tidak ditemukan.');
    } else if (error?.name === 'NotSupportedError') {
      setError('❌ Browser tidak mendukung akses kamera.');
    } else {
      setError('❌ Gagal mengakses kamera. Gunakan input manual.');
    }

    setScanning(false);
    setUseManualInput(true);
    toast.error(error?.message || 'Gagal mengakses kamera');
  };

  const fetchLaporanDetail = async (laporanId) => {
    setLoadingLaporan(true);
    try {
      let laporan = null;
      let lastError = null;

      if (blockchainData?.blockchain_doc_hash) {
        const immediateData = {
          id: laporanId,
          blockchain_doc_hash: blockchainData.blockchain_doc_hash,
          blockchain_tx_hash: blockchainData.blockchain_tx_hash,
          blockchain_verified: blockchainData.blockchain_verified || true,
          is_implemented: false
        };
        setLaporanDetail(immediateData);
      }

      if (blockchainReady && qrDataParsed?.blockchain_doc_hash) {
        try {
          laporan = await blockchainContext.getDocument(qrDataParsed.blockchain_doc_hash);

          if (laporan) {
            setLaporanDetail(laporan);
            setShowDetailModal(true);
            toast.success("🔗 Data berhasil diambil dari Polygon Blockchain!");
            setLoadingLaporan(false);
            return;
          }
        } catch (blockchainErr) {
          lastError = blockchainErr;
        }
      }

      try {
        const response = await api.get(`/perencanaan/${laporanId}/public`, {
          timeout: 5000,
        });

        laporan = response.data?.data || response.data;

        if (laporan) {
          if (laporan.blockchain && typeof laporan.blockchain === 'object') {
            laporan.blockchain_doc_hash = laporan.blockchain.doc_hash || laporan.blockchain_doc_hash;
            laporan.blockchain_tx_hash = laporan.blockchain.tx_hash || laporan.blockchain_tx_hash;
            laporan.blockchain_verified = laporan.blockchain.verified !== undefined ? laporan.blockchain.verified : true;
          }

          if (blockchainData) {
            laporan.blockchain_doc_hash = blockchainData.blockchain_doc_hash || laporan.blockchain_doc_hash;
            laporan.blockchain_tx_hash = blockchainData.blockchain_tx_hash || laporan.blockchain_tx_hash;
            laporan.blockchain_verified = blockchainData.blockchain_verified !== undefined ? blockchainData.blockchain_verified : laporan.blockchain_verified;
          }

          setLaporanDetail(laporan);
          setShowDetailModal(true);
          toast.success("📊 Detail laporan berhasil dimuat dari server!");
          setLoadingLaporan(false);
          return;
        }
      } catch (publicErr) {
        if (publicErr.response?.status === 404) {
          console.log(`[useVerification] ID ${laporanId} not found on server, using fallback`);
        }
        lastError = publicErr;
      }

      if (isAuthenticated) {
        try {
          const response = await api.get(`/perencanaan/${laporanId}`);
          laporan = response.data?.data || response.data;

          if (laporan) {
            if (laporan.blockchain && typeof laporan.blockchain === 'object') {
              laporan.blockchain_doc_hash = laporan.blockchain.doc_hash || laporan.blockchain_doc_hash;
              laporan.blockchain_tx_hash = laporan.blockchain.tx_hash || laporan.blockchain_tx_hash;
              laporan.blockchain_verified = laporan.blockchain.verified !== undefined ? laporan.blockchain.verified : true;
            }

            if (blockchainData) {
              laporan.blockchain_doc_hash = blockchainData.blockchain_doc_hash || laporan.blockchain_doc_hash;
              laporan.blockchain_tx_hash = blockchainData.blockchain_tx_hash || laporan.blockchain_tx_hash;
              laporan.blockchain_verified = blockchainData.blockchain_verified !== undefined ? blockchainData.blockchain_verified : laporan.blockchain_verified;
            }

            setLaporanDetail(laporan);
            setShowDetailModal(true);
            toast.success("📊 Detail laporan berhasil dimuat!");
            setLoadingLaporan(false);
            return;
          }
        } catch (authErr) {
          lastError = authErr;
        }
      }

      if (parsedData && typeof parsedData === 'object' && parsedData.id) {
        laporan = { ...parsedData };

        if (blockchainData) {
          laporan.blockchain_doc_hash = blockchainData.blockchain_doc_hash;
          laporan.blockchain_tx_hash = blockchainData.blockchain_tx_hash;
          laporan.blockchain_verified = blockchainData.blockchain_verified;
        }

        setLaporanDetail(laporan);
        setShowDetailModal(true);
        toast.info("💡 Menampilkan data dari QR Code", { autoClose: 2000 });
        setLoadingLaporan(false);
        return;
      }

      const mockLaporan = getMockLaporanDetail(laporanId);
      if (mockLaporan) {
        laporan = mockLaporan;
        setLaporanDetail(laporan);
        setShowDetailModal(true);
        toast.info("💡 Menampilkan data demo", { autoClose: 2000 });
        setLoadingLaporan(false);
        return;
      }

      throw lastError || new Error('Tidak dapat memuat detail laporan dari semua sumber');

    } catch (err) {
      console.error('[useVerification] All fetch attempts failed:', err);
      toast.warning("⚠️ Tidak dapat memuat detail lengkap - menampilkan data QR Code");
      if (parsedData) {
        setLaporanDetail(parsedData);
      } else {
        setLaporanDetail(null);
      }
    } finally {
      setLoadingLaporan(false);
    }
  };

  const verifyBlockchainData = async () => {
    if (!qrDataParsed?.verification?.docHash) {
      toast.warning("⚠️ No blockchain data in QR code");
      return;
    }

    try {
      toast.info("🔍 Verifying on Polygon blockchain...", { autoClose: 3000 });

      if (blockchainContext?.isReady) {
        const blockchainVerified = await Promise.race([
          blockchainContext.verifyDocumentHash(qrDataParsed.verification.docHash),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Verification timeout')), 8000)
          )
        ]);

        if (blockchainVerified.verified) {
          toast.success("🔗 ✅ Verified on Polygon blockchain!", { autoClose: 4000 });

          setLaporanDetail({
            ...laporanDetail,
            ...blockchainVerified.metadata,
            blockchain_verified: true,
            blockchain_doc_id: blockchainVerified.docId,
            blockchain_timestamp: blockchainVerified.timestampISO,
            blockchain_uploader: blockchainVerified.uploader
          });
        } else {
          toast.warning("⚠️ Document not yet on blockchain - showing QR data");
        }
      } else {
        toast.warning("⚠️ Blockchain service not ready - showing QR data");
      }
    } catch (err) {
      if (err.message.includes('timeout')) {
        toast.error("❌ Verification timeout - blockchain slow, showing QR data");
      } else if (err.message.includes('Verification timeout')) {
        toast.error("❌ Verification timeout - blockchain service not responding");
      } else {
        toast.error("❌ Verification failed: " + err.message);
      }
    }
  };

  const processQRData = async (qrData) => {
    try {
      if (!qrData || typeof qrData !== 'string') {
        toast.error('❌ Format QR code tidak valid');
        return;
      }

      if (qrData === scanResult) {
        toast.info('Info: Anda sudah melakukan scan pada QR Code ini.');
        return;
      }

      const trimmedData = qrData.trim();

      let parsed = null;
      
      // Check if it's a URL first
      if (/^https?:\/\//i.test(trimmedData)) {
        console.log('[useVerification] URL detected in QR code:', trimmedData);
        
        try {
          const parsedUrl = new URL(trimmedData);
          if (parsedUrl.pathname.includes('/public/laporan/') || parsedUrl.pathname.includes('/laporan/')) {
            // Extract ID from URL path
            const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
            const laporanId = pathParts[pathParts.length - 1];
            
            if (laporanId) {
              parsed = {
                id: laporanId,
                type: 'URL_LAPORAN',
                source: 'QR_CODE_URL'
              };
              
              playBeepSound('success');
              toast.success("✅ QR Code scanned successfully!");
              setQrDataParsed(parsed);
              setScanResult(qrData);
              setScanning(false);
              setError(null);
              
              // Fetch laporan detail
              await fetchLaporanDetail(laporanId);
              return;
            }
          }
        } catch (urlErr) {
          console.error('[useVerification] URL parsing error:', urlErr);
        }
      }
      
      // Try JSON parsing if not URL
      try {
        parsed = JSON.parse(trimmedData);
      } catch (jsonErr) {
        console.log('[useVerification] Not JSON format, checking for raw text:', jsonErr.message);
      }

      if (parsed && typeof parsed === 'object') {
        if (parsed.type === 'PERENCANAAN_BLOCKCHAIN') {
          playBeepSound('success');
          toast.success("✅ QR Code scanned successfully!");
          setQrDataParsed(parsed);
          setScanResult(qrData);
          setScanning(false);
          setError(null);

          if (parsed.verification?.docHash) {
            setBlockchainData({
              blockchain_doc_hash: parsed.verification.docHash,
              blockchain_tx_hash: parsed.verification.txHash,
              blockchain_verified: true
            });
          }

          if (parsed.data && Object.keys(parsed.data).length > 0) {
            setParsedData(parsed.data);
            setLaporanDetail(parsed.data);
            setShowDetailModal(true);
            toast.info("📊 Showing data from QR code", { autoClose: 2000 });
          } else {
            const minimalData = {
              id: parsed.verification?.docId || 'unknown',
              type: 'PERENCANAAN_BLOCKCHAIN',
              blockchain_verified: true,
              blockchain_doc_hash: parsed.verification?.docHash,
              blockchain_tx_hash: parsed.verification?.txHash
            };
            setParsedData(minimalData);
            setLaporanDetail(minimalData);
            setShowDetailModal(true);
          }

          if (parsed.verification?.docHash && blockchainContext?.isReady) {
            setTimeout(() => {
              verifyBlockchainData();
            }, 500);
          }
          return;
        }

        if (parsed.id || parsed.docHash || parsed.verified !== undefined) {
          playBeepSound('success');
          toast.success("✅ QR Code scanned successfully!");
          setScanResult(qrData);
          setScanning(false);
          setError(null);

          const bcData = {
            id: parsed.id || 'unknown',
            blockchain_doc_hash: parsed.docHash || parsed.blockchain_doc_hash,
            blockchain_tx_hash: parsed.txHash || parsed.blockchain_tx_hash,
            blockchain_verified: parsed.verified || false,
            source: 'QR_CODE'
          };

          setBlockchainData(bcData);
          setParsedData(bcData);
          setLaporanDetail(bcData);
          setShowDetailModal(true);
          setQrDataParsed(parsed);

          toast.info("📊 Blockchain data from QR code", { autoClose: 2000 });

          if (parsed.id) {
            await fetchLaporanDetail(parsed.id);
          }
          return;
        }

        if (Object.keys(parsed).length > 0) {
          playBeepSound('success');
          toast.success("✅ QR Code data received");
          setScanResult(qrData);
          setScanning(false);
          setError(null);

          if (parsed.blockchain_doc_hash || parsed.docHash) {
            const bcData = {
              blockchain_doc_hash: parsed.blockchain_doc_hash || parsed.docHash,
              blockchain_tx_hash: parsed.blockchain_tx_hash || parsed.txHash,
              blockchain_verified: parsed.blockchain_verified !== undefined ? parsed.blockchain_verified : false
            };
            setBlockchainData(bcData);
          }

          setParsedData(parsed);
          setLaporanDetail(parsed);
          setShowDetailModal(true);

          if (parsed.id) {
            await fetchLaporanDetail(parsed.id);
          }
          return;
        }
      }

      if (/^https?:\/\//i.test(trimmedData)) {
        try {
          const parsedUrl = new URL(trimmedData);
          if (parsedUrl.pathname.includes('/monitoring-access/')) {
            const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
            const perencanaanId = pathParts[pathParts.length - 1];
            const docHash = parsedUrl.searchParams.get('docHash');
            const txHash = parsedUrl.searchParams.get('txHash');

            playBeepSound('success');
            setScanResult(qrData);
            setScanning(false);
            setError(null);

            const qrPayload = {
              type: 'MONITORING_ACCESS_URL',
              id: perencanaanId,
              monitoringAccessUrl: trimmedData,
              verification: {
                docHash,
                txHash,
              },
            };

            setQrDataParsed(qrPayload);
            setParsedData({
              id: perencanaanId,
              blockchain_doc_hash: docHash,
              blockchain_tx_hash: txHash,
              source: 'MONITORING_ACCESS_URL',
            });
            setBlockchainData({
              blockchain_doc_hash: docHash,
              blockchain_tx_hash: txHash,
            });

            setLaporanDetail({
              id: perencanaanId,
              type: 'MONITORING_ACCESS_URL',
              monitoringAccessUrl: trimmedData,
              blockchain_doc_hash: docHash,
              blockchain_tx_hash: txHash,
              source: 'MONITORING_ACCESS_URL',
            });
            setShowDetailModal(true);

            toast.success('✅ QR terdeteksi, menampilkan detail di modal...');

            if (perencanaanId) {
              await fetchLaporanDetail(perencanaanId);
            }
            return;
          }
        } catch (urlErr) {
        }
      }

      if (/^\d+$/.test(trimmedData)) {
        const numericId = parseInt(trimmedData);
        playBeepSound('triple');
        toast.success("✅ ID detected, loading data...");
        setScanResult(qrData);
        setParsedData({ id: numericId, type: 'NUMERIC_ID' });
        setScanning(false);
        setError(null);
        await fetchLaporanDetail(numericId);
        return;
      }

      if (trimmedData.startsWith('0x') && (trimmedData.length === 66 || trimmedData.length === 130)) {
        playBeepSound('success');
        toast.info("🔗 Blockchain hash detected, verifying...");
        setScanResult(qrData);

        const bcData = {
          blockchain_doc_hash: trimmedData,
          type: 'BLOCKCHAIN_HASH'
        };
        setBlockchainData(bcData);
        setParsedData(bcData);

        setScanning(false);
        setError(null);

        if (blockchainContext?.isReady) {
          try {
            const blockchainResponse = await blockchainContext.verifyDocumentHash(trimmedData);
            if (blockchainResponse?.verified) {
              const laporanFromBlockchain = {
                id: blockchainResponse.docId,
                ...blockchainResponse.metadata,
                blockchain_verified: true,
                blockchain_doc_hash: blockchainResponse.docHash,
                source: 'BLOCKCHAIN_DIRECT'
              };
              setLaporanDetail(laporanFromBlockchain);
              setShowDetailModal(true);
              setBlockchainData(bcData);
              toast.success("🔗 Data loaded from blockchain!");
              return;
            }
          } catch (err) {
            toast.error("❌ Blockchain verification failed");
          }
        }
        return;
      }

      playBeepSound('warning');
      toast.info("📋 Text data scanned");
      setScanResult(qrData);
      setParsedData({ raw: trimmedData, type: 'TEXT' });
      setScanning(false);
      setError(null);
      setShowDetailModal(true);

    } catch (err) {
      toast.error('❌ Error processing QR data: ' + err.message);
    }
  };

  const resetScan = () => {
    setScanResult(null);
    setParsedData(null);
    setLaporanDetail(null);
    setBlockchainData(null);
    setQrDataParsed(null);
    setShowDetailModal(false);
    setScanning(true);
    setError(null);
    setManualQRCode("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(scanResult);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast.success('✅ Disalin ke clipboard');
  };

  const handleManualQRSubmit = (e) => {
    e.preventDefault();
    if (!manualQRCode.trim()) {
      toast.error('❌ Silakan masukkan QR code atau data');
      return;
    }
    processQRData(manualQRCode);
    setManualQRCode("");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setScanning(false);
      const reader = new FileReader();

      reader.onload = async (event) => {
        const img = new Image();
        img.onload = async () => {
          try {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            let qrContent = null;

            try {
              const { default: jsQR } = await import('jsqr');
              const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
              const code = jsQR(imageData.data, imageData.width, imageData.height);

              if (code) {
                qrContent = code.data;
              }
            } catch (jsqrErr) {
            }

            if (!qrContent) {
              try {
                const { default: QrScanner } = await import('qr-scanner');
                const code = await QrScanner.scanImage(img);
                if (code) {
                  qrContent = code;
                }
              } catch (qrScannerErr) {
              }
            }

            if (!qrContent) {
              try {
                const { BrowserMultiFormatReader } = await import('@zxing/library');
                const reader = new BrowserMultiFormatReader();
                const result = await reader.decodeFromImageElement(img);
                if (result) {
                  qrContent = result.getText();
                }
              } catch (zxingErr) {
              }
            }

            if (!qrContent) {
              toast.warning('⚠️ Tidak dapat membaca QR dari gambar otomatis.');
              toast.info('💡 Silakan input QR code secara manual atau copy-paste data-nya');
              setUseManualInput(true);
            } else {
              toast.success('✅ QR Code dari gambar berhasil dibaca!');
              await processQRData(qrContent);
            }

          } catch (decodeErr) {
            toast.warning('⚠️ Tidak dapat membaca QR dari gambar.');
            setUseManualInput(true);
          }
        };
        img.onerror = () => {
          toast.error('❌ File gambar tidak valid');
        };
        img.src = event.target?.result;
      };
      reader.onerror = () => {
        toast.error('❌ Gagal membaca file');
      };
      reader.readAsDataURL(file);
    } catch (err) {
      toast.error('❌ Gagal memproses file');
    }
  };

  return {
    state: {
      scanResult,
      scanning,
      error,
      deviceId,
      devices,
      parsedData,
      isCopied,
      scannerReady,
      useManualInput,
      manualQRCode,
      laporanDetail,
      showDetailModal,
      loadingLaporan,
      blockchainReady,
      blockchainError,
      blockchainData,
      qrDataParsed,
      cameraStarted,
    },
    actions: {
      setDeviceId,
      setScanning,
      setCameraStarted,
      setUseManualInput,
      setManualQRCode,
      setLaporanDetail,
      setShowDetailModal,
      resetScan,
      copyToClipboard,
      handleManualQRSubmit,
      handleFileUpload,
      processQRData,
    },
    videoRef,
    EXPLORER_BASE_URL,
  };
};
