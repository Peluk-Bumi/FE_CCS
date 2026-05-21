/**
 * Evaluasi Engine - Business Logic Layer
 * Pure functions for evaluation calculations and data transformations
 */

// Utility functions
export const parseNumber = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const parsed = Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
};

export const mean = (arr) => {
  if (!arr.length) return null;
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
};

export const formatDateId = (dateLike) => {
  if (!dateLike) return "-";
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// Leaf condition scoring
export const leafConditionScore = (monitoring) => {
  const scoreMap = {
    "<25%": 0,
    "25-45%": 1,
    "25-45": 1,
    "25 - 45%": 1,
    "50-74%": 2,
    "50-74": 2,
    "50 - 74%": 2,
    ">75%": 3,
    ">75": 3,
  };

  const fields = [
    monitoring?.daun_mengering,
    monitoring?.daun_layu,
    monitoring?.daun_menguning,
    monitoring?.bercak_daun,
    monitoring?.daun_serangga,
  ];

  const scores = fields
    .map((value) => String(value || "").replace("–", "-").trim())
    .map((value) => scoreMap[value])
    .filter((value) => value !== undefined);

  return scores.length ? mean(scores) : null;
};

// Health condition label based on leaf observations (monitoring-only)
export const getHealthLabel = (scores) => {
  const avg = mean(scores.filter((value) => value !== null));
  if (avg === null) return "Data kesehatan belum tersedia";
  if (avg <= 0.5) return "Sangat Baik";
  if (avg <= 1.5) return "Baik";
  if (avg <= 2.3) return "Perlu Perhatian";
  return "Kurang Sehat";
};

// Health condition label based on survival rate (evaluation-only)
export const getSurvivalHealthLabel = (survivalRate) => {
  const rate = Number.parseFloat(String(survivalRate ?? "").replace("%", ""));

  if (Number.isNaN(rate)) return "Data kesehatan belum tersedia";
  if (rate >= 85) return "Sangat Baik (Excellent)";
  if (rate >= 70) return "Baik (Good)";
  if (rate >= 50) return "Kurang Sehat / Sakit (Fair/Stressed)";
  return "Kritis / Buruk (Critical/Poor)";
};

export const getSurvivalHealthProfile = (survivalRate) => {
  const rate = Number.parseFloat(String(survivalRate ?? "").replace("%", ""));

  if (Number.isNaN(rate)) {
    return {
      label: "Data kesehatan belum tersedia",
      description: "Data survival rate belum tersedia untuk menentukan status kesehatan.",
      action: "",
    };
  }

  if (rate >= 85) {
    return {
      label: "Sangat Baik (Excellent)",
      description: "Bibit mangrove tumbuh sangat optimal dan cukup dipantau secara rutin tanpa intervensi khusus.",
      action: "Pemantauan rutin berkala",
    };
  }

  if (rate >= 70) {
    return {
      label: "Baik (Good)",
      description: "Vegetasi tumbuh stabil namun mulai memerlukan pemeliharaan ringan seperti pembersihan gulma atau sampah di sekitar bibit.",
      action: "Pemeliharaan ringan",
    };
  }

  if (rate >= 50) {
    return {
      label: "Kurang Sehat / Sakit (Fair/Stressed)",
      description: "Bibit menunjukkan stres lingkungan dan memerlukan pengawasan ketat serta persiapan penyulaman parsial.",
      action: "Pengawasan ketat dan persiapan penyulaman parsial",
    };
  }

  return {
    label: "Kritis / Buruk (Critical/Poor)",
    description: "Terjadi kegagalan tumbuh skala besar sehingga perlu investigasi kualitas air dan tanah serta tindakan replanting.",
    action: "Investigasi mendalam dan replanting",
  };
};

// Monitoring list normalization
export const getMonitoringListFromAnyShape = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return [value];
};

// Survival rate calculation
export const deriveSurvivalRate = (monitoring) => {
  const planted = parseNumber(monitoring?.jumlah_bibit_ditanam);
  const dead = parseNumber(monitoring?.jumlah_bibit_mati);

  if (planted === null || planted <= 0 || dead === null || dead < 0) {
    return null;
  }

  const survived = Math.max(planted - dead, 0);
  return (survived / planted) * 100;
};

// Height value extraction
export const getHeightValue = (monitoring) => {
  return (
    parseNumber(monitoring?.tinggi_bibit) ??
    parseNumber(monitoring?.tinggi_tanaman) ??
    parseNumber(monitoring?.tinggi) ??
    parseNumber(monitoring?.height_cm) ??
    parseNumber(monitoring?.height)
  );
};

// Geo-tagging formatting
export const formatGeoTagging = (lat, long) => {
  const latNum = parseNumber(lat);
  const longNum = parseNumber(long);

  if (latNum === null || longNum === null) {
    return null;
  }

  return `${latNum.toFixed(6)}, ${longNum.toFixed(6)}`;
};

