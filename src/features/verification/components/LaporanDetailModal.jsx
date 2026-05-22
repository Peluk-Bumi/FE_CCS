import { FiCheckCircle, FiShield, FiExternalLink, FiRefreshCw, FiX, FiLayers, FiActivity, FiBarChart2, FiClipboard } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

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

const getPublicFields = (report) => [
  { label: "Nama Perusahaan", value: pickValue(report?.nama_perusahaan, report?.perencanaan?.nama_perusahaan) },
  { label: "Jenis Kegiatan", value: pickValue(report?.jenis_kegiatan, report?.perencanaan?.jenis_kegiatan) },
  { label: "Lokasi", value: pickValue(report?.lokasi, report?.perencanaan?.lokasi) },
  { label: "Tanggal Pelaksanaan", value: formatDateId(pickValue(report?.tanggal_pelaksanaan, report?.perencanaan?.tanggal_pelaksanaan)) },
  { label: "Nama PIC", value: pickValue(report?.nama_pic, report?.perencanaan?.nama_pic) },
  { label: "Narahubung", value: pickValue(report?.narahubung, report?.perencanaan?.narahubung) },
  { label: "Jumlah Bibit", value: pickValue(report?.jumlah_bibit, report?.perencanaan?.jumlah_bibit) },
  { label: "Jenis Bibit", value: pickValue(report?.jenis_bibit, report?.perencanaan?.jenis_bibit) },
];

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
  const publicFields = getPublicFields(report);
  const evaluationSummary = getEvaluationSummary(report);
  const txHash = pickValue(report?.blockchain_tx_hash, blockchainData?.blockchain_tx_hash);
  const docHash = pickValue(report?.blockchain_doc_hash, blockchainData?.blockchain_doc_hash);
  const currentStageLabel = currentStage?.label || "Perencanaan";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-5xl w-full max-h-[92vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-white/15 text-white flex-shrink-0">
                  <FiLayers className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold text-white text-lg">Detail Laporan Publik</h3>
                    {loadingLaporan && (
                      <motion.span
                        className="text-xs bg-white/20 px-2 py-1 rounded-full text-white"
                        animate={{ opacity: [1, 0.5, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        Loading...
                      </motion.span>
                    )}
                  </div>
                  <p className="text-xs text-white/80 truncate">
                    Informasi yang dapat diakses publik berdasarkan QR Code
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
              >
                <FiX className="w-5 h-5 text-white" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto scrollbar-premium flex-1 space-y-6">
              {loadingLaporan ? (
                <div className="grid gap-4 md:grid-cols-2">
                  {[1, 2, 3, 4, 5, 6].map((item) => (
                    <motion.div
                      key={item}
                      className="h-24 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-2xl"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: item * 0.08 }}
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

                  <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] items-start">
                    <div className="space-y-6">
                      <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <FiClipboard className="w-5 h-5 text-primary" />
                          <h4 className="font-bold text-gray-900 dark:text-gray-100">Setiap Kegiatan yang dapat diakses publik</h4>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          {publicFields.map((field) => (
                            <InfoCard
                              key={field.label}
                              label={field.label}
                              value={field.value}
                              accent="default"
                              mono={field.label === "Lokasi" || field.label === "ID Laporan"}
                            />
                          ))}
                        </div>
                      </section>

                      <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <FiActivity className="w-5 h-5 text-primary" />
                          <h4 className="font-bold text-gray-900 dark:text-gray-100">Data Perencanaan</h4>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <InfoCard label="Nama Perusahaan" value={pickValue(report?.nama_perusahaan, report?.perencanaan?.nama_perusahaan)} />
                          <InfoCard label="Tanggal Pelaksanaan" value={formatDateId(pickValue(report?.tanggal_pelaksanaan, report?.perencanaan?.tanggal_pelaksanaan))} />
                          <InfoCard label="Lokasi" value={pickValue(report?.lokasi, report?.perencanaan?.lokasi)} mono />
                          <InfoCard label="Jumlah Bibit" value={pickValue(report?.jumlah_bibit, report?.perencanaan?.jumlah_bibit)} />
                          <InfoCard label="Jenis Bibit" value={pickValue(report?.jenis_bibit, report?.perencanaan?.jenis_bibit)} />
                          <InfoCard label="PIC / Narahubung" value={`${pickValue(report?.nama_pic, report?.perencanaan?.nama_pic)} / ${pickValue(report?.narahubung, report?.perencanaan?.narahubung)}`} />
                        </div>
                      </section>

                      <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <FiBarChart2 className="w-5 h-5 text-primary" />
                          <h4 className="font-bold text-gray-900 dark:text-gray-100">Ringkasan Evaluasi</h4>
                        </div>
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
                        {(report?.healthConditionDetail?.description || report?.healthConditionDetail?.action || report?.ringkasan_evaluasi) && (
                          <div className="mt-4 rounded-xl border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 p-4">
                            <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:text-emerald-300 mb-2">Catatan Evaluasi</p>
                            {report?.healthConditionDetail?.description && (
                              <p className="text-sm text-emerald-900 dark:text-emerald-100 mb-2">
                                {report.healthConditionDetail.description}
                              </p>
                            )}
                            {report?.healthConditionDetail?.action && (
                              <p className="text-sm text-emerald-800 dark:text-emerald-200 font-medium">
                                Tindak lanjut: {report.healthConditionDetail.action}
                              </p>
                            )}
                            {!report?.healthConditionDetail?.description && report?.ringkasan_evaluasi && (
                              <p className="text-sm text-emerald-900 dark:text-emerald-100">{report.ringkasan_evaluasi}</p>
                            )}
                          </div>
                        )}
                      </section>
                    </div>

                    <div className="space-y-6">
                      <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <FiLayers className="w-5 h-5 text-primary" />
                          <h4 className="font-bold text-gray-900 dark:text-gray-100">Tahapan Saat Ini</h4>
                        </div>
                        <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 border border-primary/15 p-4">
                          <p className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-semibold mb-2">Tahap aktif</p>
                          <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">{currentStageLabel}</p>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{currentStage?.note}</p>
                        </div>
                      </section>

                      <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <FiActivity className="w-5 h-5 text-primary" />
                          <h4 className="font-bold text-gray-900 dark:text-gray-100">Ringkasan Status (4 Tahapan)</h4>
                        </div>
                        <div className="space-y-3">
                          {stages.map((stage, index) => (
                            <div
                              key={stage.key}
                              className={`rounded-xl border p-4 ${stage.key === currentStage?.key ? "border-primary bg-primary/5 dark:bg-primary/10" : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60"}`}
                            >
                              <div className="flex items-start justify-between gap-3 mb-2">
                                <div>
                                  <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{index + 1}. {stage.label}</p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{stage.note}</p>
                                </div>
                                <StageBadge available={stage.available} />
                              </div>
                              {stage.key === currentStage?.key && (
                                <p className="text-xs font-semibold text-primary dark:text-primary-light">Tahap saat ini</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </section>

                      <section className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <FiShield className="w-5 h-5 text-primary" />
                          <h4 className="font-bold text-gray-900 dark:text-gray-100">TX HASH</h4>
                        </div>
                        {txHash ? (
                          <div className="rounded-xl border border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 p-4">
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Hash transaksi blockchain</p>
                            <a
                              href={`${EXPLORER_BASE_URL}/tx/${txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-mono text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary break-all flex items-center gap-2"
                            >
                              {txHash}
                              <FiExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                            </a>
                            {docHash && (
                              <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 break-all">
                                Doc hash: <span className="font-mono text-gray-800 dark:text-gray-200">{docHash}</span>
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600 dark:text-gray-400">TX hash belum tersedia pada data QR ini.</p>
                        )}
                      </section>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <InfoCard label="Dokumentasi" value={pickValue(report?.dokumentasi_count, report?.dokumentasi?.length, report?.documentation_count, 0)} accent="yellow" />
                    <InfoCard label="Monitoring" value={pickValue(report?.totalMonitoring, report?.monitoring?.length, report?.monitoringItems?.length, 0)} accent="blue" />
                    <InfoCard label="Status Blockchain" value={report?.blockchain_verified || blockchainData?.blockchain_verified ? "Verified" : (txHash ? "Uploaded" : "Belum ada") } accent="green" />
                    <InfoCard label="Terakhir Diperbarui" value={formatDateIdTime(pickValue(report?.updated_at, report?.created_at))} accent="purple" />
                  </div>

                  <div className="border-t border-gray-200 dark:border-gray-700 pt-5 flex flex-col sm:flex-row justify-between gap-3">
                    <motion.button
                      onClick={onReset}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-medium transition-all shadow-md"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiRefreshCw className="w-4 h-4" />
                      Scan QR Lain
                    </motion.button>
                    <p className="text-xs text-gray-500 dark:text-gray-400 sm:text-right self-center">
                      Semua informasi di atas adalah data publik yang dapat diverifikasi dari QR Code.
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
              <motion.button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Tutup
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}