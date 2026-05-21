// Validation utilities
export const validatePlanningData = (data) => {
  const errors = [];

  // Required fields validation
  if (!data.nama_perusahaan || data.nama_perusahaan.trim() === '') {
    errors.push('Nama perusahaan wajib diisi');
  }

  if (!data.nama_pic || data.nama_pic.trim() === '') {
    errors.push('Nama PIC wajib diisi');
  }

  if (!data.narahubung || data.narahubung.trim() === '') {
    errors.push('Narahubung wajib diisi');
  }

  if (!data.jenis_kegiatan) {
    errors.push('Jenis kegiatan wajib dipilih');
  }

  if (!data.lokasi || data.lokasi.trim() === '') {
    errors.push('Lokasi wajib diisi');
  }

  if (!data.jumlah_bibit || data.jumlah_bibit <= 0) {
    errors.push('Jumlah bibit harus lebih dari 0');
  }

  if (!data.jenis_bibit || data.jenis_bibit.trim() === '') {
    errors.push('Jenis bibit wajib diisi');
  }

  if (!data.tanggal_pelaksanaan) {
    errors.push('Tanggal pelaksanaan wajib diisi');
  }

  if (!data.lat || data.long) {
    errors.push('Koordinat lokasi (latitude dan longitude) wajib diisi');
  }

  // Phone number validation
  if (data.narahubung && !/^[\d\s\-\+\(\)]+$/.test(data.narahubung)) {
    errors.push('Format narahubung tidak valid');
  }

  // Date validation
  if (data.tanggal_pelaksanaan) {
    const pelaksanaanDate = new Date(data.tanggal_pelaksanaan);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (pelaksanaanDate < today) {
      errors.push('Tanggal pelaksanaan tidak boleh di masa lalu');
    }
  }

  // Coordinate validation
  if (data.lat && (data.lat < -90 || data.lat > 90)) {
    errors.push('Latitude harus antara -90 dan 90');
  }

  if (data.long && (data.long < -180 || data.long > 180)) {
    errors.push('Longitude harus antara -180 dan 180');
  }

  // Quantity validation
  if (data.jumlah_bibit && (data.jumlah_bibit < 1 || data.jumlah_bibit > 1000000)) {
    errors.push('Jumlah bibit harus antara 1 dan 1,000,000');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Format planning status
export const formatPlanningStatus = (status) => {
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
    'cancelled': {
      label: 'Dibatalkan',
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

// Format activity type
export const formatActivityType = (type) => {
  const typeMap = {
    'Planting Mangrove': {
      label: 'Penanaman Mangrove',
      icon: '🌱',
      color: 'text-green-600'
    },
    'Coral Transplanting': {
      label: 'Transplantasi Karang',
      icon: '🪸',
      color: 'text-blue-600'
    }
  };

  return typeMap[type] || {
    label: type,
    icon: '🌿',
    color: 'text-gray-600'
  };
};

// Calculate planning progress
export const calculatePlanningProgress = (planning) => {
  if (!planning) return 0;

  let progress = 0;

  // Base progress for having planning data (20%)
  if (planning.nama_perusahaan && planning.jenis_kegiatan) {
    progress += 20;
  }

  // Implementation progress (50%)
  if (planning.implementasi) {
    progress += 50;

    // If implementation has documentation, add more progress
    if (planning.implementasi.dokumentasi) {
      progress += 15;
    }
  }

  // Monitoring progress (30%)
  if (planning.implementasi && planning.implementasi.monitoring) {
    const monitoringCount = Array.isArray(planning.implementasi.monitoring) 
      ? planning.implementasi.monitoring.length 
      : 1;
    
    // Each monitoring month adds 5% (max 30% for 6 months)
    progress += Math.min(monitoringCount * 5, 30);
  }

  return Math.min(progress, 100);
};

// Generate planning report data
export const generatePlanningReport = (planningList) => {
  if (!planningList || planningList.length === 0) {
    return {
      total: 0,
      byStatus: {},
      byActivity: {},
      totalSeedlings: 0,
      uniqueCompanies: 0,
      uniqueLocations: 0
    };
  }

  const total = planningList.length;
  const totalSeedlings = planningList.reduce((sum, item) => sum + (item.jumlah_bibit || 0), 0);
  const uniqueCompanies = [...new Set(planningList.map(item => item.nama_perusahaan))].length;
  const uniqueLocations = [...new Set(planningList.map(item => item.lokasi))].length;

  // Group by status
  const byStatus = planningList.reduce((acc, item) => {
    const status = item.status || 'planning';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Group by activity type
  const byActivity = planningList.reduce((acc, item) => {
    const activity = item.jenis_kegiatan || 'Unknown';
    acc[activity] = (acc[activity] || 0) + 1;
    return acc;
  }, {});

  return {
    total,
    byStatus,
    byActivity,
    totalSeedlings,
    uniqueCompanies,
    uniqueLocations
  };
};

// Format date for display
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Format datetime for display
export const formatDateTime = (dateString) => {
  if (!dateString) return '-';
  
  const date = new Date(dateString);
  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Get coordinates display format
export const formatCoordinates = (lat, long) => {
  if (!lat || !long) return '-';
  
  return `${parseFloat(lat).toFixed(6)}, ${parseFloat(long).toFixed(6)}`;
};

// Generate company name for user context
export const generateUserCompanyName = (userId, userName = null) => {
  if (userName) {
    return userName;
  }
  return `USER_${userId}`;
};

// Check if planning is editable
export const isPlanningEditable = (planning, userRole, userId) => {
  if (!planning) return false;

  // Admin can edit any planning
  if (userRole === 'admin') return true;

  // User can only edit their own planning
  if (userRole === 'user' && planning.user_id === userId) {
    // Only allow editing if status is still 'planning'
    return planning.status === 'planning';
  }

  return false;
};

// Check if planning is deletable
export const isPlanningDeletable = (planning, userRole, userId) => {
  if (!planning) return false;

  // Admin can delete any planning
  if (userRole === 'admin') return true;

  // User can only delete their own planning
  if (userRole === 'user' && planning.user_id === userId) {
    // Only allow deletion if status is still 'planning'
    return planning.status === 'planning';
  }

  return false;
};

// Sort planning data
export const sortPlanningData = (data, field = 'created_at', direction = 'desc') => {
  return [...data].sort((a, b) => {
    let aValue = a[field];
    let bValue = b[field];
    
    // Handle date fields
    if (field === 'created_at' || field === 'tanggal_pelaksanaan') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    // Handle numeric fields
    if (field === 'jumlah_bibit') {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    }
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

// Filter planning data
export const filterPlanningData = (data, filters = {}) => {
  return data.filter(item => {
    // Filter by status
    if (filters.status && item.status !== filters.status) {
      return false;
    }

    // Filter by activity type
    if (filters.jenis_kegiatan && item.jenis_kegiatan !== filters.jenis_kegiatan) {
      return false;
    }

    // Filter by company
    if (filters.nama_perusahaan && !item.nama_perusahaan.toLowerCase().includes(filters.nama_perusahaan.toLowerCase())) {
      return false;
    }

    // Filter by date range
    if (filters.dateFrom && new Date(item.tanggal_pelaksanaan) < new Date(filters.dateFrom)) {
      return false;
    }

    if (filters.dateTo && new Date(item.tanggal_pelaksanaan) > new Date(filters.dateTo)) {
      return false;
    }

    return true;
  });
};
