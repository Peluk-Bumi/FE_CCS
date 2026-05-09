// pages/user/DashboardUser.jsx
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { PieChart, BarChart } from "../../components/charts/Charts";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
  FiCalendar,
  FiCheckCircle,
  FiMonitor,
  FiUser,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import api from "../../api/axios";
import PageHeader from "../../components/shared/PageHeader";

// Default stats dengan format chart yang benar
const defaultStats = {
  total_perencanaan: 0,
  total_implementasi: 0,
  total_monitoring: 0,
  completed_activities: 0,
  kegiatan_stats: [
    { label: "Planting Mangrove", value: 0 },
    { label: "Coral Transplanting", value: 0 }
  ],
  monthly_stats: [
    { label: "Jan", value: 0 },
    { label: "Feb", value: 0 },
    { label: "Mar", value: 0 },
    { label: "Apr", value: 0 },
    { label: "May", value: 0 },
    { label: "Jun", value: 0 }
  ],
};

export default function DashboardUser() {
  const { user } = useAuth();
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const pollingRef = useRef(null);
  const navigate = useNavigate();
  const DASHBOARD_REQUEST_TIMEOUT = 10000; // 10 seconds
  const POLLING_INTERVAL = 5000; // 5 seconds

  // Polling function for realtime data - fetches every 5 seconds
  useEffect(() => {
    let isMounted = true;

    const fetchStats = async () => {
      try {
        // Use correct localStorage method
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('[DashboardUser] No token found, user not authenticated');
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
          
          console.log('[DashboardUser] API Response:', { statsData, chartsData, breakdownsData, recentActivities });
          
          // Transform kegiatan_stats untuk PieChart
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
              { label: "Planting Mangrove", value: statsData.total_perencanaan || 0 },
              { label: "Coral Transplanting", value: Math.floor((statsData.total_perencanaan || 0) * 0.3) || 0 }
            ];
          }
          
          // Transform monthly data untuk BarChart
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
          
          // Fallback monthly data
          if (monthlyStats.length === 0) {
            monthlyStats = [
              { label: "Jan", value: 0 },
              { label: "Feb", value: 0 },
              { label: "Mar", value: 0 },
              { label: "Apr", value: 0 },
              { label: "May", value: 0 },
              { label: "Jun", value: 0 }
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
          
          setError(null);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching dashboard stats:", error);
          
          // Handle different error types
          if (error.response?.status === 401) {
            console.log('[DashboardUser] Unauthorized - redirecting to login');
            setError('Sesi anda telah berakhir, silakan login kembali');
            setLoading(false);
            navigate('/login', { replace: true });
            return;
          }
          
          const hasCachedStats = (() => {
            try {
              return Boolean(sessionStorage.getItem('dashboard_user_stats_cache'));
            } catch {
              return false;
            }
          })();

          if (error.code === 'ECONNABORTED' && hasCachedStats) {
            console.warn('[DashboardUser] Stats request timed out, keeping cached data');
            setError('Data dashboard sedang diperbarui di latar belakang');
            return;
          }

          // Use demo data ketika error
          const demoStats = {
            ...defaultStats,
            total_perencanaan: 0,
            total_implementasi: 0,
            total_monitoring: 0,
            completed_activities: 0,
            kegiatan_stats: [
              { label: "Planting Mangrove", value: 0 },
              { label: "Coral Transplanting", value: 0 }
            ],
            monthly_stats: [
              { label: "Jan", value: 0 },
              { label: "Feb", value: 0 },
              { label: "Mar", value: 0 },
              { label: "Apr", value: 0 },
              { label: "May", value: 0 },
              { label: "Jun", value: 0 }
            ],
          };
          
          setError("Menggunakan data demo - API tidak tersedia");
          setStats(demoStats);
          console.log('[DashboardUser] Using demo stats:', demoStats);
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

    // Setup polling interval for real-time updates
    const intervalId = setInterval(() => {
      if (isMounted) {
        fetchStats();
      }
    }, POLLING_INTERVAL);

    // Store interval ID in ref for potential manual control
    pollingRef.current = intervalId;

    return () => {
      isMounted = false;
      // Clear polling interval on unmount
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
      // Use correct localStorage method
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Sesi anda telah berakhir, silakan login kembali');
        navigate('/login', { replace: true });
        return;
      }

      const { data } = await api.get("/dashboard/stats", { timeout: DASHBOARD_REQUEST_TIMEOUT });
      
      // Extract stats from nested response structure
      const statsData = data?.stats || {};
      const chartsData = data?.charts || {};
      const breakdownsData = data?.breakdowns || {};
      const recentActivities = data?.recent_activities || [];
      
      console.log('[DashboardUser] Refresh - API Response:', { statsData, chartsData, breakdownsData });
      
      // Transform data dengan format yang benar
      let kegiatanStats = [];
      if (breakdownsData?.jenis_kegiatan && Array.isArray(breakdownsData.jenis_kegiatan)) {
        kegiatanStats = breakdownsData.jenis_kegiatan.map(item => ({
          label: item.jenis_kegiatan || item.label,
          value: parseInt(item.total || item.value || 0)
        }));
      }
      
      if (kegiatanStats.length === 0) {
        kegiatanStats = [
          { label: "Planting Mangrove", value: statsData.total_perencanaan || 0 },
          { label: "Coral Transplanting", value: Math.floor((statsData.total_perencanaan || 0) * 0.4) || 0 }
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
          { label: "Jan", value: 0 },
          { label: "Feb", value: 0 },
          { label: "Mar", value: 0 },
          { label: "Apr", value: 0 },
          { label: "May", value: 0 },
          { label: "Jun", value: 0 }
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
      
      console.log('[DashboardUser] Stats refreshed successfully');
    } catch (error) {
      console.error('[DashboardUser] Refresh failed:', error);
      
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

  // Stat cards untuk user dashboard dengan admin styling
  const statCards = [
    {
      title: "Total Perencanaan",
      value: stats.total_perencanaan || 0,
      icon: <FiCalendar className="w-7 h-7" />,
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
      title: "Kegiatan Selesai",
      value: stats.completed_activities || 0,
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
    <div className="py-12">
      {/* Header */}
      <PageHeader
        badge="User Dashboard"
        badgeIcon={FiCheckCircle}
        title="Selamat Datang"
        description="Dashboard untuk monitoring kegiatan konservasi Anda"
      />
      

      {/* Error Alert */}
      {error && (
        <div className="mb-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
              <FiActivity className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
            </div>
            <p className="text-red-700 dark:text-red-300 font-medium text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Cards - Admin Styling */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => (
          <div
            key={index}
            className="bg-white group dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 transition-all hover:shadow-xl"
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
          </div>
        ))}
      </div>

      {/* Charts - Admin Styling */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Jenis Kegiatan Saya</h3>
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
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Progress Bulanan Saya</h3>
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
  );
}
