import { useState, useEffect } from 'react';
import { 
  fetchMonitoringData, 
  submitMonitoring, 
  updateMonitoringStatus, 
  deleteMonitoring 
} from '../services/monitoringService';
import { validateMonitoringData } from '../utils/monitoringUtils';

export const useMonitoringData = (implementasiId, userRole = 'user', maxMonths = 6) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Fetch monitoring data
  const loadMonitoringData = async () => {
    if (!implementasiId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await fetchMonitoringData(implementasiId, userRole);
      setData(result);
    } catch (err) {
      setError(err.message || 'Gagal memuat data monitoring');
      console.error('Error loading monitoring data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create new monitoring
  const createMonitoring = async (monitoringData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate data
      const validation = validateMonitoringData(monitoringData, data, maxMonths);
      if (!validation.isValid) {
        setError(validation.errors.join(', '));
        return false;
      }

      // Auto-set implementasi_id
      monitoringData.implementasi_id = implementasiId;

      const result = await submitMonitoring(monitoringData);
      setData(prev => [...prev, result]);
      setSuccess('Data monitoring berhasil ditambahkan');
      return result;
    } catch (err) {
      setError(err.message || 'Gagal menambahkan data monitoring');
      console.error('Error creating monitoring:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Update monitoring
  const updateMonitoring = async (id, updateData) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await updateMonitoringStatus(id, updateData);
      setData(prev => prev.map(item => 
        item.id === id ? { ...item, ...result } : item
      ));
      setSuccess('Data monitoring berhasil diperbarui');
      return result;
    } catch (err) {
      setError(err.message || 'Gagal memperbarui data monitoring');
      console.error('Error updating monitoring:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Delete monitoring
  const removeMonitoring = async (id) => {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await deleteMonitoring(id);
      setData(prev => prev.filter(item => item.id !== id));
      setSuccess('Data monitoring berhasil dihapus');
      return true;
    } catch (err) {
      setError(err.message || 'Gagal menghapus data monitoring');
      console.error('Error deleting monitoring:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Get monitoring by ID
  const getMonitoringById = (id) => {
    return data.find(item => item.id === id);
  };

  // Get monitoring by month
  const getMonitoringByMonth = (month) => {
    return data.find(item => item.bulan_monitoring === month);
  };

  // Check if month is already monitored
  const isMonthMonitored = (month) => {
    return data.some(item => item.bulan_monitoring === month);
  };

  // Get next available month
  const getNextAvailableMonth = () => {
    for (let i = 1; i <= maxMonths; i++) {
      if (!isMonthMonitored(i)) {
        return i;
      }
    }
    return null; // All months are monitored
  };

  // Check if monitoring is complete
  const isMonitoringComplete = () => {
    return data.length >= maxMonths;
  };

  // Get progress percentage
  const getProgressPercentage = () => {
    return (data.length / maxMonths) * 100;
  };

  // Calculate average survival rate
  const getAverageSurvivalRate = () => {
    if (data.length === 0) return 0;
    const total = data.reduce((sum, item) => sum + (item.survival_rate || 0), 0);
    return total / data.length;
  };

  // Get survival rate trend
  const getSurvivalRateTrend = () => {
    return data
      .sort((a, b) => a.bulan_monitoring - b.bulan_monitoring)
      .map(item => ({
        month: item.bulan_monitoring,
        rate: item.survival_rate || 0
      }));
  };

  // Get health status summary
  const getHealthStatusSummary = () => {
    return data.reduce((acc, item) => {
      const rate = item.survival_rate || 0;
      if (rate >= 90) acc.excellent = (acc.excellent || 0) + 1;
      else if (rate >= 75) acc.good = (acc.good || 0) + 1;
      else acc.poor = (acc.poor || 0) + 1;
      return acc;
    }, {});
  };

  // Clear messages
  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  // Auto-refresh data
  useEffect(() => {
    loadMonitoringData();
  }, [implementasiId, userRole]);

  return {
    data,
    loading,
    error,
    success,
    maxMonths,
    loadMonitoringData,
    createMonitoring,
    updateMonitoring,
    removeMonitoring,
    getMonitoringById,
    getMonitoringByMonth,
    isMonthMonitored,
    getNextAvailableMonth,
    isMonitoringComplete,
    getProgressPercentage,
    getAverageSurvivalRate,
    getSurvivalRateTrend,
    getHealthStatusSummary,
    clearMessages
  };
};

export default useMonitoringData;
