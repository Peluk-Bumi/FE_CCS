import { FiCheckCircle, FiShield, FiExternalLink, FiRefreshCw, FiX, FiLayers, FiActivity, FiBarChart2, FiClipboard } from "react-icons/fi";
import { useState } from "react";
import { Accordion } from "@/shared/components/ui/accordion";
import { ActionModal } from "@/shared/components/ui/modal/AnimatedModal";
import { FormButton } from "@/shared/components/ui/button/FormButton";

const isPresent = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (typeof value === "number") return Number.isFinite(value);
  return true;
};

const pickValue = (...values) => values.find((value) => isPresent(value)) ?? "-";

const formatDateIdTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateId = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const getStageState = (report) => {
  const monitoringItems = Array.isArray(report?.monitoring)
    ? report.monitoring
    : report?.monitoring
      ? [report.monitoring]
      : Array.isArray(report?.monitoringItems)
        ? report.monitoringItems
        : [];

  const stages = [
    {
      key: "planning",
      label: "Perencanaan",
      available: Boolean(
        report?.nama_perusahaan ||
        report?.jenis_kegiatan ||
        report?.tanggal_pelaksanaan ||
        report?.lokasi ||
        report?.perencanaan
      ),
      note: "Data dasar kegiatan dan lokasi sudah tercatat.",
    },
    {
      key: "implementation",
      label: "Implementasi",
      available: Boolean(
        report?.implementasi ||
        report?.is_implemented ||
        report?.dokumentasi_kegiatan ||
        report?.blockchain_doc_hash ||
        report?.blockchain_tx_hash
      ),
      note: "Dokumentasi implementasi dan jejak transaksi dapat dilihat publik.",
    },
    {
      key: "monitoring",
      label: "Monitoring",
      available: monitoringItems.length > 0 || Boolean(report?.monitoringDate || report?.survivalRate || report?.survival_rate),
      note: monitoringItems.length > 0
        ? `${monitoringItems.length} data monitoring tersedia.`
        : "Belum ada data monitoring yang dibuka ke publik.",
    },
    {
      key: "evaluation",
      label: "Evaluasi",
      available: Boolean(
        report?.evaluasi ||
        report?.evaluation ||
        report?.healthCondition ||
        report?.healthConditionDetail ||
        report?.survivalRate ||
        report?.survival_rate
      ),
      note: "Ringkasan hasil evaluasi dan rekomendasi tindak lanjut.",
    },
  ];

  const currentStage = stages.filter((stage) => stage.available).at(-1) || stages[0];

  return { stages, currentStage };
};



const getEvaluationSummary = (report) => {
  const healthDetail = report?.healthConditionDetail || {};
  const monitoringItems = Array.isArray(report?.monitoring)
    ? report.monitoring
    : Array.isArray(report?.monitoringItems)
      ? report.monitoringItems
      : [];

  return [
    { label: "Survival Rate", value: pickValue(report?.survivalRate, report?.survival_rate, report?.monitoring?.survival_rate) },
    { label: "Status Kesehatan", value: pickValue(report?.healthCondition, healthDetail.label) },
    { label: "Monitoring Tersedia", value: monitoringItems.length || report?.totalMonitoring || 0 },
    { label: "Monitoring Terakhir", value: pickValue(report?.monitoringDate, report?.latestMonitoringDate) },
    { label: "Rekomendasi", value: pickValue(healthDetail.action, report?.evaluation_action, report?.ringkasan_evaluasi) },
  ];
};

const InfoCard = ({ label, value, accent = "default", mono = false }) => {
  const accentClass = {
    default: "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800",
    green: "border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20",
    blue: "border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20",
    yellow: "border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20",
    purple: "border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/20",
  }[accent] || "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800";

  return (
    <div className={`rounded-2xl border p-4 ${accentClass}`}>
      <p className="text-[11px] uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-2">{label}</p>
      <p className={`text-sm font-medium text-gray-900 dark:text-gray-100 ${mono ? "font-mono break-all" : ""}`}>
        {isPresent(value) ? value : "-"}
      </p>
    </div>
  );
};

