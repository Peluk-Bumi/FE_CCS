import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoadingSpinner from "@/shared/components/layout/LoadingSpinner";
import { FiCheckCircle, FiUpload, FiX, FiMapPin, FiAlertCircle, FiCamera, FiFolder, FiBarChart2, FiHash, FiTrendingUp, FiActivity, FiNavigation } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import api from "@/shared/services/api";
import { useAuth } from "@/app/context/AuthContext";
import PageTitle from "@/shared/components/common/PageTitle";
import { Input } from "@/shared/components/ui/input";
import StatusBadge from "@/shared/components/ui/badge/StatusBadge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";
import RadioCard from "@/shared/components/ui/radio-card";
import { cn } from "@/shared/utils/utils";

import { FaTree } from "react-icons/fa";

// ✅ Enhanced transparent minimalist marker icon using CSS variables
const createIconMarker = (isSelected = false) => {
  const opacity = isSelected ? 0.95 : 0.75;
  const primaryColor = isSelected ? "var(--primary-dark, #059669)" : "var(--primary, #10b981)";

  return L.divIcon({
    className: "custom-div-icon",
    html: renderToStaticMarkup(
      <div className="relative flex items-center justify-center">
        {/* Outer Glow for Selected */}
        {isSelected && (
          <div 
            className="absolute w-12 h-12 rounded-full animate-ping opacity-20"
            style={{ backgroundColor: primaryColor }}
          />
        )}
        {/* Circular Background with Transparency */}
        <div 
          className={`flex items-center justify-center rounded-full border-2 border-white shadow-xl transition-all ${
            isSelected ? "w-10 h-10 scale-110" : "w-8 h-8"
          }`}
          style={{ backgroundColor: primaryColor, opacity: opacity, backdropFilter: "blur(2px)" }}
        >
          <FaTree className="text-white w-1/2 h-1/2" />
        </div>
        {/* Bottom Pointer */}
        <div 
          className="absolute -bottom-1 w-2 h-2 rotate-45 border-r-2 border-b-2 border-white shadow-sm"
          style={{ backgroundColor: primaryColor, opacity: opacity }}
        />
      </div>
    ),
    iconSize: isSelected ? [40, 40] : [32, 32],
    iconAnchor: isSelected ? [20, 20] : [16, 16],
    popupAnchor: [0, -20],
  });
};

const implementationMarkerIcon = createIconMarker(false);
const selectedMarkerIcon = createIconMarker(true);
const DOCUMENTATION_MAX_FILES = 10;
const DOCUMENTATION_MAX_FILE_SIZE_MB = 10;
const DOCUMENTATION_MAX_FILE_SIZE_BYTES = DOCUMENTATION_MAX_FILE_SIZE_MB * 1024 * 1024;
const DOCUMENTATION_SUPPORTED_FORMATS = [
  'JPG',
  'JPEG',
  'PNG',
  'SVG',
  'HEIC',
];
const DOCUMENTATION_ACCEPT = '.jpg,.jpeg,.png,.svg,.heic,image/*';

const MonitoringForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [implementasis, setImplementasis] = useState([]);
  const [selectedImplementasi, setSelectedImplementasi] = useState(null);
  const [loadingImplementasi, setLoadingImplementasi] = useState(true);
  const [existingLocations, setExistingLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [monitoringByImplementasi, setMonitoringByImplementasi] = useState({});
  const [monitoringRecordsByImplementasi, setMonitoringRecordsByImplementasi] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  // ✅ ADD NEW STATES FOR UPLOAD
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const location = useLocation();

  const calculateSurvivalRate = (plantedValue, deadValue) => {
    const planted = Number.parseFloat(plantedValue);
    const dead = Number.parseFloat(deadValue);

    if (!Number.isFinite(planted) || planted <= 0) return "";
    if (!Number.isFinite(dead) || dead < 0) return "";

    const survived = Math.max(planted - dead, 0);
    return ((survived / planted) * 100).toFixed(2);
  };

  const getMonitoringMonths = (implementasiId) => {
    if (!implementasiId) return [];
    return monitoringByImplementasi[String(implementasiId)] || [];
  };

  const validationSchema = Yup.object({
    implementasi_id: Yup.string().required("Wajib pilih implementasi terlebih dahulu"),
    bulan_monitoring: Yup.number().required("Wajib pilih bulan monitoring").oneOf([3,6], 'Bulan monitoring harus salah satu dari 3 atau 6'),
    jumlah_bibit_ditanam: Yup.number().required("Wajib diisi").positive("Harus positif"),
    jumlah_bibit_mati: Yup.number().required("Wajib diisi").min(0, "Tidak boleh negatif"),
    tinggi_bibit: Yup.number().required("Wajib diisi").positive("Harus positif"),
    diameter_batang: Yup.number().required("Wajib diisi").positive("Harus positif"),
    jumlah_daun: Yup.number().required("Wajib diisi").positive("Harus positif"),
    survival_rate: Yup.number()
      .transform((value, originalValue) => (originalValue === "" ? undefined : value))
      .min(0)
      .max(100),
    kondisi_daun: Yup.object().shape({
      mengering: Yup.string().required("Wajib dipilih"),
      layu: Yup.string().required("Wajib dipilih"),
      menguning: Yup.string().required("Wajib dipilih"),
      bercak: Yup.string().required("Wajib dipilih"),
      hama: Yup.string().required("Wajib dipilih"),
    }),
    dokumentasi: Yup.mixed().required("Wajib diisi"),
    lokasi: Yup.string().required("Wajib memilih lokasi dari peta"),
  });

  const formik = useFormik({
    initialValues: {
      implementasi_id: "",
      bulan_monitoring: "",
      jumlah_bibit_ditanam: "",
      jumlah_bibit_mati: "",
      tinggi_bibit: "",
      diameter_batang: "",
      jumlah_daun: "",
      survival_rate: "",
      kondisi_daun: {
        mengering: "",
        layu: "",
        menguning: "",
        bercak: "",
        hama: "",
      },
      dokumentasi: null,
      lokasi: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        const computedSurvivalRate = calculateSurvivalRate(
          values.jumlah_bibit_ditanam,
          values.jumlah_bibit_mati
        );

        const formData = new FormData();
        formData.append("implementasi_id", values.implementasi_id);
        formData.append("bulan_monitoring", values.bulan_monitoring);
        formData.append("daun_mengering", values.kondisi_daun.mengering);
        formData.append("daun_layu", values.kondisi_daun.layu);
        formData.append("daun_menguning", values.kondisi_daun.menguning);
        formData.append("bercak_daun", values.kondisi_daun.bercak);
        formData.append("daun_serangga", values.kondisi_daun.hama);
        formData.append("jumlah_bibit_ditanam", values.jumlah_bibit_ditanam);
        formData.append("jumlah_bibit_mati", values.jumlah_bibit_mati);
        formData.append("tinggi_bibit", values.tinggi_bibit);
        formData.append("diameter_batang", values.diameter_batang);
        formData.append("jumlah_daun", values.jumlah_daun);
        formData.append("survival_rate", computedSurvivalRate || values.survival_rate || "");
        
        // Append dokumentasi dengan index yang jelas
        if (values.dokumentasi && Array.isArray(values.dokumentasi) && values.dokumentasi.length > 0) {
          values.dokumentasi.forEach((file, index) => {
            if (file instanceof File) {
              formData.append(`dokumentasi_monitoring_${index}`, file);
            }
          });
          formData.append("dokumentasi_count", values.dokumentasi.length);
        }

        console.log('[Monitoring Form] Submitting:', {
          implementasi_id: values.implementasi_id,
          bulan_monitoring: values.bulan_monitoring,
          files: values.dokumentasi?.length || 0
        });

        const response = await api.post(`/monitoring`, formData);

        if (response.status === 201 || response.status === 200) {
          setSuccess(true);
          toast.success("✅ Monitoring berhasil disimpan!");
          setTimeout(() => {
            formik.resetForm();
            setSelectedLocation(null);
            setSelectedImplementasi(null);
            setSuccess(false);
          }, 2500);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        console.error("Error response data:", error.response?.data);
        const errorMsg = error.response?.data?.message || error.message || "Gagal menyimpan monitoring";
        toast.error(`❌ ${errorMsg}`);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const computedSurvivalRate = calculateSurvivalRate(
      formik.values.jumlah_bibit_ditanam,
      formik.values.jumlah_bibit_mati
    );

    if (computedSurvivalRate !== formik.values.survival_rate) {
      formik.setFieldValue("survival_rate", computedSurvivalRate, false);
    }

    // If user selects bulan ke-6, adjust jumlah_bibit_ditanam to be the
    // remaining (bibit hidup) from monitoring bulan ke-3 if available.
    const month = Number(formik.values.bulan_monitoring);
    if (month === 6 && selectedLocation) {
      const records = monitoringRecordsByImplementasi[String(selectedLocation.id)] || [];
      const month3 = records.find(r => Number(r.bulan_monitoring) === 3);
      if (month3) {
        const initialPlanted = Number(selectedLocation.jumlah_bibit ?? selectedLocation.jumlah_bibit_ditanam ?? selectedLocation.perencanaan?.jumlah_bibit ?? 0);
        const deadInMonth3 = Number(month3.jumlah_bibit_mati ?? 0);
        const alive = Math.max(initialPlanted - deadInMonth3, 0);
        if (String(alive) !== String(formik.values.jumlah_bibit_ditanam)) {
          formik.setFieldValue("jumlah_bibit_ditanam", String(alive), false);
        }
      }
    }
  }, [formik.values.jumlah_bibit_ditanam, formik.values.jumlah_bibit_mati, formik.values.bulan_monitoring, selectedLocation, monitoringRecordsByImplementasi]);

  // ✅ Fetch implementasi dan lokasi
  useEffect(() => {
    let isMounted = true;
    const queryParams = new URLSearchParams(location.search);
    const preselectedPerencanaanId = queryParams.get("perencanaan_id");

    const fetchData = async () => {
      try {
        const role = user?.role;
        const implementasiEndpoint = role === 'admin' ? '/implementasi/all' : '/implementasi';
        const monitoringEndpoint = role === 'admin' ? '/monitoring/all' : '/monitoring';

        const [implementasiResponse, monitoringResponse] = await Promise.all([
          api.get(implementasiEndpoint),
          api.get(monitoringEndpoint)
        ]);

        const data = implementasiResponse.data?.data || implementasiResponse.data || [];
        const monitoringData = monitoringResponse.data?.data || monitoringResponse.data || [];

        const monitoringMap = {};
        const monitoringRecords = {};
        monitoringData.forEach((item) => {
          const key = String(item.implementasi_id);
          const month = Number(item.bulan_monitoring);
          if (!monitoringMap[key]) monitoringMap[key] = [];
          if (!monitoringRecords[key]) monitoringRecords[key] = [];
          if (!Number.isNaN(month) && [3,6].includes(month) && !monitoringMap[key].includes(month)) {
            monitoringMap[key].push(month);
          }
          monitoringRecords[key].push(item);
        });

        Object.keys(monitoringMap).forEach((key) => {
          monitoringMap[key].sort((a, b) => a - b);
        });

        const availableImplementasi = data.filter((item) => {
          const usedMonths = monitoringMap[String(item.id)] || [];
          // Get duration and interval from item or its planning
          const duration = Number(item.durasi_proyek || item.perencanaan?.durasi_proyek || 6);
          const interval = Number(item.monitoring_interval || item.perencanaan?.monitoring_interval || 3);
          
          // Generate target months: e.g. if interval 3, duration 6 -> [3, 6]
          const targetMonths = [];
          if (interval > 0) {
            for (let m = interval; m <= duration; m += interval) {
              targetMonths.push(m);
            }
          } else {
            targetMonths.push(3, 6); // Fallback
          }
          
          const monitoringComplete = targetMonths.length > 0 && targetMonths.every((month) => usedMonths.includes(month));
          return !monitoringComplete;
        });
        
        if (isMounted) {
          setImplementasis(data);
          setExistingLocations(availableImplementasi);
          setMonitoringByImplementasi(monitoringMap);
          setMonitoringRecordsByImplementasi(monitoringRecords);

          if (preselectedPerencanaanId) {
            const preselectedImplementasi = data.find(
              (item) => String(item.perencanaan_id) === String(preselectedPerencanaanId)
            );

            if (preselectedImplementasi) {
              const usedMonths = monitoringMap[String(preselectedImplementasi.id)] || [];
              const nextMonth = [3, 6].find((month) => !usedMonths.includes(month));
              if (nextMonth) {
                handleLocationSelect(preselectedImplementasi, monitoringMap);
                formik.setFieldValue("bulan_monitoring", String(nextMonth));
                toast.info(`Monitoring diarahkan dari QR untuk bulan ke-${nextMonth}`);
              } else {
                toast.warning("Implementasi ini sudah lengkap monitoring untuk bulan 3 dan 6");
              }
            }
          }
          
          if (data.length > 0) {
            console.log(`✅ ${data.length} data implementasi ditemukan`);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (isMounted) {
          setImplementasis([]);
          setExistingLocations([]);
        }
      } finally {
        if (isMounted) {
          setLoadingImplementasi(false);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [location.search]);

  // ✅ Handle implementasi selection
  const handleImplementasiSelect = (implementasi) => {
    setSelectedImplementasi(implementasi);
    formik.setFieldValue("implementasi_id", implementasi.id);
    // Auto-select lokasi dari implementasi yang dipilih
    handleLocationSelect(implementasi);
  };

  const handleLocationSelect = (location, monitoringMapOverride = null) => {
    const monitoringMap = monitoringMapOverride || monitoringByImplementasi;
    setSelectedLocation(location);
    setSelectedImplementasi(location);

    if (location?.id) {
      formik.setFieldValue("implementasi_id", String(location.id));
      formik.setFieldTouched("implementasi_id", true, false);
    }

    // Format geotagging as "lat,long"
    const geotagging = `${location.lat},${location.long}`;
    formik.setFieldValue("lokasi", geotagging);
    formik.setFieldTouched("lokasi", true, false);

    const plantedSeedCount = location?.jumlah_bibit ?? location?.jumlah_bibit_ditanam ?? location?.perencanaan?.jumlah_bibit ?? "";
    if (plantedSeedCount !== "") {
      formik.setFieldValue("jumlah_bibit_ditanam", String(plantedSeedCount), false);
      formik.setFieldTouched("jumlah_bibit_ditanam", false, false);
    }

    const usedMonths = monitoringMap[String(location.id)] || [];
    const suggestedMonth = [3, 6].find((month) => !usedMonths.includes(month));
    if (suggestedMonth) {
      formik.setFieldValue("bulan_monitoring", String(suggestedMonth));
    } else {
      formik.setFieldValue("bulan_monitoring", "");
    }
  };

  // ✅ HANDLE DRAG AND DROP
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(Array.from(files));
    }
  };

  // ✅ PROCESS FILES (supports images, videos, HEIC conversion)
  const processFiles = async (files) => {
    const accepted = [];

    for (const file of files) {
      const name = (file.name || '').toLowerCase();
      const isHeic = name.endsWith('.heic') || name.endsWith('.heif') || /heic|heif/.test(file.type);
      const isImage = file.type && file.type.startsWith('image/');
      const isVideo = file.type && file.type.startsWith('video/');
      const isSupportedByExtension = name.match(/\.(jpg|jpeg|png|gif|webp|heic|heif|mp4|mov|webm|ogg)$/);

      if (file.size > DOCUMENTATION_MAX_FILE_SIZE_BYTES) {
        toast.error(`❌ ${file.name} melebihi ${DOCUMENTATION_MAX_FILE_SIZE_MB} MB`);
        continue;
      }

      if (isHeic) {
        // convert HEIC to JPEG using heic2any
        try {
          const heic2anyModule = await import('heic2any');
          const heic2any = heic2anyModule.default || heic2anyModule;
          const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 });
          // heic2any may return a Blob or an array of Blobs
          if (Array.isArray(converted)) {
            converted.forEach((b, i) => {
              const f = new File([b], `${name.replace(/\.heic|\.heif/, '')}-${i + 1}.jpg`, { type: 'image/jpeg' });
              accepted.push(f);
            });
          } else if (converted) {
            const f = new File([converted], `${name.replace(/\.heic|\.heif/, '')}.jpg`, { type: 'image/jpeg' });
            accepted.push(f);
          }
        } catch (err) {
          console.warn('[Monitoring] HEIC conversion failed:', err);
        }
        continue;
      }

      if (isImage || isVideo) {
        accepted.push(file);
      } else {
        // fallback by extension
        if (isSupportedByExtension) {
          accepted.push(file);
        }
      }
    }

    if (accepted.length === 0) {
      toast.error('❌ Silakan pilih file JPG, JPEG, PNG, WEBP, GIF, HEIC, HEIF, MP4, MOV, WEBM, atau OGG!');
      return;
    }

    const currentFiles = formik.values.dokumentasi || [];
    const availableSlots = Math.max(DOCUMENTATION_MAX_FILES - currentFiles.length, 0);

    if (availableSlots === 0) {
      toast.error(`❌ Maksimal ${DOCUMENTATION_MAX_FILES} file dokumentasi`);
      return;
    }

    const newFiles = [...currentFiles, ...accepted.slice(0, availableSlots)];
    formik.setFieldValue('dokumentasi', newFiles);
    setShowUploadModal(false);

    if (accepted.length > availableSlots) {
      toast.warning(`⚠️ Hanya ${availableSlots} file yang ditambahkan karena batas maksimal ${DOCUMENTATION_MAX_FILES} file`);
    } else {
      toast.success(`✅ ${accepted.length} file berhasil ditambahkan!`);
    }
  };

  // ✅ HANDLE FILE INPUT
  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files) {
      processFiles(Array.from(files));
    }
  };

  // ✅ HANDLE CAMERA
  const handleCameraCapture = (e) => {
    const files = e.target.files;
    if (files) {
      processFiles(Array.from(files));
    }
  };

  // ✅ OPEN CAMERA
  const openCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  // ✅ OPEN FILE PICKER
  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const renderRadioGroup = (name, label) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <label className="block font-semibold text-gray-800 dark:text-gray-200 mb-4">
        {label}
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {["<25%", "25–45%", "50–74%", ">75%"].map((option) => (
          <RadioCard
            key={option}
            label={option}
            name={`kondisi_daun.${name}`}
            value={option}
            checked={formik.values.kondisi_daun[name] === option}
            onChange={(e) => formik.setFieldValue(`kondisi_daun.${name}`, e.target.value)}
            readOnly={false}
          />
        ))}
      </div>
      {formik.touched.kondisi_daun?.[name] && formik.errors.kondisi_daun?.[name] && (
        <p className="text-red-500 text-sm mt-2">{formik.errors.kondisi_daun[name]}</p>
      )}
    </motion.div>
  );

  return (
    <div className="py-12">
        {/* Header */}
        <PageTitle
          type="page"
          badge="Formulir Monitoring"
          badgeIcon={FiCheckCircle}
          title="Form Monitoring Kegiatan"
          description="Monitoring kesehatan bibit dari hasil implementasi yang telah dilakukan"
        />

        {/* Success Animation */}
        <AnimatePresence>
          {success && (
            <motion.div
              className="mb-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <FiCheckCircle className="w-16 h-16 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">✅ Data Berhasil Disimpan!</h3>
              <p>Monitoring kegiatan telah tercatat dengan baik</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Card */}
        <motion.div
          className="glass bg-white/90 dark:bg-gray-900 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={formik.handleSubmit} className="p-8 md:p-12">
            
            {/* ✅ SELECT LOCATION FROM MAP - PERTAMA */}
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                <FiMapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                Pilih Lokasi Implementasi untuk Monitoring
                <span className="text-red-500">*</span>
              </label>

              {/* Info Box */}
              <div className="mb-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FiMapPin className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-bold text-green-900 dark:text-green-200 mb-2">
                      📍 Pilih dari Lokasi Implementasi
                    </h4>
                    <p className="text-sm text-green-800 dark:text-green-300">
                      Klik pada marker di peta untuk memilih lokasi implementasi yang akan dimonitor. 
                      Hanya lokasi yang telah diimplementasikan yang dapat dipilih untuk monitoring.
                    </p>
                  </div>
                </div>
              </div>

              {implementasis.length > 0 && (
                <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200/80 bg-white/90 shadow-sm dark:border-gray-700 dark:bg-gray-900/90">
                  <div className="flex flex-col gap-1 border-b border-gray-200 px-4 py-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Daftar Lokasi Siap Monitoring</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Pilih baris untuk menyorot lokasi di peta dan mengisi data secara otomatis.</p>
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{existingLocations.length} lokasi tersedia</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-[760px] w-full border-separate border-spacing-0">
                      <thead className="bg-gray-50/80 dark:bg-gray-800/60">
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Nama Lembaga</th>
                          <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Lokasi & Geotagging</th>
                          <th className="p-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Monitoring</th>
                          <th className="p-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {existingLocations.map((impl) => {
                          const isSelected = selectedLocation?.id === impl.id;
                          const usedMonths = getMonitoringMonths(impl.id);
                          const totalMonitoring = usedMonths.length;

                          return (
                            <tr
                              key={impl.id}
                              className={`border-b border-gray-100 dark:border-gray-800 transition-colors ${isSelected ? 'bg-green-50/80 dark:bg-green-900/20' : 'hover:bg-gray-50/80 dark:hover:bg-gray-800/50'}`}
                            >
                              <td className="p-3 align-top">
                                <div className="font-medium text-gray-900 dark:text-gray-100">{impl.nama_perusahaan}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{impl.jenis_kegiatan}</div>
                              </td>
                              <td className="p-3 align-top">
                                <div className="text-sm text-gray-700 dark:text-gray-300">{impl.lokasi || "Lokasi tidak bernama"}</div>
                                <div className="text-[10px] font-mono text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                                  <FiNavigation className="w-2.5 h-2.5" />
                                  LAT: {impl.lat} | LONG: {impl.long}
                                </div>
                              </td>
                              <td className="p-3 align-top text-center">
                                <div className="flex flex-col items-center gap-1">
                                  <div className="flex flex-wrap justify-center gap-1">
                                    {(() => {
                                      const duration = Number(impl.durasi_proyek || impl.perencanaan?.durasi_proyek || 6);
                                      const interval = Number(impl.monitoring_interval || impl.perencanaan?.monitoring_interval || 3);
                                      const targetMonths = [];
                                      if (interval > 0) {
                                        for (let m = interval; m <= duration; m += interval) {
                                          targetMonths.push(m);
                                        }
                                      } else {
                                        targetMonths.push(3, 6);
                                      }
                                      
                                      return targetMonths.map(m => (
                                        <StatusBadge 
                                          key={m} 
                                          variant={usedMonths.includes(m) ? "success" : "default"}
                                          label={`Bln ${m}`}
                                          size="small"
                                        />
                                      ));
                                    })()}
                                  </div>
                                  {totalMonitoring > 0 && (
                                    <span className="text-[10px] font-medium text-primary-dark mt-1">
                                      {totalMonitoring} Monitoring dilakukan
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td className="p-3 align-top text-center">
                                <button
                                  type="button"
                                  onClick={() => handleLocationSelect(impl)}
                                  className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold transition ${isSelected ? 'bg-green-600 text-white shadow hover:bg-green-700' : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-200 dark:hover:bg-green-900/50'}`}
                                >
                                  {isSelected ? 'Dipilih' : 'Pilih'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Map */}
              {loading ? (
                <div className="h-96 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Memuat lokasi implementasi...</p>
                  </div>
                </div>
              ) : existingLocations.length === 0 ? (
                <div className="h-96 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-700 flex items-center justify-center">
                  <div className="text-center p-8">
                    <FiAlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-amber-900 dark:text-amber-200 mb-2">
                      Belum Ada Lokasi Implementasi
                    </h3>
                    <p className="text-amber-700 dark:text-amber-300">
                      Silakan lakukan implementasi terlebih dahulu untuk mendapatkan data lokasi monitoring.
                    </p>
                  </div>
                </div>
              ) : (
                <motion.div
                  className="rounded-2xl overflow-hidden border-2 border-green-200 dark:border-green-700 shadow-xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <MapContainer
                    center={[-2.5489, 118.0149]}
                    zoom={5}
                    style={{ height: "500px", width: "100%" }}
                    className="z-0"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {existingLocations.map((location) => {
                      const lat = parseFloat(location.lat);
                      const lng = parseFloat(location.long);
                      const isSelected = selectedLocation?.id === location.id;
                      
                      if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
                        return null;
                      }
                      
                      return (
                        <Marker
                          key={location.id}
                          position={[lat, lng]}
                          icon={isSelected ? selectedMarkerIcon : implementationMarkerIcon}
                          eventHandlers={{
                            click: () => handleLocationSelect(location),
                          }}
                        >
                          <Popup>
                            <div className="text-center">
                              <p className="font-bold text-green-700">{location.nama_perusahaan}</p>
                              <p className="text-xs text-gray-600 mb-1">
                                Implementasi: {location.jenis_kegiatan}
                              </p>
                              <p className="text-xs text-gray-600 mb-3">
                                Bibit: {location.jenis_bibit} ({location.jumlah_bibit} unit)
                              </p>
                              <button
                                onClick={() => handleLocationSelect(location)}
                                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg transition-colors font-semibold"
                              >
                                Pilih Lokasi Ini
                              </button>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                </motion.div>
              )}

              {/* ✅ DETAIL LOKASI TERPILIH - DITAMPILKAN DI BAWAH MAPS */}
              {selectedLocation && (
                <motion.div
                  className="mt-6 bg-gradient-to-br from-green-50 to-lime-50 dark:from-green-900/20 dark:to-lime-900/20 border-2 border-green-300 dark:border-green-700 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <motion.div
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      <FiCheckCircle className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-green-900 dark:text-green-200 mb-1">
                        Lokasi Implementasi Terpilih
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Berikut adalah detail lokasi implementasi untuk monitoring
                      </p>
                    </div>
                  </div>

                  {/* ✅ SEED COUNT SUMMARY - PROMINENT DISPLAY */}
                  <div className="mt-5 rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 border-2 border-green-400 dark:border-green-600 p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-xs font-semibold text-green-700 dark:text-green-300 mb-2 uppercase tracking-wide">Jumlah Bibit Perencanaan</p>
                        <p className="text-3xl font-black text-green-900 dark:text-green-100">
                          {selectedLocation.jumlah_bibit ?? selectedLocation.perencanaan?.jumlah_bibit ?? "-"}
                        </p>
                        <p className="text-xs text-green-700 dark:text-green-300 mt-1">Unit</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 mb-2 uppercase tracking-wide">Bibit Tertanam</p>
                        <p className="text-3xl font-black text-emerald-900 dark:text-emerald-100">
                          {formik.values.jumlah_bibit_ditanam || "-"}
                        </p>
                        <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-1">Unit</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-semibold text-lime-700 dark:text-lime-300 mb-2 uppercase tracking-wide">Survival Rate</p>
                        <p className="text-3xl font-black text-lime-900 dark:text-lime-100">
                          {formik.values.survival_rate || "-"}
                        </p>
                        <p className="text-xs text-lime-700 dark:text-lime-300 mt-1">%</p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-green-300 dark:border-green-700">
                      <p className="text-xs text-green-700 dark:text-green-300">
                        📊 Bulan terisi: <span className="font-bold">{
                          getMonitoringMonths(selectedLocation.id).length > 0
                            ? getMonitoringMonths(selectedLocation.id).join(", ")
                            : "Belum ada"
                        }</span>
                      </p>
                    </div>
                  </div>

                  {/* Detail Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Lembaga */}
                    <motion.div
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-green-100 dark:border-green-800"
                      whileHover={{ translateY: -2 }}
                    >
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
                        Lembaga
                      </p>
                      <p className="text-base font-bold text-gray-900 dark:text-gray-100 break-words">
                        {selectedLocation.nama_perusahaan}
                      </p>
                    </motion.div>

                    {/* Kegiatan */}
                    <motion.div
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-green-100 dark:border-green-800"
                      whileHover={{ translateY: -2 }}
                    >
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
                        Jenis Kegiatan
                      </p>
                      <p className="text-base font-bold text-gray-900 dark:text-gray-100 break-words">
                        {selectedLocation.jenis_kegiatan}
                      </p>
                    </motion.div>

                    {/* PIC Koorlap */}
                    <motion.div
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-green-100 dark:border-green-800"
                      whileHover={{ translateY: -2 }}
                    >
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
                        PIC Koorlap
                      </p>
                      <p className="text-base font-bold text-gray-900 dark:text-gray-100 break-words">
                        {selectedLocation.pic_koorlap}
                      </p>
                    </motion.div>

                    {/* Jenis Bibit */}
                    <motion.div
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-green-100 dark:border-green-800"
                      whileHover={{ translateY: -2 }}
                    >
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
                        Jenis Bibit
                      </p>
                      <p className="text-base font-bold text-gray-900 dark:text-gray-100 break-words">
                        {selectedLocation.jenis_bibit}
                      </p>
                    </motion.div>

                    {/* Jumlah Bibit */}
                    <motion.div
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-green-100 dark:border-green-800"
                      whileHover={{ translateY: -2 }}
                    >
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
                        Jumlah Bibit
                      </p>
                      <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                        {selectedLocation.jumlah_bibit} Unit
                      </p>
                    </motion.div>

                    {/* Koordinat */}
                    <motion.div
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-green-100 dark:border-green-800 md:col-span-2"
                      whileHover={{ translateY: -2 }}
                    >
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
                        Koordinat Lokasi
                      </p>
                      <p className="text-sm font-mono text-gray-900 dark:text-gray-100 bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-lg">
                        Latitude: {selectedLocation.lat} | Longitude: {selectedLocation.long}
                      </p>
                    </motion.div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6 pt-6 border-t border-green-200 dark:border-green-700">
                    <motion.button
                      type="button"
                      onClick={() => {
                        setSelectedLocation(null);
                        setSelectedImplementasi(null);
                        formik.setFieldValue("lokasi", "");
                        formik.setFieldValue("implementasi_id", "");
                        formik.setFieldTouched("lokasi", false, false);
                        formik.setFieldTouched("implementasi_id", false, false);
                      }}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Pilih Lokasi Lain
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={() => handleLocationSelect(selectedLocation)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium transition-all shadow-md"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiCheckCircle className="w-4 h-4" />
                      <span>Gunakan Lokasi Ini</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Validation Error */}
              {formik.touched.lokasi && formik.errors.lokasi && (
                <motion.p
                  className="text-red-500 text-sm mt-3 flex items-center gap-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <FiAlertCircle className="w-4 h-4" />
                  {formik.errors.lokasi}
                </motion.p>
              )}

              {formik.touched.implementasi_id && formik.errors.implementasi_id && (
                <motion.p
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <FiAlertCircle className="w-4 h-4" />
                  {formik.errors.implementasi_id}
                </motion.p>
              )}
            </motion.div>

            {/* Input Grid Data Monitoring */}
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 inline-flex items-center gap-2">
                <FiBarChart2 className="w-5 h-5 text-green-600" />
                <span>Data Monitoring</span>
              </h3>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  Bulan Monitoring <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formik.values.bulan_monitoring}
                  onValueChange={(val) => formik.setFieldValue("bulan_monitoring", val)}
                  disabled={!formik.values.implementasi_id}
                >
                  <SelectTrigger className="w-full md:w-72">
                    <SelectValue placeholder="Pilih bulan monitoring" />
                  </SelectTrigger>
                  <SelectContent>
                    {(() => {
                      if (!selectedLocation) return null;
                      const duration = Number(selectedLocation.durasi_proyek || selectedLocation.perencanaan?.durasi_proyek || 6);
                      const interval = Number(selectedLocation.monitoring_interval || selectedLocation.perencanaan?.monitoring_interval || 3);
                      const targetMonths = [];
                      if (interval > 0) {
                        for (let m = interval; m <= duration; m += interval) {
                          targetMonths.push(m);
                        }
                      } else {
                        targetMonths.push(3, 6);
                      }

                      return targetMonths.map((month) => {
                        const used = getMonitoringMonths(selectedLocation.id).includes(month);
                        return (
                          <SelectItem key={month} value={String(month)} disabled={used}>
                            Bulan ke-{month}{used ? " (sudah terisi)" : ""}
                          </SelectItem>
                        );
                      });
                    })()}
                  </SelectContent>
                </Select>
                {formik.touched.bulan_monitoring && formik.errors.bulan_monitoring && (
                  <p className="text-red-500 text-sm mt-2">{formik.errors.bulan_monitoring}</p>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { name: "jumlah_bibit_ditanam", label: "Jumlah Bibit Ditanam", placeholder: "100", icon: FiCheckCircle, readOnly: true, suffix: "bibit" },
                  { name: "jumlah_bibit_mati", label: "Jumlah Bibit Mati", placeholder: "5", icon: FiAlertCircle, suffix: "bibit" },
                  { name: "tinggi_bibit", label: "Tinggi Bibit", placeholder: "35.5", step: "0.1", icon: FiTrendingUp, suffix: "cm" },
                  { name: "diameter_batang", label: "Diameter Batang", placeholder: "2.5", step: "0.1", icon: FiActivity, suffix: "cm" },
                  { name: "jumlah_daun", label: "Jumlah Daun", placeholder: "20", icon: FiHash, suffix: "helai" },
                  { name: "survival_rate", label: "Survival Rate", placeholder: "95", icon: FiTrendingUp, suffix: "%" },
                ].map((field, index) => (
                  <motion.div
                    key={field.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                      <field.icon className="w-4 h-4 inline mr-2 text-primary dark:text-primary-light" />
                      {field.label}
                    </label>
                    <Input
                      type="number"
                      step={field.step}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={formik.values[field.name]}
                      onChange={formik.handleChange}
                      readOnly={field.readOnly || field.name === "survival_rate"}
                      disabled={false}
                      tabIndex={(field.readOnly || field.name === "survival_rate") ? -1 : 0}
                      suffix={field.suffix}
                    />
                      {(field.name === "jumlah_bibit_ditanam" || field.name === "survival_rate") && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {field.name === "jumlah_bibit_ditanam"
                            ? "Otomatis diambil dari data perencanaan/implementasi yang dipilih."
                            : "Otomatis dihitung dari bibit ditanam dikurangi bibit mati."}
                        </p>
                      )}
                    {formik.touched[field.name] && formik.errors[field.name] && (
                      <p className="text-red-500 text-sm mt-2">{formik.errors[field.name]}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Kondisi Kesehatan Bibit */}
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 inline-flex items-center gap-2">
                <FiActivity className="w-5 h-5 text-green-600" />
                <span>Kondisi Kesehatan Bibit</span>
              </h3>
              <div className="space-y-6">
                {renderRadioGroup("mengering", "Daun Mengering")}
                {renderRadioGroup("layu", "Daun Layu")}
                {renderRadioGroup("menguning", "Daun Menguning")}
                {renderRadioGroup("bercak", "Bercak Daun")}
                {renderRadioGroup("hama", "Terserang Hama")}
              </div>
            </motion.div>

            {/* Upload Dokumentasi dengan Drag-Drop */}
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Dokumentasi Monitoring <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Format: {DOCUMENTATION_SUPPORTED_FORMATS.join(', ')}. Maks {DOCUMENTATION_MAX_FILE_SIZE_MB} MB per file, maksimal {DOCUMENTATION_MAX_FILES} file.
              </p>

              {/* ✅ DRAG DROP AREA */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
                  dragActive
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20 scale-105"
                    : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-primary hover:bg-primary/10 dark:hover:bg-primary/20"
                }`}
              >
                {/* Hidden File Inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={DOCUMENTATION_ACCEPT}
                  multiple
                  onChange={handleFileSelect}
                  className="sr-only"
                  id="file-input"
                />
                
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept={DOCUMENTATION_ACCEPT}
                  capture="environment"
                  onChange={handleCameraCapture}
                  className="sr-only"
                  id="camera-input"
                />

                {/* Content */}
                <motion.div
                  className="flex flex-col items-center justify-center"
                  animate={dragActive ? { scale: 1.03 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {formik.values.dokumentasi && formik.values.dokumentasi.length > 0 ? (
                    <>
                      <div className="w-full flex items-center justify-between mb-4">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Preview Dokumentasi ({formik.values.dokumentasi.length})
                        </p>
                        <motion.button
                          type="button"
                          onClick={() => setShowUploadModal(true)}
                          className="relative group px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium shadow-md overflow-hidden transition-all duration-300"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          {/* hover overlay */}
                          <span className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary to-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* content */}
                          <span className="relative z-10">Tambah Foto</span>
                        </motion.button>
                      </div>

                      <motion.div
                        className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {formik.values.dokumentasi.map((file, index) => (
                          <motion.div
                            key={index}
                            className="relative group"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.05 * index }}
                            whileHover={{ scale: 1.03 }}
                          >
                            <div className="relative w-full h-32 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 shadow-md bg-white dark:bg-gray-800">
                              {/\.(mp4|mov|webm|ogg)$/i.test(file.name) ? (
                                <video
                                  src={URL.createObjectURL(file)}
                                  className="w-full h-full object-cover"
                                  preload="metadata"
                                />
                              ) : (
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Preview ${index}`}
                                  className="w-full h-full object-cover"
                                />
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all" />
                              <motion.button
                                type="button"
                                onClick={() => {
                                  const newFiles = [...formik.values.dokumentasi];
                                  newFiles.splice(index, 1);
                                  formik.setFieldValue("dokumentasi", newFiles);
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FiX className="w-4 h-4 text-white" />
                              </motion.button>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate">
                              {file.name}
                            </p>
                          </motion.div>
                        ))}
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div
                        className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4"
                        animate={dragActive ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <FiUpload className={`w-8 h-8 ${dragActive ? 'text-green-600' : 'text-green-600 dark:text-green-400'}`} />
                      </motion.div>

                      <p className="text-center mb-2">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                          {dragActive ? "Lepaskan gambar di sini" : "Drag & Drop gambar di sini"}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">
                          atau gunakan tombol di bawah
                        </span>
                      </p>

                      {/* Upload Buttons - ONLY SHOWN WHEN NOT DRAGGING */}
                      {!dragActive && (
                        <motion.button
                          type="button"
                          onClick={() => setShowUploadModal(true)}
                          className="relative group mt-4 px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium shadow-lg overflow-hidden transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {/* hover overlay */}
                          <span className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary to-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* content */}
                          <span className="relative z-10">Pilih Gambar</span>
                        </motion.button>
                      )}
                    </>
                  )}
                </motion.div>
              </div>

              {formik.touched.dokumentasi && formik.errors.dokumentasi && (
                <p className="text-red-500 text-sm mt-2">{formik.errors.dokumentasi}</p>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={submitting}
              className={`relative group w-full py-4 rounded-xl font-bold text-lg shadow-xl overflow-hidden transition-all duration-300 ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary text-primary-foreground"
              }`}
              whileHover={!submitting ? { scale: 1.02, boxShadow: "0 20px 60px -10px rgba(var(--primary), 0.5)" } : {}}
              whileTap={!submitting ? { scale: 0.98 } : {}}
            >
              {/* hover overlay */}
              {!submitting && (
                <span className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary to-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              )}
              
              {/* content */}
              <span className="relative z-10 flex items-center justify-center gap-2">
                {submitting ? (
                  <>
                    <motion.div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <FiCheckCircle className="w-6 h-6" />
                    Simpan Data Monitoring
                  </>
                )}
              </span>
            </motion.button>
          </form>
        </motion.div>

      {/* ✅ MODAL UPLOAD OPTIONS */}
      <AnimatePresence>
        {showUploadModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                  <motion.div
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <FiUpload className="w-7 h-7 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    Upload Dokumentasi
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Pilih sumber dokumentasi. Format {DOCUMENTATION_SUPPORTED_FORMATS.join(', ')} | Maks {DOCUMENTATION_MAX_FILE_SIZE_MB} MB/file | Maks {DOCUMENTATION_MAX_FILES} file
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Camera Option */}
                  <motion.button
                    type="button"
                    onClick={openCamera}
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl border-2 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 text-green-700 dark:text-green-300 font-semibold transition-all"
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center"
                      whileHover={{ rotate: 10 }}
                    >
                      <FiCamera className="w-5 h-5 text-white" />
                    </motion.div>
                    <div className="text-left">
                      <p className="font-semibold">Ambil Foto</p>
                      <p className="text-xs opacity-80">Gunakan kamera perangkat</p>
                    </div>
                  </motion.button>

                  {/* File Picker Option */}
                  <motion.button
                    type="button"
                    onClick={openFilePicker}
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl border-2 border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold transition-all"
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center"
                      whileHover={{ rotate: -10 }}
                    >
                      <FiFolder className="w-5 h-5 text-white" />
                    </motion.div>
                    <div className="text-left">
                      <p className="font-semibold">Pilih dari Galeri</p>
                      <p className="text-xs opacity-80">Pilih dari file tersimpan</p>
                    </div>
                  </motion.button>
                </div>

                <motion.button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="w-full mt-4 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Batal
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MonitoringForm;


