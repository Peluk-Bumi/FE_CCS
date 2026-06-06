// pages/user/DashboardUser.jsx
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { PieChart, BarChart } from "@/shared/components/charts/Charts";
import LoadingSpinner from "@/shared/components/layout/LoadingSpinner";
import {
  FiCalendar,
  FiCheckCircle,
  FiMonitor,
  FiUser,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import api from "@/shared/services/api";
import PageTitle from "@/shared/components/common/PageTitle";
import { FieldDashboardCard } from "@/shared/components/ui/card/FieldDashboardCard";
import { ContextActions } from "@/shared/components/ui/ContextActions";

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

export default function UserDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState(defaultStats);
  const [loading, setLoading] = useState(false);
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

  const calculateGrowth = (series = []) => {
    if (!Array.isArray(series) || series.length < 2) return "+0%";
    const recent = series[series.length - 1]?.count || 0;
    const previous = series[series.length - 2]?.count || 0;
    if (previous === 0) return recent > 0 ? "+100%" : "+0%";
    const growth = ((recent - previous) / previous) * 100;
    return `${growth >= 0 ? "+" : ""}${growth.toFixed(1)}%`;
  };

  const perencanaanGrowth = calculateGrowth(stats.charts?.perencanaan_per_hari || []);

  // Stat cards untuk user dashboard
  const statCards = [
    {
      title: "Aktivitas Direncanakan",
      value: stats.total_perencanaan || 0,
      icon: <FiCalendar className="w-5 h-5" />,
      trend: perencanaanGrowth,
      trendUp: !!(perencanaanGrowth && perencanaanGrowth.startsWith('+')),
      subtitle: "Proses konservasi (Blockchain)",
      type: "default",
      navigateTo: "/user/perencanaan",
    },
    {
      title: "Aktivitas Dilaksanakan",
      value: stats.total_implementasi || 0,
      icon: <FiCheckCircle className="w-5 h-5" />,
      trend: "+8%",
      trendUp: true,
      subtitle: "Dari rencana (Real-time)",
      type: "trees",
      navigateTo: "/user/implementasi",
    },
    {
      title: "Monitoring Berjalan",
      value: stats.total_monitoring || 0,
      icon: <FiMonitor className="w-5 h-5" />,
      trend: "+5%",
      trendUp: true,
      subtitle: "Proses evaluasi (Data Analytics)",
      type: "activities",
      navigateTo: "/user/monitoring",
    },
    {
      title: "Proses Selesai",
      value: stats.completed_activities || 0,
      icon: <FiCheckCircle className="w-5 h-5" />,
      trend: "+3",
      trendUp: true,
      subtitle: "Dokumentasi lengkap (Digital)",
      type: "progress",
      navigateTo: "/user/evaluasi",
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
      <PageTitle
        type="page"
        badge="Dashboard Peluk Bumi"
        badgeIcon={FiCheckCircle}
        title="Environmental Monitoring System"
        description="Sistem monitoring berbasis teknologi untuk proses konservasi dan dokumentasi lapangan"
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

      {/* Stats Cards — FieldDashboardCard, clickable ke halaman terkait */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-4">
        {statCards.map((card, index) => (
          <FieldDashboardCard
            key={index}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
            type={card.type}
            onClick={() => navigate(card.navigateTo)}
          />
        ))}
      </div>

      {/* Quick Actions — mobile only */}
      <div className="md:hidden mb-6">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Aksi Cepat</p>
        <ContextActions context="dashboard" />
      </div>

      {/* Removed Charts Section per user request */}
    </div>
  );
}


