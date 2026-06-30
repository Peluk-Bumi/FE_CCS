# FE_CCS Riwayat Perubahan

Semua perubahan penting pada aplikasi frontend FE_CCS.

## [Unreleased]

---

## [v2.0.0] - 2026-07-01

### Ditambahkan
- **Layanan Intelijen ESG (ESG Analytics)**: Dashboard visualisasi analitik terpadu.
  - `src/features/intelligence/components/SurvivalRateChart.jsx` - Line chart tren survival rate per ronde.
  - `src/features/intelligence/components/ESGScoreChart.jsx` - Doughnut chart skor ESG.
  - `src/features/intelligence/components/IntelligenceReport.jsx` - Halaman monitoring utama dengan ESG score, tren survival, dan deteksi anomali.
- **Ronde Pemantauan Dinamis (Dynamic Monitoring)**:
  - Form perencanaaan (`PlanningForm.jsx`) dan form monitoring (`MonitoringForm.jsx`) diperbarui untuk mendukung perhitungan target ronde pemantauan dinamis (durasi proyek / interval monitoring).
  - Validasi penanganan data realisasi aktual dalam form pemantauan.

### Diubah & Direfaktor
- **Overhaul Layout & Navigasi Mobile**:
  - Peningkatan layout visual responsif sidebar (`Sidebar.jsx`), navbar (`Navbar.jsx`), header (`MobileHeader.jsx`), dan tab navigation (`BottomTabBar.jsx`).
  - Penambahan Floating Action Button (FAB) adaptif dan bottom sheet untuk perangkat ber-notch.
  - Implementasi komponen visual tabs, modal, dan accordion terstandarisasi.
- **Kompabilitas Integrasi Blockchain**:
  - Dukungan pemetaan kata kunci bahasa Indonesia (`PERENCANAAN`/`PLANNING`, `IMPLEMENTASI`/`IMPLEMENTATION`, `VERIFIKASI`/`VERIFICATION`) untuk pemanggilan method smart contract.
  - Pengaktifan kembali widget status debugging blockchain (`BlockchainDebug.jsx`) di `App.jsx`, dan perbaikan visual widget untuk merujuk pada `walletStatus.status`.

### Dokumentasi
- Mengubah `README.md` menjadi dokumentasi overview sistem terpusat.
- Menambahkan audit kepatuhan 7 layer (`docs/SEVEN_LAYER_ALIGNMENT.md`).

### Pengarsipan & Depresiasi (Pembersihan)
- Memindahkan berkas Hardhat (`hardhat.config.js`), smart contract lama (`contracts/`), script replace (`rewrite.js`), serta 22 berkas markdown laporan usang dari root folder ke `/archive/FE_CCS/` untuk kebutuhan audit berkala.
- Membersihkan package dependensi dengan menghapus `"hardhat"`, `"@nomicfoundation/hardhat-ethers"`, serta menghapus scripts build/deploy smart contract dari `package.json`.

---

## [v1.5.0] - 2026-05-19

### Ditambahkan
- **Mobile UI Enhancement**: Mobile experience improvements
  - `src/shared/components/ui/navigation/MobileHeader.jsx` - Sticky header dengan back button & page title
  - `src/shared/components/ui/navigation/BottomTabBar.jsx` - Bottom navigation untuk dashboard
  - `src/layouts/VerificationFullscreenLayout.jsx` - Fullscreen layout untuk verification pages
  - `src/shared/utils/showBlockchainDebug.js` - Debug utility untuk blockchain

- **Mobile Navigation Features**:
  - Context-aware page titles & subtitles untuk setiap route
  - Smart back button (conditional visibility)
  - Logo button untuk quick navigation ke landing page
  - Dynamic bottom tabs berdasarkan user role (admin/user)
  - Active state indicator dengan smooth animations
  - Menu tab untuk full navigation sheet
  - Safe area support untuk notch devices

- **Mobile Layouts**:
  - DashboardLayout: Integrated mobile header + bottom tab bar
  - VerificationFullscreenLayout: Fullscreen untuk verification pages
  - Responsive design dengan mobile-first approach
  - Proper padding untuk bottom tab bar (pb-20)

- **Responsive Design**:
  - Mobile-first approach dengan responsive breakpoints
  - Touch-optimized components (44px+ touch targets)
  - Full dark mode support di semua mobile components
  - Smooth animations dengan Framer Motion

