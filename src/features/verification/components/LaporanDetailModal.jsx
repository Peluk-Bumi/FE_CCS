import {
  FiCheckCircle, FiShield, FiExternalLink, FiRefreshCw,
  FiLayers, FiActivity, FiBarChart2, FiClipboard,
  FiMapPin, FiChevronDown,
} from "react-icons/fi";
import { useState } from "react";
import { ActionModal } from "@/shared/components/ui/modal/AnimatedModal";
import { FormButton } from "@/shared/components/ui/button/FormButton";

// ── Helpers ────────────────────────────────────────────────────────────────

const isPresent = (v) => {
  if (v === null || v === undefined) return false;
  if (typeof v === "string") return v.trim() !== "";
  if (typeof v === "number") return Number.isFinite(v);
  return true;
};

const pick = (...vals) => vals.find(isPresent) ?? "—";

const fmtDate = (val) => {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
};

const parseJSON = (str) => {
  if (!str) return {};
  if (typeof str === 'object') return str;
  try { return JSON.parse(str); } catch { return {}; }
};

// ── Sub-components ──────────────────────────────────────────────────────────

const InfoRow = ({ label, value, mono = false, accent }) => {
  const accentCls = {
    green: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800",
    blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
    yellow: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800",
    default: "bg-white dark:bg-gray-800/60 border-gray-100 dark:border-gray-700",
  }[accent || "default"];

  return (
    <div className={`rounded-xl border p-3.5 ${accentCls}`}>
      <p className="text-xs uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 mb-1">
        {label}
      </p>
      <p className={`text-sm font-semibold text-gray-800 dark:text-gray-200 ${mono ? "font-mono break-all" : ""}`}>
        {isPresent(value) ? value : "—"}
      </p>
    </div>
  );
};

