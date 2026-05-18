import { api } from '@/shared/services/api';

// Base API endpoints
const PLANNING_ENDPOINT = '/api/perencanaan';
const USERS_ENDPOINT = '/api/users';

// Fetch planning data
export const fetchPlanningData = async (userRole = 'user', userId = null) => {
  try {
    let url = PLANNING_ENDPOINT;
    
    // Add query parameters based on user role
    const params = new URLSearchParams();
    if (userRole !== 'admin' && userId) {
      params.append('user_id', userId);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching planning data:', error);
    throw new Error(error.response?.data?.message || 'Gagal memuat data perencanaan');
  }
};

// Submit new planning
export const submitPlanning = async (planningData) => {
  try {
    const response = await api.post(PLANNING_ENDPOINT, planningData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error submitting planning:', error);
    throw new Error(error.response?.data?.message || 'Gagal menyimpan perencanaan');
  }
};

// Update planning status
export const updatePlanningStatus = async (id, status) => {
  try {
    const response = await api.patch(`${PLANNING_ENDPOINT}/${id}`, { status });
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error updating planning status:', error);
    throw new Error(error.response?.data?.message || 'Gagal memperbarui status perencanaan');
  }
};

// Update planning data
export const updatePlanning = async (id, updateData) => {
  try {
    const response = await api.put(`${PLANNING_ENDPOINT}/${id}`, updateData);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error updating planning:', error);
    throw new Error(error.response?.data?.message || 'Gagal memperbarui perencanaan');
  }
};

// Delete planning
export const deletePlanning = async (id) => {
  try {
    await api.delete(`${PLANNING_ENDPOINT}/${id}`);
    return true;
  } catch (error) {
    console.error('Error deleting planning:', error);
    throw new Error(error.response?.data?.message || 'Gagal menghapus perencanaan');
  }
};

// Get planning by ID
export const getPlanningById = async (id) => {
  try {
    const response = await api.get(`${PLANNING_ENDPOINT}/${id}`);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching planning by ID:', error);
    throw new Error(error.response?.data?.message || 'Gagal memuat detail perencanaan');
  }
};

// Get users for admin dropdown
export const fetchUsersForDropdown = async () => {
  try {
    const response = await api.get(`${USERS_ENDPOINT}?role=user&limit=100`);
    const users = response.data.data || response.data;
    
    // Format for dropdown
    return users.map(user => ({
      value: user.id,
      label: `${user.name} (${user.email})`,
      name: user.name,
      email: user.email
    }));
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error(error.response?.data?.message || 'Gagal memuat data pengguna');
  }
};

// Check if user can create planning (for rate limiting or validation)
export const checkUserPlanningLimit = async (userId) => {
  try {
    const response = await api.get(`${PLANNING_ENDPOINT}/check-limit/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error checking planning limit:', error);
    // Return default values if endpoint doesn't exist
    return { canCreate: true, remainingLimit: 10 };
  }
};

// Get planning statistics
export const getPlanningStatistics = async (userRole = 'user', userId = null) => {
  try {
    let url = `${PLANNING_ENDPOINT}/statistics`;
    const params = new URLSearchParams();
    
    if (userRole !== 'admin' && userId) {
      params.append('user_id', userId);
    }
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await api.get(url);
    return response.data.data || response.data;
  } catch (error) {
    console.error('Error fetching planning statistics:', error);
    // Return default statistics if endpoint doesn't exist
    return {
      total: 0,
      thisMonth: 0,
      completed: 0,
      inProgress: 0
    };
  }
};

// Export planning data
export const exportPlanningData = async (filters = {}) => {
  try {
    const response = await api.get(`${PLANNING_ENDPOINT}/export`, {
      params: filters,
      responseType: 'blob'
    });
    
    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `planning-data-${new Date().toISOString().split('T')[0]}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error exporting planning data:', error);
    throw new Error(error.response?.data?.message || 'Gagal mengekspor data perencanaan');
  }
};

// Validate planning data with backend
export const validatePlanningWithBackend = async (planningData) => {
  try {
    const response = await api.post(`${PLANNING_ENDPOINT}/validate`, planningData);
    return response.data;
  } catch (error) {
    console.error('Error validating planning data:', error);
    return {
      isValid: false,
      errors: [error.response?.data?.message || 'Validasi gagal']
    };
  }
};
