import { motion } from "framer-motion";
import { FiBarChart2, FiMapPin, FiTool, FiClock, FiActivity, FiCpu } from "react-icons/fi";
import PageTitle from "@/shared/components/common/PageTitle";
import navigationConfig from "@/app/config/navigationConfig";
import { PageTabs } from "@/shared/components/ui/tabs";
import { useAuth } from "@/app/context/AuthContext";

const equipmentItems = [
  "Pita ukur khusus kehutanan untuk pengukuran tinggi tanaman",
  "Jangka sorong digital (caliper) untuk pengukuran diameter batang dengan presisi tinggi",
  "Kamera ber-geotag (Mobile App) untuk dokumentasi visual kondisi riil tanaman",
  "Aplikasi Mobile CCS untuk sinkronisasi data lapangan terenkripsi",
  "Tally sheet digital / lembar kerja evaluasi otomatis tingkat tapak",
  "Perangkat GPS / sensor geotagging terintegrasi"
];

const methodologySteps = [
  {
    title: "1. Pengumpulan Data Berkala (Ronde Monitoring)",
    desc: "Data lapangan dikumpulkan setiap ronde monitoring (misalnya Ronde 1 pada Bulan 3, Ronde 2 pada Bulan 6). Parameter utama meliputi tinggi tanaman (cm), diameter batang (mm), jumlah daun, rentang kerusakan daun, dan tingkat kelangsungan hidup periode."
  },
  {
    title: "2. Perhitungan Kelangsungan Hidup Progresif (Ecology Principle)",
    desc: "Survival rate dihitung secara progresif-kumulatif: sisa bibit hidup di ronde terakhir dibagi jumlah bibit awal yang ditanam aktual saat implementasi. Ini menghindari bias matematika rata-rata biasa karena bibit yang mati tidak bisa hidup kembali."
  },
  {
    title: "3. Konversi Data Daun (Midpoint Parser)",
    desc: "Indikator kerusakan daun disimpan dalam bentuk rentang persentase (misalnya <25%, 25–45%). Sistem secara otomatis melakukan konversi ke nilai titik tengah (midpoint) seperti 12%, 35%, 62%, 80% sebelum diolah menjadi persentase kesehatan daun."
  },
  {
    title: "4. Penilaian Kriteria & Pembobotan Otomatis (Smart Contract Layer)",
    desc: "Semua skor dikalikan dengan bobot kriteria resmi (90% Stabilitas Lanskap + 10% Efisiensi Program). Smart Contract memvalidasi integritas data dan mengunci Nilai Akhir ke blockchain secara permanen setelah monitoring selesai."
  }
];

export default function InformationPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="py-6 md:py-12">
      <PageTitle
        type="page"
        badge="Informasi Pengamatan"
        badgeIcon={FiBarChart2}
        title="Metode & Alur Pengamatan"
        description="Dokumentasi metodologi evaluasi otomatis, alur pengolahan data ekologis, dan standar peralatan monitoring lapangan"
      />

      <div className="md:hidden mb-4">
        <PageTabs tabs={navigationConfig.getEvaluationMenuItems(isAdmin)} />
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Intro */}
        <motion.div
          className="glass bg-white/90 dark:bg-gray-900 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-gray-700/50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-8 md:p-10 space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <FiCpu className="text-emerald-600 dark:text-emerald-400" />
              Metodologi Evaluasi Otomatis (Auto-Scoring Engine)
            </h2>
            <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              Sistem Carbon Capture System (CCS) menerapkan model evaluasi otomatis secara langsung dari data monitoring berkala yang diinput oleh Koorlap. Metodologi ini didesain sesuai dengan standar <strong>Perdirjen KSDAE No. P.13/2015</strong> dengan modifikasi khusus untuk karakteristik mangrove Taman Wisata Alam (TWA) Angke.
            </p>

            {/* Steps */}
            <div className="grid gap-6 md:grid-cols-2 mt-4">
              {methodologySteps.map((step, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-5 border border-gray-200 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-2">{step.title}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Equipment & Metadata */}
        <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
          {/* Equipment */}
          <motion.div
            className="glass bg-white/90 dark:bg-gray-900 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-gray-700/50 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="p-8">
              <div className="flex items-center gap-2 mb-6">
                <FiTool className="text-emerald-600 dark:text-emerald-400" size={20} />
                <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">Standar Peralatan Lapangan</h3>
              </div>
              <ul className="space-y-3 text-xs text-gray-700 dark:text-gray-300">
                {equipmentItems.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Metadata */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-300">
                <FiMapPin size={18} />
                <h3 className="font-bold text-xs">Lokasi Pengamatan</h3>
              </div>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-normal">
                Mengacu secara akurat pada data koordinat spasial (geotagging) yang dikirim saat implementasi proyek restorasi mangrove.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-300">
                <FiClock size={18} />
                <h3 className="font-bold text-xs">Jadwal Pengukuran</h3>
              </div>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-normal">
                Dilakukan secara terjadwal berdasarkan parameter interval monitoring (biasanya bulan ke-3 dan bulan ke-6 sejak penanaman).
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-2 text-emerald-700 dark:text-emerald-300">
                <FiActivity size={18} />
                <h3 className="font-bold text-xs">Integritas Data</h3>
              </div>
              <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-normal">
                Setiap ronde data yang masuk divalidasi dan dihitung sidik jari kriptografisnya (*hash*) untuk dicatat ke Sepolia Testnet.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}