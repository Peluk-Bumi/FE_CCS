import { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  FiActivity,
  FiCheckCircle,
  FiClock,
  FiCopy,
  FiExternalLink,
  FiFilter,
  FiHash,
  FiRefreshCw,
  FiSearch,
  FiRotateCw,
  FiXCircle,
  FiGlobe,
  FiCalendar,
  FiLink,
  FiDownload,
  FiUser,
} from "react-icons/fi";
import { toast } from "react-toastify";
import api from "@/shared/services/api";
import LoadingSpinner from "@/layouts/common/LoadingSpinner";
import PageTitle from "@/shared/components/PageTitle";
import { getActivityColors, getActivityIcon, formatHash, getActivityDisplayName } from "@/shared/constants/activityColors";
import { buildLaporanPdfBlob } from "@/features/reporting/utils/reportPdf";
const EXPLORER_BASE_URL =
  import.meta.env.VITE_BLOCKCHAIN_EXPLORER_URL ||
  "https://sepolia.etherscan.io";
const ACTIVITY_TYPES = [
  "ALL",
  "PERENCANAAN",
  "IMPLEMENTASI",
  "MONITORING",
  "EVALUASI",
];
const STATUS_TYPES = ["ALL", "confirmed", "pending", "failed"];
function shortHash(value, length = 14) {
  if (!value) return "-";
  if (value.length <= length * 2) return value;
  return `${value.slice(0, length)}...${value.slice(-length)}`;
}
function formatDate(value) {
  if (!value) return "-";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
export default function LaporanPage() {
  const [logs, setLogs] = useState([]);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 25,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activityFilter, setActivityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [retryingId, setRetryingId] = useState(null);
  const [downloadingReportId, setDownloadingReportId] = useState(null);
  // ✅ Polling ref at top level (React hook rules)
  const pollingRef = useRef();
  const fetchTransactionHistory = async (page = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/laporan/transaction-history", {
        params: { page, per_page: 50 },
        timeout: 30000,
      });
      setLogs(response.data?.data || []);
      setMeta(
        response.data?.meta || {
          current_page: 1,
          last_page: 1,
          per_page: 50,
          total: (response.data?.data || []).length,
        },
      );
    } catch (err) {
      const message =
        err?.response?.data?.message ||
        err.message ||
        "Gagal memuat log transaksi";
      setError(message);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTransactionHistory(1);
  }, []);
  // ✅ Real-time polling setup - updates every 10 seconds for transaction history
  useEffect(() => {
    let isMounted = true;
    const POLLING_INTERVAL = 10000; // 10 seconds - faster updates for doc/tx hash
    const pollTransactionHistory = async () => {
      if (!isMounted) return;
      try {
        const response = await api.get("/laporan/transaction-history", {
          params: { page: 1, per_page: 50 },
          timeout: 30000,
        });
        if (!isMounted) return;
        const newLogs = response.data?.data || [];
        
        // Only update if there are actual changes to prevent unnecessary re-renders
        if (JSON.stringify(newLogs) !== JSON.stringify(logs)) {
          setLogs(newLogs);
          console.log('[LaporanPage] Transaction history updated:', {
            count: newLogs.length,
            hasDocHash: newLogs.some(log => log.blockchain_doc_hash),
            hasTxHash: newLogs.some(log => log.blockchain_tx_hash)
          });
        }
        
        setMeta(
          response.data?.meta || {
            current_page: 1,
            last_page: 1,
            per_page: 50,
            total: (response.data?.data || []).length,
          },
        );
        setError(null);
      } catch (err) {
        console.error("[LaporanPage] Polling error:", err);
        // Continue polling even on error
      }
    };
    // Setup polling interval
    const intervalId = setInterval(() => {
      if (isMounted) {
        pollTransactionHistory();
      }
    }, POLLING_INTERVAL);
    pollingRef.current = intervalId;
    return () => {
      isMounted = false;
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [logs]); // Add logs dependency for change detection
  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      const lowerSearch = searchTerm.toLowerCase();
      const searchable = [
        item.activity_type,
        item.user_name,
        item.user_email,
        item.nama_perusahaan,
        item.blockchain_doc_hash,
        item.blockchain_tx_hash,
        item.parent_perencanaan_id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      const activityMatch =
        activityFilter === "ALL" || item.activity_type === activityFilter;
      const statusMatch =
        statusFilter === "ALL" ||
        String(item.blockchain_status || "").toLowerCase() === statusFilter;
      const searchMatch = !lowerSearch || searchable.includes(lowerSearch);
      return activityMatch && statusMatch && searchMatch;
    });
  }, [logs, searchTerm, activityFilter, statusFilter]);
  const stats = useMemo(() => {
    const total = logs.length;
    const confirmed = logs.filter(
      (item) => item.blockchain_status === "confirmed",
    ).length;
    const pending = logs.filter(
      (item) => item.blockchain_status === "pending",
    ).length;
    const failed = logs.filter(
      (item) => item.blockchain_status === "failed",
    ).length;
    return { total, confirmed, pending, failed };
  }, [logs]);
  const copyHash = async (value) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Hash berhasil disalin");
    } catch {
      toast.error("Gagal menyalin hash");
    }
  };
  const retryTransaction = async (item) => {
    setRetryingId(item.id);
    try {
      console.log('[LaporanPage] Retrying transaction:', {
        id: item.id,
        parent_perencanaan_id: item.parent_perencanaan_id,
        current_status: item.blockchain_status,
        current_doc_hash: item.blockchain_doc_hash,
        current_tx_hash: item.blockchain_tx_hash
      });

      const response = await api.post(
        `/laporan/transaction-history/${item.id}/retry`,
      );
      const updated = response.data?.data || {};
      
      console.log('[LaporanPage] Retry response:', {
        success: response.data.success,
        updated: updated,
        new_doc_hash: updated.blockchain_doc_hash,
        new_tx_hash: updated.blockchain_tx_hash
      });

      // Update the specific item in logs
      setLogs((prev) =>
        prev.map((row) =>
          row.id === item.id ? { ...row, ...updated } : row
        )
      );
      
      if (response.data.success) {
        toast.success("Transaksi berhasil di-retry");
        // Force refresh after a short delay to get updated blockchain data
        setTimeout(() => {
          fetchTransactionHistory(meta.current_page || 1);
        }, 2000);
      } else {
        toast.error(response.data.message || "Gagal retry transaksi");
      }
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Gagal retry transaksi";
      toast.error(message);
    } finally {
      setRetryingId(null);
    }
  };

  const downloadReportPdf = async (item) => {
    setDownloadingReportId(item.id);
    try {
      // Debug: Log transaction history item structure
      console.log('[ReportsPage] Transaction History Item:', {
        id: item.id,
        parent_perencanaan_id: item.parent_perencanaan_id,
        activity_type: item.activity_type,
        allKeys: Object.keys(item)
      });

      // Get full report data - use parent_perencanaan_id instead of id
      const reportId = item.parent_perencanaan_id || item.id;
      const response = await api.get(`/perencanaan/${reportId}/public`);
      const reportData = response.data.data || response.data;
      
      // Debug: Log API response structure
      console.log('[ReportsPage] API Response:', {
        reportId: reportId,
        status: response.status,
        data: response.data,
        reportData: reportData,
        keys: reportData ? Object.keys(reportData) : 'null'
      });
      
      if (!reportData) {
        toast.error("Data laporan tidak ditemukan");
        return;
      }

      // Validate required fields before PDF generation
      if (!reportData.id || !reportData.nama_perusahaan) {
        toast.error("Data laporan tidak lengkap");
        return;
      }

      // Generate PDF using the template
      const pdfBlob = await buildLaporanPdfBlob(reportData);
      
      // Create download link
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Laporan_${reportData.nama_perusahaan || 'Unknown'}_${reportData.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("PDF laporan berhasil diunduh");
    } catch (err) {
      console.error("Error generating PDF:", err);
      const message = err?.response?.data?.message || err.message || "Gagal generate PDF laporan";
      toast.error(message);
    } finally {
      setDownloadingReportId(null);
    }
  };

    if (loading) {
    return (
      <LoadingSpinner
        show={true}
        message="Memuat log transaksi blockchain..."
      />
    );
  }
  return (
    <div className="py-12">
      <PageTitle
        type="page"
        badge="Log History Transaksi"
        badgeIcon={FiActivity}
        title="Log History Transaksi"
        description="Jejak transaksi on-chain untuk seluruh aktivitas, dengan penyimpanan txHash off-chain."
      />
      
      <motion.div
        className="glass bg-white/90 dark:bg-gray-900 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden p-8 md:p-12 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Total Log
            </p>
            <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mt-1">
              {stats.total}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Confirmed
            </p>
            <p className="text-lg sm:text-2xl font-bold text-primary mt-1">
              {stats.confirmed}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Pending
            </p>
            <p className="text-lg sm:text-2xl font-bold text-amber-500 mt-1">
              {stats.pending}
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
          >
            <p className="text-xs sm:text-sm text-gray-500 font-medium">
              Failed
            </p>
            <p className="text-lg sm:text-2xl font-bold text-rose-500 mt-1">
              {stats.failed}
            </p>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-lg sm:rounded-2xl border border-gray-200 dark:border-gray-700 p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
            {/* Search Input */}
            <div className="sm:col-span-3 lg:col-span-2 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex-shrink-0" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari perusahaan, hash..."
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>
            {/* Activity Filter */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex-shrink-0" />
              <select
                value={activityFilter}
                onChange={(e) => setActivityFilter(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
              >
                {ACTIVITY_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {item === "ALL" ? "Semua Aktivitas" : item}
                  </option>
                ))}
              </select>
            </div>
            {/* Status Filter */}
            <div className="relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 flex-shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-primary transition-all appearance-none"
              >
                {STATUS_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {item === "ALL" ? "Semua Status" : item}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <button
                type="button"
                onClick={() => fetchTransactionHistory(meta.current_page || 1)}
                className="inline-flex items-center justify-center w-full gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-semibold shadow-md transition-all hover:shadow-lg"
              >
                <FiRefreshCw className="flex-shrink-0" />
                <span>Refresh Data</span>
              </button>
            </div>
          </div>
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg sm:rounded-xl border border-rose-200 bg-rose-50 dark:bg-rose-900/20 dark:border-rose-900/50 text-rose-700 dark:text-rose-300 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium"
            >
              {error}
            </motion.div>
          )}
          {/* Empty State */}
          {filteredLogs.length === 0 ? (
            <div className="rounded-lg sm:rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300 px-3 sm:px-4 py-6 sm:py-8 text-center text-sm sm:text-base font-medium">
              Data log transaksi tidak ditemukan.
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto rounded-lg sm:rounded-xl border border-gray-200 dark:border-gray-700">
                <table className="w-full text-sm">
                  <thead className="bg-primary/10 dark:bg-gray-700 text-left sticky top-0">
                    <tr>
                      <th className="px-3 sm:px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                        Waktu
                      </th>
                      <th className="px-3 sm:px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                        Aktivitas
                      </th>
                      <th className="px-3 sm:px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                        User
                      </th>
                      <th className="px-3 sm:px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                        Perusahaan
                      </th>
                      <th className="px-3 sm:px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                        Doc Hash
                      </th>
                      <th className="px-3 sm:px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                        Tx Hash
                      </th>
                      <th className="px-3 sm:px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                        Status
                      </th>
                      <th className="px-3 sm:px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    {filteredLogs.map((item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-primary/10 dark:hover:bg-gray-700/40 transition-colors"
                      >
                        <td className="px-3 sm:px-4 py-3 text-gray-700 dark:text-gray-200 text-xs sm:text-sm">
                          {formatDate(item.recorded_at || item.created_at)}
                        </td>
                        <td className="px-3 sm:px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getActivityColors(item.activity_type).badge}`}>
                                {getActivityDisplayName(item.activity_type)}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                              {item.nama_perusahaan || '-'}
                            </p>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-3 text-gray-700 dark:text-gray-200">
                          <div className="flex items-start gap-2">
                            <FiUser className="mt-0.5 flex-shrink-0 text-gray-400" />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                {item.user_name || '-'}
                              </p>
                              <p className="text-xs text-gray-500 truncate">
                                {item.user_email || item.user_role || '-'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-3 text-gray-800 dark:text-gray-100">
                          <div className="text-xs text-gray-500">
                            ID: {item.parent_perencanaan_id || "-"}
                          </div>
                        </td>
                        <td className="px-3 sm:px-4 py-3">
                          <button
                            type="button"
                            onClick={() => copyHash(item.blockchain_doc_hash)}
                            className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-200 transition-colors"
                          >
                            <FiHash className="flex-shrink-0" />
                            {shortHash(item.blockchain_doc_hash)}
                            <FiCopy className="flex-shrink-0" />
                          </button>
                        </td>
                        <td className="px-3 sm:px-4 py-3">
                          {item.blockchain_tx_hash ? (
                            <a
                              href={`${EXPLORER_BASE_URL}/tx/${item.blockchain_tx_hash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs text-primary dark:text-primary-light hover:text-primary-dark dark:hover:text-primary-light transition-colors"
                            >
                              {shortHash(item.blockchain_tx_hash)}
                              <FiExternalLink className="flex-shrink-0" />
                            </a>
                          ) : (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-3 sm:px-4 py-3">
                          {item.blockchain_status === "confirmed" && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                              <FiCheckCircle className="flex-shrink-0" />{" "}
                              Confirmed
                            </span>
                          )}
                          {item.blockchain_status === "pending" && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                              <FiClock className="flex-shrink-0" /> Pending
                            </span>
                          )}
                          {item.blockchain_status === "failed" && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600">
                              <FiXCircle className="flex-shrink-0" /> Failed
                            </span>
                          )}
                        </td>
                        <td className="px-3 sm:px-4 py-3">
                          <div className="flex items-center gap-2">
                            {item.blockchain_status === "failed" && (
                              <button
                                type="button"
                                onClick={() => retryTransaction(item)}
                                disabled={retryingId === item.id}
                                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all ${
                                  retryingId === item.id
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-rose-600 hover:bg-rose-700 active:scale-95"
                                }`}
                              >
                                <FiRotateCw
                                  className={`flex-shrink-0 ${retryingId === item.id ? "animate-spin" : ""}`}
                                />
                                <span className="hidden sm:inline">
                                  {retryingId === item.id ? "Retry..." : "Retry"}
                                </span>
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => downloadReportPdf(item)}
                              disabled={downloadingReportId === item.id}
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all ${
                                downloadingReportId === item.id
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-primary hover:bg-primary-dark active:scale-95"
                                }`}
                            >
                              <FiDownload
                                className={`flex-shrink-0 ${downloadingReportId === item.id ? "animate-pulse" : ""}`}
                              />
                              <span className="hidden sm:inline">
                                {downloadingReportId === item.id ? "Mengunduh..." : "Unduh Laporan Lengkap"}
                              </span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile Card View */}
              <div className="lg:hidden space-y-3">
                {filteredLogs.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3 sm:p-4 space-y-3"
                  >
                    {/* Row 1: Title + Activity Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                          {item.nama_perusahaan || "Aktivitas Tanpa Nama"}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${getActivityColors(item.activity_type).badge}`}>
                            {getActivityDisplayName(item.activity_type)}
                          </span>
                          <span className="text-xs text-gray-500">
                            ID: {item.parent_perencanaan_id || "-"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <FiUser className="flex-shrink-0" />
                        <span className="truncate">
                          {item.user_name || item.user_email || item.user_role || "User tidak tercatat"}
                        </span>
                      </div>
                    </div>
                    {/* Row 2: Hashes */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                          <FiHash className="flex-shrink-0" /> Doc:
                        </p>
                        <button
                          type="button"
                          onClick={() => copyHash(item.blockchain_doc_hash)}
                          className="text-xs text-indigo-600 dark:text-indigo-300 hover:text-indigo-700 dark:hover:text-indigo-200 font-mono transition-colors flex items-center gap-1"
                        >
                          {formatHash(item.blockchain_doc_hash, 8, 6)}
                          <FiCopy className="flex-shrink-0" />
                        </button>
                      </div>
                      {item.blockchain_tx_hash && (
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                            <FiExternalLink className="flex-shrink-0" /> Tx:
                          </p>
                          <a
                            href={`${EXPLORER_BASE_URL}/tx/${item.blockchain_tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-emerald-600 dark:text-emerald-300 hover:text-emerald-700 dark:hover:text-emerald-200 font-mono transition-colors"
                          >
                            {formatHash(item.blockchain_tx_hash, 8, 6)}
                          </a>
                        </div>
                      )}
                    </div>
                    {/* Row 3: Status + Actions */}
                    <div className="flex flex-col gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {item.blockchain_status === "confirmed" && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                              <FiCheckCircle className="flex-shrink-0" /> Confirmed
                            </span>
                          )}
                          {item.blockchain_status === "pending" && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                              <FiClock className="flex-shrink-0" /> Pending
                            </span>
                          )}
                          {item.blockchain_status === "failed" && (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600">
                              <FiXCircle className="flex-shrink-0" /> Failed
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {formatDate(item.recorded_at || item.created_at)}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {item.blockchain_status === "failed" && (
                          <button
                            type="button"
                            onClick={() => retryTransaction(item)}
                            disabled={retryingId === item.id}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all flex-shrink-0 ${
                              retryingId === item.id
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-rose-600 hover:bg-rose-700 active:scale-95"
                            }`}
                          >
                            <FiRotateCw
                              className={`flex-shrink-0 ${retryingId === item.id ? "animate-spin" : ""}`}
                            />
                            Retry
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => downloadReportPdf(item)}
                          disabled={downloadingReportId === item.id}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all flex-shrink-0 ${
                            downloadingReportId === item.id
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-primary hover:bg-primary-dark active:scale-95"
                          }`}
                        >
                          <FiDownload
                            className={`flex-shrink-0 ${downloadingReportId === item.id ? "animate-pulse" : ""}`}
                          />
                          {downloadingReportId === item.id ? "Mengunduh..." : "Unduh Laporan Lengkap"}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
