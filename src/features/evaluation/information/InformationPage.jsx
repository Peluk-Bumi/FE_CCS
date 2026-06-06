import { motion } from "framer-motion";
import { FiBarChart2, FiMapPin, FiTool, FiClock } from "react-icons/fi";
import PageTitle from "@/shared/components/common/PageTitle";
import navigationConfig from "@/app/config/navigationConfig";
import { PageTabs } from "@/shared/components/ui/tabs";
import { useAuth } from "@/app/context/AuthContext";

const equipmentItems = [
  "Pita ukur untuk pengukuran tinggi dan keliling batang",
  "Jangka sorong untuk pengukuran diameter batang",
  "Kamera untuk dokumentasi visual kondisi bibit",
  "Laptop untuk pencatatan data elektronik",
  "Tally sheet untuk pencatatan lapangan",
  "Alat tulis dan peralatan pendukung lainnya",
];

export default function InformationPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="py-12">
      <PageTitle
        type="page"
        badge="Informasi Pengamatan"
        badgeIcon={FiBarChart2}
        title="Metode Pengamatan"
        description="Halaman informasi metode monitoring dan alat yang digunakan di lapangan"
      />

      <div className="md:hidden mb-4">
        <PageTabs tabs={navigationConfig.getEvaluationMenuItems(isAdmin)} />
      </div>

      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-white/90 dark:bg-gray-900 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-8 md:p-10 space-y-6 text-sm leading-7 text-gray-700 dark:text-gray-300">
            <p>
              Kegiatan monitoring dilakukan secara berkala pada lokasi implementasi yang tercatat dalam sistem, dengan titik geotagging yang berbeda sesuai area pengamatan masing-masing. Pendekatan ini dirancang agar metode pengamatan dapat diterapkan lintas wilayah dan lintas jenis program konservasi.
            </p>

            <p>
              Dalam pelaksanaan monitoring, digunakan metode kuantitatif lapangan dengan pendekatan observasi langsung. Peralatan berikut digunakan untuk mendukung proses pengukuran, dokumentasi, dan pencatatan data secara konsisten:
            </p>

            <div className="grid gap-4 md:grid-cols-[1.2fr_0.8fr]">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <FiTool className="text-emerald-600 dark:text-emerald-400" size={20} />
                  <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-100">Peralatan Pengamatan</h3>
                </div>
                <ul className="space-y-2 text-xs">
                  {equipmentItems.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                  <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-300">
                    <FiMapPin size={18} />
                    <h3 className="font-bold">Lokasi Pengamatan</h3>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Menyesuaikan lokasi kegiatan yang dipilih pada setiap pelaporan monitoring.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                  <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-300">
                    <FiClock size={18} />
                    <h3 className="font-bold">Tanggal Monitoring</h3>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Menyesuaikan jadwal monitoring aktual pada masing-masing kegiatan.</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                  <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-300">
                    <FiBarChart2 size={18} />
                    <h3 className="font-bold">Jumlah Data</h3>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Jumlah data pengamatan bersifat dinamis dan mengikuti data monitoring yang tersedia di sistem.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}