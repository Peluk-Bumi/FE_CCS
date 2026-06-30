import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  FiBookOpen, FiCheckCircle, FiActivity, FiShield, 
  FiUser, FiUsers, FiLock, FiSearch, FiArrowRight, 
  FiInfo, FiExternalLink, FiMapPin, FiTrendingUp 
} from "react-icons/fi";
import Footer from "@/shared/components/layout/Footer";
import { useTheme } from "@/app/context/ThemeContext";

export default function PanduanPengguna() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState("umum");

  const steps = [
    {
      title: "1. Perencanaan (Tanam)",
      desc: "Aktivis mengajukan rencana konservasi (mangrove atau terumbu karang) lengkap dengan koordinat lokasi, jumlah target, dan jenis spesies.",
      icon: FiBookOpen,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10"
    },
    {
      title: "2. Realisasi (Rawat)",
      desc: "Setelah disetujui, aktivitas penanaman dilaporkan ke sistem lengkap dengan dokumentasi foto dan data riil di lapangan.",
      icon: FiCheckCircle,
      color: "text-teal-500",
      bgColor: "bg-teal-500/10"
    },
    {
      title: "3. Pemantauan (Pantau)",
      desc: "Perkembangan bibit diukur secara berkala (tinggi batang, diameter, tingkat kelangsungan hidup) untuk menjamin transparansi keberhasilan restorasi.",
      icon: FiActivity,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10"
    }
  ];

  const roles = [
    {
      title: "Masyarakat Umum (Publik)",
      icon: FiUsers,
      desc: "Dapat mengakses dashboard statistik, memantau peta sebaran bibit secara real-time, melihat laporan keberhasilan restorasi, serta melakukan verifikasi integritas data ke blockchain secara gratis.",
      features: ["Verifikasi Transaksi Blockchain"]
    },
    {
      title: "Mitra Konservator (User)",
      icon: FiUser,
      desc: "Pihak lapangan atau komunitas yang melakukan aksi nyata. Memiliki hak untuk mengajukan usulan rencana, melaporkan realisasi penanaman, dan mengunggah data pemantauan berkala.",
      features: ["Membuat Usulan Proyek (Perencanaan)", "Melaporkan Aksi Tanam (Implementasi)", "Input Hasil Ukur Bibit (Monitoring)", "Verifikasi Transaksi Blockchain"]
    },
    {
      title: "Administrator Sistem",
      icon: FiLock,
      desc: "Mengelola akun pengguna, memvalidasi dan memverifikasi laporan dari konservator lapangan sebelum dicatatkan secara permanen ke dalam blockchain.",
      features: ["Manajemen Pengguna", "Verifikasi Lapangan", "Audit Transaksi Blockchain"]
    }
  ];

  return (
    <>
      <div className={`pt-24 min-h-screen max-md:pb-20 transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-green-950 via-gray-950 to-green-950 text-gray-100' 
          : 'bg-gradient-to-br from-primary/5 via-white to-primary/5 text-gray-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-medium text-sm mb-4"
            >
              <FiBookOpen className="w-4 h-4" />
              Pusat Panduan & Edukasi
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className={`text-4xl md:text-5xl font-bold mb-4 ${
                isDark ? 'text-white' : 'text-primary'
              }`}
            >
              Panduan Pengguna Peluk Bumi
            </motion.h1>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: 120 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-1.5 bg-gradient-to-r from-primary to-primary-dark mx-auto rounded-full mb-6"
            />
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className={`text-base sm:text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}
            >
              Selamat datang di pusat panduan Peluk Bumi. Pelajari cara menjelajahi data restorasi ekosistem mangrove dan karang serta bagaimana verifikasi blockchain menjamin keaslian setiap data.
            </motion.p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12">
            <div className={`flex p-1.5 rounded-2xl border ${
              isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-100/80 border-gray-200'
            }`}>
              {[
                { id: "umum", label: "Cara Kerja & Peran", icon: FiInfo },
                { id: "verifikasi", label: "Verifikasi Blockchain", icon: FiShield }
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                      isActive 
                        ? 'bg-primary text-white shadow-lg' 
                        : isDark 
                          ? 'text-gray-400 hover:text-white' 
                          : 'text-gray-600 hover:text-primary'
                    }`}
                  >
                    <TabIcon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4 }}
            className="mb-20"
          >
            {activeTab === "umum" ? (
              <div className="space-y-16">
                {/* Workflow Section */}
                <div>
                  <h2 className={`text-2xl md:text-3xl font-bold text-center mb-10 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Siklus Restorasi Peluk Bumi
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {steps.map((step, idx) => {
                      const Icon = step.icon;
                      return (
                        <motion.div
                          key={idx}
                          whileHover={{ y: -6 }}
                          className={`p-6 rounded-2xl border transition-all ${
                            isDark 
                              ? 'bg-gray-900/40 border-gray-800 hover:border-primary/30' 
                              : 'bg-white border-gray-200 hover:shadow-xl'
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${step.bgColor} ${step.color}`}>
                            <Icon className="w-6 h-6" />
                          </div>
                          <h3 className="text-lg font-semibold mb-3">{step.title}</h3>
                          <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {step.desc}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Roles Section */}
                <div>
                  <h2 className={`text-2xl md:text-3xl font-bold text-center mb-10 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Hak Akses & Peran Pengguna
                  </h2>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {roles.map((role, idx) => {
                      const Icon = role.icon;
                      return (
                        <motion.div
                          key={idx}
                          className={`p-8 rounded-2xl border flex flex-col ${
                            isDark 
                              ? 'bg-gray-900/20 border-gray-800' 
                              : 'bg-white border-gray-200 shadow-sm'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-3 mb-5">
                              <div className={`p-2.5 rounded-lg ${
                                isDark ? 'bg-primary/20 text-primary-light' : 'bg-primary/10 text-primary'
                              }`}>
                                <Icon className="w-5 h-5" />
                              </div>
                              <h3 className="font-bold text-lg">{role.title}</h3>
                            </div>
                            <p className={`text-sm leading-relaxed mb-6 min-h-[120px] sm:min-h-[100px] lg:min-h-[120px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {role.desc}
                            </p>
                          </div>
                          
                          <div className="border-t border-gray-100 dark:border-gray-800 pt-5 mt-5">
                            <h4 className="text-xs font-semibold uppercase tracking-wider mb-3 text-primary">
                              Fitur Utama:
                            </h4>
                            <ul className="space-y-2">
                              {role.features.map((feat, fIdx) => (
                                <li key={fIdx} className="flex items-center gap-2 text-xs">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                                  <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : (
              // Blockchain Guide Tab
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Left explanation */}
                <div className="lg:col-span-7 space-y-6">
                  <div className={`p-6 rounded-2xl border ${
                    isDark ? 'bg-emerald-950/20 border-emerald-900/30' : 'bg-emerald-50/50 border-emerald-100'
                  }`}>
                    <h3 className="text-xl font-bold flex items-center gap-2 text-primary mb-3">
                      <FiShield className="w-5 h-5" />
                      Mengapa Menggunakan Blockchain?
                    </h3>
                    <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Untuk menjamin bahwa data yang dilaporkan oleh pihak lapangan **tidak dimanipulasi** di kemudian hari demi kepentingan sepihak (seperti greenwashing). Setiap aksi perencanaan, penanaman, dan pengukuran bibit dicatat dalam Smart Contract di Blockchain. Data ini menjadi bukti permanen yang dapat diakses oleh publik.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-bold">Langkah-Langkah Melakukan Verifikasi:</h3>
                    
                    <div className="space-y-4">
                      {[
                        {
                          num: "1",
                          title: "Cari ID Kegiatan Konservasi",
                          desc: "Setiap proyek konservasi memiliki kode unik (ID Perencanaan). Anda dapat menemukannya di halaman daftar proyek atau melalui scan QR code papan informasi fisik di lokasi penanaman."
                        },
                        {
                          num: "2",
                          title: "Buka Halaman Verifikasi Publik",
                          desc: "Masuk ke halaman 'Verifikasi' di menu navigasi atas. Halaman ini menyediakan scanner QR code serta form pencarian berbasis ID proyek."
                        },
                        {
                          num: "3",
                          title: "Bandingkan Data Aplikasi vs Blockchain",
                          desc: "Sistem akan mengambil data dari server database lokal sekaligus memanggil Smart Contract blockchain. Anda dapat membandingkan kecocokan data seperti Target Jumlah, Lokasi Koordinat, dan Spesies."
                        },
                        {
                          num: "4",
                          title: "Audit Hash Transaksi di Explorer",
                          desc: "Setiap pencatatan menghasilkan Transaction Hash. Anda dapat mengklik link hash tersebut untuk dialihkan ke penjelajah blockchain pihak ketiga untuk memverifikasi blok dan waktu transaksi nyata."
                        }
                      ].map((step, idx) => (
                        <div key={idx} className="flex gap-4 items-start">
                          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold shrink-0 text-sm">
                            {step.num}
                          </div>
                          <div>
                            <h4 className="font-semibold text-sm mb-1">{step.title}</h4>
                            <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Visual Box */}
                <div className="lg:col-span-5">
                  <div className={`p-6 rounded-2xl border ${
                    isDark ? 'bg-gray-900/50 border-gray-800' : 'bg-white border-gray-200 shadow-lg'
                  }`}>
                    <h4 className="font-bold text-sm uppercase tracking-wider text-gray-500 mb-4 flex items-center gap-2">
                      <FiSearch className="w-4 h-4" /> Contoh Tampilan Verifikasi
                    </h4>
                    
                    <div className="space-y-4">
                      {/* Fake Verification Card */}
                      <div className={`p-4 rounded-xl border text-xs space-y-3 ${
                        isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
                      }`}>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
                          <span className="font-semibold text-primary">ID Proyek: PLAN-2026-004</span>
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 font-medium scale-90">Valid & Cocok</span>
                        </div>
                        
                        <div className="space-y-1.5">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Nama Spesies:</span>
                            <span className="font-medium">Rhizophora mucronata (Mangrove)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Jumlah Bibit:</span>
                            <span className="font-medium">250 Bibit</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Lokasi Koordinat:</span>
                            <span className="font-medium">-6.892, 107.610</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-gray-200 dark:border-gray-800 space-y-2">
                          <div className="text-[10px] text-gray-400">Hash Transaksi (Blockchain):</div>
                          <div className={`p-2 rounded font-mono text-[10px] truncate ${
                            isDark ? 'bg-black/50 text-emerald-400' : 'bg-gray-200/50 text-emerald-800'
                          }`}>
                            0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D
                          </div>
                          <a 
                            href="#/" 
                            onClick={(e) => e.preventDefault()} 
                            className="text-[10px] text-primary flex items-center gap-1 hover:underline justify-end"
                          >
                            Lihat di Etherscan <FiExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>

                      {/* Info Alert */}
                      <div className={`p-4 rounded-xl flex gap-3 items-start text-xs ${
                        isDark ? 'bg-primary/10 text-primary-light' : 'bg-primary/10 text-primary'
                      }`}>
                        <FiInfo className="w-4 h-4 shrink-0 mt-0.5" />
                        <p className="leading-relaxed">
                          Anda dapat mencoba fitur ini langsung dengan mengakses halaman <strong>Verifikasi</strong> di atas menggunakan kamera ponsel Anda untuk memindai kode QR.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>

          {/* Quick Actions/FAQ CTA */}
          <div className={`p-8 rounded-3xl border text-center relative overflow-hidden mb-12 ${
            isDark 
              ? 'bg-gradient-to-r from-emerald-950/40 via-gray-900/40 to-emerald-950/40 border-gray-800' 
              : 'bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border-primary/20'
          }`}>
            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <h3 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Masih memiliki pertanyaan terkait aplikasi?
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Kunjungi halaman FAQ (Pertanyaan yang Sering Diajukan) untuk jawaban atas pertanyaan teknis lainnya, atau hubungi kontak dukungan kami.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <a
                  href="/faqs"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary-dark shadow-md transition-all text-sm"
                >
                  Buka Halaman FAQ
                  <FiArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="/contact"
                  className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all border text-sm ${
                    isDark 
                      ? 'border-gray-700 hover:bg-gray-800 text-white' 
                      : 'border-gray-300 hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  Hubungi Hubungan Pelanggan
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
