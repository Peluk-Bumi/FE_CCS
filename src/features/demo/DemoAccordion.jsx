import React from "react"
import { motion } from "framer-motion"
import { Accordion } from "@/shared/components/ui/accordion"
import { FiActivity, FiShield, FiAlertCircle, FiSettings } from "react-icons/fi"

export default function AccordionDemo() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-12 pb-24">
      {/* Header */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          Accordion
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
          Komponen panel yang bisa diperluas dan disembunyikan (collapsible) untuk mengorganisir konten dengan ruang terbatas. Dilengkapi animasi smooth dengan Framer Motion.
        </p>
      </motion.div>

      {/* Basic Example */}
      <section className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Basic Accordion</h2>
          <p className="text-sm text-gray-500 mt-1">Accordion sederhana dengan teks saja.</p>
        </div>

        <div className="grid gap-4 max-w-2xl">
          <Accordion title="Apa itu sistem ini?">
            <p className="text-gray-600 dark:text-gray-400">
              Sistem ini adalah platform manajemen data berbasis web yang dilengkapi dengan teknologi blockchain untuk transparansi laporan.
            </p>
          </Accordion>
          <Accordion title="Apakah data saya aman?">
            <p className="text-gray-600 dark:text-gray-400">
              Ya, kami menerapkan standar keamanan tinggi dengan enkripsi end-to-end dan pencatatan audit secara real-time.
            </p>
          </Accordion>
        </div>
      </section>

      {/* With Icons Example */}
      <section className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Dengan Icon</h2>
          <p className="text-sm text-gray-500 mt-1">Gunakan properti `icon` untuk menambahkan ilustrasi fungsi accordion.</p>
        </div>

        <div className="grid gap-4 max-w-2xl">
          <Accordion title="Pengaturan Keamanan" icon={FiShield}>
            <p className="text-gray-600 dark:text-gray-400">
              Ubah password secara berkala dan aktifkan autentikasi 2 langkah untuk melindungi akun Anda dari akses tidak sah.
            </p>
          </Accordion>
          <Accordion title="Monitoring Aktivitas" icon={FiActivity}>
            <p className="text-gray-600 dark:text-gray-400">
              Pantau seluruh aktivitas pengguna dan laporan transaksi harian di panel analitik utama Anda.
            </p>
          </Accordion>
        </div>
      </section>

      {/* Default Open Example */}
      <section className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Default Open</h2>
          <p className="text-sm text-gray-500 mt-1">Gunakan properti `defaultOpen={true}` agar accordion langsung terbuka saat pertama kali dirender.</p>
        </div>

        <div className="grid gap-4 max-w-2xl">
          <Accordion title="Informasi Penting" icon={FiAlertCircle} defaultOpen={true}>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 p-4 rounded-xl text-sm border border-yellow-200 dark:border-yellow-800/50">
              <p className="font-semibold mb-1">Jadwal Maintenance</p>
              <p>Sistem akan mengalami pemeliharaan rutin pada hari Minggu, pukul 02:00 - 04:00 WIB.</p>
            </div>
          </Accordion>
        </div>
      </section>
      
      {/* Custom Content Example */}
      <section className="space-y-6">
        <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Custom Content</h2>
          <p className="text-sm text-gray-500 mt-1">Accordion dapat berisi komponen apapun di dalamnya (grid, form, gambar, dll).</p>
        </div>

        <div className="grid gap-4 max-w-2xl">
          <Accordion title="Konfigurasi Lanjutan" icon={FiSettings}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Mode Tampilan</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Dark Mode Aktif</p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                  <p className="text-xs text-gray-500 font-semibold mb-1 uppercase tracking-wider">Bahasa</p>
                  <p className="font-medium text-gray-900 dark:text-gray-100">Indonesia (ID)</p>
                </div>
              </div>
              <button className="w-full py-2 bg-primary/10 hover:bg-primary/20 text-primary font-medium rounded-xl transition-colors">
                Simpan Perubahan
              </button>
            </div>
          </Accordion>
        </div>
      </section>
    </div>
  )
}
