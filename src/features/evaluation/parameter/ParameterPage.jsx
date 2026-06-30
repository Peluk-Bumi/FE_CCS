import { motion } from "framer-motion";
import { FiBarChart2, FiActivity, FiHeart, FiAlertTriangle } from "react-icons/fi";
import PageTitle from "@/shared/components/common/PageTitle";

const conditionItems = [
  {
    label: "Sangat Baik",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    description: "Kondisi tanaman sangat sehat, pertumbuhan optimal, survival rate ≥ 90%.",
    icon: FiHeart,
  },
  {
    label: "Baik (Good)",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
    description: "Kondisi tanaman sehat, pertumbuhan normal, survival rate 70-89%.",
    icon: FiActivity,
  },
  {
    label: "Kurang Sehat",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    description: "Kondisi tanaman kurang sehat, pertumbuhan terhambat, survival rate 40-69%.",
    icon: FiAlertTriangle,
  },
  {
    label: "Kritis",
    color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800",
    description: "Kondisi tanaman kritis, banyak yang mati, survival rate < 40%.",
    icon: FiBarChart2,
  },
];

const parameterItems = [
  {
    title: "Survival Rate",
    description: "Persentase tanaman yang masih hidup dibandingkan total tanaman yang ditanam.",
    formula: "(Jumlah tanaman hidup / Total tanaman) × 100%",
  },
  {
    title: "Pertumbuhan Tinggi",
    description: "Perubahan tinggi tanaman dari waktu ke waktu, diukur dalam satuan sentimeter (cm).",
  },
  {
    title: "Diameter Batang",
    description: "Ukuran diameter batang tanaman, diukur dengan jangka sorong dalam satuan milimeter (mm).",
  },
  {
    title: "Kondisi Visual",
    description: "Penilaian kondisi tanaman secara visual termasuk warna daun, keberadaan hama, dan kerusakan.",
  },
];

import { useAuth } from "@/app/context/AuthContext";
import navigationConfig from "@/app/config/navigationConfig";
import { PageTabs } from "@/shared/components/ui/tabs";

export default function ParameterPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="py-12">
      <PageTitle
        type="page"
        badge="Parameter Kondisi"
        badgeIcon={FiBarChart2}
        title="Parameter Kondisi Kesehatan"
        description="Halaman informasi parameter dan kriteria penentuan kondisi kesehatan tanaman"
      />

      {/* Sub-navigation tabs — mobile only, sidebar handles desktop */}
      <div className="md:hidden mb-4">
        <PageTabs tabs={navigationConfig.getEvaluationMenuItems(isAdmin)} />
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Parameter Section */}
        <motion.div
          className="bg-white/90 dark:bg-gray-900 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="p-8 md:p-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Parameter Penilaian</h2>
            <div className="space-y-4">
              {parameterItems.map((item, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{item.description}</p>
                  {item.formula && (
                    <div className="mt-2 p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 font-mono text-xs text-gray-700 dark:text-gray-300">
                      {item.formula}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Conditions Section */}
        <motion.div
          className="bg-white/90 dark:bg-gray-900 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-8 md:p-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">Kategori Kondisi Kesehatan</h2>
            <div className="grid gap-4">
              {conditionItems.map((item, idx) => (
                <div key={idx} className={`rounded-2xl p-5 border ${item.color}`}>
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      <item.icon size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{item.label}</h3>
                      <p className="text-sm opacity-90">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
