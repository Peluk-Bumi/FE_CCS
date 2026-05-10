import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";
import Footer from "@/layouts/partials/Footer";
import Navbar from "@/layouts/partials/Navbar";
import PageTitle from "@/shared/components/PageTitle";

export default function PrivacyPolicy() {
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
          title="Kebijakan Privasi"
          description="Komitmen kami dalam melindungi data pribadi dan menjaga transparansi dalam penggunaan informasi"
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
              Peluk Bumi adalah gerakan lingkungan yang sedang bertumbuh, menghubungkan aksi nyata di lapangan dengan sistem data dan transparansi berbasis teknologi. Dalam konteks inisiatif penelitian dan pengembangan sistem monitoring konservasi ini, kami berkomitmen untuk melindungi privasi pengguna sesuai prinsip transparansi dan kejelasan proses yang kami pegang.
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
              Pengumpulan Data
            </h2>
            <p className="leading-relaxed mb-4">
              Kami mengumpulkan data yang diperlukan untuk mendukung transparansi proses dan validasi berbasis aksi:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Pencatatan aktivitas konservasi di lapangan</li>
              <li>Monitoring dan verifikasi data ekosistem</li>
              <li>Peningkatan kualitas sistem dan layanan</li>
              <li>Komunikasi terkait inisiatif penelitian</li>
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
              Penggunaan Data
            </h2>
            <p className="leading-relaxed">
              Data yang dikumpulkan digunakan secara transparan untuk tujuan monitoring konservasi, penelitian, dan pengembangan sistem. Kami tidak menjual data kepada pihak ketiga. Semua penggunaan data diarahkan untuk membangun kepercayaan melalui keterbukaan dan jejak aktivitas yang dapat ditelusuri.
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
              Keamanan Data
            </h2>
            <p className="leading-relaxed">
              Kami menerapkan teknologi blockchain dan enkripsi untuk memastikan integritas dan keamanan data. Setiap pencatatan data dapat ditelusuri dan diverifikasi, sesuai dengan prinsip kami bahwa setiap perubahan harus bisa ditelusuri dari proses di lapangan.
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
              Hak Pengguna
            </h2>
            <p className="leading-relaxed mb-4">
              Sebagai bagian dari komitmen transparansi, pengguna memiliki hak untuk:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Mengakses data pribadi yang disimpan</li>
              <li>Meminta koreksi data yang tidak akurat</li>
              <li>Meminta penghapusan data sesuai ketentuan yang berlaku</li>
              <li>Menarik persetujuan penggunaan data</li>
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
              Kontak
            </h2>
            <p className="leading-relaxed">
              Untuk pertanyaan terkait kebijakan privasi, silakan hubungi kami melalui email: info@pelukbumi.org
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
            Kebijakan privasi ini akan terus berkembang seiring dengan pertumbuhan inisiatif Peluk Bumi. Kami menampilkan perjalanan, bukan simulasi skala, dan kebijakan ini akan diperbarui untuk mencerminkan evolusi yang dapat diamati.
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
