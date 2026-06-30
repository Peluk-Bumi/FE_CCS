import { motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";

const getHealthBadgeColor = (healthCondition) => {
  if (healthCondition?.includes("Sangat Baik")) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";
  if (healthCondition?.includes("Baik (Good)")) return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
  if (healthCondition?.includes("Kurang Sehat")) return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
  if (healthCondition?.includes("Kritis")) return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
  return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
};

export default function LembagaList({ lembagaReports, onSelectLembaga, loading, error }) {
  if (loading) {
    return (
      <div className="py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Memuat daftar lembaga...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-700 p-8 text-center">
        <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-red-900 dark:text-red-200 mb-2">Terjadi Kesalahan</h3>
        <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
      </div>
    );
  }

  if (lembagaReports.length === 0) {
    return (
      <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-700 p-8 text-center">
        <FiAlertCircle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <h3 className="text-lg font-bold text-amber-900 dark:text-amber-200 mb-2">Belum Ada Data</h3>
        <p className="text-amber-700 dark:text-amber-300 text-sm">Belum ada data perencanaan untuk dievaluasi.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {lembagaReports.map((item) => (
        <motion.button
          key={item.id}
          type="button"
          onClick={() => onSelectLembaga(item.id)}
          className="w-full text-left rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-primary/10 dark:hover:bg-primary/20 px-6 py-5 transition-all duration-300 shadow-sm hover:shadow-md"
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-gray-900 dark:text-gray-100 text-lg">{item.namaPerusahaan || item.namaLembaga || item.nama_perusahaan}</p>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getHealthBadgeColor(item.healthCondition)}`}>
                  {item.healthCondition}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{item.jenisKegiatan}</p>
            </div>
            <div className="flex gap-6 text-xs text-gray-600 dark:text-gray-400">
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Monitoring</p>
                <p className="text-base">{item.totalMonitoring} data</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Survival Rate</p>
                <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">{item.survivalRate}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900 dark:text-gray-100">Terakhir</p>
                <p className="text-base">{item.monitoringDate}</p>
              </div>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
