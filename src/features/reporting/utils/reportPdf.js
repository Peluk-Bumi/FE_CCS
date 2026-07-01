import QRCode from "qrcode";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import blockchainConfig from "@/app/config/blockchainConfig";

const EXPLORER_BASE_URL = blockchainConfig.explorerUrl;

export const getProgressInfo = (item) => {
  const status = item?.status || 'planning';
  
  const hasImplementasi = !!item?.implementasi || !!item?.is_implemented;
  const hasMonitoring = hasImplementasi && (
    !!item?.implementasi?.monitoring || 
    (Array.isArray(item?.implementasi?.monitorings) && item.implementasi.monitorings.length > 0)
  );
  const hasEvaluasi = status === 'completed' || item?.evaluation_status === 'completed' || !!item?.final_score;
  
  let currentStage = 'Perencanaan';
  if (hasEvaluasi) {
    currentStage = 'Evaluasi';
  } else if (hasMonitoring) {
    currentStage = 'Monitoring';
  } else if (hasImplementasi) {
    currentStage = 'Implementasi';
  }

  return {
    hasImplementasi,
    hasMonitoring,
    hasEvaluasi,
    currentStage,
  };
};

export const getStageDetails = (item) => {
  const implementasi = item?.implementasi || null;
  const monitoring = implementasi?.monitoring || (Array.isArray(item?.monitoring) ? item.monitoring[0] : item?.monitoring || null);

  return {
    implementasi,
    monitoring,
  };
};

export const parseStoredFiles = (value) => {
  if (!value) return [];

  const normalizeItem = (item) => {
    if (!item && item !== 0) return null;
    if (typeof item === "string") return item;
    if (typeof item === "object") {
      if (item.url) return item.url;
      if (item.src) return item.src;
      if (item.path) return item.path;
      if (item.file) {
        if (typeof item.file === 'string') return item.file;
        if (item.file.path) return item.file.path;
        if (item.file.url) return item.file.url;
        if (item.file.filename) return item.file.filename;
      }
      if (item.filename) return item.filename;
      if (item.name) return item.name;
      try {
        return JSON.stringify(item);
      } catch (_) {
        return null;
      }
    }
    return null;
  };

  if (Array.isArray(value)) {
    return value.map(normalizeItem).filter(Boolean);
  }

  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(normalizeItem).filter(Boolean);
      const single = normalizeItem(parsed);
      return single ? [single] : [value];
    } catch (_) {
      return [value];
    }
  }

  return [];
};

const drawWrappedText = (page, text, x, y, maxWidth, font, size, color) => {
  const words = String(text ?? "-").split(" ");
  const lines = [];
  let line = "";

  const breakLongWord = (word) => {
    if (font.widthOfTextAtSize(word, size) <= maxWidth) return [word];

    const chunks = [];
    let chunk = "";

    for (const char of word) {
      const test = `${chunk}${char}`;
      if (font.widthOfTextAtSize(test, size) > maxWidth && chunk) {
        chunks.push(chunk);
        chunk = char;
      } else {
        chunk = test;
      }
    }

    if (chunk) chunks.push(chunk);
    return chunks;
  };

  for (const word of words) {
    const chunks = breakLongWord(word);
    for (const chunk of chunks) {
      const testLine = line ? `${line} ${chunk}` : chunk;
      if (font.widthOfTextAtSize(testLine, size) > maxWidth && line) {
        lines.push(line);
        line = chunk;
      } else {
        line = testLine;
      }
    }
  }

  if (line) lines.push(line);

  let cursorY = y;
  lines.forEach((currentLine) => {
    page.drawText(currentLine, {
      x,
      y: cursorY,
      size,
      font,
      color,
    });
    cursorY -= 14;
  });

  return cursorY;
};

