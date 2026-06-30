// Validation utilities
export const validateMonitoringData = (data, existingData = [], maxMonths = 6) => {
  const errors = [];

  // Required fields validation
  if (!data.implementasi_id) {
    errors.push('ID implementasi wajib diisi');
  }

  const allowedMonths = [3, 6];
  if (!data.bulan_monitoring || !allowedMonths.includes(Number(data.bulan_monitoring))) {
    errors.push(`Bulan monitoring harus salah satu dari ${allowedMonths.join(' atau ')}`);
  }

  // Check if month already exists
  if (existingData.some(item => item.bulan_monitoring === data.bulan_monitoring)) {
    errors.push(`Data monitoring bulan ${data.bulan_monitoring} sudah ada`);
  }

  if (!data.jumlah_bibit_ditanam || data.jumlah_bibit_ditanam <= 0) {
    errors.push('Jumlah bibit ditanam harus lebih dari 0');
  }

  if (data.jumlah_bibit_mati === undefined || data.jumlah_bibit_mati === null) {
    errors.push('Jumlah bibit mati wajib diisi');
  }

  if (data.jumlah_bibit_mati < 0) {
    errors.push('Jumlah bibit mati tidak boleh negatif');
  }

  if (data.jumlah_bibit_mati > data.jumlah_bibit_ditanam) {
    errors.push('Jumlah bibit mati tidak boleh lebih dari jumlah bibit ditanam');
  }

  // Validate survival rate if provided
  if (data.survival_rate !== undefined && data.survival_rate !== null) {
    if (data.survival_rate < 0 || data.survival_rate > 100) {
      errors.push('Survival rate harus antara 0 dan 100');
    }
  }

  // Validate measurements
  if (data.tinggi_bibit !== undefined && data.tinggi_bibit !== null) {
    if (data.tinggi_bibit < 0) {
      errors.push('Tinggi bibit tidak boleh negatif');
    }
    if (data.tinggi_bibit > 1000) {
      errors.push('Tinggi bibit tidak boleh lebih dari 1000 cm');
    }
  }

  if (data.diameter_batang !== undefined && data.diameter_batang !== null) {
    if (data.diameter_batang < 0) {
      errors.push('Diameter batang tidak boleh negatif');
    }
    if (data.diameter_batang > 100) {
      errors.push('Diameter batang tidak boleh lebih dari 100 cm');
    }
  }

  if (data.jumlah_daun !== undefined && data.jumlah_daun !== null) {
    if (data.jumlah_daun < 0) {
      errors.push('Jumlah daun tidak boleh negatif');
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Calculate survival rate
export const calculateSurvivalRate = (jumlahDitanam, jumlahMati) => {
  if (!jumlahDitanam || jumlahDitanam <= 0) return 0;
  if (jumlahMati < 0) return 0;
  if (jumlahMati > jumlahDitanam) return 0;
  
  const survivalRate = ((jumlahDitanam - jumlahMati) / jumlahDitanam) * 100;
  return Math.round(survivalRate * 10) / 10; // Round to 1 decimal place
};

// Format monitoring status
export const formatMonitoringStatus = (status) => {
  const statusMap = {
    'planning': {
      label: 'Perencanaan',
      variant: 'default',
      color: 'text-gray-600'
    },
    'implementation': {
      label: 'Implementasi',
      variant: 'secondary',
      color: 'text-blue-600'
    },
    'monitoring_1': {
      label: 'Monitoring Bulan 1',
      variant: 'outline',
      color: 'text-green-600'
    },
    'monitoring_2': {
      label: 'Monitoring Bulan 2',
      variant: 'outline',
      color: 'text-green-600'
    },
    'monitoring_3': {
      label: 'Monitoring Bulan 3',
      variant: 'outline',
      color: 'text-green-600'
    },
    'monitoring_4': {
      label: 'Monitoring Bulan 4',
      variant: 'outline',
      color: 'text-green-600'
    },
    'monitoring_5': {
      label: 'Monitoring Bulan 5',
      variant: 'outline',
      color: 'text-green-600'
    },
    'monitoring_6': {
      label: 'Monitoring Bulan 6',
      variant: 'outline',
      color: 'text-purple-600'
    },
    'evaluation': {
      label: 'Evaluasi',
      variant: 'secondary',
      color: 'text-orange-600'
    },
    'completed': {
      label: 'Selesai',
      variant: 'default',
      color: 'text-green-600'
    },
    'failed': {
      label: 'Gagal',
      variant: 'destructive',
      color: 'text-red-600'
    }
  };

  return statusMap[status] || {
    label: status,
    variant: 'default',
    color: 'text-gray-600'
  };
};

// Get survival rate color and icon
export const getSurvivalRateInfo = (rate) => {
  if (rate >= 90) {
    return {
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      icon: 'CheckCircle',
      label: 'Sangat Baik'
    };
  } else if (rate >= 75) {
    return {
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      icon: 'TrendingUp',
      label: 'Baik'
    };
  } else if (rate >= 50) {
    return {
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      icon: 'AlertTriangle',
      label: 'Cukup'
    };
  } else {
    return {
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      icon: 'AlertTriangle',
      label: 'Kurang'
    };
  }
};

// Calculate monitoring progress
export const calculateMonitoringProgress = (monitoringData, maxMonths = 6) => {
  if (!monitoringData || monitoringData.length === 0) return 0;
  
  const completedMonths = monitoringData.length;
  return (completedMonths / maxMonths) * 100;
};

// Get next available monitoring month
export const getNextAvailableMonth = (monitoringData, maxMonths = 6) => {
  if (!monitoringData) return 1;
  
  const monitoredMonths = monitoringData.map(item => item.bulan_monitoring).sort();
  
  for (let i = 1; i <= maxMonths; i++) {
    if (!monitoredMonths.includes(i)) {
      return i;
    }
  }
  
  return null; // All months are monitored
};

// Check if monitoring is complete
export const isMonitoringComplete = (monitoringData, maxMonths = 6) => {
  if (!monitoringData) return false;
  return monitoringData.length >= maxMonths;
};

// Calculate average metrics
export const calculateAverageMetrics = (monitoringData) => {
  if (!monitoringData || monitoringData.length === 0) {
    return {
      averageSurvivalRate: 0,
      averageHeight: 0,
      averageDiameter: 0,
      averageLeaves: 0
    };
  }

  const validData = monitoringData.filter(item => item.survival_rate !== null && item.survival_rate !== undefined);
  
  const averageSurvivalRate = validData.length > 0
    ? validData.reduce((sum, item) => sum + item.survival_rate, 0) / validData.length
    : 0;

  const heightData = monitoringData.filter(item => item.tinggi_bibit !== null && item.tinggi_bibit !== undefined);
  const averageHeight = heightData.length > 0
    ? heightData.reduce((sum, item) => sum + item.tinggi_bibit, 0) / heightData.length
    : 0;

  const diameterData = monitoringData.filter(item => item.diameter_batang !== null && item.diameter_batang !== undefined);
  const averageDiameter = diameterData.length > 0
    ? diameterData.reduce((sum, item) => sum + item.diameter_batang, 0) / diameterData.length
    : 0;

  const leavesData = monitoringData.filter(item => item.jumlah_daun !== null && item.jumlah_daun !== undefined);
  const averageLeaves = leavesData.length > 0
    ? leavesData.reduce((sum, item) => sum + item.jumlah_daun, 0) / leavesData.length
    : 0;

  return {
    averageSurvivalRate: Math.round(averageSurvivalRate * 10) / 10,
    averageHeight: Math.round(averageHeight * 10) / 10,
    averageDiameter: Math.round(averageDiameter * 10) / 10,
    averageLeaves: Math.round(averageLeaves)
  };
};

// Get health status summary
export const getHealthStatusSummary = (monitoringData) => {
  if (!monitoringData || monitoringData.length === 0) {
    return { excellent: 0, good: 0, poor: 0 };
  }

  return monitoringData.reduce((acc, item) => {
    const rate = item.survival_rate || 0;
    if (rate >= 90) acc.excellent = (acc.excellent || 0) + 1;
    else if (rate >= 75) acc.good = (acc.good || 0) + 1;
    else acc.poor = (acc.poor || 0) + 1;
    return acc;
  }, {});
};

// Get leaf condition summary
export const getLeafConditionSummary = (monitoringData) => {
  if (!monitoringData || monitoringData.length === 0) {
    return { dry: 0, wilted: 0, yellow: 0, spotted: 0, insects: 0 };
  }

  return monitoringData.reduce((acc, item) => {
    // Count conditions that are significant (>25%)
    if (item.daun_mengering && item.daun_mengering !== '<25%') acc.dry++;
    if (item.daun_layu && item.daun_layu !== '<25%') acc.wilted++;
    if (item.daun_menguning && item.daun_menguning !== '<25%') acc.yellow++;
    if (item.bercak_daun && item.bercak_daun !== '<25%') acc.spotted++;
    if (item.daun_serangga && item.daun_serangga !== '<25%') acc.insects++;
    return acc;
  }, {});
};

// Get survival rate trend
export const getSurvivalRateTrend = (monitoringData) => {
  if (!monitoringData || monitoringData.length === 0) return [];

  return monitoringData
    .filter(item => item.bulan_monitoring && item.survival_rate !== null && item.survival_rate !== undefined)
    .sort((a, b) => a.bulan_monitoring - b.bulan_monitoring)
    .map(item => ({
      month: item.bulan_monitoring,
      rate: item.survival_rate,
      date: item.created_at || new Date().toISOString()
    }));
};

// Generate monitoring report
export const generateMonitoringReport = (monitoringData, implementasiData = null) => {
  if (!monitoringData || monitoringData.length === 0) {
    return {
      summary: 'Tidak ada data monitoring',
      metrics: {},
      trends: {},
      recommendations: []
    };
  }

  const metrics = calculateAverageMetrics(monitoringData);
  const healthStatus = getHealthStatusSummary(monitoringData);
  const leafConditions = getLeafConditionSummary(monitoringData);
  const trend = getSurvivalRateTrend(monitoringData);

  const report = {
    summary: `Monitoring dilakukan selama ${monitoringData.length} bulan dengan survival rate rata-rata ${metrics.averageSurvivalRate}%`,
    metrics: {
      totalMonths: monitoringData.length,
      averageSurvivalRate: metrics.averageSurvivalRate,
      averageHeight: metrics.averageHeight,
      averageDiameter: metrics.averageDiameter,
      averageLeaves: metrics.averageLeaves,
      healthStatus,
      leafConditions
    },
    trends: {
      survivalRate: trend,
      isImproving: trend.length >= 2 && trend[trend.length - 1].rate > trend[0].rate
    },
    recommendations: generateRecommendations(metrics, healthStatus, leafConditions)
  };

  return report;
};

// Generate recommendations based on monitoring data
export const generateRecommendations = (metrics, healthStatus, leafConditions) => {
  const recommendations = [];

  // Survival rate recommendations
  if (metrics.averageSurvivalRate < 75) {
    recommendations.push('Survival rate rendah, perlu evaluasi metode penanaman dan perawatan');
  } else if (metrics.averageSurvivalRate < 90) {
    recommendations.push('Survival rate cukup baik, dapat ditingkatkan dengan perawatan lebih intensif');
  } else {
    recommendations.push('Survival rate sangat baik, pertahankan metode perawatan saat ini');
  }

  // Growth recommendations
  if (metrics.averageHeight < 20) {
    recommendations.push('Pertumbuhan tinggi bibit lambat, pertimbangkan pemupukan tambahan');
  }

  // Leaf condition recommendations
  if (leafConditions.dry > 0) {
    recommendations.push('Ada indikasi daun mengering, pastikan penyiraman cukup');
  }

  if (leafConditions.insects > 0) {
    recommendations.push('Ada indikasi serangga, lakukan monitoring hama secara berkala');
  }

  if (leafConditions.spotted > 0) {
    recommendations.push('Ada bercak pada daun, periksa kemungkinan penyakit dan lakukan treatment');
  }

  return recommendations;
};

// Format month display
export const formatMonth = (bulan) => {
  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  
  return monthNames[bulan - 1] || `Bulan ${bulan}`;
};

// Format monitoring period
export const formatMonitoringPeriod = (bulan) => {
  return `Bulan ke-${bulan}`;
};

// Check if monitoring is on schedule
export const isMonitoringOnSchedule = (monitoringData, maxMonths = 6) => {
  if (!monitoringData || monitoringData.length === 0) return true;
  
  const sortedData = monitoringData.sort((a, b) => a.bulan_monitoring - b.bulan_monitoring);
  const expectedMonths = Array.from({ length: sortedData.length }, (_, i) => i + 1);
  
  return sortedData.every((item, index) => item.bulan_monitoring === expectedMonths[index]);
};

// Get monitoring compliance score
export const getMonitoringComplianceScore = (monitoringData, maxMonths = 6) => {
  if (!monitoringData) return 0;
  
  const completedMonths = monitoringData.length;
  const onSchedule = isMonitoringOnSchedule(monitoringData, maxMonths);
  
  let score = (completedMonths / maxMonths) * 100;
  
  // Bonus for being on schedule
  if (onSchedule) {
    score += 10;
  }
  
  return Math.min(score, 100);
};