- **Accessibility**:
  - WCAG AA compliant
  - ARIA labels pada semua interactive elements
  - Keyboard navigation support
  - Screen reader compatible
  - Proper color contrast

### Diubah
- **Navigation Configuration**: Update `navigationConfig.js` dengan `getMobileTabs()` method
- **All Pages**: Updated dengan MobileHeader integration
  - AdminDashboardPage: Mobile layout optimization
  - RegisterPage: Mobile form optimization
  - LandingPage: Responsive hero section
  - About: Mobile-friendly content
  - VerificationPage: Fullscreen layout

- **Components**: Updated untuk mobile responsiveness
  - Navbar: Mobile menu integration
  - Footer: Mobile spacing & responsive grid
  - HeroSection: Responsive design
  - CTASection: Mobile-friendly CTA layout
  - StatsSection: Responsive stats grid
  - CTAButton: Touch-optimized
  - FloatingSheetTrigger: Mobile sheet trigger

- **Styling**: Mobile-first CSS approach
  - Tailwind breakpoints (md: 768px)
  - Responsive padding & spacing
  - Dark mode support
  - Touch-friendly interactions

### Dokumentasi
- Tambah `MOBILE_UI_UPDATE_DOCUMENTATION.md` - Technical documentation
- Tambah `COMMIT_PLAN.md` - Detailed commit breakdown
- Tambah `MOBILE_CHANGES_SUMMARY.md` - Visual summary
- Tambah `MOBILE_FEATURES_DETAILED.md` - Deep dive ke features
- Tambah `DEPLOYMENT_CHECKLIST.md` - Step-by-step deployment
- Tambah `EXECUTION_SUMMARY.md` - Quick overview
- Tambah `README_DOCUMENTATION.md` - Navigation guide
- Tambah `START_HERE.md` - Entry point untuk deployment

### Teknis
- Lazy loading untuk mobile components
- Memoization untuk optimized renders
- Smooth 60fps animations dengan Framer Motion
- Optimized CSS dengan Tailwind
- Minimal re-renders dengan React.forwardRef
- Enhanced error handling & accessibility

### Performance
- Optimized bundle size
- Lazy loading components
- Efficient CSS-in-JS
- Smooth animations (60fps)
- Minimal re-renders

---

## [v1.4.0] - 2026-05-11

### Ditambahkan
- **Arsitektur Terpusat**: Sistem konfigurasi dan utilities yang terstruktur
  - `src/config/blockchainConfig.js` - Konfigurasi blockchain terpusat dengan validasi
  - `src/shared/constants/activityColors.js` - Shared activity colors dan UI constants
  - `src/shared/factories/providerFactory.js` - Provider factory dengan error handling
  - `src/shared/guards/securityGuard.js` - Security guards untuk validasi
  - `src/shared/utils/validation.js` - Validation utilities terpusat

- **Error Handling Komprehensif**: Error boundaries dan state management
  - `src/features/blockchain/components/BlockchainErrorBoundary.jsx` - Error boundary untuk blockchain components
  - `src/features/blockchain/components/BlockchainErrorState.jsx` - Error state UI yang konsisten
  - `src/features/blockchain/hooks/useBlockchainState.js` - State management hook untuk blockchain

### Diperbaiki
- **ReportsPage**: Perbaikan error download dengan endpoint API yang benar
  - Fix 404 error dengan menggunakan `/perencanaan/{id}/public` endpoint
  - Update ID mapping menggunakan `parent_perencanaan_id`
  - Tambah debug logging untuk transaction history dan API responses
  - Perbaiki error handling dan user feedback

- **Blockchain Configuration**: Update konfigurasi ke Sepolia testnet
  - Ganti hardcoded chain ID 137 dengan 11155111 (Sepolia)
  - Update explorer URLs ke sepolia.etherscan.io
  - Fix token symbol display (ETH untuk Sepolia, MATIC untuk Polygon)
  - Pastikan semua komponen menggunakan `VITE_BLOCKCHAIN_*` environment variables

- **PDF Generation**: Perbaikan mapping data blockchain dan logika progress
  - Fix blockchain data structure mapping (`item.blockchain.doc_hash`)
  - Update progress logic menggunakan `activity_type` bukan keberadaan data
  - Perbaiki monitoring data parsing untuk nested structures
  - Tambah debug logging untuk verifikasi struktur data

