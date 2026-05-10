import api from '@/shared/services/api';

/**
 * Fetch perencanaan data from API
 * @param {string} userRole - User role for filtering data
 * @returns {Promise<Array>} Array of perencanaan records
 */
export const fetchPerencanaan = async (userRole) => {
  try {
    const response = await api.get(`/perencanaan/all`);
    return response.data.data || [];
  } catch (error) {
    console.error('[EvaluationService] Failed to fetch perencanaan:', error);
    throw new Error('Gagal mengambil data perencanaan');
  }
};

/**
 * Fetch implementasi data from API
 * @param {string} userRole - User role for filtering data
 * @returns {Promise<Array>} Array of implementasi records
 */
export const fetchImplementasi = async (userRole) => {
  try {
    const response = await api.get(`/implementasi`);
    return response.data.data || [];
  } catch (error) {
    console.error('[EvaluationService] Failed to fetch implementasi:', error);
    throw new Error('Gagal mengambil data implementasi');
  }
};

/**
 * Fetch monitoring data from API
 * @param {string} userRole - User role for filtering data
 * @returns {Promise<Array>} Array of monitoring records
 */
export const fetchMonitoring = async (userRole) => {
  try {
    const response = await api.get(`/monitoring`);
    return response.data.data || [];
  } catch (error) {
    console.error('[EvaluationService] Failed to fetch monitoring:', error);
    throw new Error('Gagal mengambil data monitoring');
  }
};

/**
 * Fetch evaluasi data from API
 * @param {string} userRole - User role for filtering data
 * @returns {Promise<Array>} Array of evaluasi records
 */
export const fetchEvaluasi = async (userRole) => {
  try {
    const response = await api.get(`/evaluation/evaluasi`, {
      params: { role: userRole }
    });
    return response.data.data || [];
  } catch (error) {
    console.error('[EvaluationService] Failed to fetch evaluasi:', error);
    throw new Error('Gagal mengambil data evaluasi');
  }
};

/**
 * Fetch all evaluation data at once
 * @param {string} userRole - User role for filtering data
 * @returns {Promise<Object>} Object containing all evaluation data
 */
export const fetchAllEvaluasiData = async (userRole) => {
  try {
    // Fetch each type individually since combined endpoint doesn't exist
    const [perencanaan, implementasi, monitoring] = await Promise.all([
      fetchPerencanaan(userRole),
      fetchImplementasi(userRole),
      fetchMonitoring(userRole)
    ]);
    
    return {
      perencanaan,
      implementasi,
      monitoring
    };
  } catch (error) {
    console.error('[EvaluationService] Failed to fetch all evaluasi data:', error);
    throw new Error('Gagal mengambil data evaluasi lengkap');
  }
};
