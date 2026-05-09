import { useState, useEffect, useRef, useCallback } from "react";
import { fetchAllEvaluasiData } from "../services/evaluasi.service";

/**
 * Custom hook for fetching and polling evaluasi data
 * Handles data fetching, loading/error states, and smart polling
 */
export const useEvaluasiData = (userRole, options = {}) => {
  const { 
    pollingInterval = 10000, 
    enablePolling = true,
    pauseOnModalClose = true 
  } = options;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [perencanaanList, setPerencanaanList] = useState([]);
  const [implementasiList, setImplementasiList] = useState([]);
  const [monitoringList, setMonitoringList] = useState([]);
  
  const pollingRef = useRef(null);
  const isPausedRef = useRef(false);
  const isMountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      const data = await fetchAllEvaluasiData(userRole);
      
      if (!isMountedRef.current) return;

      setPerencanaanList(data.perencanaan);
      setImplementasiList(data.implementasi);
      setMonitoringList(data.monitoring);
      setError(null);
    } catch (err) {
      if (isMountedRef.current) {
        setError("Gagal memuat data evaluasi.");
        console.error("[useEvaluasiData] Fetch error:", err);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [userRole]);

  const pausePolling = useCallback(() => {
    isPausedRef.current = true;
  }, []);

  const resumePolling = useCallback(() => {
    isPausedRef.current = false;
  }, []);

  // Initial data load
  useEffect(() => {
    isMountedRef.current = true;
    fetchData();

    return () => {
      isMountedRef.current = false;
    };
  }, [fetchData]);

  // Smart polling setup
  useEffect(() => {
    if (!enablePolling) return;

    const pollData = async () => {
      if (!isMountedRef.current || isPausedRef.current) return;

      try {
        const data = await fetchAllEvaluasiData(userRole);
        
        if (!isMountedRef.current || isPausedRef.current) return;

        setPerencanaanList(data.perencanaan);
        setImplementasiList(data.implementasi);
        setMonitoringList(data.monitoring);
        setError(null);
      } catch (err) {
        console.error("[useEvaluasiData] Polling error:", err);
        // Continue polling even on error
      }
    };

    const intervalId = setInterval(pollData, pollingInterval);
    pollingRef.current = intervalId;

    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [userRole, pollingInterval, enablePolling]);

  return {
    loading,
    error,
    perencanaanList,
    implementasiList,
    monitoringList,
    refetch: fetchData,
    pausePolling,
    resumePolling,
  };
};
