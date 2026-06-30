import api from '@/shared/services/api';

// Base API endpoints
const MONITORING_ENDPOINT = '/monitoring';

// Fetch monitoring data
export const fetchMonitoringData = async (implementasiId, userRole = 'user') => {
  try {
    let url = `${MONITORING_ENDPOINT}/implementasi/${implementasiId}`;
    
    // Add query parameters based on user role
    const params = new URLSearchParams();
    if (userRole !== 'admin') {
      params.append('user_role', 'user');
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching monitoring data:', error);
    throw new Error(error.response?.data?.message || 'Gagal memuat data monitoring');
  }
};

// Submit new monitoring
export const submitMonitoring = async (monitoringData) => {
  try {
    const response = await api.post(MONITORING_ENDPOINT, monitoringData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error submitting monitoring:', error);
    throw new Error(error.response?.data?.message || 'Gagal menyimpan data monitoring');
  }
};

// Update monitoring status
export const updateMonitoringStatus = async (id, updateData) => {
  try {
    const response = await api.patch(`${MONITORING_ENDPOINT}/${id}`, updateData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error updating monitoring:', error);
    throw new Error(error.response?.data?.message || 'Gagal memperbarui data monitoring');
  }
};

// Update monitoring data
export const updateMonitoring = async (id, updateData) => {
  try {
    const response = await api.put(`${MONITORING_ENDPOINT}/${id}`, updateData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error updating monitoring:', error);
    throw new Error(error.response?.data?.message || 'Gagal memperbarui data monitoring');
  }
};

// Delete monitoring
export const deleteMonitoring = async (id) => {
  try {
    await api.delete(`${MONITORING_ENDPOINT}/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting monitoring:', error);
    throw new Error(error.response?.data?.message || 'Gagal menghapus data monitoring');
  }
};

// Get monitoring by ID
export const getMonitoringById = async (id) => {
  try {
    const response = await api.get(`${MONITORING_ENDPOINT}/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching monitoring by ID:', error);
    throw new Error(error.response?.data?.message || 'Gagal memuat detail monitoring');
  }
};

// Get monitoring by month
export const getMonitoringByMonth = async (implementasiId, month) => {
  try {
    const response = await api.get(`${MONITORING_ENDPOINT}/implementasi/${implementasiId}/bulan/${month}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching monitoring by month:', error);
    throw new Error(error.response?.data?.message || 'Gagal memuat data monitoring bulan tersebut');
  }
};

// Check if month can be monitored (validation)
export const canMonitorMonth = async (implementasiId, month) => {
  try {
    const response = await api.get(`${MONITORING_ENDPOINT}/can-monitor/${implementasiId}/${month}`);
    return response.data;
  } catch (error) {
    console.error('Error checking month availability:', error);
    // Return default values if endpoint doesn't exist
    return { canMonitor: true, reason: null };
  }
};

// Get monitoring statistics
export const getMonitoringStatistics = async (implementasiId) => {
  try {
    const response = await api.get(`${MONITORING_ENDPOINT}/statistics/${implementasiId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching monitoring statistics:', error);
    // Return default statistics if endpoint doesn't exist
    return {
      totalMonths: 0,
      averageSurvivalRate: 0,
      averageHeight: 0,
      averageDiameter: 0,
      healthStatus: { excellent: 0, good: 0, poor: 0 }
    };
  }
};

// Get monitoring trend data
export const getMonitoringTrend = async (implementasiId) => {
  try {
    const response = await api.get(`${MONITORING_ENDPOINT}/trend/${implementasiId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching monitoring trend:', error);
    // Return empty trend if endpoint doesn't exist
    return [];
  }
};

// Upload monitoring documentation
export const uploadMonitoringDocumentation = async (monitoringId, file) => {
  try {
    const formData = new FormData();
    formData.append('dokumentasi_monitoring', file);
    formData.append('monitoring_id', monitoringId);

    const response = await api.post(`${MONITORING_ENDPOINT}/${monitoringId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data || response.data;
  } catch (error) {
    console.error('Error uploading documentation:', error);
    throw new Error(error.response?.data?.message || 'Gagal mengunggah dokumentasi');
  }
};

// Validate monitoring data with backend
export const validateMonitoringWithBackend = async (monitoringData, implementasiId) => {
  try {
    const response = await api.post(`${MONITORING_ENDPOINT}/validate`, {
      ...monitoringData,
      implementasi_id: implementasiId
    });
    return response.data;
  } catch (error) {
    console.error('Error validating monitoring data:', error);
    return {
      isValid: false,
      errors: [error.response?.data?.message || 'Validasi gagal']
    };
  }
};

// Calculate survival rate automatically
export const calculateSurvivalRate = async (jumlahDitanam, jumlahMati) => {
  try {
    const response = await api.post(`${MONITORING_ENDPOINT}/calculate-survival-rate`, {
      jumlah_bibit_ditanam: jumlahDitanam,
      jumlah_bibit_mati: jumlahMati
    });
    return response.data.survival_rate;
  } catch (error) {
    console.error('Error calculating survival rate:', error);
    // Fallback calculation
    if (jumlahDitanam > 0) {
      return ((jumlahDitanam - jumlahMati) / jumlahDitanam) * 100;
    }
    return 0;
  }
};

// Export monitoring data
export const exportMonitoringData = async (implementasiId, format = 'excel') => {
  try {
    const response = await api.get(`${MONITORING_ENDPOINT}/export/${implementasiId}`, {
      params: { format },
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `monitoring-data-${implementasiId}-${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'pdf'}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error exporting monitoring data:', error);
    throw new Error(error.response?.data?.message || 'Gagal mengekspor data monitoring');
  }
};

// Get monitoring recommendations
export const getMonitoringRecommendations = async (implementasiId) => {
  try {
    const response = await api.get(`${MONITORING_ENDPOINT}/recommendations/${implementasiId}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching monitoring recommendations:', error);
    // Return default recommendations if endpoint doesn't exist
    return [
      'Pastikan penyiraman dilakukan secara teratur',
      'Periksa kondisi daun dan batang secara berkala',
      'Lakukan pemupukan sesuai dengan jadwal'
    ];
  }
};