- **Visual Consistency**: Peningkatan konsistensi visual komponen blockchain
  - Update BlockchainStatus untuk match design patterns WalletIndicator
  - Implement gradient backgrounds dan spacing yang konsisten
  - Tambah proper dark mode support dan hover effects
  - Standardisasi button styling dan animations

- **QR Scanner & Verification**: Perbaikan infinite processing dan timeout handling
  - Fix infinite "Sedang memproses..." state di QRScanner
  - Improve timeout handling dan error recovery
  - Better URL detection sebelum JSON parsing
  - Enhanced error messaging untuk user feedback

### Diubah
- **Refactoring Arsitektur**: Restrukturisasi ke pola yang lebih modular
  - Ekstrak shared utilities ke folder terpisah
  - Centralisasi konfigurasi blockchain
  - Improve code organization dan maintainability
  - Standardisasi error handling patterns

- **Performance Optimizations**: Peningkatan performa dan user experience
  - Optimasi polling interval untuk real-time updates (10 detik)
  - Better state management untuk blockchain components
  - Improved caching dan data validation
  - Enhanced error recovery mechanisms

- **Dashboard & UI**: Peningkatan visual dan fungsionalitas
  - Update AdminDashboardPage dengan shared activity colors
  - Improve activity display dengan proper formatting
  - Better responsive design dan mobile experience
  - Enhanced loading states dan error handling

### Teknis
- Enhanced error handling untuk semua blockchain operations
- Improved debugging capabilities dengan comprehensive logging
- Better data validation dan type checking
- Optimized performance untuk real-time updates
- Standardized API error handling dan user feedback
- Improved security validations dan input sanitization

---

## [v1.3.0] - 2026-05-10

### Ditambahkan
- Restrukturisasi arsitektur frontend dengan pola berbasis fitur (feature-based)
- Sistem dokumentasi komprehensif (API, Architecture, Deployment, Folder Structure)
- Aset partnership dan logo mitra
- Halaman legal baru (License, Privacy Policy, Terms & Conditions)
- Komponen modular dengan organisasi yang lebih baik
- Layout system baru dengan partials dan common components

### Diubah
- Migrasi dari struktur berbasis komponen ke berbasis fitur
- Reorganisasi folder pages menjadi domain logis (auth, dashboard, evaluation, reporting)
- Pembaruan routing dan konfigurasi untuk struktur baru
- Peningkatan modularitas komponen untuk mengurangi kompleksitas kode
- Standardisasi struktur file dan naming convention
- Update versi aplikasi ke v1.3.0 di seluruh komponen

### Direfaktor
- Ekstrak komponen ke dalam folder fitur yang sesuai
- Pemisahan concerns antara layout, features, dan shared utilities
- Optimasi struktur untuk skalabilitas dan maintainability

### Dokumentasi
- Penambahan dokumentasi arsitektur lengkap
- Panduan struktur folder untuk pengembang
- Dokumentasi API endpoint
- Panduan deployment dan konfigurasi

---

## [v1.2.0] - 2026-05-09

### Ditambahkan
- Sistem evaluasi dan verifikasi komprehensif dengan UI/UX yang ditingkatkan
- Dukungan file HEIC dan video dengan preview media yang lebih baik
- Polling real-time, konfigurasi dan integrasi halaman
- Fitur ringkasan monitoring dan narasi read-only
- Halaman 404 dan fungsi idle reload di App
- Utilitas pembuatan PDF dan dokumentasi evaluasi
- Field tinggi_bibit di form monitoring dengan preview PDF
- Caching user dan penyempurnaan perilaku loading
- Timeout request dashboard dan penanganan fallback
- Fitur auto-compute survival di dashboard

### Diubah
- Berpindah ke jaringan blockchain Polygon Amoy
- Centralisasi konfigurasi API dan variabel lingkungan
- Pembaruan konfigurasi URL API untuk produksi
- Refactor UI Dashboard admin dengan integrasi Infura
- Memindahkan tombol Dashboard ke menu user
- Peningkatan manajemen state Navbar dan perilaku scrolling
- Modernisasi desain UI di seluruh landing page dan komponen
- Pembaruan nama proyek dan branding
- Peningkatan fungsionalitas redirect monitoring

