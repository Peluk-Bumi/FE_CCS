import { motion } from "framer-motion";
import { FiX, FiDownload } from "react-icons/fi";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "@/shared/services/api";
import SummaryCards from "./SummaryCards";
import RecommendationsSection from "./RecommendationsSection";
import IntroductionSection from "./IntroductionSection";
import MonitoringSection from "./MonitoringSection";
import { buildEvaluasiPdfBlob } from "@/features/evaluation/utils/evaluationPdf";
import { buildLaporanPdfBlob } from "@/features/reporting/utils/reportPdf";
import { generateFullNarrative, getRecommendations } from "@/features/evaluation/utils/evaluationNarrator";
import { getSuccessStatus } from "@/features/evaluation/utils/evaluationNarrator";
import { getMonitoringListFromAnyShape, resolveMonitoringDate, leafConditionScore, getHealthLabel, parseNumber, deriveSurvivalRate, mean } from "@/shared/utils/evaluationEngine";

const downloadBlob = (blob, fileName) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

export default function EvaluasiModal({ report, onClose, apiOrigin }) {
  const [narratives, setNarratives] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const toAbsoluteFileUrl = (path) => {
    if (!path) return "";
    if (/^https?:\/\//i.test(path)) return path;
    const normalized = String(path).replace(/\\/g, "/").replace(/^\/+/, "");
    if (apiOrigin) return `${apiOrigin}/${normalized}`;
    return `/${normalized}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getMonitoringDates = () => {
    const raw = report?.monitoring || report?.monitoringItems || [];
    const monitoringItems = getMonitoringListFromAnyShape(raw);
    const dates = {};

    monitoringItems.forEach((m) => {
      const month = Number(m?.bulan_monitoring || m?.bulan);
      if ([3, 6].includes(month)) {
        const resolved = resolveMonitoringDate(m);
        dates[month] = formatDate(resolved);
      }
    });

    return dates;
  };

  const monitoringDates = getMonitoringDates();

  // Build monitoring items array for calculations
  const monitoringItems = getMonitoringListFromAnyShape(report?.monitoring || report?.monitoringItems || []);

  // Compute health label from monitoring items (average across monitorings)
  const healthScores = monitoringItems.map((m) => leafConditionScore(m));
  const computedHealthLabel = getHealthLabel(healthScores);

  // Compute average survival rate specifically for monitoring bulan 3 & 6
  const survivalValues36 = monitoringItems
    .map((m) => {
      const month = Number(m?.bulan_monitoring || m?.bulan);
      if (![3, 6].includes(month)) return null;
      const val = parseNumber(m?.survival_rate) ?? deriveSurvivalRate(m);
      return val;
    })
    .filter((v) => v !== null && v !== undefined);

  const survivalAvg36 = survivalValues36.length ? mean(survivalValues36) : null;
  const survivalDisplay = survivalAvg36 !== null ? `${survivalAvg36.toFixed(2)}%` : report.survivalRate;

  // Generate narratives and recommendations when report changes
  useEffect(() => {
    if (!report) {
      setNarratives({});
      setRecommendations([]);
      return;
    }

    const generated = generateFullNarrative(report);
    setNarratives(generated);

    const recs = getRecommendations(report);
    setRecommendations(recs);
  }, [report]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (!report) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [report]);

  const handleDownloadPdf = async () => {
    if (!report) return;

    setIsGeneratingPdf(true);
    try {
      const blob = await buildEvaluasiPdfBlob(report, narratives, recommendations);
      downloadBlob(blob, `evaluasi-${report.namaPerusahaan}-${report.id}.pdf`);
    } catch (error) {
      console.error("[EvaluasiModal] PDF generation error:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleDownloadReportPdf = async () => {
    if (!report) return;

    setIsGeneratingPdf(true);
    try {
      // Get full report data for complete report
      const response = await api.get(`/perencanaan/${report.id}/public`);
      const reportData = response.data.data || response.data;
      
      if (!reportData) {
        toast.error("Data laporan tidak ditemukan");
        return;
      }

      // Generate PDF using the same template as ReportsPage
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
    } catch (error) {
      console.error("[EvaluasiModal] Report PDF generation error:", error);
      toast.error("Gagal membuat PDF laporan. Silakan coba lagi.");
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (!report) return null;

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={onClose}
      >
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl p-6 md:p-8 relative max-h-[95vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors z-10"
          >
            <FiX className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Evaluasi Restorasi - {report.namaPerusahaan}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Laporan evaluasi otomatis berdasarkan data monitoring.
            </p>
          </div>

          <div className="space-y-6">
            {/* Summary Cards */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Ringkasan Data</h3>
              <SummaryCards 
                report={{ ...report, healthCondition: computedHealthLabel, survivalRate: survivalDisplay }}
                survivalStatus={getSuccessStatus(survivalAvg36 !== null ? survivalAvg36 : report.survivalRate)}
                healthStatus={computedHealthLabel}
                isAvg36={survivalAvg36 !== null}
              />
            </div>

            {/* Info Perusahaan */}
            <div className="bg-gray-50 dark:bg-gray-900/40 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Informasi Proyek</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Jenis Kegiatan</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100 mt-1">{report.jenisKegiatan}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Lokasi</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100 mt-1">{report.lokasi}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Jumlah Bibit</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100 mt-1">{report.jumlahBibit}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Tanggal Pelaksanaan</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100 mt-1">{report.tanggalPelaksanaan}</p>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Tanggal Monitoring</p>
                  <div className="space-y-1 mt-1">
                    {monitoringDates[3] && (
                      <p className="text-xs font-medium text-gray-900 dark:text-gray-100">Bulan 3: {monitoringDates[3]}</p>
                    )}
                    {monitoringDates[6] && (
                      <p className="text-xs font-medium text-gray-900 dark:text-gray-100">Bulan 6: {monitoringDates[6]}</p>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-gray-600 dark:text-gray-400">Geotagging</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100 mt-1 text-xs">{report.lokasiGeotagging}</p>
                </div>
              </div>
            </div>

            {/* Introduction Section */}
            <IntroductionSection report={report} />

            {/* Monitoring Section */}
            <MonitoringSection report={report} toAbsoluteFileUrl={toAbsoluteFileUrl} />

            {/* Recommendations */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Rekomendasi & Tindakan Perbaikan</h3>
              <RecommendationsSection recommendations={recommendations} />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={isGeneratingPdf}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white text-sm font-semibold transition-colors"
              >
                <FiDownload size={16} />
                {isGeneratingPdf ? "Membuat PDF..." : "Unduh PDF Evaluasi"}
              </button>
              <button
                type="button"
                onClick={handleDownloadReportPdf}
                disabled={isGeneratingPdf}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark disabled:bg-gray-400 text-white text-sm font-semibold transition-colors"
              >
                <FiDownload size={16} />
                {isGeneratingPdf ? "Mengunduh..." : "Unduh Laporan Lengkap"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
