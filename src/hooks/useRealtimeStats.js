import { useEffect, useRef, useCallback } from 'react';
import api from '../api/axios';

/**
 * ✅ Custom hook for real-time dashboard statistics
 * Automatically polls data at specified intervals
 * 
 * @param {Function} onDataUpdate - Callback when data is fetched
 * @param {number} pollingInterval - Interval in milliseconds (default: 5000ms)
 * @param {Object} options - Additional options
 * @returns {Object} - { isPolling, stopPolling, startPolling, data }
 */
export const useRealtimeStats = (onDataUpdate, pollingInterval = 5000, options = {}) => {
  const pollingRef = useRef(null);
  const isMountedRef = useRef(true);
  const lastFetchTimeRef = useRef(0);

  const fetchStats = useCallback(async () => {
    if (!isMountedRef.current) return;

    // Prevent too frequent requests (debounce)
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 1000) return;
    lastFetchTimeRef.current = now;

    try {
      const { data } = await api.get('/dashboard/stats', {
        timeout: 30000,
      });
      
      if (isMountedRef.current && onDataUpdate) {
        onDataUpdate(data);
      }
    } catch (error) {
      console.error('[useRealtimeStats] Fetch error:', error.message);
      
      // Don't stop polling on error, just log it
      if (options.onError) {
        options.onError(error);
      }
    }
  }, [onDataUpdate, options]);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
      console.log('[useRealtimeStats] Polling stopped');
    }
  }, []);

  const startPolling = useCallback(() => {
    stopPolling(); // Clear any existing interval
    
    // Fetch immediately
    fetchStats();
    
    // Then setup interval
    pollingRef.current = setInterval(() => {
      if (isMountedRef.current) {
        fetchStats();
      }
    }, pollingInterval);
    
    console.log(`[useRealtimeStats] Polling started (interval: ${pollingInterval}ms)`);
  }, [pollingInterval, fetchStats, stopPolling]);

  useEffect(() => {
    isMountedRef.current = true;
    
    // Start polling on mount
    startPolling();

    return () => {
      isMountedRef.current = false;
      stopPolling();
    };
  }, [startPolling, stopPolling]);

  return {
    isPolling: Boolean(pollingRef.current),
    stopPolling,
    startPolling,
    pollingRef,
  };
};

export default useRealtimeStats;