### Diperbaiki
- Perbaikan destructuring useState di komponen Navbar
- Perbaikan bug di halaman laporan dan User Interface
- Perbaikan modal Verifikasi dengan timeout lebih cepat untuk endpoint publik
- Penambahan blockchain fallback untuk verifikasi
- Perbaikan berbagai bug UI dan masalah manajemen state
- Penyelesaian masalah caching statistik dashboard dan progress laporan

### Direfaktor
- Refactor modal PDF/QR dan ekstrak utilitas pembuatan PDF
- Refactor inisialisasi konteks blockchain dan penanganan error
- Penyederhanaan perhitungan progress laporan
- Ekstrak komponen dan utilitas yang dapat digunakan kembali

### Dihapus
- Penghapusan file .env dari git tracking untuk keamanan
- Penghapusan tombol kontak dari interface
- Pembersihan komponen terkait kamera

### Dokumentasi
- Penambahan dokumentasi evaluasi komprehensif
- Pembaruan metadata proyek dan informasi package
- Penambahan konfigurasi build dengan build.mjs

---

## [v1.2.0] - 2026-05-09

### Ditambahkan
- Sistem evaluasi dan verifikasi komprehensif dengan UI/UX yang ditingkatkan
- Dukungan file HEIC dan video dengan preview media yang lebih baik
- Polling real-time, konfigurasi dan integrasi halaman
- Fitur ringkasan monitoring dan narasi read-only
- Halaman 404 dan fungsi idle reload di App
- Utilitas pembuatan PDF dan dokumentasi evaluasi
- Field tinggi_bibit di form monitoring dengan preview PDF
- Caching user dan penyempurnaan perilaku loading
- Timeout request dashboard dan penanganan fallback
- Fitur auto-compute survival di dashboard

### Diubah
- Berpindah ke jaringan blockchain Polygon Amoy
- Centralisasi konfigurasi API dan variabel lingkungan
- Pembaruan konfigurasi URL API untuk produksi
- Refactor UI Dashboard admin dengan integrasi Infura
- Memindahkan tombol Dashboard ke menu user
- Peningkatan manajemen state Navbar dan perilaku scrolling
- Modernisasi desain UI di seluruh landing page dan komponen
- Pembaruan nama proyek dan branding
- Peningkatan fungsionalitas redirect monitoring

### Diperbaiki
- Perbaikan destructuring useState di komponen Navbar
- Perbaikan bug di halaman laporan dan User Interface
- Perbaikan modal Verifikasi dengan timeout lebih cepat untuk endpoint publik
- Penambahan blockchain fallback untuk verifikasi
- Perbaikan berbagai bug UI dan masalah manajemen state
- Penyelesaian masalah caching statistik dashboard dan progress laporan

### Direfaktor
- Refactor modal PDF/QR dan ekstrak utilitas pembuatan PDF
- Refactor inisialisasi konteks blockchain dan penanganan error
- Penyederhanaan perhitungan progress laporan
- Ekstrak komponen dan utilitas yang dapat digunakan kembali

### Dihapus
- Penghapusan file .env dari git tracking untuk keamanan
- Penghapusan tombol kontak dari interface
- Pembersihan komponen terkait kamera

### Dokumentasi
- Penambahan dokumentasi evaluasi komprehensif
- Pembaruan metadata proyek dan informasi package
- Penambahan konfigurasi build dengan build.mjs

---

## [v1.1.7] - 2026-05-06

### Ditambahkan
- Realtime polling, config dan page integrations
- Update artifacts, hardhat config, dan dependencies

### Diperbaiki
- Update fixing bug pada laporan page dan User Interface
- Add monitoring redirect dan fix Navbar state
- Also fix incorrect useState destructuring di Navbar

---

## [v1.1.6] - 2026-05-04

### Diubah
- Update Name dan Logo
- Update artifacts, hardhat config, dan dependencies

---

## [v1.1.5] - 2026-05-02

### Diubah
- Update UI copy, theming, footer & navbar tweaks

### Dihapus
- Remove contact button dan add camera cleanup

---

## [v1.1.4] - 2026-04-28

### Ditambahkan
- Cache dashboard stats; simplify report progress
- Add user cache dan refine loading behavior
- Add dashboard request timeout dan fallback handling
- Improve dashboard UI & auto-compute survival

### Diubah
- Integrasi Infura dan refactor admin Dashboard UI
- Pembaruan UI dashboard dan penyederhanaan report progress

