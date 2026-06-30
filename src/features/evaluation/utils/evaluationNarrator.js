/**
 * Utility untuk menghasilkan narasi evaluasi berdasarkan data monitoring
 */

export const generateSurvivalNarrative = (report) => {
  const survivalRate = parseFloat(report.survivalRate);
  if (!survivalRate || survivalRate <= 0) {
    return "Data survival rate belum tersedia untuk analisis.";
  }

  const planted = report.jumlahBibit;
  const survived = Math.round((survivalRate / 100) * planted);
  const date = report.monitoringDate;
  const company = report.namaPerusahaan;
  const location = report.lokasi;

  return `Berdasarkan hasil monitoring pada ${date}, dari total ${planted} bibit yang ditanam oleh ${company}, sebanyak ${survived} bibit ditemukan dalam kondisi hidup. Hal ini menunjukkan tingkat kelangsungan hidup (Survival Rate) sebesar ${survivalRate.toFixed(2)}%, yang dikategorikan sebagai keberhasilan restorasi yang ${getSurvivalCategory(survivalRate)}.`;
};

export const generateHeightNarrative = (avgHeight) => {
  if (!avgHeight || avgHeight <= 0) {
    return "Data tinggi bibit rata-rata belum tersedia.";
  }

  const heightNum = parseFloat(avgHeight);
  return `Tinggi bibit rata-rata yang terukur adalah ${heightNum.toFixed(2)} cm. Pertumbuhan vertikal menunjukkan adaptasi bibit terhadap kondisi lingkungan setempat.`;
};

export const generateDiameterNarrative = (avgDiameter) => {
  if (!avgDiameter || avgDiameter <= 0) {
    return "Data diameter batang rata-rata belum tersedia.";
  }

  const diameterNum = parseFloat(avgDiameter);
  return `Diameter batang rata-rata yang terukur adalah ${diameterNum.toFixed(2)} cm, yang mencerminkan kekuatan dan stabilitas struktural bibit mangrove.`;
};

export const generateHealthNarrative = (healthCondition, monitoringData = {}) => {
  const baseNarrative = {
    "Sangat Baik (Excellent)": "Bibit mangrove tumbuh sangat optimal dan cukup dipantau secara rutin tanpa intervensi khusus.",
    "Baik (Good)": "Vegetasi tumbuh stabil namun mulai memerlukan pemeliharaan ringan seperti pembersihan gulma atau sampah di sekitar bibit.",
    "Kurang Sehat / Sakit (Fair/Stressed)": "Bibit menunjukkan stres lingkungan dan memerlukan pengawasan ketat serta persiapan penyulaman parsial.",
    "Kritis / Buruk (Critical/Poor)": "Terjadi kegagalan tumbuh skala besar sehingga perlu investigasi mendalam dan tindakan replanting.",
    "Data kesehatan belum tersedia": "Data kesehatan belum tersedia untuk analisis mendalam.",
  };

  let narrative = baseNarrative[healthCondition] || baseNarrative["Data kesehatan belum tersedia"];

  // Tambahkan detail dari monitoring jika ada
  if (monitoringData && Object.keys(monitoringData).length > 0) {
    const details = [];

    if (monitoringData.daun_menguning) {
      details.push(`daun menguning (${monitoringData.daun_menguning})`);
    }
    if (monitoringData.daun_layu) {
      details.push(`daun layu (${monitoringData.daun_layu})`);
    }
    if (monitoringData.bercak_daun) {
      details.push(`bercak daun (${monitoringData.bercak_daun})`);
    }
    if (monitoringData.daun_serangga) {
      details.push(`kerusakan akibat serangga (${monitoringData.daun_serangga})`);
    }
    if (monitoringData.daun_mengering) {
      details.push(`daun mengering (${monitoringData.daun_mengering})`);
    }

    if (details.length > 0) {
      narrative += ` Observasi mencatat: ${details.join(", ")}.`;
    } else {
      narrative += " Tidak ditemukan adanya serangan hama atau penyakit yang signifikan pada saat pengamatan dilakukan.";
    }
  } else {
    narrative += " Tidak ditemukan adanya serangan hama atau penyakit yang signifikan pada saat pengamatan dilakukan.";
  }

  return narrative;
};

export const getSurvivalCategory = (survivalRate) => {
  if (survivalRate >= 85) return "sangat baik (excellent)";
  if (survivalRate >= 70) return "baik (good)";
  if (survivalRate >= 50) return "kurang sehat / sakit (fair/stressed)";
  return "kritis / buruk (critical/poor)";
};