const addLogoToQRCode = async (qrDataUrl, logoPath = "/images/icon.png") => {
  return new Promise((resolve) => {
    const qrImage = new Image();
    const logoImage = new Image();

    let loaded = 0;
    const onAssetLoaded = () => {
      loaded += 1;
      if (loaded < 2) return;

      try {
        const canvas = document.createElement("canvas");
        const size = qrImage.width || 400;
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(qrDataUrl);
          return;
        }

        ctx.drawImage(qrImage, 0, 0, size, size);

        const logoSize = Math.floor(size * 0.2);
        const logoX = Math.floor((size - logoSize) / 2);
        const logoY = Math.floor((size - logoSize) / 2);
        const bgPadding = Math.floor(logoSize * 0.18);
        const bgX = logoX - bgPadding;
        const bgY = logoY - bgPadding;
        const bgSize = logoSize + bgPadding * 2;
        const radius = Math.floor(bgSize * 0.2);

        ctx.fillStyle = "#fff7ea";
        ctx.beginPath();
        ctx.moveTo(bgX + radius, bgY);
        ctx.lineTo(bgX + bgSize - radius, bgY);
        ctx.quadraticCurveTo(bgX + bgSize, bgY, bgX + bgSize, bgY + radius);
        ctx.lineTo(bgX + bgSize, bgY + bgSize - radius);
        ctx.quadraticCurveTo(bgX + bgSize, bgY + bgSize, bgX + bgSize - radius, bgY + bgSize);
        ctx.lineTo(bgX + radius, bgY + bgSize);
        ctx.quadraticCurveTo(bgX, bgY + bgSize, bgX, bgY + bgSize - radius);
        ctx.lineTo(bgX, bgY + radius);
        ctx.quadraticCurveTo(bgX, bgY, bgX + radius, bgY);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = "rgba(107, 68, 35, 0.35)";
        ctx.lineWidth = Math.max(1, Math.floor(size * 0.006));
        ctx.stroke();

        ctx.drawImage(logoImage, logoX, logoY, logoSize, logoSize);
        resolve(canvas.toDataURL("image/png"));
      } catch (err) {
        console.warn("[laporanPdf] Failed to composite QR logo:", err);
        resolve(qrDataUrl);
      }
    };

    const onError = () => resolve(qrDataUrl);

    qrImage.onload = onAssetLoaded;
    logoImage.onload = onAssetLoaded;
    qrImage.onerror = onError;
    logoImage.onerror = onError;

    qrImage.src = qrDataUrl;
    logoImage.src = logoPath;
  });
};

const normalizeBoolean = (value) => {
  if (value === true || value === false) return value;
  if (value === 1 || value === "1") return true;
  if (value === 0 || value === "0") return false;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    if (["true", "ya", "yes", "sesuai"].includes(normalized)) return true;
    if (["false", "tidak", "no", "tidak sesuai"].includes(normalized)) return false;
  }
  return null;
};

const getKesesuaianValue = (implementasi, key) => {
  const directMap = {
    nama_perusahaan: implementasi?.nama_perusahaan_sesuai,
    lokasi: implementasi?.lokasi_sesuai,
    jenis_kegiatan: implementasi?.jenis_kegiatan_sesuai,
    jumlah_bibit: implementasi?.jumlah_bibit_sesuai,
    jenis_bibit: implementasi?.jenis_bibit_sesuai,
    tanggal: implementasi?.tanggal_sesuai,
  };

  const nested = implementasi?.kesesuaian?.[key];
  return normalizeBoolean(directMap[key] ?? nested);
};