const TxHashBlock = ({ label, hash, explorerUrl, color = "blue" }) => {
  const isAvailable = Boolean(hash && hash !== "—" && hash !== "null");
  const cls = {
    blue: "text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/20",
    yellow: "text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20",
    green: "text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-900/20",
  }[color];

  return (
    <div className={`mt-4 rounded-xl border p-3 ${cls}`}>
      <div className="flex items-center gap-1.5 mb-2">
        <FiShield className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-xs font-semibold">{label}</span>
      </div>
      {isAvailable ? (
        <a href={`${explorerUrl}/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 group">
          <span className="text-xs font-mono break-all group-hover:underline">{hash}</span>
          <FiExternalLink className="w-3.5 h-3.5 flex-shrink-0 opacity-60 group-hover:opacity-100 transition-opacity" />
        </a>
      ) : (
        <p className="text-xs italic opacity-70">Sedang diproses / Hash transaksi belum tersedia di jaringan blockchain.</p>
      )}
    </div>
  );
};

// ── Accordion ────────────────────────────────────────────────────────────────

const Accordion = ({ title, icon: Icon, iconCls = "text-gray-500", defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/60 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 hover:bg-gray-50/70 dark:hover:bg-gray-800/40 transition-colors text-left"
      >
        <div className="flex items-center gap-2.5">
          {Icon && (
            <span className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0">
              <Icon className={`w-4 h-4 ${iconCls}`} />
            </span>
          )}
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{title}</span>
        </div>
        <FiChevronDown
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-200">
          {children}
        </div>
      )}
    </div>
  );
};

// ── Progress bar ────────────────────────────────────────────────────────────

const StageProgress = ({ stages, report }) => {
  const filledCount = stages.filter((s) => s.available).length;
  const basePct = Math.round((filledCount / stages.length) * 100);
  let displayPct = basePct;

  // Custom logic for monitoring progress
  const status = report?.status || 'planning';
  const monCount = report?.monitoring_count || 0;
  const monTarget = (report?.durasi_proyek && report?.monitoring_interval) 
    ? Math.floor(Number(report.durasi_proyek) / Number(report.monitoring_interval)) 
    : (report?.monitoring_target || report?.target_monitoring_phase || 6);
  const isMonitoringPhase = status.includes('monitoring') || (monCount > 0 && status !== 'planning' && status !== 'implementation');
  
  if (isMonitoringPhase && status !== 'completed' && status !== 'evaluation') {
    const baseProgress = 50; 
    const monProgress = monTarget > 0 ? (monCount / monTarget) * 25 : 0; 
    displayPct = Math.min(Math.round(baseProgress + monProgress), 75);
  } else if (status === 'evaluation' || status === 'completed') {
    displayPct = status === 'completed' ? 100 : 85;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Progres Kegiatan {(isMonitoringPhase && monTarget > 0) ? `(Tahap ${monCount} dari ${monTarget})` : ""}
        </span>
        <span className="text-sm font-bold text-primary">{displayPct}%</span>
      </div>
      <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-gradient-to-r from-emerald-400 to-green-500 rounded-full transition-all duration-700"
          style={{ width: `${displayPct}%` }}
        />
      </div>
      <div className="flex justify-between">
        {stages.map((s) => (
          <span key={s.key} className="flex flex-col items-center gap-1 text-center" style={{ flex: 1 }}>
            <span className={`w-3 h-3 rounded-full mx-auto ${s.available ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-700"}`} />
            <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 leading-none">{s.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// ── Tabs ────────────────────────────────────────────────────────────────────

const TABS = [
  { id: 0, label: "Perencanaan", icon: FiActivity, color: "blue" },
  { id: 1, label: "Implementasi", icon: FiLayers, color: "amber" },
  { id: 2, label: "Monitoring", icon: FiBarChart2, color: "green" },
];

const cMap = {
  blue:  { active: "bg-blue-600 text-white shadow-md shadow-blue-500/25",   icon: "text-blue-500"   },
  amber: { active: "bg-amber-500 text-white shadow-md shadow-amber-500/25", icon: "text-amber-500"  },
  green: { active: "bg-emerald-600 text-white shadow-md shadow-emerald-500/25", icon: "text-emerald-500" },
};

// ── Derived data helpers ────────────────────────────────────────────────────

const getStages = (report) => {
  const status = report?.status || 'planning';
  
  const hasImplementasi = status !== 'planning' || Boolean(report?.implementasi);
  const hasMonitoring = status.includes('monitoring') || status === 'completed' || status === 'evaluation' || Boolean(report?.implementasi?.monitorings?.length > 0);
  const hasEvaluasi = status === 'completed' || report?.evaluation_status === 'completed';

  return [
    { key: "planning",       label: "Rencana",       available: true },
    { key: "implementation", label: "Implementasi",  available: hasImplementasi },
    { key: "monitoring",     label: "Monitoring",    available: hasMonitoring },
    { key: "evaluation",     label: "Evaluasi",      available: hasEvaluasi },
  ];
};

const getEvalSummary = (report) => {
  const monItems = Array.isArray(report?.implementasi?.monitorings)
    ? report.implementasi.monitorings
    : report?.implementasi?.monitoring ? [report.implementasi.monitoring] : [];

  const latestMon = monItems.length > 0 ? monItems[monItems.length - 1] : null;

  return [
    { label: "Survival Rate Aktual", value: pick(latestMon?.survival_rate, report?.final_score, report?.health_status) },
    { label: "Kondisi Kesehatan",    value: pick(report?.health_status) },
    { label: "Total Monitoring",     value: String(monItems.length) },
    { label: "Monitoring Terakhir",  value: fmtDate(latestMon?.created_at) },
  ];
};

// ── Main Component ──────────────────────────────────────────────────────────

export default function LaporanDetailModal({
  isOpen, onClose, laporanDetail, loadingLaporan,
  blockchainData, EXPLORER_BASE_URL, onReset,
}) {
  const [activeTab, setActiveTab] = useState(0);
  const report = laporanDetail || {};

  const txHash = pick(report?.blockchain?.tx_hash, report?.blockchain_tx_hash, blockchainData?.blockchain_tx_hash);
  const isVerified = Boolean(report?.blockchain_verified || blockchainData?.blockchain_verified);
  const stages = getStages(report);
  const evalSummary = getEvalSummary(report);
  
  const hasImplementasi = stages.find(s => s.key === 'implementation')?.available;
  const hasMonitoring = stages.find(s => s.key === 'monitoring')?.available;
  const hasEvaluasi = stages.find(s => s.key === 'evaluation')?.available;

  // Implementation Realisasi logic
  const imp = report?.implementasi || {};
  const aktual = parseJSON(imp.realisasi_aktual);

  const valImplementasi = (fieldSesuai, fieldName, fallbackName) => {
    if (imp[fieldSesuai]) return report?.[fallbackName || fieldName];
    return aktual[fieldName] || report?.[fallbackName || fieldName];
  };

  const getDokumentasiCount = (dok) => {
    if (!dok) return 0;
    if (Array.isArray(dok)) return dok.length;
    if (typeof dok === 'string') {
      try {
        const parsed = JSON.parse(dok);
        if (Array.isArray(parsed)) return parsed.length;
      } catch {
        if (dok.includes(',')) return dok.split(',').filter(s => s.trim() !== '').length;
      }
      return 1;
    }
    return 1;
  };

  const dokCount = imp.dokumentasi_count ?? getDokumentasiCount(imp.dokumentasi_kegiatan);
  const monItems = Array.isArray(report?.implementasi?.monitorings)
    ? report.implementasi.monitorings
    : report?.implementasi?.monitoring ? [report.implementasi.monitoring] : [];

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      size="5xl"
      icon={FiLayers}
      title={
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-base font-bold">Detail Dokumen Publik</span>
          {loadingLaporan && (
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full text-white animate-pulse">Memuat…</span>
          )}
          {isVerified && !loadingLaporan && (
            <span className="text-xs bg-emerald-500/80 px-2.5 py-1 rounded-full text-white flex items-center gap-1 font-semibold">
              <FiCheckCircle className="w-3.5 h-3.5" /> Terverifikasi
            </span>
          )}
        </div>
      }
      subtitle="Data publik yang diverifikasi melalui QR Code"
      bodyClassName="space-y-5"
      footer={
        <div className="flex flex-col sm:flex-row justify-end w-full gap-3">
          <FormButton type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto px-5 py-2.5 h-auto">
            Tutup
          </FormButton>
          <FormButton type="button" onClick={onReset} variant="primary" className="w-full sm:w-auto px-5 py-2.5 h-auto" icon={<FiRefreshCw />}>
            Scan QR Lain
          </FormButton>
        </div>
      }
    >
      {loadingLaporan ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* ── Header: nama kegiatan + verified badge ── */}
          <div className="rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent dark:from-primary/15 border border-primary/15 p-5">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-white dark:bg-gray-800 text-primary border border-primary/20">
                    <FiClipboard className="w-3 h-3" />
                    {pick(report?.nama_perusahaan, report?.perencanaan?.nama_perusahaan, "Dokumen Publik")}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                    <FiCheckCircle className="w-3 h-3" /> Tersedia
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
                  {pick(report?.jenis_kegiatan, report?.perencanaan?.jenis_kegiatan, "Laporan Kegiatan")}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  ID Dokumen: <span className="font-mono font-semibold">{report?.id || "—"}</span>
                </p>
              </div>
              <div className="flex-shrink-0">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${isVerified
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                  : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
                  }`}>
                  <FiShield className="w-3.5 h-3.5" />
                  {isVerified ? "Blockchain Verified" : "QR Tersedia"}
                </span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-5">
              <StageProgress stages={stages} report={report} />
            </div>
          </div>

          {/* ── Accordion: Informasi Lembaga (sebelum tab) ── */}
          <Accordion title="Informasi Lembaga" icon={FiClipboard} iconCls="text-primary" defaultOpen={false}>
            <div className="grid gap-3 sm:grid-cols-2 pt-1">
              <InfoRow label="Nama Lembaga"  value={pick(report?.nama_perusahaan, report?.perencanaan?.nama_perusahaan)} />
              <InfoRow label="Nama PIC"      value={pick(report?.nama_pic, report?.perencanaan?.nama_pic)} />
              <InfoRow label="Narahubung"    value={pick(report?.narahubung, report?.perencanaan?.narahubung)} />
              <InfoRow label="Email"         value={report?.user?.email} />
            </div>
          </Accordion>

          {/* ── Tab nav ── */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800/60 rounded-2xl">
            {TABS.map((tab) => {
              const isDisabled = (tab.id === 1 && !hasImplementasi) || (tab.id === 2 && !hasMonitoring);
              const isActive = activeTab === tab.id;
              const c = cMap[tab.color];
              return (
                <button
                  key={tab.id}
                  onClick={() => !isDisabled && setActiveTab(tab.id)}
                  disabled={isDisabled}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isDisabled 
                      ? "opacity-50 cursor-not-allowed text-gray-400 dark:text-gray-600 bg-transparent" 
                      : isActive 
                        ? c.active 
                        : `text-gray-500 dark:text-gray-400 hover:bg-white/60 dark:hover:bg-gray-700/60 ${c.icon}`
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* ── Tab content ── */}
          <div className="min-h-[200px]">

            {/* Perencanaan */}
            {activeTab === 0 && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 space-y-3">
                <Accordion title="Detail Lokasi & Kegiatan Direncanakan" icon={FiMapPin} iconCls="text-blue-500" defaultOpen={true}>
                  <div className="grid gap-3 sm:grid-cols-2 pt-1">
                    <InfoRow label="Jenis Kegiatan Direncanakan"  value={pick(report?.perencanaan?.jenis_kegiatan, report?.jenis_kegiatan)} accent="blue" />
                    <InfoRow label="Lokasi Direncanakan"          value={pick(report?.perencanaan?.lokasi, report?.lokasi)} mono />
                    <InfoRow label="Tanggal Direncanakan"         value={fmtDate(pick(report?.perencanaan?.tanggal_pelaksanaan, report?.tanggal_pelaksanaan))} />
                    <InfoRow label="Jumlah Bibit Direncanakan"    value={pick(report?.perencanaan?.jumlah_bibit, report?.jumlah_bibit)} />
                    <InfoRow label="Jenis Bibit Direncanakan"     value={pick(report?.perencanaan?.jenis_bibit, report?.jenis_bibit)} accent="green" />
                  </div>
                  <TxHashBlock
                    label="TX Hash Perencanaan"
                    hash={pick(report?.perencanaan?.blockchain_tx_hash, report?.blockchain?.tx_hash, report?.blockchain_tx_hash, txHash)}
                    explorerUrl={EXPLORER_BASE_URL}
                    color="blue"
                  />
                </Accordion>
              </div>
            )}

            {/* Implementasi */}
            {activeTab === 1 && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 space-y-3">
                <Accordion title="Detail Implementasi" icon={FiLayers} iconCls="text-amber-500" defaultOpen={true}>
                  {hasImplementasi ? (
                    <>
                      <div className="grid gap-3 sm:grid-cols-2 pt-1">
                        <InfoRow 
                          label="Jenis Kegiatan Aktual"  
                          value={valImplementasi('jenis_kegiatan_sesuai', 'jenis_kegiatan')} 
                          accent={imp.jenis_kegiatan_sesuai ? "default" : "blue"} 
                        />
                        <InfoRow 
                          label="Lokasi Aktual"          
                          value={valImplementasi('lokasi_sesuai', 'lokasi')} 
                          mono 
                          accent={imp.lokasi_sesuai ? "default" : "yellow"}
                        />
                        <InfoRow 
                          label="Tanggal Implementasi"   
                          value={fmtDate(valImplementasi('tanggal_sesuai', 'tanggal', 'tanggal_pelaksanaan'))} 
                          accent={imp.tanggal_sesuai ? "default" : "yellow"} 
                        />
                        <InfoRow 
                          label="Jumlah Bibit Ditanam"   
                          value={valImplementasi('jumlah_bibit_sesuai', 'jumlah_bibit')} 
                          accent={imp.jumlah_bibit_sesuai ? "default" : "blue"}
                        />
                        <InfoRow 
                          label="Jenis Bibit Ditanam"    
                          value={valImplementasi('jenis_bibit_sesuai', 'jenis_bibit')} 
                          accent={imp.jenis_bibit_sesuai ? "default" : "green"} 
                        />
                        <InfoRow 
                          label="Dokumentasi"            
                          value={dokCount > 0 ? `${dokCount} Foto/File` : "Tidak Ada"} 
                        />
                      </div>
                      <TxHashBlock
                        label="TX Hash Implementasi"
                        hash={pick(imp.blockchain_tx_hash, report?.blockchain?.tx_hash, report?.blockchain_tx_hash, txHash)}
                        explorerUrl={EXPLORER_BASE_URL}
                        color="yellow"
                      />
                    </>
                  ) : (
                    <div className="py-8 text-center rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 mt-1">
                      <FiLayers className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                      <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">Implementasi belum dimulai</p>
                    </div>
                  )}
                </Accordion>
              </div>
            )}

            {/* Evaluasi */}
            {activeTab === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-300 space-y-3">
                <Accordion title="Rekap Evaluasi & Monitoring" icon={FiBarChart2} iconCls="text-emerald-500" defaultOpen={true}>
                  {hasMonitoring || hasEvaluasi ? (
                    <>
                      {/* Detailed Auto-Evaluation Data & Recommendations */}
                      {(() => {
                        const evalData = parseJSON(report?.evaluation_data || report?.perencanaan?.evaluation_data || report?.evaluationData || report?.perencanaan?.evaluationData);
                        if (!evalData || !evalData.nilai_akhir) return null;
                        return (
                          <div className="mb-5 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl p-4 space-y-3">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400">Hasil Evaluasi Kelayakan (Perdirjen KSDAE P.13/2015)</h4>
                            <div className="grid grid-cols-2 gap-4 text-xs md:text-sm">
                              <div>
                                <p className="text-gray-500">Nilai Akhir (NA)</p>
                                <p className="font-bold text-base text-emerald-700 dark:text-emerald-300">{evalData.nilai_akhir} / 5.00</p>
                              </div>
                              <div>
                                <p className="text-gray-500">Kategori Kondisi</p>
                                <p className="font-bold text-base text-emerald-700 dark:text-emerald-300 capitalize">
                                  {evalData.kategori === 'good' ? 'SEDANG (Sehat)' : evalData.kategori === 'excellent' ? 'BAIK (Sangat Sehat)' : evalData.kategori === 'warning' ? 'BURUK (Kurang Sehat)' : 'GAGAL'}
                                </p>
                              </div>
                            </div>
                            <div className="pt-2 border-t border-emerald-100 dark:border-emerald-900/20">
                              <p className="text-[9px] uppercase font-bold text-gray-400">Rekomendasi Tindakan</p>
                              <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed mt-0.5">{evalData.rekomendasi}</p>
                            </div>
                            
                            <div className="pt-2 border-t border-emerald-100 dark:border-emerald-900/20 space-y-1.5">
                              <p className="text-[9px] uppercase font-bold text-gray-400">Rincian Skor Indikator</p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                <div className="bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 p-2 rounded-xl flex justify-between items-center">
                                  <span className="text-gray-500">Survival Kumulatif:</span> 
                                  <span className="font-semibold text-gray-800 dark:text-gray-200">{evalData.criteria?.stabilitas_lanskap?.skor_survival_rate}/5 ({evalData.detail?.cumulative_survival}%)</span>
                                </div>
                                <div className="bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 p-2 rounded-xl flex justify-between items-center">
                                  <span className="text-gray-500">Tinggi Vegetasi Akhir:</span> 
                                  <span className="font-semibold text-gray-800 dark:text-gray-200">{evalData.criteria?.stabilitas_lanskap?.skor_tinggi_bibit}/5 ({evalData.detail?.tinggi_bibit_akhir_cm} cm)</span>
                                </div>
                                <div className="bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 p-2 rounded-xl flex justify-between items-center">
                                  <span className="text-gray-500">Kesehatan Daun:</span> 
                                  <span className="font-semibold text-gray-800 dark:text-gray-200">{evalData.criteria?.stabilitas_lanskap?.skor_kesehatan_daun}/5 ({evalData.detail?.avg_daun_sehat_pct}%)</span>
                                </div>
                                <div className="bg-white dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700 p-2 rounded-xl flex justify-between items-center">
                                  <span className="text-gray-500">Tren Pemeliharaan:</span> 
                                  <span className="font-semibold text-gray-800 dark:text-gray-200">{evalData.criteria?.efisiensi_program?.skor_tren_survival}/5 ({evalData.detail?.delta_survival_periode ?? 0}%)</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      <div className="grid gap-3 sm:grid-cols-2 pt-1 mb-4">
                        {evalSummary.map((item) => (
                          <InfoRow
                            key={item.label}
                            label={item.label}
                            value={item.value}
                            accent={
                              item.label === "Survival Rate Aktual" ? "blue"
                                : item.label === "Kondisi Kesehatan" ? "green"
                                  : "default"
                            }
                          />
                        ))}
                      </div>

                      {/* Detail Monitoring List */}
                      {monItems.length > 0 && (
                        <div className="mt-4 border-t border-gray-100 dark:border-gray-800 pt-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3 px-1">Riwayat Monitoring</h4>
                          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {monItems.map((mon, idx) => (
                              <div key={mon.id || idx} className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-xl p-3 flex flex-col gap-2 relative">
                                <div className="absolute top-3 right-3 text-xs font-bold text-gray-300 dark:text-gray-600">#{idx + 1}</div>
                                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                  <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-semibold mb-0.5">Tanggal</p>
                                    <p className="font-medium text-gray-700 dark:text-gray-200">{fmtDate(mon.created_at)}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-semibold mb-0.5">Bulan Ke</p>
                                    <p className="font-medium text-gray-700 dark:text-gray-200">{mon.bulan_monitoring || "—"}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-semibold mb-0.5">Survival Rate</p>
                                    <p className="font-semibold text-blue-600 dark:text-blue-400">{mon.survival_rate ? `${mon.survival_rate}%` : "—"}</p>
                                  </div>
                                  <div>
                                    <p className="text-[10px] uppercase text-gray-400 font-semibold mb-0.5">Pohon Mati</p>
                                    <p className="font-medium text-amber-600 dark:text-amber-400">{mon.jumlah_bibit_mati ?? "—"}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      <TxHashBlock
                        label="TX Hash Evaluasi/Monitoring"
                        hash={pick(
                          report?.evaluasi?.blockchain_tx_hash,
                          monItems?.[monItems.length - 1]?.blockchain_tx_hash,
                          monItems?.[0]?.blockchain_tx_hash,
                          report?.blockchain?.tx_hash,
                          report?.blockchain_tx_hash,
                          txHash
                        )}
                        explorerUrl={EXPLORER_BASE_URL}
                        color="green"
                      />
                    </>
                  ) : (
                    <div className="py-8 text-center rounded-xl border border-dashed border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/30 mt-1">
                      <FiBarChart2 className="w-8 h-8 mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                      <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">Data monitoring belum tersedia</p>
                    </div>
                  )}
                </Accordion>
              </div>
            )}

          </div>

          {/* ── Footer note ── */}
          <div className="flex items-center justify-center gap-2 pt-1 border-t border-gray-100 dark:border-gray-800">
            <FiShield className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Semua informasi di atas adalah data publik yang dapat diverifikasi dari QR Code.
            </p>
          </div>
        </>
      )}
    </ActionModal>
  );
}