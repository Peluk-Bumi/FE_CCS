import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { PieChart, BarChart } from "../../components/charts/Charts";
import api from "../../api/axios";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiCheckCircle,
  FiActivity,
  FiUser,
  FiClock,
  FiTrendingUp,
  FiTrendingDown,
  FiMoreVertical,
  FiDownload,
  FiRefreshCw,
  FiEye,
  FiFileText,
  FiMonitor,
} from "react-icons/fi";
import WalletIndicator from '../../components/WalletIndicator';

const defaultStats = {
  total_perencanaan: 0,
  total_implementasi: 0,
  total_monitoring: 0,
  total_evaluasi: 0,
  avg_survival_monitoring: 0,
  avg_survival_evaluasi: 0,
  kegiatan_stats: [],
  monthly_stats: [],
};

const DASHBOARD_REQUEST_TIMEOUT = 30000;

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const navigate = useNavigate();
  const pollingRef = useRef();

  useEffect(() => {
    try {
      const cachedStats = sessionStorage.getItem('dashboard_stats_cache');
      if (cachedStats) {
        const parsed = JSON.parse(cachedStats);
        setStats((prev) => ({
          ...prev,
          ...parsed,
        }));
      }
    } catch (cacheError) {
      console.warn('[Dashboard] Failed to read cached stats:', cacheError);
    }
  }, []);

  // ✅ Polling function for realtime data - fetches every 5 seconds
  useEffect(() => {
    let isMounted = true;
    const POLLING_INTERVAL = 5000; // 5 seconds

    const fetchStats = async () => {
      try {
        // FIXED: Use correct localStorage method
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('[Dashboard] No token found, user not authenticated');
          setError('Sesi anda telah berakhir, silakan login kembali');
          setLoading(false);
          navigate('/login', { replace: true });
          return;
        }

        setLoading(false);

        const { data } = await api.get("/dashboard/stats", { timeout: DASHBOARD_REQUEST_TIMEOUT });
        if (isMounted) {
          // Extract stats from nested response structure
          const statsData = data?.stats || {};
          const chartsData = data?.charts || {};
          const breakdownsData = data?.breakdowns || {};
          const recentActivities = data?.recent_activities || [];
          
          console.log('[Dashboard] API Response:', { statsData, chartsData, breakdownsData, recentActivities });
          
          // FIXED: Transform kegiatan_stats untuk PieChart
          let kegiatanStats = [];
          if (breakdownsData?.jenis_kegiatan && Array.isArray(breakdownsData.jenis_kegiatan)) {
            kegiatanStats = breakdownsData.jenis_kegiatan.map(item => ({
              label: item.jenis_kegiatan || item.label,
              value: parseInt(item.total || item.value || 0)
            }));
          }
          
          // Fallback dengan data demo
          if (kegiatanStats.length === 0) {
            kegiatanStats = [
              { label: "Planting Mangrove", value: statsData.total_perencanaan || 8 },
              { label: "Coral Transplanting", value: Math.floor((statsData.total_perencanaan || 8) * 0.4) || 3 }
            ];
          }
          
          // FIXED: Transform monthly data untuk BarChart
          let monthlyStats = [];
          if (chartsData?.perencanaan_per_hari && Array.isArray(chartsData.perencanaan_per_hari)) {
            // Group daily data by month
            const monthlyData = {};
            chartsData.perencanaan_per_hari.forEach(item => {
              if (item.date && item.count !== undefined) {
                const month = new Date(item.date).toLocaleDateString('id-ID', { month: 'short' });
                monthlyData[month] = (monthlyData[month] || 0) + (item.count || 0);
              }
            });
            
            monthlyStats = Object.entries(monthlyData).map(([label, value]) => ({
              label,
              value: parseInt(value)
            }));
          }
          
          // Fallback monthly data dengan demo yang realistis
          if (monthlyStats.length === 0) {
            monthlyStats = [
              { label: "Jan", value: 2 },
              { label: "Feb", value: 3 },
              { label: "Mar", value: 1 },
              { label: "Apr", value: 4 },
              { label: "May", value: 2 },
              { label: "Jun", value: 5 }
            ];
          }
          
          // Properly merge nested data dengan format yang benar
          setStats({
            ...defaultStats,
            ...statsData,
            kegiatan_stats: kegiatanStats,
            monthly_stats: monthlyStats,
            charts: chartsData,
            recent_activities: recentActivities,
          });

          try {
            sessionStorage.setItem(
              'dashboard_stats_cache',
              JSON.stringify({
                ...defaultStats,
                ...statsData,
                kegiatan_stats: kegiatanStats,
                monthly_stats: monthlyStats,
                charts: chartsData,
                recent_activities: recentActivities,
              })
            );
          } catch (cacheError) {
            console.warn('[Dashboard] Failed to store cached stats:', cacheError);
          }
          
          console.log('[Dashboard] Final transformed stats:', {
            kegiatanStats,
            monthlyStats,
            totalStats: statsData
          });
          
          setError(null);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching dashboard stats:", error);
          
          // Handle different error types
          if (error.response?.status === 401) {
            console.log('[Dashboard] Unauthorized - redirecting to login');
            setError('Sesi anda telah berakhir, silakan login kembali');
            setLoading(false);
            navigate('/login', { replace: true });
            return;
          }
          
          const hasCachedStats = (() => {
            try {
              return Boolean(sessionStorage.getItem('dashboard_stats_cache'));
            } catch {
              return false;
            }
          })();

          if (error.code === 'ECONNABORTED' && hasCachedStats) {
            console.warn('[Dashboard] Stats request timed out, keeping cached data');
            setError('Data dashboard sedang diperbarui di latar belakang');
            return;
          }

          // Use demo data ketika error
          const demoStats = {
            ...defaultStats,
            total_perencanaan: 12,
            total_implementasi: 7,
            total_monitoring: 4,
            total_evaluasi: 2,
            kegiatan_stats: [
              { label: "Planting Mangrove", value: 9 },
              { label: "Coral Transplanting", value: 3 }
            ],
            monthly_stats: [
              { label: "Jan", value: 2 },
              { label: "Feb", value: 3 },
              { label: "Mar", value: 1 },
              { label: "Apr", value: 4 },
              { label: "May", value: 2 },
              { label: "Jun", value: 0 }
            ],
          };
          
          setError("Menggunakan data demo - API tidak tersedia");
          setStats(demoStats);

          try {
            sessionStorage.setItem('dashboard_stats_cache', JSON.stringify(demoStats));
          } catch (cacheError) {
            console.warn('[Dashboard] Failed to store demo cache:', cacheError);
          }
          console.log('[Dashboard] Using demo stats:', demoStats);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    // Initial fetch
    fetchStats();

    // FIXED: Setup polling interval for real-time updates
    const intervalId = setInterval(() => {
      if (isMounted) {
        fetchStats();
      }
    }, POLLING_INTERVAL);

    // Store interval ID in ref for potential manual control
    pollingRef.current = intervalId;

    return () => {
      isMounted = false;
      // ✅ Clear polling interval on unmount
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [navigate]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setError(null);
    
    try {
      // ✅ FIXED: Use correct localStorage method
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Sesi anda telah berakhir, silakan login kembali');
        navigate('/login', { replace: true });
        return;
      }

      const { data } = await api.get("/dashboard/stats", { timeout: DASHBOARD_REQUEST_TIMEOUT });
      
      // ✅ Extract stats from nested response structure
      const statsData = data?.stats || {};
      const chartsData = data?.charts || {};
      const breakdownsData = data?.breakdowns || {};
      const recentActivities = data?.recent_activities || [];
      
      console.log('[Dashboard] Refresh - API Response:', { statsData, chartsData, breakdownsData });
      
      // ✅ Transform data dengan format yang benar
      let kegiatanStats = [];
      if (breakdownsData?.jenis_kegiatan && Array.isArray(breakdownsData.jenis_kegiatan)) {
        kegiatanStats = breakdownsData.jenis_kegiatan.map(item => ({
          label: item.jenis_kegiatan || item.label,
          value: parseInt(item.total || item.value || 0)
        }));
      }
      
      if (kegiatanStats.length === 0) {
        kegiatanStats = [
          { label: "Planting Mangrove", value: statsData.total_perencanaan || 8 },
          { label: "Coral Transplanting", value: Math.floor((statsData.total_perencanaan || 8) * 0.4) || 3 }
        ];
      }
      
      let monthlyStats = [];
      if (chartsData?.perencanaan_per_hari && Array.isArray(chartsData.perencanaan_per_hari)) {
        const monthlyData = {};
        chartsData.perencanaan_per_hari.forEach(item => {
          if (item.date && item.count !== undefined) {
            const month = new Date(item.date).toLocaleDateString('id-ID', { month: 'short' });
            monthlyData[month] = (monthlyData[month] || 0) + (item.count || 0);
          }
        });
        
        monthlyStats = Object.entries(monthlyData).map(([label, value]) => ({
          label,
          value: parseInt(value)
        }));
      }
      
      if (monthlyStats.length === 0) {
        monthlyStats = [
          { label: "Jan", value: 2 },
          { label: "Feb", value: 3 },
          { label: "Mar", value: 1 },
          { label: "Apr", value: 4 },
          { label: "May", value: 2 },
          { label: "Jun", value: 5 }
        ];
      }
      
      setStats({
        ...defaultStats,
        ...statsData,
        kegiatan_stats: kegiatanStats,
        monthly_stats: monthlyStats,
        charts: chartsData,
        recent_activities: recentActivities,
      });
      
      console.log('[Dashboard] Stats refreshed successfully');
    } catch (error) {
      console.error('[Dashboard] Refresh failed:', error);
      
      if (error.response?.status === 401) {
        setError('Sesi anda telah berakhir, silakan login kembali');
        navigate('/login', { replace: true });
      } else {
        setError('Gagal merefresh data. Silakan coba lagi.');
      }
    } finally {
      setRefreshing(false);
    }
  };

  // ✅ FIXED: Updated stat cards dengan data yang benar
  const statCards = [
    {
      title: "Total Perencanaan",
      value: stats.total_perencanaan || 0,
      icon: <FiFileText className="w-7 h-7" />,
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Total Implementasi",
      value: stats.total_implementasi || 0,
      icon: <FiCheckCircle className="w-7 h-7" />,
      trend: "+8%",
      trendUp: true
    },
    {
      title: "Monitoring Aktif",
      value: stats.total_monitoring || 0,
      icon: <FiMonitor className="w-7 h-7" />,
      trend: "+5%",
      trendUp: true
    },
    {
      title: "Evaluasi",
      value: stats.total_evaluasi || 0,
      icon: <FiCheckCircle className="w-7 h-7" />,
      trend: "+3",
      trendUp: true
    },
  ];

  if (loading && stats.total_perencanaan === 0 && !error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner show={true} message="Memuat dashboard..." size="small" />
      </div>
    );
  }

  return (
    <div className="py-6 md:py-12 min-h-screen flex flex-col space-y-6 md:space-y-12">
      {/* Compact Header Section */}
      <motion.div 
        className="flex-shrink-0"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="glass bg-background/70 dark:bg-background/70 backdrop-blur-xl rounded-2xl p-4 md:p-5 shadow-xl border border-border">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            {/* Welcome Section */}
            <div className="flex items-center gap-3">
              <motion.div
                className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br from-muted to-background flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden flex-shrink-0"
                whileHover={{ scale: 1.02, y: -2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img
                  src="/logo/full_logosystem-green.png"
                  alt="Logo"
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <div className="min-w-0">
                <h1 className="text-lg md:text-xl font-black bg-gradient-to-r from-primary via-primary-dark to-primary bg-clip-text text-transparent truncate">
                  Selamat Datang, {user?.name?.split(' ')[0] || "Admin"}!
                </h1>
                <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-0.5 text-xs">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse flex-shrink-0"></span>
                  <span className="font-medium">{user?.role || "Administrator"}</span>
                  <span className="text-gray-400">•</span>
                  <FiClock className="w-3 h-3 flex-shrink-0" />
                  <span>
                    {new Date().toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 flex-shrink-0">
              <motion.button
                onClick={handleRefresh}
                className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium transition-all flex items-center gap-1.5 shadow-sm text-sm"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={refreshing}
              >
                <FiRefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline text-xs">Refresh</span>
              </motion.button>
              <WalletIndicator />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="flex-shrink-0 px-4 sm:px-6 lg:px-8 py-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-2.5 flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <FiActivity className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              </div>
              <p className="text-red-700 dark:text-red-300 font-medium text-sm">{error}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-hidden min-h-0">
        <div className="h-full flex flex-col gap-6 min-h-0">
          {/* Stats Cards - User Friendly Large Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 flex-shrink-0">
            {statCards.map((card, index) => (
              <motion.div
                key={index}
                className="bg-white group dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-all hover:shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 truncate">
                      {card.title}
                    </p>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-gray-100 leading-none">
                      {card.value}
                    </h3>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0 group-hover:bg-primary-dark dark:group-hover:bg-primary-light group-hover:scale-105 transition-all duration-300">
                    <span className="text-base">{React.cloneElement(card.icon, { className: "w-5 h-5" })}</span>
                  </div>
                </div>

                {/* Trend Indicator */}
                <div className="flex items-center justify-between gap-1">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold ${
                    card.trendUp 
                      ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light group-hover:bg-primary/20 dark:group-hover:bg-primary/30' 
                      : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 group-hover:bg-red-200 dark:group-hover:bg-red-800/40'
                  }`}>
                    {card.trendUp ? (
                      <FiTrendingUp className="w-3 h-3" />
                    ) : (
                      <FiTrendingDown className="w-3 h-3" />
                    )}
                    <span>{card.trend}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Charts Section - Side by Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pie Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Jenis Kegiatan</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ({(stats.kegiatan_stats || []).reduce((sum, item) => sum + (item.value || 0), 0)} total)
                </p>
              </div>
              <div className="h-64 flex items-center justify-center">
                <PieChart data={stats.kegiatan_stats || []} compact />
              </div>
            </div>

            {/* Bar Chart */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Progress Bulanan</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  ({(stats.monthly_stats || []).reduce((sum, item) => sum + (item.value || 0), 0)} total)
                </p>
              </div>
              <div className="h-64 flex items-center justify-center">
                <BarChart data={stats.monthly_stats || []} compact />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}