### Diperbaiki
- Perbaikan bug dashboard UI dan auto-compute survival
- Penambahan timeout request dan fallback handling
- Perbaikan caching user dan penyempurnaan loading behavior

---

## [v1.1.3] - 2026-04-25

### Diubah
- Switch to Polygon Amoy dan update blockchain UI
- Centralize API config dan update envs
- Update env agar otomatis

---

## [v1.1.2] - 2026-04-22

### Ditambahkan
- Add tinggi_bibit ke monitoring form & PDF preview
- Update VITE_API_URL untuk production environment

### Diubah
- Centralisasi konfigurasi API dan pembaruan environment

---

## [v1.1.1] - 2026-04-20

### Ditambahkan
- Add Evaluasi page dan integrate ke app
- Add Evaluasi feature, docs dan PDF utils
- Add 404 page dan idle reload di App
- Refactor PDF/QR modals dan extract PDF builder
- Filter by progress stage; hide used perencanaan
- Use Etherscan URL untuk QR jika tx hash exists
- Enhance LaporanPage: PDF/ZIP, QR logo & rate-limit

### Diubah
- Berpindah ke jaringan Polygon Amoy dan pembaruan UI blockchain
- Pembaruan URL API untuk environment produksi
- Centralisasi konfigurasi API dan pembaruan environment

### Diperbaiki
- Perbaikan bug umum

### Direfaktor
- Refactor modal PDF/QR dan ekstrak PDF builder
- Refactor inisialisasi konteks blockchain dan penanganan error

---

## [v1.1.0] - 2026-04-18

### Ditambahkan
- Add Evaluasi feature, docs dan PDF utils
- Add Evaluasi page dan integrate ke app

### Diubah
- Berpindah ke jaringan Polygon Amoy dan pembaruan UI blockchain

---

## [v1.0.10] - 2026-04-16

### Ditambahkan
- Add Evaluasi page dan integrate ke app
- Add 404 page dan idle reload di App

### Direfaktor
- Refactor PDF/QR modals dan extract PDF builder

---

## [v1.0.9] - 2026-04-15

### Ditambahkan
- Add 404 page dan idle reload di App
- Refactor PDF/QR modals dan extract PDF builder

---

## [v1.0.8] - 2026-04-14

### Ditambahkan
- Filter by progress stage; hide used perencanaan
- Use Etherscan URL untuk QR jika tx hash exists
- Enhance LaporanPage: PDF/ZIP, QR logo & rate-limit

### Diperbaiki
- Fix bug

---

## [v1.0.7] - 2026-04-13

### Ditambahkan
- Add build.mjs dan use it di npm build
- Move Vite plugin ke deps dan add vite

### Diubah
- UPDATE META DATA
- Pembaruan package.json dan metadata proyek
- Pemindahan tombol Dashboard ke menu user; penyesuaian UI

### Direfaktor
- Refactor blockchain context init dan error handling

### Diperbaiki
- Perbaikan build aplikasi frontend
- Perbaikan umum

---

## [v1.0.6] - 2026-04-12

### Diubah
- Update: redesign user interface agar lebih modern
- Update: UI lebih modern dengan styling yang ditingkatkan
- Update: nav dan Foot menyesuaikan modern landingpage
- Update: ubah ke kotak message dropdown bawah tombol
- Update: atur default view peta jadi level Indonesia (zoom nasional)
- Update: sinkronkan semua label/status terkait TX hash
- Update: isi halaman settings jadi halaman Update Profile yang lengkap
- Update: build up aplikasi frontend

### Ditambahkan
- Build up aplikasi frontend dengan konfigurasi baru

### Diperbaiki
- Perbaikan umum pada UI dan UX

---

## [v1.0.5] - 2025-12-02

### Ditambahkan
- Add loading skeletons dan improvements ke Verifikasi modal
- Improve Verifikasi: faster timeout untuk public endpoint, immediate blockchain fallback

### Diperbaiki
- Perbaikan bug pada verifikasi modal dan timeout handling
- Penambahan blockchain fallback untuk verifikasi
- Perbaikan berbagai bug UI dan state management

---

## [v1.0.4] - 2025-11-28

### Diperbaiki
- Fix
- Fixxxxx
- Perbaikan umum

---

## [v1.0.3] - 2025-11-26

### Diperbaiki
- Perbaikan bug wallet dan laporan
- Perbaikan umum

