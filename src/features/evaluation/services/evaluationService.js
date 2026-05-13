import api from '@/shared/services/api';

const buildUserScopeParams = (userRole, userId) => {
  if (userRole === 'admin' || !userId) {
    return {};
  }

  return {
    user_id: userId,
  };
};

const extractRecords = (payload) => {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return payload?.data || [];
};

/**
 * Fetch perencanaan data from API
 * @param {string} userRole - User role for filtering data
 * @param {number|string|null} userId - Logged-in user ID for scoped filtering
 * @returns {Promise<Array>} Array of perencanaan records
 */
export const fetchPerencanaan = async (userRole, userId = null) => {
  try {
    const endpoint = userRole === 'admin' ? `/perencanaan/all` : `/perencanaan`;
    const response = await api.get(endpoint, {
      params: buildUserScopeParams(userRole, userId),
    });
    return extractRecords(response.data);
  } catch (error) {
    console.error('[EvaluationService] Failed to fetch perencanaan:', error);
    throw new Error('Gagal mengambil data perencanaan');
  }
};

/**
 * Fetch implementasi data from API
 * @param {string} userRole - User role for filtering data
 * @param {number|string|null} userId - Logged-in user ID for scoped filtering
 * @returns {Promise<Array>} Array of implementasi records
 */
export const fetchImplementasi = async (userRole, userId = null) => {
  try {
    const response = await api.get('/implementasi', {
      params: buildUserScopeParams(userRole, userId),
    });
    return extractRecords(response.data);
  } catch (error) {
    console.error('[EvaluationService] Failed to fetch implementasi:', error);
    throw new Error('Gagal mengambil data implementasi');
  }
};

/**
 * Fetch monitoring data from API
 * @param {string} userRole - User role for filtering data
 * @param {number|string|null} userId - Logged-in user ID for scoped filtering
 * @returns {Promise<Array>} Array of monitoring records
 */
export const fetchMonitoring = async (userRole, userId = null) => {
  try {
    const response = await api.get('/monitoring', {
      params: buildUserScopeParams(userRole, userId),
    });
    return extractRecords(response.data);
  } catch (error) {
    console.error('[EvaluationService] Failed to fetch monitoring:', error);
    throw new Error('Gagal mengambil data monitoring');
  }
};

/**
 * Fetch evaluasi data from API
 * @param {string} userRole - User role for filtering data
 * @param {number|string|null} userId - Logged-in user ID for scoped filtering
 * @returns {Promise<Array>} Array of evaluasi records
 */
export const fetchEvaluasi = async (userRole, userId = null) => {
  try {
    const response = await api.get(`/evaluasi`, {
      params: {
        role: userRole,
        ...buildUserScopeParams(userRole, userId),
      }
    });
    return extractRecords(response.data);
  } catch (error) {
    console.error('[EvaluationService] Failed to fetch evaluasi:', error);
    throw new Error('Gagal mengambil data evaluasi');
  }
};

/**
 * Fetch all evaluation data at once
 * @param {string} userRole - User role for filtering data
 * @param {number|string|null} userId - Logged-in user ID for scoped filtering
 * @returns {Promise<Object>} Object containing all evaluation data
 */
export const fetchAllEvaluasiData = async (userRole, userId = null) => {
  try {
    // Fetch each type individually since combined endpoint doesn't exist
    const [perencanaan, implementasi, monitoring] = await Promise.all([
      fetchPerencanaan(userRole, userId),
      fetchImplementasi(userRole, userId),
      fetchMonitoring(userRole, userId)
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