// Merge unique items by ID
export const mergeUniqueById = (items) => {
  const map = new Map();
  items.forEach((item, index) => {
    const key = item?.id ? `id-${item.id}` : `idx-${index}`;
    if (!map.has(key)) map.set(key, item);
  });
  return [...map.values()];
};

// Resolve monitoring date
export const resolveMonitoringDate = (monitoring) => {
  if (!monitoring) return null;

  const candidates = [
    monitoring?.tanggal_monitoring,
    monitoring?.monitoring_date,
    monitoring?.tanggal,
    monitoring?.created_at,
    monitoring?.updated_at,
  ].filter(Boolean);

  for (const candidate of candidates) {
    const date = new Date(candidate);
    if (!Number.isNaN(date.getTime())) {
      return candidate;
    }
  }

  return null;
};

// Build company report from data
export const buildCompanyReport = (perencanaan, implementasiList, monitoringList) => {
  const implementasiByPerencanaan = new Map();
  implementasiList.forEach((item) => {
    if (item?.perencanaan_id) {
      implementasiByPerencanaan.set(String(item.perencanaan_id), item);
    }
  });

  const monitoringByImplementasi = new Map();
  monitoringList.forEach((item) => {
    if (item?.implementasi_id) {
      const key = String(item.implementasi_id);
      const current = monitoringByImplementasi.get(key) || [];
      current.push(item);
      monitoringByImplementasi.set(key, current);
    }
  });

  const perencanaanId = String(perencanaan?.id || "");
  const implementasiFromRelation = perencanaan?.implementasi || null;
  const implementasiFromEndpoint = implementasiByPerencanaan.get(perencanaanId) || null;
  const implementasi = implementasiFromRelation || implementasiFromEndpoint;

  const geoTaggingText =
    implementasi?.geotagging ||
    formatGeoTagging(implementasi?.lat, implementasi?.long) ||
    formatGeoTagging(perencanaan?.lat, perencanaan?.long) ||
    "-";

  const monitoringFromPerencanaan = getMonitoringListFromAnyShape(perencanaan?.monitoring);
  const monitoringFromImplementasiRelation = getMonitoringListFromAnyShape(implementasi?.monitoring);
  const monitoringFromEndpoint = implementasi?.id
    ? monitoringByImplementasi.get(String(implementasi.id)) || []
    : [];

  const monitoringItems = mergeUniqueById([
    ...monitoringFromPerencanaan,
    ...monitoringFromImplementasiRelation,
    ...monitoringFromEndpoint,
  ]);

  const survivalValues = monitoringItems
    .map((item) => parseNumber(item?.survival_rate) ?? deriveSurvivalRate(item))
    .filter((value) => value !== null);

  const diameterValues = monitoringItems
    .map((item) => parseNumber(item?.diameter_batang))
    .filter((value) => value !== null);

  const heightValues = monitoringItems
    .map((item) => getHeightValue(item))
    .filter((value) => value !== null);

  const healthScores = monitoringItems.map(leafConditionScore);

  const latestMonitoringDate = monitoringItems
    .map((item) => resolveMonitoringDate(item))
    .filter(Boolean)
    .sort((a, b) => new Date(b) - new Date(a))[0];

  return {
    id: perencanaan?.id,
    namaPerusahaan: perencanaan?.nama_perusahaan || "Perusahaan tanpa nama",
    jenisKegiatan: perencanaan?.jenis_kegiatan || "-",
    jumlahBibit: perencanaan?.jumlah_bibit || "-",
    lokasi: perencanaan?.lokasi || "-",
    lokasiGeotagging: geoTaggingText,
    tanggalPelaksanaan: formatDateId(perencanaan?.tanggal_pelaksanaan),
    totalMonitoring: monitoringItems.length,
    monitoringDate: latestMonitoringDate ? formatDateId(latestMonitoringDate) : "-",
    survivalRate: survivalValues.length ? `${mean(survivalValues).toFixed(2)}%` : "-",
    avgHeight: heightValues.length ? mean(heightValues).toFixed(2) : "-",
    avgDiameter: diameterValues.length ? mean(diameterValues).toFixed(2) : "-",
    healthCondition: getSurvivalHealthLabel(survivalValues.length ? mean(survivalValues) : null),
    healthConditionDetail: getSurvivalHealthProfile(survivalValues.length ? mean(survivalValues) : null),
    leafHealthCondition: getHealthLabel(healthScores),
    monitoringItems: monitoringItems,
  };
};

// Build all company reports
export const buildAllCompanyReports = (perencanaanList, implementasiList, monitoringList) => {
  return perencanaanList.map((perencanaan) =>
    buildCompanyReport(perencanaan, implementasiList, monitoringList)
  );
};
