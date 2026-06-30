import { motion } from "framer-motion";
import { FiTrendingUp, FiActivity, FiAward, FiCheckCircle } from "react-icons/fi";

/**
 * Komponen untuk menampilkan ringkasan data evaluasi dalam bentuk card
 */
export default function SummaryCards({ report, survivalStatus, healthStatus, isAvg36 = false }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "BERHASIL":
        return { bg: "bg-green-50 dark:bg-green-900/20", border: "border-green-200 dark:border-green-800", text: "text-green-700 dark:text-green-300", icon: "text-green-600 dark:text-green-400" };
      case "BAIK":
        return { bg: "bg-emerald-50 dark:bg-emerald-900/20", border: "border-emerald-200 dark:border-emerald-800", text: "text-emerald-700 dark:text-emerald-300", icon: "text-emerald-600 dark:text-emerald-400" };
      case "PERLU_PERHATIAN":
        return { bg: "bg-yellow-50 dark:bg-yellow-900/20", border: "border-yellow-200 dark:border-yellow-800", text: "text-yellow-700 dark:text-yellow-300", icon: "text-yellow-600 dark:text-yellow-400" };
      case "GAGAL":
        return { bg: "bg-red-50 dark:bg-red-900/20", border: "border-red-200 dark:border-red-800", text: "text-red-700 dark:text-red-300", icon: "text-red-600 dark:text-red-400" };
      default:
        return { bg: "bg-gray-50 dark:bg-gray-900/20", border: "border-gray-200 dark:border-gray-800", text: "text-gray-700 dark:text-gray-300", icon: "text-gray-600 dark:text-gray-400" };
    }
  };

  const survivalColor = getStatusColor(survivalStatus);

  return (
    <motion.div
      className="grid grid-cols-2 gap-3 mb-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Survival Rate Card */}
      <motion.div
        variants={itemVariants}
        className={`rounded-xl border-2 p-3 sm:p-4 flex flex-col justify-between ${survivalColor.bg} ${survivalColor.border}`}
      >
        <div className="flex items-start justify-between mb-2">
          <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 leading-tight">Tingkat<br className="sm:hidden" /> Keberhasilan</p>
          <div className={`p-2 rounded-lg ${survivalColor.bg} hidden sm:block`}>
            <FiTrendingUp className={`w-5 h-5 ${survivalColor.icon}`} />
          </div>
        </div>
        <div>
          <p className={`text-2xl sm:text-3xl font-bold ${survivalColor.text}`}>{report.survivalRate}</p>
          <p className="text-[10px] sm:text-xs mt-1 text-gray-600 dark:text-gray-400 line-clamp-2">
            {isAvg36 ? "Rata-rata survival rate monitoring 3 & 6" : "Survival rate (data akhir)"}
          </p>
          <p className={`text-[10px] sm:text-xs mt-1 font-medium ${survivalColor.text}`}>
            {survivalStatus === "BERHASIL" && "✓ Berhasil"}
            {survivalStatus === "BAIK" && "✓ Baik"}
            {survivalStatus === "PERLU_PERHATIAN" && "⚠ Perlu Perhatian"}
            {survivalStatus === "GAGAL" && "✗ Gagal"}
          </p>
        </div>
      </motion.div>

      {/* Kondisi Kesehatan Card */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl border-2 border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-3 sm:p-4 flex flex-col justify-between"
      >
        <div className="flex items-start justify-between mb-2">
          <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 leading-tight">Kondisi<br className="sm:hidden" /> Kesehatan</p>
          <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 hidden sm:block">
            <FiActivity className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          </div>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-bold text-emerald-700 dark:text-emerald-300 leading-tight">{report.healthCondition}</p>
          <p className="text-[10px] sm:text-xs text-emerald-600 dark:text-emerald-400 mt-1 line-clamp-2">
            {report.healthConditionDetail?.description || "Status kesehatan bibit"}
          </p>
        </div>
      </motion.div>

      {/* Tinggi Rata-rata Card */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-3 sm:p-4 flex flex-col justify-between"
      >
        <div className="flex items-start justify-between mb-2">
          <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 leading-tight">Tinggi Bibit<br className="sm:hidden" /> Rata-rata</p>
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/40 hidden sm:block">
            <FiAward className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-bold text-blue-700 dark:text-blue-300">{report.avgHeight}</p>
          <p className="text-[10px] sm:text-xs text-blue-600 dark:text-blue-400 mt-0.5">cm</p>
        </div>
      </motion.div>

      {/* Diameter Rata-rata Card */}
      <motion.div
        variants={itemVariants}
        className="rounded-xl border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 p-3 sm:p-4 flex flex-col justify-between"
      >
        <div className="flex items-start justify-between mb-2">
          <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 leading-tight">Diameter Batang<br className="sm:hidden" /> Rata-rata</p>
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/40 hidden sm:block">
            <FiCheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
        </div>
        <div>
          <p className="text-xl sm:text-2xl font-bold text-purple-700 dark:text-purple-300">{report.avgDiameter}</p>
          <p className="text-[10px] sm:text-xs text-purple-600 dark:text-purple-400 mt-0.5">cm</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
