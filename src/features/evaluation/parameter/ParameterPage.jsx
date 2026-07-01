import { motion } from "framer-motion";
import { FiBarChart2, FiActivity, FiHeart, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import PageTitle from "@/shared/components/common/PageTitle";
import { useAuth } from "@/app/context/AuthContext";
import navigationConfig from "@/app/config/navigationConfig";
import { PageTabs } from "@/shared/components/ui/tabs";

const conditionItems = [
  {
    label: "Sangat Sehat (Excellent / BAIK)",
    color: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
    description: "Program berjalan sukses optimal menuju ekosistem referensi. Nilai Akhir Evaluasi (NA) ≥ 4.0. Standar keberhasilan tutupan vegetasi wajar dan survival rate kumulatif tinggi.",
    icon: FiHeart,
  },
  {
    label: "Sehat (Good / SEDANG)",
    color: "bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-300 border-green-200 dark:border-green-800",
    description: "Program menunjukkan hasil vegetatif memadai tetapi memiliki beberapa kendala teknis/pertumbuhan. Nilai Akhir 3.0 ≤ NA < 4.0. Rekomendasi: melakukan perbaikan atau penyulaman pada area dengan indikator rendah.",
    icon: FiActivity,
  },
  {
    label: "Kurang Sehat (Warning / BURUK)",
    color: "bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-300 border-amber-200 dark:border-amber-800",
    description: "Program kurang berjalan secara ekologis atau fisik tanah masih labil. Nilai Akhir 2.0 ≤ NA < 3.0. Diperlukan pengulangan program pemulihan sebagian dan pembinaan intensif pelaksana lapangan.",
    icon: FiAlertTriangle,
  },
  {
    label: "Kritis (Critical / GAGAL)",
    color: "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-300 border-red-200 dark:border-red-800",
    description: "Program tidak berjalan secara ekologis, tingkat kelangsungan hidup rendah, atau memicu dampak kerusakan ekologis baru. Nilai Akhir NA < 2.0. Memerlukan pengulangan pelaksanaan program secara total.",
    icon: FiBarChart2,
  },
];

const scoringWeights = [
  {
    kriteria: "Stabilitas Lanskap (SL)",
    bobot: "90%",
    deskripsi: "Mengukur kondisi fisik-biologis vegetasi penanaman di lapangan. Terdiri dari 3 parameter utama:",
    details: [
      "1. Cumulative Survival Rate (Tingkat Kelangsungan Hidup Kumulatif)",
      "2. Tinggi Vegetasi Akhir (Tinggi Bibit di Periode Terakhir)",
      "3. Kesehatan Daun (Persentase Daun Sehat Bebas Kerusakan/Penyakit)"
    ]
  },
  {
    kriteria: "Efisiensi Program (EP)",
    bobot: "10%",
    deskripsi: "Mengukur tren keberhasilan pemeliharaan dan konsistensi kelangsungan hidup tanaman antar periode monitoring.",
    details: [
      "Menggunakan Delta (Δ) Survival Rate Periode Terakhir vs Periode Pertama untuk melihat efisiensi program."
    ]
  },
  {
    kriteria: "Fleksibilitas Program (FP)",
    bobot: "0% (Parameter Kontrol)",
    deskripsi: "Menilai aspek pemanfaatan dan kepedulian masyarakat sekitar untuk kontrol jangka panjang (tidak mempengaruhi skor evaluasi akhir)."
  }
];

const parameterItems = [
  {
    title: "Cumulative Survival Rate (SL - 1)",
    description: "Persentase total bibit yang masih hidup di akhir periode monitoring dibandingkan dengan jumlah bibit awal yang ditanam saat implementasi. Ini menggunakan prinsip ekologi progresif (bibit yang mati tidak bisa hidup kembali).",
    formula: "Cumulative SR = (Jumlah Bibit Hidup Akhir / Jumlah Bibit Awal Ditanam) × 100%",
    thresholds: [
      "Skor 5: Cumulative SR > 80% (Kondisi Ideal)",
      "Skor 3: Cumulative SR 60% – 80% (Kondisi Sedang)",
      "Skor 1: Cumulative SR < 60% (Kondisi Buruk)"
    ]
  },
  {
    title: "Tinggi Vegetasi Akhir (SL - 2)",
    description: "Rata-rata tinggi tanaman pada ronde/periode monitoring terakhir yang menggambarkan pertumbuhan fisik aktual. Threshold disesuaikan dengan bibit mangrove propagule khas Taman Wisata Alam (TWA) Angke.",
    formula: "Tinggi Akhir = Rata-rata Tinggi Tanaman pada Ronde Terakhir (cm)",
    thresholds: [
      "Skor 5: Tinggi > 40 cm (Pertumbuhan Baik/Optimal)",
      "Skor 3: Tinggi 20 cm – 40 cm (Pertumbuhan Wajar/Awal)",
      "Skor 1: Tinggi < 20 cm (Pertumbuhan Terhambat)"
    ]
  },
  {
    title: "Kondisi Kesehatan Daun (SL - 3)",
    description: "Rata-rata persentase daun sehat di seluruh periode monitoring. Dihitung berdasarkan indikator kerusakan daun (mengering, layu, menguning, bercak, serangga) dari data input range persentase.",
    formula: "% Daun Sehat per Ronde = 100 - Rata-rata % Kerusakan Daun (midpoint range)",
    thresholds: [
      "Skor 5: Rata-rata Daun Sehat > 80%",
      "Skor 3: Rata-rata Daun Sehat 60% – 80%",
      "Skor 1: Rata-rata Daun Sehat < 60%"
    ]
  },
  {
    title: "Tren Keberhasilan Pemeliharaan (EP - 1)",
    description: "Menilai kestabilan program dengan mengamati perubahan (delta) survival rate antar periode monitoring dari ronde awal hingga ronde akhir.",
    formula: "Delta SR Periode = SR Periode Terakhir - SR Periode Pertama",
    thresholds: [
      "Skor 5: Delta SR ≥ +5% (Program Pemeliharaan Semakin Efisien)",
      "Skor 3: Delta SR di antara -5% s/d +5% (Kondisi Stabil)",
      "Skor 1: Delta SR ≤ -5% (Penurunan Kualitas Penanaman Signifikan)"
    ]
  }
];

export default function ParameterPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  return (
    <div className="py-6 md:py-12">
      <PageTitle
        type="page"
        badge="Parameter Kondisi"
        badgeIcon={FiBarChart2}
        title="Parameter Kondisi Kesehatan"
        description="Informasi lengkap parameter ekologi, pembobotan nilai akhir, dan kategori kondisi kesehatan tanaman pemulihan ekosistem"
      />

      {/* Sub-navigation tabs — mobile only, sidebar handles desktop */}
      <div className="md:hidden mb-4">
        <PageTabs tabs={navigationConfig.getEvaluationMenuItems(isAdmin)} />
      </div>

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Bobot Section */}
        <motion.div
          className="glass bg-white/90 dark:bg-gray-900 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-gray-700/50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-8 md:p-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <FiActivity className="text-emerald-600 dark:text-emerald-400" />
              Sistem Pembobotan & Rumus Nilai Akhir (NA)
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Sesuai dengan <strong>Perdirjen KSDAE No. P.13/2015</strong>, tingkat keberhasilan pemulihan dihitung menggunakan pembobotan nilai rata-rata dari kriteria-kriteria berikut:
            </p>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
              {scoringWeights.map((item, idx) => (
                <div key={idx} className="bg-emerald-50/50 dark:bg-emerald-950/10 rounded-2xl p-5 border border-emerald-100 dark:border-emerald-900/30 flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-semibold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider">Kriteria</span>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base mt-1">{item.kriteria}</h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{item.deskripsi}</p>
                    {item.details && (
                      <ul className="mt-3 space-y-1 text-[11px] text-gray-700 dark:text-gray-300 list-none">
                        {item.details.map((detail, dIdx) => (
                          <li key={dIdx} className="leading-relaxed">• {detail}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div className="mt-4 pt-3 border-t border-emerald-100 dark:border-emerald-900/20 flex justify-between items-center">
                    <span className="text-xs text-gray-500">Bobot Evaluasi:</span>
                    <span className="text-lg font-black text-emerald-700 dark:text-emerald-400">{item.bobot}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-5 bg-emerald-900 text-white rounded-2xl border border-emerald-800 font-mono text-center shadow-inner">
              <span className="text-xs opacity-75 block mb-1">FORMULA EVALUASI OTOMATIS:</span>
              <span className="text-sm md:text-base font-bold tracking-wide">
                Nilai Akhir (NA) = (Rata-rata Skor SL × 90%) + (Skor EP × 10%)
              </span>
            </div>
          </div>
        </motion.div>

        {/* Parameter Section */}
        <motion.div
          className="glass bg-white/90 dark:bg-gray-900 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-gray-700/50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="p-8 md:p-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
              <FiCheckCircle className="text-emerald-600 dark:text-emerald-400" />
              Detail Parameter & Kriteria Skor (1, 3, 5)
            </h2>
            <div className="grid gap-6">
              {parameterItems.map((item, idx) => (
                <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-base">{item.title}</h3>
                    <span className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 px-3 py-1 rounded-full text-xs font-semibold self-start md:self-auto">
                      Skor Diskrit: 1, 3, 5
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">{item.description}</p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                      <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">Rumus Perhitungan</span>
                      <div className="font-mono text-xs text-gray-800 dark:text-gray-200 mt-1 select-all">{item.formula}</div>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
                      <span className="text-[10px] uppercase font-bold text-emerald-600 tracking-wider">Kriteria Ambang Batas (Threshold)</span>
                      <ul className="mt-1 space-y-1 text-xs text-gray-700 dark:text-gray-300">
                        {item.thresholds.map((t, tIdx) => (
                          <li key={tIdx} className="leading-normal flex items-start gap-1">
                            <span className="text-emerald-500">•</span>
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Conditions Section */}
        <motion.div
          className="glass bg-white/90 dark:bg-gray-900 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 dark:border-gray-700/50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-8 md:p-10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 flex items-center gap-2">
              <FiHeart className="text-emerald-600 dark:text-emerald-400" />
              Kategori Keberhasilan Akhir
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Nilai Akhir (NA) berada pada skala 1.0 s/d 5.0. Penamaan kategori disesuaikan secara resmi dengan regulasi tanpa istilah bebas:
            </p>
            <div className="grid gap-4">
              {conditionItems.map((item, idx) => (
                <div key={idx} className={`rounded-2xl p-5 border transition-all hover:translate-x-1 ${item.color}`}>
                  <div className="flex items-start gap-4">
                    <div className="mt-1 p-2 bg-white/80 dark:bg-gray-800 rounded-xl shadow-sm">
                      <item.icon size={20} className="text-emerald-700 dark:text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-1">{item.label}</h3>
                      <p className="text-xs leading-relaxed opacity-90">{item.description}</p>
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
