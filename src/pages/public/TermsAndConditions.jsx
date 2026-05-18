import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";
import Footer from "@/shared/components/layout/Footer";
import Navbar from "@/shared/components/layout/Navbar";
import PageTitle from "@/shared/components/common/PageTitle";

export default function TermsAndConditions() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen transition-colors ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-green-950 via-gray-950 to-green-950'
        : 'bg-gradient-to-br from-primary/10 via-white to-primary/10'
    }`}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <PageTitle
          type="section"
          theme={theme}
          badge="Legal"
          title="Syarat & Ketentuan"
          description="Kerangka kerja kolaborasi dalam gerakan yang sedang bertumbuh melalui aksi nyata dan transparansi"
          subtitle="Terakhir diperbarui: Januari 2025"
        />

        <motion.div
          className={`space-y-8 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <section className={`p-6 rounded-2xl border ${
            theme === 'dark'
              ? 'bg-green-950/35 border-green-800/40'
              : 'bg-white/85 border-primary/20'
          }`}>
            <h2 className={`text-xl font-semibold mb-4 transition-colors ${
              theme === 'dark' ? 'text-primary-light' : 'text-primary'
            }`}>
              Pendahuluan
            </h2>
            <p className="leading-relaxed">
              Syarat dan ketentuan ini mengatur penggunaan platform Peluk Bumi sebagai bagian dari inisiatif penelitian konservasi. Sebagai gerakan yang sedang bertumbuh, kami menyadari bahwa model kerja kami masih berkembang berdasarkan respons lapangan. Dengan menggunakan platform ini, Anda menyetujui untuk menjadi bagian dari perjalanan ini.
            </p>
          </section>

          <section className={`p-6 rounded-2xl border ${
            theme === 'dark'
              ? 'bg-green-950/35 border-green-800/40'
              : 'bg-white/85 border-primary/20'
          }`}>
            <h2 className={`text-xl font-semibold mb-4 transition-colors ${
              theme === 'dark' ? 'text-primary-light' : 'text-primary'
            }`}>
              Penggunaan Platform
            </h2>
            <p className="leading-relaxed mb-4">
              Platform Peluk Bumi digunakan untuk mendukung transparansi proses dan validasi berbasis aksi:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Pencatatan aktivitas konservasi</li>
              <li>Monitoring data ekosistem</li>
              <li>Verifikasi informasi lapangan</li>
              <li>Kolaborasi dengan stakeholder penelitian</li>
            </ul>
          </section>

          <section className={`p-6 rounded-2xl border ${
            theme === 'dark'
              ? 'bg-green-950/35 border-green-800/40'
              : 'bg-white/85 border-primary/20'
          }`}>
            <h2 className={`text-xl font-semibold mb-4 transition-colors ${
              theme === 'dark' ? 'text-primary-light' : 'text-primary'
            }`}>
              Tanggung Jawab Pengguna
            </h2>
            <p className="leading-relaxed mb-4">
              Dalam semangat membangun kepercayaan melalui aksi nyata, pengguna bertanggung jawab untuk:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Memberikan informasi yang akurat dan jujur</li>
              <li>Menghormati privasi dan hak pengguna lain</li>
              <li>Tidak menggunakan platform untuk aktivitas ilegal</li>
              <li>Mengikuti pedoman etika penelitian yang berlaku</li>
            </ul>
          </section>

          <section className={`p-6 rounded-2xl border ${
            theme === 'dark'
              ? 'bg-green-950/35 border-green-800/40'
              : 'bg-white/85 border-primary/20'
          }`}>
            <h2 className={`text-xl font-semibold mb-4 transition-colors ${
              theme === 'dark' ? 'text-primary-light' : 'text-primary'
            }`}>
              Data dan Konten
            </h2>
            <p className="leading-relaxed">
              Data yang dicatat di platform Peluk Bumi akan disimpan dengan teknologi blockchain untuk memastikan integritas dan transparansi. Setiap klaim memiliki jejak aktivitas di lapangan yang dapat ditelusuri. Pengguna memahami bahwa data yang dikumpulkan dapat digunakan untuk tujuan penelitian dan pengembangan sistem.
            </p>
          </section>

          <section className={`p-6 rounded-2xl border ${
            theme === 'dark'
              ? 'bg-green-950/35 border-green-800/40'
              : 'bg-white/85 border-primary/20'
          }`}>
            <h2 className={`text-xl font-semibold mb-4 transition-colors ${
              theme === 'dark' ? 'text-primary-light' : 'text-primary'
            }`}>
              Batasan Tanggung Jawab
            </h2>
            <p className="leading-relaxed">
              Peluk Bumi menyediakan platform sebagaimana adanya dalam konteks inisiatif penelitian yang sedang berkembang. Kami tidak menampilkan diri sebagai sesuatu yang sudah selesai. Kami tidak bertanggung jawab atas kerugian yang timbul dari penggunaan platform di luar tujuan yang dimaksud.
            </p>
          </section>

          <section className={`p-6 rounded-2xl border ${
            theme === 'dark'
              ? 'bg-green-950/35 border-green-800/40'
              : 'bg-white/85 border-primary/20'
          }`}>
            <h2 className={`text-xl font-semibold mb-4 transition-colors ${
              theme === 'dark' ? 'text-primary-light' : 'text-primary'
            }`}>
              Perubahan Ketentuan
            </h2>
            <p className="leading-relaxed">
              Kami berhak mengubah syarat dan ketentuan ini seiring berkembangnya inisiatif. Perubahan akan diumumkan melalui platform kami sebagai bagian dari komitmen transparansi kami.
            </p>
          </section>
        </motion.div>

        <motion.div
          className={`mt-12 p-6 rounded-2xl border ${
            theme === 'dark'
              ? 'bg-green-950/35 border-green-800/40'
              : 'bg-white/85 border-primary/20'
          }`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <p className={`text-sm ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Dengan menggunakan platform Peluk Bumi, Anda mengakui bahwa Anda telah membaca, memahami, dan menyetujui syarat dan ketentuan ini. Kami membangun sesuatu yang bisa dipertanggungjawabkan sejak hari pertama.
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}