const StageBadge = ({ available }) => (
  <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${available ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"}`}>
    {available ? "Tersedia" : "Belum tersedia"}
  </span>
);

export default function LaporanDetailModal({
  isOpen,
  onClose,
  laporanDetail,
  loadingLaporan,
  blockchainData,
  EXPLORER_BASE_URL,
  onReset,
}) {
  const report = laporanDetail || {};
  const { stages, currentStage } = getStageState(report);
  const evaluationSummary = getEvaluationSummary(report);
  const txHash = pickValue(report?.blockchain_tx_hash, blockchainData?.blockchain_tx_hash);
  const docHash = pickValue(report?.blockchain_doc_hash, blockchainData?.blockchain_doc_hash);
  const currentStageLabel = currentStage?.label || "Perencanaan";
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { id: 0, label: "Perencanaan", icon: FiActivity, color: "blue", condition: true },
    { id: 1, label: "Implementasi", icon: FiLayers, color: "yellow", condition: report?.is_implemented || report?.implementasi || currentStage?.value >= 2 },
    { id: 2, label: "Evaluasi & Monitoring", icon: FiBarChart2, color: "green", condition: report?.evaluasi || report?.monitoringItems?.length > 0 || currentStage?.value >= 3 }
  ];

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      icon={FiLayers}
      title={
        <div className="flex flex-wrap items-center gap-2">
          <span>Detail Laporan Publik</span>
          {loadingLaporan && (
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full text-white animate-pulse">
              Loading...
            </span>
          )}
        </div>
      }
      subtitle="Informasi yang dapat diakses publik berdasarkan QR Code"
      bodyClassName="space-y-6"
      footer={
        <div className="flex flex-col sm:flex-row justify-end w-full gap-3">
          <FormButton
            type="button"
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 h-auto"
          >
            Tutup
          </FormButton>
          <FormButton
            type="button"
            onClick={onReset}
            variant="primary"
            className="w-full sm:w-auto px-4 py-2 h-auto"
            icon={<FiRefreshCw />}
          >
            Scan QR Lain
          </FormButton>
        </div>
      }
    >
              {loadingLaporan ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                      key={item}
                      className="h-24 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <>
                  <div className="rounded-2xl border border-primary/15 bg-primary/5 dark:bg-primary/10 p-5">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-gray-800 text-primary border border-primary/20">
                            <FiCheckCircle className="w-3.5 h-3.5" />
                            {pickValue(report?.nama_perusahaan, report?.perencanaan?.nama_perusahaan, "Data dari QR Code")}
                          </span>
                          <StageBadge available={true} />
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                          {pickValue(report?.jenis_kegiatan, report?.perencanaan?.jenis_kegiatan, report?.type, "Detail Laporan")}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Tahapan saat ini: <span className="font-semibold text-gray-900 dark:text-gray-100">{currentStageLabel}</span>
                        </p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[360px]">
                        <InfoCard label="ID Laporan" value={report?.id || "-"} mono accent="blue" />
                        <InfoCard label="Status QR" value={report?.blockchain_verified || blockchainData?.blockchain_verified ? "Terverifikasi" : "Tersedia"} accent="green" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Lembaga */}
                    <section className="rounded-2xl border border-white/20 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md p-5 shadow-sm">
                      <div className="flex items-center gap-2 mb-4">
                        <FiClipboard className="w-5 h-5 text-primary" />
                        <h4 className="font-bold text-gray-900 dark:text-gray-100">Informasi Lembaga</h4>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <InfoCard label="Nama Lembaga" value={pickValue(report?.nama_perusahaan, report?.perusahaan, report?.perencanaan?.nama_perusahaan)} />
                        <InfoCard label="Nama PIC" value={pickValue(report?.nama_pic, report?.perencanaan?.nama_pic)} />
                        <InfoCard label="Narahubung" value={pickValue(report?.narahubung, report?.perencanaan?.narahubung)} />
                        <InfoCard label="Email" value={report?.user?.email || "-"} />
                      </div>
                    </section>

                    {/* Multistep Progress */}
                    <div className="relative pt-6 pb-2 px-4">
                      <div className="absolute left-8 right-8 top-12 h-1 bg-gray-200 dark:bg-gray-700 -z-10 rounded-full"></div>
                      <div className="flex justify-between relative z-0">
                        {steps.map((step, idx) => {
                          const isActive = activeStep === idx;
                          const isAvailable = step.condition;
                          return (
                            <button
                              key={step.id}
                              onClick={() => setActiveStep(idx)}
                              className={`flex flex-col items-center gap-3 transition-all duration-300 ${isActive ? 'scale-105' : 'opacity-70 hover:opacity-100 hover:scale-100'}`}
                            >
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? (step.color === 'blue' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40 ring-4 ring-blue-500/20' : step.color === 'yellow' ? 'bg-yellow-500 text-white shadow-lg shadow-yellow-500/40 ring-4 ring-yellow-500/20' : 'bg-green-500 text-white shadow-lg shadow-green-500/40 ring-4 ring-green-500/20') : isAvailable ? 'bg-gray-300 dark:bg-gray-700 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-2 border-dashed border-gray-300 dark:border-gray-700'}`}>
                                <step.icon className="w-5 h-5" />
                              </div>
                              <span className={`text-xs sm:text-sm font-bold ${isActive ? (step.color === 'blue' ? 'text-blue-500' : step.color === 'yellow' ? 'text-yellow-500' : 'text-green-500') : isAvailable ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600'}`}>
                                {step.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="min-h-[250px]">
                      {/* Perencanaan */}
                      {steps[activeStep]?.id === 0 && (
                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-2xl border border-white/20 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md p-5 shadow-sm">
                          <div className="flex items-center gap-2 mb-4">
                            <FiActivity className="w-5 h-5 text-blue-500" />
                            <h4 className="font-bold text-gray-900 dark:text-gray-100">Detail Perencanaan</h4>
                          </div>
                          <div className="grid gap-4 sm:grid-cols-2">
                            <InfoCard label="Jenis Kegiatan" value={pickValue(report?.jenis_kegiatan, report?.perencanaan?.jenis_kegiatan)} />
                            <InfoCard label="Lokasi" value={pickValue(report?.lokasi, report?.perencanaan?.lokasi)} mono />
                            <InfoCard label="Tanggal Direncanakan" value={formatDateId(pickValue(report?.tanggal_pelaksanaan, report?.perencanaan?.tanggal_pelaksanaan))} />
                            <InfoCard label="Jumlah Bibit" value={pickValue(report?.jumlah_bibit, report?.perencanaan?.jumlah_bibit)} />
                            <InfoCard label="Jenis Bibit" value={pickValue(report?.jenis_bibit, report?.perencanaan?.jenis_bibit)} />
                          </div>
                          {(report?.perencanaan?.blockchain_tx_hash || txHash) && (
                            <div className="mt-5 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-blue-500/10">
                              <div className="flex items-center gap-2 mb-2">
                                <FiShield className="w-4 h-4 text-blue-500" />
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">TX Hash Perencanaan</span>
                              </div>
                              <a href={`${EXPLORER_BASE_URL}/tx/${report?.perencanaan?.blockchain_tx_hash || txHash}`} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-blue-500 break-all flex items-center gap-2 hover:underline">
                                {report?.perencanaan?.blockchain_tx_hash || txHash} <FiExternalLink className="w-3 h-3 flex-shrink-0" />
                              </a>
                            </div>
                          )}
                        </section>
                      )}

                      {/* Implementasi */}
                      {steps[activeStep]?.id === 1 && (
                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-2xl border border-white/20 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md p-5 shadow-sm">
                          <div className="flex items-center gap-2 mb-4">
                            <FiLayers className="w-5 h-5 text-yellow-500" />
                            <h4 className="font-bold text-gray-900 dark:text-gray-100">Detail Implementasi</h4>
                          </div>
                          {steps[1].condition ? (
                            <>
                              <div className="grid gap-4 sm:grid-cols-2">
                                <InfoCard label="Tanggal Diimplementasikan" value={formatDateId(report?.implementasi?.tanggal_pelaksanaan || report?.tanggal_implementasi)} />
                                <InfoCard label="Jumlah Bibit Ditanam" value={report?.implementasi?.jumlah_bibit || report?.jumlah_bibit_ditanam} />
                                <InfoCard label="Dokumentasi" value={pickValue(report?.dokumentasi_count, report?.implementasi?.dokumentasi?.length, report?.documentation_count, 0)} accent="yellow" />
                                <InfoCard label="Status Implementasi" value={report?.is_implemented || report?.implementasi ? "Sudah Diimplementasikan" : "Belum Diimplementasikan"} />
                              </div>
                              {report?.implementasi?.blockchain_tx_hash && (
                                <div className="mt-5 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-yellow-500/10">
                                  <div className="flex items-center gap-2 mb-2">
                                    <FiShield className="w-4 h-4 text-yellow-500" />
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">TX Hash Implementasi</span>
                                  </div>
                                  <a href={`${EXPLORER_BASE_URL}/tx/${report?.implementasi?.blockchain_tx_hash}`} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-yellow-500 break-all flex items-center gap-2 hover:underline">
                                    {report?.implementasi?.blockchain_tx_hash} <FiExternalLink className="w-3 h-3 flex-shrink-0" />
                                  </a>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="py-8 text-center bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                              <p className="text-gray-500 dark:text-gray-400 font-medium">Tahap implementasi belum dimulai</p>
                            </div>
                          )}
                        </section>
                      )}

                      {/* Evaluasi */}
                      {steps[activeStep]?.id === 2 && (
                        <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 rounded-2xl border border-white/20 bg-white/40 dark:bg-gray-900/40 backdrop-blur-md p-5 shadow-sm">
                          <div className="flex items-center gap-2 mb-4">
                            <FiBarChart2 className="w-5 h-5 text-green-500" />
                            <h4 className="font-bold text-gray-900 dark:text-gray-100">Detail Evaluasi & Monitoring</h4>
                          </div>
                          {steps[2].condition ? (
                            <>
                              <div className="grid gap-4 sm:grid-cols-2">
                                {evaluationSummary.map((item) => (
                                  <InfoCard
                                    key={item.label}
                                    label={item.label}
                                    value={item.label === "Monitoring Tersedia" ? Number(item.value) : item.value}
                                    accent={item.label === "Status Kesehatan" ? "green" : item.label === "Survival Rate" ? "blue" : "default"}
                                  />
                                ))}
                              </div>
                              {(report?.monitoring?.blockchain_tx_hash || report?.evaluasi?.blockchain_tx_hash || (report?.monitoringItems && report.monitoringItems[0]?.blockchain_tx_hash)) && (
                                <div className="mt-5 p-3 rounded-xl bg-white/50 dark:bg-gray-800/50 border border-green-500/10">
                                  <div className="flex items-center gap-2 mb-2">
                                    <FiShield className="w-4 h-4 text-green-500" />
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">TX Hash Evaluasi/Monitoring</span>
                                  </div>
                                  <a href={`${EXPLORER_BASE_URL}/tx/${report?.evaluasi?.blockchain_tx_hash || report?.monitoring?.blockchain_tx_hash || (report?.monitoringItems && report.monitoringItems[0]?.blockchain_tx_hash)}`} target="_blank" rel="noopener noreferrer" className="text-xs font-mono text-green-500 break-all flex items-center gap-2 hover:underline">
                                    {report?.evaluasi?.blockchain_tx_hash || report?.monitoring?.blockchain_tx_hash || (report?.monitoringItems && report.monitoringItems[0]?.blockchain_tx_hash)} <FiExternalLink className="w-3 h-3 flex-shrink-0" />
                                  </a>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="py-8 text-center bg-gray-50/50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                              <p className="text-gray-500 dark:text-gray-400 font-medium">Tahap evaluasi & monitoring belum tersedia</p>
                            </div>
                          )}
                        </section>
                      )}
                    </div>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-5 mt-5">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Semua informasi di atas adalah data publik yang dapat diverifikasi dari QR Code.
                    </p>
                  </div>
                </>
              )}
    </ActionModal>
  );
}