import { FiDownload, FiChevronDown, FiActivity, FiFileText } from "react-icons/fi";
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
import { getMonitoringListFromAnyShape, resolveMonitoringDate, getSurvivalHealthLabel, getSurvivalHealthProfile, parseNumber, deriveSurvivalRate, mean } from "@/shared/utils/evaluationEngine";
import { ModalTabs } from "@/shared/components/ui/tabs";
import { TabbedModal } from "@/shared/components/ui/modal/AnimatedModal";
import { FormButton } from "@/shared/components/ui/button/FormButton";
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

import { Accordion } from "@/shared/components/ui/accordion";

// Tab definitions for modal
const MODAL_TABS = [
  { key: "ringkasan", label: "Ringkasan" },
  { key: "monitoring", label: "Monitoring" },
  { key: "rekomendasi", label: "Rekomendasi" },
];

export default function EvaluasiModal({ report, onClose, apiOrigin }) {
  const [narratives, setNarratives] = useState({});
  const [recommendations, setRecommendations] = useState([]);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [activeTab, setActiveTab] = useState("ringkasan");

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
  const monitoringItems = getMonitoringListFromAnyShape(report?.monitoring || report?.monitoringItems || []);

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
  const healthProfile = getSurvivalHealthProfile(survivalAvg36 !== null ? survivalAvg36 : report.survivalRate);
  const computedHealthLabel = getSurvivalHealthLabel(survivalAvg36 !== null ? survivalAvg36 : report.survivalRate);

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
      const response = await api.get(`/perencanaan/${report.id}/public`);
      const reportData = response.data.data || response.data;
      if (!reportData) {
        toast.error("Data laporan tidak ditemukan");
        return;
      }
      const pdfBlob = await buildLaporanPdfBlob(reportData);
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

  const enrichedReport = { ...report, healthCondition: computedHealthLabel, healthConditionDetail: healthProfile, survivalRate: survivalDisplay };
  const survivalStatus = getSuccessStatus(survivalAvg36 !== null ? survivalAvg36 : report.survivalRate);

  return (
    <TabbedModal
      isOpen={!!report}
      onClose={onClose}
      size="4xl"
      height="fixed-lg"
      icon={FiFileText}
      title="Detail Evaluasi"
      subtitle={`Nama Lembaga: ${report.namaPerusahaan || report.nama_perusahaan}`}
      tabs={MODAL_TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
      footer={
        <>
          <FormButton
            variant="danger"
            onClick={handleDownloadPdf}
            loading={isGeneratingPdf}
            className="flex-1 w-full sm:w-auto px-4 py-3"
            icon={<FiDownload />}
          >
            PDF Evaluasi
          </FormButton>
          <FormButton
            variant="primary"
            onClick={handleDownloadReportPdf}
            loading={isGeneratingPdf}
            className="flex-1 w-full sm:w-auto px-4 py-3"
            icon={<FiDownload />}
          >
            Laporan Lengkap
          </FormButton>
        </>
      }
    >
      {/* Tab: Ringkasan */}
      {activeTab === "ringkasan" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div>
            <h3 className="text-base font-bold text-gray-900 dark:text-gray-100 mb-3">Ringkasan Data</h3>
            <SummaryCards
              report={enrichedReport}
              survivalStatus={survivalStatus}
              healthStatus={computedHealthLabel}
              isAvg36={survivalAvg36 !== null}
            />
          </div>

          {/* Info Proyek - Accordion */}
          <Accordion title="Informasi Proyek" defaultOpen={true}>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs md:text-sm">
              <div><p className="text-gray-500">Jenis Kegiatan</p><p className="font-medium mt-0.5">{report.jenisKegiatan}</p></div>
              <div><p className="text-gray-500">Lokasi</p><p className="font-medium mt-0.5">{report.lokasi}</p></div>
              <div><p className="text-gray-500">Jumlah Bibit</p><p className="font-medium mt-0.5">{report.jumlahBibit}</p></div>
              <div><p className="text-gray-500">Tgl Pelaksanaan</p><p className="font-medium mt-0.5">{report.tanggalPelaksanaan}</p></div>
              {(monitoringDates[3] || monitoringDates[6]) && (
                <div className="col-span-2 md:col-span-1">
                  <p className="text-gray-500">Tanggal Monitoring</p>
                  <div className="mt-0.5 space-y-0.5">
                    {monitoringDates[3] && <p className="font-medium">Bulan 3: {monitoringDates[3]}</p>}
                    {monitoringDates[6] && <p className="font-medium">Bulan 6: {monitoringDates[6]}</p>}
                  </div>
                </div>
              )}
              <div className="col-span-2 md:col-span-1"><p className="text-gray-500">Geotagging</p><p className="font-medium mt-0.5">{report.lokasiGeotagging}</p></div>
            </div>
          </Accordion>

          {/* Introduction - Accordion */}
          <Accordion title="Pendahuluan">
            <IntroductionSection report={report} />
          </Accordion>
        </div>
      )}

      {/* Tab: Monitoring */}
      {activeTab === "monitoring" && (
        <div>
          <MonitoringSection report={report} toAbsoluteFileUrl={toAbsoluteFileUrl} />
        </div>
      )}

      {/* Tab: Rekomendasi */}
      {activeTab === "rekomendasi" && (
        <div>
          <RecommendationsSection recommendations={recommendations} />
        </div>
      )}
    </TabbedModal>
  );
}
