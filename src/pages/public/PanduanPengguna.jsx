import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiBookOpen, FiCheckCircle, FiActivity, FiShield, 
  FiUser, FiUsers, FiLock, FiSearch, FiArrowRight, 
  FiInfo, FiExternalLink, FiCompass, FiCamera, 
  FiAlertTriangle, FiHelpCircle, FiSettings, 
  FiChevronDown, FiPlusCircle, FiCheck, FiImage
} from "react-icons/fi";
import Footer from "@/shared/components/layout/Footer";
import { useTheme } from "@/app/context/ThemeContext";
import { Input } from "@/shared/components/ui/input";
import { SidebarTabs } from "@/shared/components/ui/tabs";
import PageTitle from "@/shared/components/common/PageTitle";

// Simple Flowchart Component for Alur Ringkas
function Flowchart({ steps }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-6 px-4 my-4 overflow-x-auto rounded-2xl border bg-gray-50/50 dark:bg-gray-900/30 border-gray-100 dark:border-gray-800">
      {steps.map((step, idx) => (
        <React.Fragment key={idx}>
          <div className={`flex flex-col items-center p-4 rounded-xl border text-center shadow-sm max-w-[180px] w-full ${
            isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm mb-2">
              {idx + 1}
            </div>
            <span className="text-xs font-semibold">{step}</span>
          </div>
          {idx < steps.length - 1 && (
            <div className="flex items-center justify-center rotate-90 md:rotate-0 my-1 md:my-0 text-primary shrink-0">
              <FiArrowRight className="w-5 h-5" />
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

// Screenshot Placeholder / Image Loader
function Screenshot({ src, alt, title }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [hasError, setHasError] = useState(false);

  // In production/local web server, paths like '../public/screenshoot/LandingPage.png' 
  // map to '/screenshoot/LandingPage.png' in the public folder.
  const webSrc = src.replace('../public', '');

  return (
    <div className={`my-6 rounded-2xl border overflow-hidden transition-all ${
      isDark ? 'border-gray-800 bg-gray-950/40' : 'border-gray-200 bg-gray-50'
    }`}>
      <div className={`px-4 py-2.5 border-b flex items-center gap-2 text-xs font-semibold ${
        isDark ? 'bg-gray-900/60 border-gray-800 text-gray-400' : 'bg-gray-100/60 border-gray-200 text-gray-500'
      }`}>
        <FiImage className="w-4 h-4 text-primary" />
        <span>{title}</span>
      </div>
      
      <div className="relative min-h-[160px] md:min-h-[220px] flex items-center justify-center p-4">
        {hasError ? (
          <div className="text-center max-w-sm p-6">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
              <FiCamera className="w-6 h-6" />
            </div>
            <h5 className="text-sm font-bold mb-1">{alt}</h5>
            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Gambar ilustrasi akan muncul di sini jika file tersedia di path <code className="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-800 font-mono text-[10px]">{webSrc}</code>.
            </p>
          </div>
        ) : (
          <img 
            src={webSrc} 
            alt={alt} 
            onError={() => setHasError(true)}
            className="max-h-[350px] w-auto object-contain rounded shadow-md"
          />
        )}
      </div>
    </div>
  );
}

// Accordion for Troubleshooting / FAQ
function AccordionItem({ title, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={`border-b last:border-0 transition-colors ${
      isDark ? 'border-gray-800' : 'border-gray-200'
    }`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-4 flex justify-between items-center text-left font-semibold text-sm sm:text-base hover:text-primary transition-colors"
      >
        <span>{title}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FiChevronDown className="w-5 h-5" />
        </motion.div>
      </button>
      
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className={`pb-4 text-xs sm:text-sm leading-relaxed ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PanduanPengguna() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("tujuan");

  const sections = [
    { id: "tujuan", label: "1. Tujuan Dokumen" },
    { id: "ruang-lingkup", label: "2. Ruang Lingkup Pengguna" },
    { id: "struktur-menu", label: "3. Struktur Menu Aplikasi" },
    { id: "prasyarat", label: "4. Prasyarat Penggunaan" },
    { id: "prosedur", label: "5. Prosedur Penggunaan" },
    { id: "tips", label: "6. Tips Penggunaan" },
    { id: "troubleshooting", label: "7. Troubleshooting" }
  ];

  // Search filter
  const filteredSections = sections.filter(sec => 
    sec.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sidebarTabs = filteredSections.map((sec) => {
    let icon = FiBookOpen;
    if (sec.id === "tujuan") icon = FiCompass;
    else if (sec.id === "ruang-lingkup") icon = FiUsers;
    else if (sec.id === "struktur-menu") icon = FiSettings;
    else if (sec.id === "prasyarat") icon = FiShield;
    else if (sec.id === "prosedur") icon = FiActivity;
    else if (sec.id === "tips") icon = FiCheckCircle;
    else if (sec.id === "troubleshooting") icon = FiHelpCircle;

    return {
      key: sec.id,
      label: sec.label,
      icon: icon
    };
  });

  const handleScrollTo = (id) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      const offset = 90; // offset for navbar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Intersection observer to highlight active section in sidebar on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -60% 0px", // triggers when section is in the middle of the viewport
      threshold: 0
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    sections.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className={`pt-24 min-h-screen max-md:pb-20 transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-green-950 via-gray-950 to-green-950 text-gray-100' 
          : 'bg-gradient-to-br from-primary/5 via-white to-primary/5 text-gray-800'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
           {/* Header */}
           <PageTitle 
             badge="Manual Resmi Penggunaan" 
             badgeIcon={FiBookOpen}
             title="Panduan Penggunaan Aplikasi" 
             description={
               <>
                 Dokumen resmi panduan operasional aplikasi <strong>Peluk Bumi EMS</strong>. Temukan panduan akses, alur pencatatan data restorasi, hingga verifikasi blockchain.
               </>
             }
           />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
              {/* Search Box */}
              <div className="bg-white dark:bg-gray-800/40 p-4 sm:p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">Cari Panduan</h3>
                <Input
                  type="text"
                  placeholder="Cari bab panduan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  prefix={<FiSearch className="w-5 h-5 text-gray-400" />}
                  className="w-full bg-gray-50 dark:bg-gray-900/50"
                />
              </div>

              {/* Daftar Isi Tabs */}
              {sidebarTabs.length > 0 && (
                <div className="bg-white dark:bg-gray-800/40 p-2 sm:p-3 md:p-5 rounded-2xl border border-gray-100 dark:border-gray-700/50 shadow-sm">
                  <h3 className="hidden md:block text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 px-2">Daftar Isi</h3>
                  <SidebarTabs
                    tabs={sidebarTabs}
                    activeTab={activeSection}
                    onTabChange={handleScrollTo}
                  />
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div className={`lg:col-span-8 p-6 sm:p-8 rounded-3xl border space-y-16 ${
              isDark ? 'bg-gray-900/20 border-gray-800' : 'bg-white border-gray-200 shadow-sm'
            }`}>
              
              {/* 1. Tujuan Dokumen */}
              <section id="tujuan" className="scroll-mt-24 space-y-4">
                <h2 className={`text-xl sm:text-2xl font-bold flex items-center gap-2 border-b pb-3 ${
                  isDark ? 'text-white border-gray-800' : 'text-primary border-gray-100'
                }`}>
                  <FiCompass className="text-primary" />
                  1. Tujuan Dokumen
                </h2>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Dokumen ini merupakan panduan resmi penggunaan aplikasi **Peluk Bumi EMS**. Panduan ini disusun khusus untuk membantu pengguna publik, pengguna terdaftar (mitra lapangan), dan administrator dalam memahami alur kerja utama pada frontend aplikasi.
                </p>
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Panduan ini menjelaskan tata cara penggunaan fitur utama aplikasi, meliputi:</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                    {[
                      "Akses aplikasi dan login ke sistem",
                      "Pengisian data perencanaan (Tanam)",
                      "Pengisian data implementasi (Rawat)",
                      "Pengisian data monitoring (Pantau)",
                      "Pengisian data evaluasi akhir",
                      "Verifikasi QR Code fisik lapangan",
                      "Akses informasi monitoring publik"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <FiCheck className="text-primary shrink-0 w-4 h-4" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* 2. Ruang Lingkup Pengguna */}
              <section id="ruang-lingkup" className="scroll-mt-24 space-y-6">
                <h2 className={`text-xl sm:text-2xl font-bold flex items-center gap-2 border-b pb-3 ${
                  isDark ? 'text-white border-gray-800' : 'text-primary border-gray-100'
                }`}>
                  <FiUsers className="text-primary" />
                  2. Ruang Lingkup Pengguna
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Publik */}
                  <div className={`p-5 rounded-2xl border ${
                    isDark ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2.5 mb-3 text-primary">
                      <FiUsers className="w-5 h-5" />
                      <h3 className="font-bold text-sm sm:text-base">2.1 Pengguna Publik</h3>
                    </div>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Pengguna umum yang dapat membuka halaman utama, membaca informasi umum, memantau peta sebaran, dan melakukan verifikasi QR Code tanpa perlu mendaftar atau login.
                    </p>
                  </div>

                  {/* Terdaftar */}
                  <div className={`p-5 rounded-2xl border ${
                    isDark ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2.5 mb-3 text-primary">
                      <FiUser className="w-5 h-5" />
                      <h3 className="font-bold text-sm sm:text-base">2.2 Pengguna Terdaftar</h3>
                    </div>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Mitra konservator lapangan atau komunitas mitra. Dapat mengakses dashboard sesuai dengan hak aksesnya untuk menginput dan mengelola data kegiatan secara mandiri.
                    </p>
                  </div>

                  {/* Admin */}
                  <div className={`p-5 rounded-2xl border ${
                    isDark ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
                  }`}>
                    <div className="flex items-center gap-2.5 mb-3 text-primary">
                      <FiLock className="w-5 h-5" />
                      <h3 className="font-bold text-sm sm:text-base">2.3 Administrator</h3>
                    </div>
                    <p className={`text-xs sm:text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Tim internal pengelola sistem. Memiliki otoritas pengelolaan data yang lebih luas, termasuk validasi laporan lapangan dan audit data transaksi blockchain.
                    </p>
                  </div>
                </div>
              </section>

              {/* 3. Struktur Menu Aplikasi */}
              <section id="struktur-menu" className="scroll-mt-24 space-y-6">
                <h2 className={`text-xl sm:text-2xl font-bold flex items-center gap-2 border-b pb-3 ${
                  isDark ? 'text-white border-gray-800' : 'text-primary border-gray-100'
                }`}>
                  <FiSettings className="text-primary" />
                  3. Struktur Menu Aplikasi
                </h2>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  Setelah login berhasil dilakukan, menu utama navigasi aplikasi akan otomatis menyesuaikan dengan peran (*role*) masing-masing akun pengguna.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Menu Terdaftar/Admin */}
                  <div className={`p-5 rounded-2xl border ${
                    isDark ? 'bg-gray-900/30 border-gray-800' : 'bg-white border-gray-200 shadow-sm'
                  }`}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-4">
                      3.1 Menu Pengguna Terdaftar & Admin
                    </h4>
                    <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                      {[
                        "Dashboard", "Perencanaan", 
                        "Implementasi", "Monitoring", 
                        "Evaluasi", "Informasi Evaluasi", 
                        "Verifikasi", "Settings"
                      ].map((menu, idx) => (
                        <div key={idx} className={`p-2 rounded-xl flex items-center gap-2 border ${
                          isDark ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span>{menu}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Menu Publik */}
                  <div className={`p-5 rounded-2xl border ${
                    isDark ? 'bg-gray-900/30 border-gray-800' : 'bg-white border-gray-200 shadow-sm'
                  }`}>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-primary mb-4">
                      3.2 Menu Pengguna Publik
                    </h4>
                    <div className="grid grid-cols-1 gap-3 text-xs font-semibold">
                      {[
                        "Landing page (Informasi utama)", 
                        "Verifikasi publik (Scan QR & Pencarian ID)", 
                        "Monitoring access (Akses detail melalui tautan QR)"
                      ].map((menu, idx) => (
                        <div key={idx} className={`p-2.5 rounded-xl flex items-center gap-2 border ${
                          isDark ? 'bg-gray-950 border-gray-800' : 'bg-gray-50 border-gray-200'
                        }`}>
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          <span>{menu}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. Prasyarat Penggunaan */}
              <section id="prasyarat" className="scroll-mt-24 space-y-4">
                <h2 className={`text-xl sm:text-2xl font-bold flex items-center gap-2 border-b pb-3 ${
                  isDark ? 'text-white border-gray-800' : 'text-primary border-gray-100'
                }`}>
                  <FiShield className="text-primary" />
                  4. Prasyarat Penggunaan
                </h2>
                <p className="text-sm">Sebelum menggunakan aplikasi, harap pastikan beberapa hal teknis berikut terpenuhi:</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { title: "Koneksi Internet", desc: "Perangkat terhubung ke jaringan internet yang stabil untuk kelancaran sinkronisasi data." },
                    { title: "Dukungan Browser", desc: "Browser versi terbaru yang mendukung fitur kamera (WebRTC) dan pengunggahan file media." },
                    { title: "Akses Kamera Aktif", desc: "Izin kamera diberikan pada browser untuk memindai QR Code fisik di lokasi kegiatan." },
                    { title: "Kredensial Akun", desc: "Akun login telah terdaftar untuk masuk dan mengelola data di dashboard internal." }
                  ].map((item, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border flex gap-3 ${
                      isDark ? 'bg-gray-900/20 border-gray-800' : 'bg-gray-50 border-gray-150'
                    }`}>
                      <div className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                        ✓
                      </div>
                      <div>
                        <h4 className="text-xs sm:text-sm font-bold mb-1">{item.title}</h4>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 5. Prosedur Penggunaan Aplikasi */}
              <section id="prosedur" className="scroll-mt-24 space-y-12">
                <h2 className={`text-xl sm:text-2xl font-bold flex items-center gap-2 border-b pb-3 ${
                  isDark ? 'text-white border-gray-800' : 'text-primary border-gray-100'
                }`}>
                  <FiActivity className="text-primary" />
                  5. Prosedur Penggunaan Aplikasi
                </h2>

                {/* 5.1 Membuka Aplikasi */}
                <div className="space-y-3">
                  <h3 className="font-bold text-base sm:text-lg text-primary flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full shrink-0" />
                    5.1 Membuka Aplikasi
                  </h3>
                  <div className="pl-4 border-l border-gray-200 dark:border-gray-800 space-y-2 text-xs sm:text-sm">
                    <p>1. Buka alamat URL frontend aplikasi Peluk Bumi pada browser Anda.</p>
                    <p>2. Sistem akan menampilkan halaman utama (**Landing Page**) berisi ringkasan program dan statistik konservasi.</p>
                    <p>3. Pengguna umum dapat membaca informasi, memilih masuk ke dashboard, atau melakukan verifikasi data.</p>
                  </div>
                  <Screenshot src="../public/screenshoot/LandingPage.png" alt="Tampilan Landing Page" title="Ilustrasi 1: Landing Page Utama" />
                </div>

                {/* 5.2 Login ke Sistem */}
                <div className="space-y-3">
                  <h3 className="font-bold text-base sm:text-lg text-primary flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full shrink-0" />
                    5.2 Login ke Sistem
                  </h3>
                  <div className="pl-4 border-l border-gray-200 dark:border-gray-800 space-y-2 text-xs sm:text-sm">
                    <p>1. Klik tombol **Login** atau **Masuk** pada bagian pojok kanan atas Navbar.</p>
                    <p>2. Masukkan alamat email terdaftar dan kata sandi Anda.</p>
                    <p>3. Klik tombol masuk.</p>
                    <p>4. Sistem akan mengonfirmasi kecocokan data dan mengarahkan Anda ke halaman Dashboard internal.</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Screenshot src="../public/screenshoot/Login.png" alt="Tampilan Form Login" title="Ilustrasi 2: Form Login" />
                    <Screenshot src="../public/screenshoot/Dashboard.png" alt="Tampilan Dashboard" title="Ilustrasi 3: Dashboard Internal" />
                  </div>
                </div>

                {/* 5.3 Registrasi Akun */}
                <div className="space-y-3">
                  <h3 className="font-bold text-base sm:text-lg text-primary flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full shrink-0" />
                    5.3 Registrasi Akun
                  </h3>
                  <div className="pl-4 border-l border-gray-200 dark:border-gray-800 space-y-2 text-xs sm:text-sm">
                    <p>1. Klik tombol **Register** pada halaman login jika Anda belum memiliki akun.</p>
                    <p>2. Isi seluruh kolom form pendaftaran (Nama Lengkap, Username, Email, Kata Sandi, dll).</p>
                    <p>3. Klik tombol Simpan/Daftar.</p>
                    <p>4. Setelah notifikasi registrasi sukses muncul, silakan kembali ke halaman login.</p>
                  </div>
                  <Screenshot src="../public/screenshoot/Register.png" alt="Tampilan Form Registrasi" title="Ilustrasi 4: Form Registrasi Akun" />
                </div>

                {/* 5.4 Mengisi Data Perencanaan */}
                <div className="space-y-3">
                  <h3 className="font-bold text-base sm:text-lg text-primary flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full shrink-0" />
                    5.4 Mengisi Data Perencanaan
                  </h3>
                  <div className="pl-4 border-l border-gray-200 dark:border-gray-800 space-y-2 text-xs sm:text-sm">
                    <p>1. Buka menu **Perencanaan** di sidebar dashboard Anda.</p>
                    <p>2. Lengkapi detail kegiatan yang akan diusulkan (Nama program, koordinat, target bibit, spesies).</p>
                    <p>3. Pilih tanggal rencana pelaksanaan yang valid.</p>
                    <p>4. Klik simpan untuk mencatatkan rencana kerja.</p>
                  </div>
                  <div className={`p-4 rounded-xl text-xs flex gap-2 ${
                    isDark ? 'bg-emerald-950/20 text-emerald-400 border border-emerald-900/30' : 'bg-emerald-50 text-emerald-800 border border-emerald-100'
                  }`}>
                    <FiInfo className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <strong>Ketentuan Pengisian:</strong>
                      <ul className="list-disc pl-4 mt-1 space-y-1">
                        <li>Tanggal pelaksanaan tidak boleh diisi dengan tanggal sebelum hari ini (backdate ditolak).</li>
                        <li>Seluruh kolom wajib bertanda bintang harus terisi lengkap sebelum tombol simpan aktif.</li>
                      </ul>
                    </div>
                  </div>
                  <Flowchart steps={["Buka menu Perencanaan", "Isi data kegiatan", "Pilih tanggal valid", "Simpan data"]} />
                  <Screenshot src="../public/screenshoot/Perencanaan.png" alt="Tampilan Form Perencanaan" title="Ilustrasi 5: Form Perencanaan Kegiatan" />
                </div>

                {/* 5.5 Mengisi Data Implementasi */}
                <div className="space-y-3">
                  <h3 className="font-bold text-base sm:text-lg text-primary flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full shrink-0" />
                    5.5 Mengisi Data Implementasi
                  </h3>
                  <div className="pl-4 border-l border-gray-200 dark:border-gray-800 space-y-2 text-xs sm:text-sm">
                    <p>1. Buka menu **Implementasi** di dashboard.</p>
                    <p>2. Masukkan informasi detail pelaksanaan penanaman riil di lapangan.</p>
                    <p>3. Unggah berkas dokumentasi foto aksi nyata di lapangan.</p>
                    <p>4. Klik simpan data implementasi untuk diproses validasi oleh admin.</p>
                  </div>
                  <div className={`p-4 rounded-xl text-xs flex gap-2 ${
                    isDark ? 'bg-amber-950/20 text-amber-400 border border-amber-900/30' : 'bg-amber-50 text-amber-800 border border-amber-100'
                  }`}>
                    <FiAlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <strong>Ketentuan Unggahan Dokumentasi:</strong>
                      <ul className="list-disc pl-4 mt-1 space-y-1">
                        <li>Format file yang didukung: JPG, JPEG, PNG.</li>
                        <li>Ukuran file maksimal per gambar diatur sesuai batas sistem (biasanya 2MB - 5MB).</li>
                        <li>Jumlah file dokumentasi dibatasi sesuai instruksi form.</li>
                      </ul>
                    </div>
                  </div>
                  <Flowchart steps={["Buka menu Implementasi", "Isi detail pelaksanaan", "Upload dokumentasi", "Simpan data implementasi"]} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Screenshot src="../public/screenshoot/Implementasi.png" alt="Tampilan Form Implementasi 1" title="Ilustrasi 6: Form Implementasi Kegiatan" />
                    <Screenshot src="../public/screenshoot/Implementasi2.png" alt="Tampilan Form Implementasi 2" title="Ilustrasi 7: Upload Dokumentasi" />
                  </div>
                </div>

                {/* 5.6 Mengisi Data Monitoring */}
                <div className="space-y-3">
                  <h3 className="font-bold text-base sm:text-lg text-primary flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full shrink-0" />
                    5.6 Mengisi Data Monitoring
                  </h3>
                  <div className="pl-4 border-l border-gray-200 dark:border-gray-800 space-y-2 text-xs sm:text-sm">
                    <p>1. Buka menu **Monitoring** untuk mencatat perkembangan bibit berkala.</p>
                    <p>2. Isi hasil pengukuran lapangan (Tinggi tanaman, diameter batang, jumlah bibit hidup/mati).</p>
                    <p>3. Unggah dokumentasi berkas perkembangan fisik bibit.</p>
                    <p>4. Simpan laporan hasil monitoring berkala.</p>
                  </div>
                  <Flowchart steps={["Buka menu Monitoring", "Isi hasil pengamatan", "Upload dokumentasi", "Simpan data monitoring"]} />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Screenshot src="../public/screenshoot/Monitoring.png" alt="Tampilan Form Monitoring 1" title="Ilustrasi 8: Form Input Monitoring" />
                    <Screenshot src="../public/screenshoot/Monitoring2.png" alt="Tampilan Form Monitoring 2" title="Ilustrasi 9: Input Hasil Pengukuran" />
                    <Screenshot src="../public/screenshoot/Monitoring3.png" alt="Tampilan Form Monitoring 3" title="Ilustrasi 10: Validasi Upload Foto" />
                  </div>
                </div>

                {/* 5.7 Mengisi Data Evaluasi */}
                <div className="space-y-3">
                  <h3 className="font-bold text-base sm:text-lg text-primary flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full shrink-0" />
                    5.7 Mengisi Data Evaluasi
                  </h3>
                  <div className="pl-4 border-l border-gray-200 dark:border-gray-800 space-y-2 text-xs sm:text-sm">
                    <p>1. Buka menu **Evaluasi**.</p>
                    <p>2. Isi ringkasan hasil evaluasi dan tingkat keberhasilan restorasi secara keseluruhan berdasarkan data berkala.</p>
                    <p>3. Simpan data evaluasi akhir.</p>
                  </div>
                  <div className={`p-4 rounded-xl text-xs flex gap-2 ${
                    isDark ? 'bg-blue-950/20 text-blue-400 border border-blue-900/30' : 'bg-blue-50 text-blue-800 border border-blue-100'
                  }`}>
                    <FiInfo className="w-4 h-4 shrink-0 mt-0.5" />
                    <p>
                      Untuk mempelajari metode pengamatan dan parameter kesehatan ekosistem secara teoretis, Anda dapat membuka menu **Informasi Evaluasi**. Halaman tersebut menyajikan pedoman umum yang tidak terikat pada lokasi tertentu.
                    </p>
                  </div>
                  <Flowchart steps={["Buka menu Evaluasi", "Isi hasil evaluasi", "Simpan hasil evaluasi"]} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Screenshot src="../public/screenshoot/Evaluasi.png" alt="Tampilan Form Evaluasi 1" title="Ilustrasi 11: Form Evaluasi" />
                    <Screenshot src="../public/screenshoot/Evaluasi2.png" alt="Tampilan Form Evaluasi 2" title="Ilustrasi 12: Parameter Kondisi Kesehatan" />
                  </div>
                </div>

                {/* 5.8 Verifikasi QR Code */}
                <div className="space-y-6">
                  <h3 className="font-bold text-base sm:text-lg text-primary flex items-center gap-2">
                    <span className="w-1.5 h-6 bg-primary rounded-full shrink-0" />
                    5.8 Verifikasi QR Code
                  </h3>
                  <p className="text-sm">Fitur verifikasi digunakan publik untuk membaca QR Code fisik di lapangan lalu membandingkan kesesuaian data lokal dengan kontrak pintar di Blockchain.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
                    <div className={`p-5 rounded-2xl border ${
                      isDark ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <h4 className="font-bold text-primary mb-3">A. Verifikasi Menggunakan Kamera</h4>
                      <ol className="list-decimal pl-4 space-y-1">
                        <li>Buka menu **Verifikasi** di navbar atas.</li>
                        <li>Izinkan browser mengakses kamera perangkat Anda.</li>
                        <li>Arahkan kamera ke QR Code di papan informasi lokasi.</li>
                        <li>Tunggu hingga pemindaian sukses dilakukan.</li>
                        <li>Sistem otomatis memunculkan modal detail laporan.</li>
                      </ol>
                    </div>

                    <div className={`p-5 rounded-2xl border ${
                      isDark ? 'bg-gray-900/30 border-gray-800' : 'bg-gray-50 border-gray-200'
                    }`}>
                      <h4 className="font-bold text-primary mb-3">B. Verifikasi Menggunakan Unggahan Gambar</h4>
                      <ol className="list-decimal pl-4 space-y-1">
                        <li>Buka menu **Verifikasi**.</li>
                        <li>Klik atau seret file gambar QR Code ke area unggahan.</li>
                        <li>Pilih file foto dari penyimpanan perangkat.</li>
                        <li>Sistem akan memproses berkas gambar secara otomatis.</li>
                        <li>Modal detail audit data blockchain akan langsung ditampilkan.</li>
                      </ol>
                    </div>
                  </div>

                  <div className={`p-5 rounded-2xl border ${
                    isDark ? 'bg-gray-900/30 border-gray-800' : 'bg-white border-gray-250 shadow-sm'
                  }`}>
                    <h4 className="font-bold text-sm text-primary mb-3">C. Informasi yang Tampil pada Modal Verifikasi</h4>
                    <p className="text-xs sm:text-sm mb-3">Ketika QR Code berhasil dibaca, sistem akan mencocokkan data dan menampilkan:</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {[
                        "Ringkasan profil kegiatan restorasi",
                        "Tahapan pelaksanaan saat ini (Plan/Realized/Monitored)",
                        "Spesifikasi data perencanaan dan bibit",
                        "Status validitas kecocokan data server vs blockchain",
                        "Transaction Hash (TX Hash) bukti audit blockchain",
                        "Ringkasan nilai indeks keberhasilan evaluasi"
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <Flowchart steps={["Buka menu Verifikasi", "Scan QR atau upload gambar", "QR terbaca", "Modal detail laporan tampil"]} />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Screenshot src="../public/screenshoot/Verifikasi.png" alt="Halaman Verifikasi" title="Ilustrasi 13: Halaman Pemindai QR" />
                    <Screenshot src="../public/screenshoot/Verifikasi2.png" alt="Modal Detail Hasil Scan" title="Ilustrasi 14: Modal Laporan Terverifikasi Blockchain" />
                  </div>
                </div>
              </section>

              {/* 6. Tips Penggunaan */}
              <section id="tips" className="scroll-mt-24 space-y-4">
                <h2 className={`text-xl sm:text-2xl font-bold flex items-center gap-2 border-b pb-3 ${
                  isDark ? 'text-white border-gray-800' : 'text-primary border-gray-100'
                }`}>
                  <FiCheckCircle className="text-primary" />
                  6. Tips Penggunaan
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  {[
                    "Pastikan koneksi internet Anda stabil demi kelancaran pengiriman data koordinat lokasi.",
                    "Berikan izin akses kamera pada browser saat pertama kali membuka menu Verifikasi.",
                    "Lakukan pemindaian di area terang agar QR Code pada papan fisik terbaca dengan cepat.",
                    "Gunakan file gambar berkualitas baik jika Anda melakukan verifikasi via unggahan file.",
                    "Periksa kembali batas ukuran dan format file foto sebelum mengunggah dokumentasi kegiatan."
                  ].map((tip, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border flex gap-3 items-start ${
                      isDark ? 'bg-gray-900/30 border-gray-800' : 'bg-white border-gray-200'
                    }`}>
                      <span className="w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 font-bold text-xs">
                        {idx + 1}
                      </span>
                      <p className={isDark ? 'text-gray-300' : 'text-gray-600'}>{tip}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* 7. Troubleshooting Singkat */}
              <section id="troubleshooting" className="scroll-mt-24 space-y-4">
                <h2 className={`text-xl sm:text-2xl font-bold flex items-center gap-2 border-b pb-3 ${
                  isDark ? 'text-white border-gray-800' : 'text-primary border-gray-100'
                }`}>
                  <FiHelpCircle className="text-primary" />
                  7. Troubleshooting Singkat
                </h2>
                
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  <AccordionItem title="Kamera Tidak Aktif atau Tidak Terdeteksi">
                    Periksa kembali pengaturan izin (*permissions*) kamera pada browser Anda untuk memastikan situs diizinkan mengakses kamera. Muat ulang (*reload*) halaman verifikasi. Pastikan tidak ada aplikasi atau tab lain yang sedang menggunakan kamera secara bersamaan.
                  </AccordionItem>
                  
                  <AccordionItem title="QR Code Tidak Terbaca">
                    Pastikan posisi kamera fokus, lensa bersih, dan kode QR tidak terlalu jauh atau buram. Jika melakukan verifikasi dengan unggahan gambar, pastikan foto QR Code memiliki resolusi yang cukup tinggi dan tidak terpotong.
                  </AccordionItem>
                  
                  <AccordionItem title="File Unggahan Ditolak">
                    Pastikan format file berupa `.png`, `.jpg`, atau `.jpeg`. Periksa juga ukuran berkas agar tidak melebihi batas maksimal (biasanya 2MB atau 5MB per file) serta jumlah total file tidak melebihi batas yang ditentukan di dalam form.
                  </AccordionItem>
                  
                  <AccordionItem title="Data Tidak Tampil Setelah Pengisian">
                    Pastikan Anda telah masuk menggunakan akun dengan peran (*role*) yang tepat. Lakukan *refresh* halaman browser. Jika data tetap tidak tampil setelah beberapa saat, silakan hubungi administrator untuk pengecekan status sinkronisasi server database.
                  </AccordionItem>
                </div>
              </section>

              {/* Penutup */}
              <div className={`p-6 rounded-2xl text-center border ${
                isDark ? 'bg-gray-950/40 border-gray-800' : 'bg-gray-50 border-gray-150'
              }`}>
                <p className={`text-xs sm:text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  Manual resmi penggunaan sistem **Peluk Bumi EMS**. Dokumen teknis lainnya dapat diakses pada folder <code className="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-800 font-mono">docs/</code> di direktori proyek Anda.
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