---

## [v1.0.2] - 2025-11-24

### Ditambahkan
- Update laporan dan verifikasi
- Update UI implementasi dan monitoring

### Diubah
- Update semuanya

### Diperbaiki
- Perbaikan umum

---

## [v1.0.1] - 2025-11-05

### Ditambahkan
- Update verifikasi dan loading
- Update UI dashboard, implementasi, monitoring, dan perencanaan

### Diubah
- Update fitur dan UI
- Update Dashboard.jsx

### Diperbaiki
- Benerin bug
- Fix update
- Done - 1


---

## [v1.1.1] - 2026-04-20

### Ditambahkan
- Field tinggi_bibit di form monitoring dengan preview PDF
- Sistem Evaluasi dengan dokumentasi dan utilitas PDF
- Halaman Evaluasi dan integrasi ke aplikasi
- Peningkatan LaporanPage: PDF/ZIP, QR logo & rate-limit
- Filter berdasarkan tahap progress; sembunyikan perencanaan yang digunakan
- Penggunaan Etherscan URL untuk QR jika tx hash ada

### Diubah
- Pembaruan URL API untuk environment produksi
- Berpindah ke jaringan Polygon Amoy dan pembaruan UI blockchain
- Centralisasi konfigurasi API dan pembaruan environment

### Diperbaiki
- Perbaikan bug umum
- Perbaikan bug di halaman laporan dan User Interface
- Perbaikan modal Verifikasi dengan timeout lebih cepat untuk endpoint publik
- Penambahan blockchain fallback untuk verifikasi
- Perbaikan berbagai bug UI dan masalah manajemen state
- Penyelesaian masalah caching statistik dashboard dan progress laporan

### Direfaktor
- Refactor modal PDF/QR dan ekstrak utilitas pembuatan PDF
- Refactor inisialisasi konteks blockchain dan penanganan error
- Penyederhanaan perhitungan progress laporan
- Ekstrak komponen dan utilitas yang dapat digunakan kembali

### Dihapus
- Penghapusan file .env dari git tracking untuk keamanan
- Penghapusan tombol kontak dari interface
- Pembersihan komponen terkait kamera

### Dokumentasi
- Penambahan dokumentasi evaluasi komprehensif
- Pembaruan metadata proyek dan informasi package
- Penambahan konfigurasi build dengan build.mjs

---

## [v1.0.0] - 2025-11-04

### Ditambahkan
- Rilis awal Peluk Bumi CCS Frontend
- Aplikasi berbasis React lengkap dengan sistem build Vite
- Sistem autentikasi dan otorisasi
- Dashboard dengan kemampuan monitoring
- Integrasi blockchain untuk transparansi
- Pembuatan PDF dan fungsionalitas kode QR
- Peta interaktif dengan integrasi Leaflet
- UI modern dengan Tailwind CSS dan komponen Material-UI
- Desain responsif untuk mobile dan desktop
- Update data real-time dan caching
- Penanganan form komprehensif dengan Formik
- Visualisasi chart dengan Chart.js
- Konfigurasi berbasis environment
- Integrasi Hardhat untuk deployment smart contract

### Fitur
- **Autentikasi**: Login, register, dan route terproteksi
- **Dashboard**: Monitoring real-time dan statistik
- **Monitoring**: Pelacakan pertumbuhan tanaman dan visualisasi data
- **Perencanaan**: Alat perencanaan dan manajemen proyek
- **Implementasi**: Pelacakan implementasi proyek
- **Pelaporan**: Pelaporan komprehensif dengan export PDF
- **Verifikasi**: Sistem verifikasi berbasis blockchain
- **Peta**: Visualisasi geografis interaktif
- **Blockchain**: Integrasi Ethereum/Polygon untuk integritas data

### Stack Teknis
- React 19.1.1 dengan hooks dan fitur modern
- Vite 5.4.21 untuk development dan build cepat
- Tailwind CSS 3.4.18 untuk styling
- Material-UI 7.3.1 untuk library komponen
- Ethers.js 6.15.0 untuk interaksi blockchain
- Leaflet 1.9.4 untuk fungsionalitas pemetaan
- Chart.js 4.5.1 untuk visualisasi data
- Formik 2.4.6 untuk manajemen form
- Axios 1.11.0 untuk komunikasi API

---

## Ringkasan Evolusi Proyek

