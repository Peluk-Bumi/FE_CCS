import { useEffect, useMemo, useState } from "react";
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
} from "react-icons/fi";
import { toast } from "react-toastify";
import api from "../../api/axios";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const EXPLORER_BASE_URL =
  import.meta.env.VITE_BLOCKCHAIN_EXPLORER_BASE_URL || "https://amoy.polygonscan.com";

const ACTIVITY_TYPES = ["ALL", "PERENCANAAN", "IMPLEMENTASI", "MONITORING", "EVALUASI"];
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
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, per_page: 25, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activityFilter, setActivityFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [retryingId, setRetryingId] = useState(null);

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
        }
      );
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Gagal memuat log transaksi";
      setError(message);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionHistory(1);
  }, []);

  const filteredLogs = useMemo(() => {
    return logs.filter((item) => {
      const lowerSearch = searchTerm.toLowerCase();
      const searchable = [
        item.activity_type,
        item.nama_perusahaan,
        item.blockchain_doc_hash,
        item.blockchain_tx_hash,
        item.parent_perencanaan_id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const activityMatch = activityFilter === "ALL" || item.activity_type === activityFilter;
      const statusMatch = statusFilter === "ALL" || String(item.blockchain_status || "").toLowerCase() === statusFilter;
      const searchMatch = !lowerSearch || searchable.includes(lowerSearch);

      return activityMatch && statusMatch && searchMatch;
    });
  }, [logs, searchTerm, activityFilter, statusFilter]);

  const stats = useMemo(() => {
    const total = logs.length;
    const confirmed = logs.filter((item) => item.blockchain_status === "confirmed").length;
    const pending = logs.filter((item) => item.blockchain_status === "pending").length;
    const failed = logs.filter((item) => item.blockchain_status === "failed").length;

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
      const response = await api.post(`/laporan/transaction-history/${item.id}/retry`);
      const updated = response.data?.data || {};

      setLogs((prev) =>
        prev.map((row) =>
          row.id === item.id
            ? {
                ...row,
                blockchain_status: updated.blockchain_status || "confirmed",
                blockchain_tx_hash: updated.blockchain_tx_hash || row.blockchain_tx_hash,
                blockchain_doc_hash: updated.blockchain_doc_hash || row.blockchain_doc_hash,
                error_message: updated.error_message || null,
              }
            : row
        )
      );

      toast.success(response.data?.message || "Retry blockchain berhasil");
    } catch (err) {
      const message = err?.response?.data?.message || err.message || "Retry blockchain gagal";
      toast.error(message);
    } finally {
      setRetryingId(null);
    }
  };

  if (loading) {
    return <LoadingSpinner show={true} message="Memuat log transaksi blockchain..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/40 to-teal-50/40 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-5">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 dark:bg-gray-800/90 rounded-2xl border border-emerald-100 dark:border-gray-700 p-5 shadow-md"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-emerald-700 dark:text-emerald-300 inline-flex items-center gap-2">
                <FiActivity />
                Log History Transaksi
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                Jejak transaksi on-chain untuk seluruh aktivitas, dengan penyimpanan txHash off-chain.
              </p>
            </div>
            <button
              type="button"
              onClick={() => fetchTransactionHistory(meta.current_page || 1)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
            >
              <FiRefreshCw />
              Refresh
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500">Total Log</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500">Confirmed</p>
            <p className="text-2xl font-bold text-emerald-600">{stats.confirmed}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500">Pending</p>
            <p className="text-2xl font-bold text-amber-500">{stats.pending}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500">Failed</p>
            <p className="text-2xl font-bold text-rose-500">{stats.failed}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 md:p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6 relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama perusahaan, hash, atau jenis aktivitas..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              />
            </div>
            <div className="md:col-span-3 relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={activityFilter}
                onChange={(e) => setActivityFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                {ACTIVITY_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {item === "ALL" ? "Semua Aktivitas" : item}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-3 relative">
              <FiFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100"
              >
                {STATUS_TYPES.map((item) => (
                  <option key={item} value={item}>
                    {item === "ALL" ? "Semua Status" : item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-rose-200 bg-rose-50 text-rose-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          {filteredLogs.length === 0 ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 text-amber-700 px-4 py-8 text-center text-sm">
              Data log transaksi tidak ditemukan.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
              <table className="w-full min-w-[980px] text-sm">
                <thead className="bg-emerald-50 dark:bg-gray-700 text-left">
                  <tr>
                    <th className="px-4 py-3">Waktu</th>
                    <th className="px-4 py-3">Aktivitas</th>
                    <th className="px-4 py-3">Perusahaan</th>
                    <th className="px-4 py-3">Doc Hash</th>
                    <th className="px-4 py-3">Tx Hash</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                  {filteredLogs.map((item) => (
                    <tr key={item.id} className="hover:bg-emerald-50/50 dark:hover:bg-gray-700/40">
                      <td className="px-4 py-3 text-gray-700 dark:text-gray-200">{formatDate(item.recorded_at || item.created_at)}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300">
                          {item.activity_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-800 dark:text-gray-100">
                        <div>{item.nama_perusahaan || "-"}</div>
                        <div className="text-xs text-gray-500">Perencanaan ID: {item.parent_perencanaan_id || "-"}</div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => copyHash(item.blockchain_doc_hash)}
                          className="inline-flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-300"
                        >
                          <FiHash />
                          {shortHash(item.blockchain_doc_hash)}
                          <FiCopy />
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        {item.blockchain_tx_hash ? (
                          <a
                            href={`${EXPLORER_BASE_URL}/tx/${item.blockchain_tx_hash}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-300"
                          >
                            {shortHash(item.blockchain_tx_hash)}
                            <FiExternalLink />
                          </a>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {item.blockchain_status === "confirmed" && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
                            <FiCheckCircle /> Confirmed
                          </span>
                        )}
                        {item.blockchain_status === "pending" && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
                            <FiClock /> Pending
                          </span>
                        )}
                        {item.blockchain_status === "failed" && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600">
                            <FiXCircle /> Failed
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {item.blockchain_status === "failed" ? (
                          <button
                            type="button"
                            onClick={() => retryTransaction(item)}
                            disabled={retryingId === item.id}
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-white transition-colors ${
                              retryingId === item.id
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-emerald-600 hover:bg-emerald-700"
                            }`}
                          >
                            <FiRotateCw className={retryingId === item.id ? "animate-spin" : ""} />
                            {retryingId === item.id ? "Retry..." : "Retry Broadcast"}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
