import { motion } from "framer-motion";
import { FiBarChart2, FiMapPin, FiTool, FiClock } from "react-icons/fi";
import PageTitle from "@/shared/components/common/PageTitle";

const equipmentItems = [
  "Pita ukur untuk pengukuran tinggi dan keliling batang",
  "Jangka sorong untuk pengukuran diameter batang",
  "Kamera untuk dokumentasi visual kondisi bibit",
  "Laptop untuk pencatatan data elektronik",
  "Tally sheet untuk pencatatan lapangan",
  "Alat tulis dan peralatan pendukung lainnya",
];

export default function InformationPage() {
  return (
    <div className="py-12">
      <PageTitle
        type="page"
        badge="Informasi Pengamatan"
        badgeIcon={FiBarChart2}
        title="Metode Pengamatan"
        description="Halaman informasi metode monitoring dan alat yang digunakan di lapangan"
      />

      <div className="max-w-4xl mx-auto">
        <motion.div
          className="bg-white/90 dark:bg-gray-900 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-8 md:p-10 space-y-6 text-sm leading-7 text-gray-700 dark:text-gray-300">
            <p>
              Kegiatan monitoring dilakukan pada tanggal <strong className="text-gray-900 dark:text-gray-100">19 Mei 2026</strong> pada titik geotagging <strong className="text-gray-900 dark:text-gray-100">(-6.11200000, 106.77800000)</strong> di area <strong className="text-gray-900 dark:text-gray-100">Pantai Kamal Muara, Jakarta Utara</strong>. Kawasan ini dikelola oleh Balai Konservasi Sumber Daya Alam (BKSDA) DKI Jakarta di bawah Kementerian Lingkungan Hidup dan Kehutanan.
            </p>

            <p>
              Dalam pelaksanaan monitoring, digunakan metode kuantitatif lapangan dengan pendekatan observasi langsung. Alat yang digunakan pada pengamatan bibit mangrove yang telah ditanam antara lain:
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
                  <p className="text-xs text-gray-600 dark:text-gray-400">Pantai Kamal Muara, Jakarta Utara</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                  <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-300">
                    <FiClock size={18} />
                    <h3 className="font-bold">Tanggal Monitoring</h3>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">19 Mei 2026</p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5">
                  <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-300">
                    <FiBarChart2 size={18} />
                    <h3 className="font-bold">Jumlah Data</h3>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Total data monitoring tersedia: <strong>6</strong> data pengamatan</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}