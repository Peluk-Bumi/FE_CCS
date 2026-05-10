import React from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";
import Footer from "@/layouts/partials/Footer";
import Navbar from "@/layouts/partials/Navbar";
import PageTitle from "@/shared/components/PageTitle";

export default function License() {
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
          title="Lisensi"
          description="Informasi lisensi dan penggunaan platform CCS sesuai dengan ketentuan yang berlaku"
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
              Platform Peluk Bumi dikembangkan sebagai bagian dari inisiatif penelitian konservasi yang sedang bertumbuh. Lisensi ini mengatur penggunaan sistem dan data yang terkait dalam konteks membangun kepercayaan melalui aksi nyata dan transparansi.
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
              Lisensi Software
            </h2>
            <p className="leading-relaxed mb-4">
              Kode sumber Peluk Bumi dilisensikan untuk tujuan mendukung transparansi dan validasi berbasis aksi:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Penelitian dan pengembangan konservasi</li>
              <li>Pendidikan dan pelatihan</li>
              <li>Penggunaan non-komersial yang sesuai dengan tujuan inisiatif</li>
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
              Data yang dikumpulkan melalui platform Peluk Bumi dapat digunakan untuk tujuan penelitian, monitoring, dan pengembangan sistem dengan tetap menjaga privasi dan hak pengguna sesuai kebijakan yang berlaku. Semua penggunaan data diarahkan untuk membangun kepercayaan melalui keterbukaan.
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
              Atribusi
            </h2>
            <p className="leading-relaxed">
              Penggunaan platform, kode, atau data Peluk Bumi untuk publikasi atau presentasi harus mencantumkan atribusi yang sesuai terhadap inisiatif Peluk Bumi dan institusi pendukung. Kami menghargai kolaborasi awal yang membentuk fondasi gerakan ini.
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
              Batasan
            </h2>
            <p className="leading-relaxed mb-4">
              Penggunaan platform tidak diperbolehkan untuk:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Tujuan komersial tanpa izin tertulis</li>
              <li>Aktivitas yang bertentangan dengan tujuan konservasi</li>
              <li>Modifikasi yang menghilangkan atribusi atau integritas data</li>
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
              Kontak untuk Lisensi Khusus
            </h2>
            <p className="leading-relaxed">
              Untuk penggunaan komersial atau lisensi khusus, silakan hubungi kami melalui email: info@pelukbumi.org
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
            Lisensi ini akan terus berkembang seiring dengan pertumbuhan inisiatif Peluk Bumi. Kami menampilkan perjalanan, bukan simulasi skala, dan lisensi ini akan diperbarui untuk mencerminkan evolusi yang dapat diamati.
          </p>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