### Fase 1: Fondasi (Agustus 2025)
- Setup proyek awal dengan React dan Vite
- Sistem autentikasi dan routing dasar
- Komponen UI inti dan struktur layout
- Integrasi dengan API backend

### Fase 2: Pengembangan Fitur (September - Oktober 2025)
- Implementasi dashboard dengan data real-time
- Modul monitoring dan perencanaan
- Integrasi blockchain untuk transparansi
- Pembuatan PDF dan fungsionalitas export
- Fitur peta interaktif dan geographic

### Fase 3: Modernisasi UI (November - Desember 2025)
- Redesign UI lengkap dengan estetika modern
- Peningkatan pengalaman pengguna dan navigasi
- Peningkatan responsivitas mobile
- Optimasi performa dan caching
- Perbaikan bug dan stabilitas

### Fase 4: Fitur Lanjutan (Januari - April 2026)
- Sistem evaluasi dan verifikasi
- Dukungan media lanjutan (HEIC, video)
- Polling real-time dan konfigurasi
- Peningkatan fitur blockchain dengan Polygon Amoy
- Utilitas PDF komprehensif dan dokumentasi
- Monitoring dan analytics lanjutan

### Fase 5: Polish dan Optimasi (Mei 2026)
- Penyempurnaan UI/UX dan peningkatan
- Optimasi performa, caching, dan penanganan error
- Peningkatan keamanan dengan manajemen environment variable
- Refactoring kode dan peningkatan arsitektur
- Dokumentasi dan pembaruan metadata

---

## Highlight Catatan Rilis

### v1.2.0 Highlights
- **Fitur Utama**: Sistem evaluasi dan verifikasi lengkap
- **Media Lanjutan**: Dukungan untuk gambar HEIC dan file video
- **Blockchain**: Migrasi ke Polygon Amoy untuk performa lebih baik
- **UI/UX**: Modernisasi komprehensif dan peningkatan pengalaman pengguna
- **Performa**: Caching lanjutan, optimasi loading, dan penanganan error
- **Keamanan**: Peningkatan manajemen environment variable dan konfigurasi API

### v1.1.1 Highlights
- **Stabilitas**: Perbaikan bug dashboard dan peningkatan performa
- **Performa**: Optimasi caching dan timeout handling
- **UI**: Penyempurnaan dashboard admin

### v1.1.0 Highlights
- **Evaluasi**: Sistem evaluasi dan verifikasi komprehensif
- **PDF**: Utilitas pembuatan PDF dan dokumentasi
- **Blockchain**: Integrasi Polygon Amoy
- **UI**: Modernisasi desain dan peningkatan UX

### v1.0.1 Highlights
- **Build**: Peningkatan konfigurasi build dan proses deployment
- **UI**: Penyesuaian menu dan tata letak
- **Stabilitas**: Perbaikan umum dan peningkatan kualitas

### v1.0.0 Highlights
- **Peluncuran**: Platform monitoring CCS lengkap
- **Transparansi**: Verifikasi data berbasis blockchain
- **Aksesibilitas**: Desain responsif untuk semua perangkat
- **Analytics**: Monitoring real-time dan pelaporan
- **Integrasi**: Deployment dan manajemen smart contract

---

## Rekomendasi Konvensi Commit

Untuk pengembangan selanjutnya, kami merekomendasikan mengikuti spesifikasi [Conventional Commits](https://www.conventionalcommits.org/):

```
<tipe>[opsional scope]: <deskripsi>

[opsional body]

[opsional footer(s)]
```

### Tipe
- `feat`: Fitur baru
- `fix`: Perbaikan bug
- `docs`: Perubahan dokumentasi
- `style`: Perubahan style kode (formatting, missing semi-colons, dll)
- `refactor`: Refactoring kode tanpa perubahan fitur
- `perf`: Peningkatan performa
- `test`: Penambahan atau update test
- `chore`: Tugas maintenance, update dependency, dll

### Contoh
```
feat(auth): tambah integrasi OAuth2 dengan Google
fix(monitoring): perbaikan masalah loading data dashboard
docs(api): update dokumentasi API untuk endpoint baru
refactor(components): ekstrak komponen modal yang dapat digunakan kembali
perf(dashboard): implementasi caching untuk data statistik
```

Konvensi ini akan membantu otomatisasi pembuatan changelog dan meningkatkan kejelasan commit.