export const buildLaporanPdfBlob = async (item) => {
  const progress = getProgressInfo(item);
  const { implementasi, monitoring } = getStageDetails(item);
  const pdfDoc = await PDFDocument.create();
  const pageSize = [595.28, 841.89];
  let page = null;
  const regular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const bold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const margin = 42;
  const contentWidth = 595.28 - margin * 2;
  const labelWidth = 178;
  const valueWidth = contentWidth - labelWidth - 16;
  let y = 800;
  let pageNumber = 0;

  let logoImage = null;
  try {
    const logoRes = await fetch("/images/icon.png");
    if (logoRes.ok) {
      const logoBytes = await logoRes.arrayBuffer();
      logoImage = await pdfDoc.embedPng(logoBytes);
    }
  } catch (logoErr) {
    console.warn("[laporanPdf] logo load skipped:", logoErr?.message || logoErr);
  }

  let qrCodeImage = null;
  try {
    const qrContent = item.blockchain_tx_hash
      ? `${EXPLORER_BASE_URL}/tx/${item.blockchain_tx_hash}`
      : `${window.location.origin}/public/laporan/${item.id}`;

    const qrDataUrl = await QRCode.toDataURL(qrContent, {
      errorCorrectionLevel: "H",
      type: "image/png",
      quality: 0.95,
      margin: 1,
      width: 200,
      color: { dark: "#1f2937", light: "#ffffff" },
    });
    const qrWithLogo = await addLogoToQRCode(qrDataUrl);
    const qrBytes = await fetch(qrWithLogo).then((response) => response.arrayBuffer());
    qrCodeImage = await pdfDoc.embedPng(qrBytes);
  } catch (qrErr) {
    console.warn("[laporanPdf] QR code generation skipped:", qrErr?.message || qrErr);
  }

  const drawText = (text, x, yPos, options = {}) => {
    page.drawText(String(text ?? "-"), {
      x,
      y: yPos,
      size: options.size || 11,
      font: options.bold ? bold : regular,
      color: options.color || rgb(0.1, 0.1, 0.1),
    });
  };

  const drawHeader = () => {
    const headerTopY = 790;

    if (logoImage) {
      page.drawImage(logoImage, {
        x: margin,
        y: headerTopY - 35,
        width: 35,
        height: 35,
      });
    }

    const headerX = logoImage ? margin + 42 : margin;
    drawText("PELUK BUMI CCS", headerX, headerTopY - 8, { size: 13, bold: true, color: rgb(0.1, 0.32, 0.25) });
    drawText("Sistem Konservasi Berbasis Blockchain", headerX, headerTopY - 21, { size: 9, color: rgb(0.33, 0.33, 0.33) });
    drawText("Pelaporan Perencanaan, Implementasi, dan Monitoring", headerX, headerTopY - 33, { size: 8, color: rgb(0.4, 0.4, 0.4) });

    if (qrCodeImage) {
      page.drawImage(qrCodeImage, {
        x: margin + contentWidth - 75,
        y: headerTopY - 75,
        width: 75,
        height: 75,
      });
      drawText("Verifikasi", margin + contentWidth - 70, headerTopY - 82, { size: 7, color: rgb(0.45, 0.45, 0.45), bold: true });
      drawText("Dokumen", margin + contentWidth - 65, headerTopY - 89, { size: 7, color: rgb(0.45, 0.45, 0.45), bold: true });
    }

    drawText(`Halaman ${pageNumber}`, margin + contentWidth - 52, headerTopY, { size: 8.5, color: rgb(0.4, 0.4, 0.4) });

    page.drawLine({ start: { x: margin, y: headerTopY - 105 }, end: { x: margin + contentWidth, y: headerTopY - 105 }, thickness: 1.2, color: rgb(0.12, 0.42, 0.32) });
    page.drawLine({ start: { x: margin, y: headerTopY - 108 }, end: { x: margin + contentWidth, y: headerTopY - 108 }, thickness: 0.5, color: rgb(0.5, 0.5, 0.5) });
  };

  const drawMetaBlock = () => {
    page.drawRectangle({
      x: margin,
      y: 635,
      width: contentWidth,
      height: 50,
      color: rgb(0.96, 0.98, 0.97),
      borderColor: rgb(0.8, 0.9, 0.86),
      borderWidth: 1,
    });

    drawText("Nomor Laporan", margin + 12, 667, { size: 9, bold: true, color: rgb(0.35, 0.35, 0.35) });
    drawText(String(item.id), margin + 12, 655, { size: 10.5, color: rgb(0.1, 0.1, 0.1) });

    drawText("Tanggal Cetak", margin + 190, 667, { size: 9, bold: true, color: rgb(0.35, 0.35, 0.35) });
    drawText(new Date().toLocaleString("id-ID"), margin + 190, 655, { size: 10.5, color: rgb(0.1, 0.1, 0.1) });

    drawText("Tahap Saat Ini", margin + 390, 667, { size: 9, bold: true, color: rgb(0.35, 0.35, 0.35) });
    drawText(progress.currentStage, margin + 390, 655, { size: 10.5, bold: true, color: rgb(0.1, 0.32, 0.25) });
  };

  const startNewPage = () => {
    page = pdfDoc.addPage(pageSize);
    pageNumber += 1;
    drawHeader();
    drawMetaBlock();
    y = 615;
  };

  const ensureSpace = (neededHeight = 28) => {
    if (y - neededHeight < 60) {
      startNewPage();
    }
  };

  const addField = (label, value) => {
    const lines = String(value ?? "-").split(" ");
    const rowText = lines.join(" ");
    const rowHeight = Math.max(1, Math.ceil(rowText.length / 50)) * 14 + 8;
    ensureSpace(rowHeight);

    page.drawRectangle({
      x: margin,
      y: y - rowHeight + 5,
      width: contentWidth,
      height: rowHeight,
      color: rgb(0.995, 0.995, 0.995),
      borderColor: rgb(0.92, 0.92, 0.92),
      borderWidth: 0.4,
    });

    drawText(label, margin + 8, y - 7, { size: 9.5, bold: true, color: rgb(0.35, 0.35, 0.35) });
    drawText(":", margin + labelWidth, y - 7, { size: 9.5, bold: true, color: rgb(0.4, 0.4, 0.4) });

    let valueY = y - 7;
    const wrappedValue = rowText.match(new RegExp(`.{1,${Math.max(20, Math.floor(valueWidth / 4))}}`, "g")) || ["-"];
    wrappedValue.forEach((line) => {
      drawText(line, margin + labelWidth + 10, valueY, { size: 10.5, color: rgb(0.1, 0.1, 0.1) });
      valueY -= 14;
    });

    y -= rowHeight;
  };

  const addSection = (title) => {
    ensureSpace(30);
    page.drawRectangle({
      x: margin,
      y: y - 16,
      width: contentWidth,
      height: 20,
      color: rgb(0.9, 0.96, 0.93),
      borderColor: rgb(0.72, 0.84, 0.78),
      borderWidth: 0.8,
    });
    drawText(title, margin + 8, y - 2, { size: 11, bold: true, color: rgb(0.08, 0.32, 0.25) });
    y -= 24;
  };

  const boolLabel = (value) => (value === undefined || value === null ? "-" : value ? "Sesuai" : "Tidak Sesuai");

  const monItems = Array.isArray(implementasi?.monitorings)
    ? implementasi.monitorings
    : (implementasi?.monitoring ? [implementasi.monitoring] : []);

  const latestMon = monItems.length > 0 ? monItems[monItems.length - 1] : null;

  // Implementation helper matching modal logic
  const valImplementasi = (fieldSesuai, fieldName, fallbackName) => {
    if (!implementasi) return "-";
    const aktual = typeof implementasi.realisasi_aktual === 'string'
      ? (JSON.parse(implementasi.realisasi_aktual || '{}'))
      : (implementasi.realisasi_aktual || {});

    const targetField = fallbackName || fieldName;
    if (implementasi[fieldSesuai]) {
      const val = item ? item[targetField] : null;
      return val !== undefined && val !== null ? val : "-";
    }
    const valAktual = aktual[fieldName];
    if (valAktual !== undefined && valAktual !== null && valAktual !== "") return valAktual;
    const valFallback = item ? item[targetField] : null;
    return valFallback !== undefined && valFallback !== null ? valFallback : "-";
  };

  const getDokumentasiCount = (dok) => {
    if (!dok) return 0;
    if (Array.isArray(dok)) return dok.length;
    if (typeof dok === 'string') {
      try {
        const parsed = JSON.parse(dok);
        if (Array.isArray(parsed)) return parsed.length;
      } catch {
        if (dok.includes(',')) return dok.split(',').filter(s => s.trim() !== '').length;
      }
      return 1;
    }
    return 1;
  };

  const fmtDateValue = (val) => {
    if (!val) return "—";
    const d = new Date(val);
    if (isNaN(d.getTime())) return String(val);
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
  };

  const getKategoriLabel = (healthStr, evalData) => {
    const term = String(healthStr || evalData?.kategori || "").toLowerCase();
    if (term.includes('excel') || term.includes('sangat') || term.includes('baik')) return "Sangat Sehat (Excellent / BAIK)";
    if (term.includes('good') || term.includes('sedang')) return "Sehat (Good / SEDANG)";
    if (term.includes('warn') || term.includes('kurang') || term.includes('buruk')) return "Kurang Sehat (Warning / BURUK)";
    if (term.includes('critical') || term.includes('kritis') || term.includes('gagal')) return "Kritis (Critical / GAGAL)";
    return healthStr || "-";
  };

  const dokCount = implementasi ? (implementasi.dokumentasi_count ?? getDokumentasiCount(implementasi.dokumentasi_kegiatan)) : 0;

  startNewPage();

  addSection("INFORMASI LEMBAGA");
  addField("Nama Lembaga", item.nama_perusahaan);
  addField("Nama PIC", item.nama_pic || "-");
  addField("Narahubung", item.narahubung || "-");
  addField("Email", item.user?.email || "-");

  addSection("DETAIL PERENCANAAN");
  addField("ID Dokumen", item.id);
  addField("Jenis Kegiatan Direncanakan", item.jenis_kegiatan);
  addField("Lokasi Direncanakan", item.lokasi || "-");
  addField("Tanggal Direncanakan", fmtDateValue(item.tanggal_pelaksanaan));
  addField("Jumlah Bibit Direncanakan", item.jumlah_bibit ? `${item.jumlah_bibit} Bibit` : "-");
  addField("Jenis Bibit Direncanakan", item.jenis_bibit || "-");
  addField("TX Hash Perencanaan", item.blockchain_tx_hash || item.blockchain?.tx_hash || "-");

  if (progress.hasImplementasi && implementasi) {
    const jumlahBibitDitanam = valImplementasi('jumlah_bibit_sesuai', 'jumlah_bibit');
    addSection("DETAIL IMPLEMENTASI");
    addField("Jenis Kegiatan Aktual", valImplementasi('jenis_kegiatan_sesuai', 'jenis_kegiatan'));
    addField("Lokasi Aktual", valImplementasi('lokasi_sesuai', 'lokasi'));
    addField("Tanggal Implementasi", fmtDateValue(valImplementasi('tanggal_sesuai', 'tanggal', 'tanggal_pelaksanaan')));
    addField("Jumlah Bibit Ditanam", jumlahBibitDitanam !== "-" ? `${jumlahBibitDitanam} Bibit` : "-");
    addField("Jenis Bibit Ditanam", valImplementasi('jenis_bibit_sesuai', 'jenis_bibit'));
    addField("Dokumentasi", dokCount > 0 ? `${dokCount} Foto/File` : "Tidak Ada");
    addField("TX Hash Implementasi", implementasi.blockchain_tx_hash || "-");
  }

  if (progress.hasMonitoring && monItems.length > 0) {
    const evalData = item.evaluation_data;
    const survivalRateText = evalData
      ? `${Number(evalData.detail?.cumulative_survival ?? 0).toFixed(2)}% (Kumulatif)`
      : (latestMon?.survival_rate ? `${latestMon.survival_rate}%` : "-");

    const healthText = getKategoriLabel(item.health_status, evalData);

    addSection("REKAP EVALUASI & MONITORING");
    addField("Total Monitoring", String(monItems.length));
    addField("Monitoring Terakhir", fmtDateValue(latestMon?.created_at));

    if (evalData && evalData.nilai_akhir) {
      addField("Nilai Akhir (NA)", `${evalData.nilai_akhir} / 5.00`);
      addField("Kategori Kelayakan", healthText);
      addField("Rekomendasi Tindakan", evalData.rekomendasi || "-");
      addField("Survival Rate Kumulatif", `${evalData.criteria?.stabilitas_lanskap?.skor_survival_rate}/5 (${evalData.detail?.cumulative_survival}%)`);
      addField("Tinggi Vegetasi Akhir", `${evalData.criteria?.stabilitas_lanskap?.skor_tinggi_bibit}/5 (${evalData.detail?.tinggi_bibit_akhir_cm} cm)`);
      addField("Kesehatan Daun", `${evalData.criteria?.stabilitas_lanskap?.skor_kesehatan_daun}/5 (${evalData.detail?.avg_daun_sehat_pct}%)`);
      addField("Tren Pemeliharaan", `${evalData.criteria?.efisiensi_program?.skor_tren_survival}/5 (${evalData.detail?.delta_survival_periode ?? 0}%)`);
    } else {
      addField("Survival Rate Aktual", survivalRateText);
      addField("Kondisi Kesehatan", healthText);
    }

    addSection("RIWAYAT MONITORING");
    monItems.forEach((mon, idx) => {
      const detailsText = `Bulan Ke: ${mon.bulan_monitoring || "—"} | Survival: ${mon.survival_rate ? `${mon.survival_rate}%` : "—"} | Mati: ${mon.jumlah_bibit_mati ?? "0"} | Tinggi: ${mon.tinggi_bibit ? `${mon.tinggi_bibit} cm` : "—"}`;
      addField(`Ronde #${idx + 1} (${fmtDateValue(mon.created_at)})`, detailsText);
      addField(`TX Hash Ronde #${idx + 1}`, mon.blockchain_tx_hash || "-");
    });
  }

  page.drawLine({ start: { x: margin, y: 46 }, end: { x: margin + contentWidth, y: 46 }, thickness: 0.6, color: rgb(0.76, 0.76, 0.76) });
  drawText("Dokumen ini dihasilkan otomatis oleh PELUK BUMI. QR code di atas dapat digunakan untuk memverifikasi keaslian dokumen.", margin, 33, { size: 8.5, color: rgb(0.45, 0.45, 0.45) });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
};
