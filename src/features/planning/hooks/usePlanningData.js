import { useState, useEffect } from 'react';
import { fetchPlanningData, submitPlanning, updatePlanningStatus, deletePlanning } from '../services/planningService';
import { validatePlanningData } from '../utils/planningUtils';

export const usePlanningData = (userRole = 'user', userId = null) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch planning data
  const loadPlanningData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchPlanningData(userRole, userId);
      setData(result);
    } catch (err) {
      setError(err.message || 'Gagal memuat data perencanaan');
      console.error('Error loading planning data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new planning
  const createPlanning = async (planningData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate data
      const validation = validatePlanningData(planningData);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return false;
      }

      // Keep any company name already provided by the form or auth layer.
      if (userRole !== 'admin' && userId) {
        planningData.nama_perusahaan = planningData.nama_perusahaan || planningData.user_name || planningData.user?.name || `USER_${userId}`;
        planningData.user_id = userId;
      }

      const result = await submitPlanning(planningData);
      setData(prev => [...prev, result]);
      setSuccess('Perencanaan berhasil dibuat');
      return result;
    } catch (err) {
      setError(err.message || 'Gagal membuat perencanaan');
      console.error('Error creating planning:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update planning status
  const updatePlanning = async (id, status) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await updatePlanningStatus(id, status);
      setData(prev => prev.map(item => 
        item.id === id ? { ...item, ...result } : item
      ));
      setSuccess('Status perencanaan berhasil diperbarui');
      return result;
    } catch (err) {
      setError(err.message || 'Gagal memperbarui status perencanaan');
      console.error('Error updating planning:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete planning
  const removePlanning = async (id) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await deletePlanning(id);
      setData(prev => prev.filter(item => item.id !== id));
      setSuccess('Perencanaan berhasil dihapus');
      return true;
    } catch (err) {
      setError(err.message || 'Gagal menghapus perencanaan');
      console.error('Error deleting planning:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get planning by ID
  const getPlanningById = (id) => {
    return data.find(item => item.id === id);
  };

  // Filter data by status
  const getPlanningByStatus = (status) => {
    return data.filter(item => item.status === status);
  };

  // Filter data by user
  const getPlanningByUser = (userId) => {
    return data.filter(item => item.user_id === userId);
  };

  // Clear messages
  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // Auto-refresh data
  useEffect(() => {
    loadPlanningData();
  }, [userRole, userId]);

  return {
    data,
    loading,
    error,
    success,
    loadPlanningData,
    createPlanning,
    updatePlanning,
    removePlanning,
    getPlanningById,
    getPlanningByStatus,
    getPlanningByUser,
    clearMessages
  };
};

export default usePlanningData;