export const getSuccessStatus = (survivalRate) => {
  const rate = parseFloat(survivalRate);
  if (Number.isNaN(rate)) return "UNKNOWN";
  if (rate >= 85) return "BERHASIL";
  if (rate >= 70) return "BAIK";
  if (rate >= 50) return "PERLU_PERHATIAN";
  return "GAGAL";
};

export const getRecommendations = (report, monitoringData = {}) => {
  const recommendations = [];
  const survivalRate = parseFloat(report.survivalRate);

  // Rekomendasi berdasarkan Survival Rate
  if (survivalRate < 50) {
    recommendations.push({
      level: "KRITIS",
      text: "Status kesehatan kritis. Rekomendasi: investigasi kualitas air dan tanah, evaluasi ulang metode penanaman, lalu lakukan replanting atau penyulaman total.",
      icon: "alert",
    });
  } else if (survivalRate < 70) {
    recommendations.push({
      level: "TINGGI",
      text: "Status kesehatan kurang sehat. Rekomendasi: tingkatkan pengawasan, cek hama/arus/nutrisi, dan siapkan penyulaman parsial bila diperlukan.",
      icon: "warning",
    });
  } else if (survivalRate < 85) {
    recommendations.push({
      level: "SEDANG",
      text: "Status kesehatan baik namun belum optimal. Rekomendasi: lakukan pemeliharaan ringan seperti pembersihan gulma, sampah plastik, dan pemantauan rutin berkala.",
      icon: "info",
    });
  }

  // Rekomendasi berdasarkan kondisi kesehatan
  if (monitoringData.daun_menguning && monitoringData.daun_menguning !== "<25%") {
    recommendations.push({
      level: "SEDANG",
      text: "Daun menguning terdeteksi. Rekomendasi: periksa keseimbangan nutrisi, kemungkinan kekurangan Fe atau Mn. Lakukan pemberian pupuk cair jika diperlukan.",
      icon: "info",
    });
  }

  if (monitoringData.bercak_daun && monitoringData.bercak_daun !== "<25%") {
    recommendations.push({
      level: "SEDANG",
      text: "Bercak daun terdeteksi. Rekomendasi: penawaran pestisida organik, peningkatan sirkulasi udara, dan pengurangan kelembaban berlebih.",
      icon: "info",
    });
  }

  if (monitoringData.daun_layu && monitoringData.daun_layu !== "<25%") {
    recommendations.push({
      level: "TINGGI",
      text: "Daun layu terdeteksi. Rekomendasi: periksa kelembaban tanah, sistem irigasi, dan kemungkinan serangan patogen akar.",
      icon: "warning",
    });
  }

  if (monitoringData.daun_serangga && monitoringData.daun_serangga !== "<25%") {
    recommendations.push({
      level: "SEDANG",
      text: "Kerusakan akibat serangga terdeteksi. Rekomendasi: aplikasi pestisida organik, pengendalian hayati, atau penyemprotan air dengan sabun organik.",
      icon: "info",
    });
  }

  // Rekomendasi default
  if (recommendations.length === 0) {
    recommendations.push({
      level: "BAIK",
      text: "Kondisi bibit sangat baik. Rekomendasi: lanjutkan pemantauan rutin berkala tanpa intervensi khusus, sambil tetap mencatat perubahan lapangan.",
      icon: "check",
    });
  }

  return recommendations;
};

export const getSuccessColor = (survivalRate) => {
  const rate = parseFloat(survivalRate);
  if (Number.isNaN(rate)) return { bg: "bg-gray-50", border: "border-gray-200", text: "text-gray-700", badge: "bg-gray-100 text-gray-800" };
  if (rate >= 85) return { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", badge: "bg-green-100 text-green-800" };
  if (rate >= 70) return { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", badge: "bg-emerald-100 text-emerald-800" };
  if (rate >= 50) return { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", badge: "bg-yellow-100 text-yellow-800" };
  return { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", badge: "bg-red-100 text-red-800" };
};

export const generateFullNarrative = (report, monitoringData = {}) => {
  return {
    survivalRate: generateSurvivalNarrative(report),
    height: generateHeightNarrative(report.avgHeight),
    diameter: generateDiameterNarrative(report.avgDiameter),
    health: generateHealthNarrative(report.healthCondition, monitoringData),
  };
};
