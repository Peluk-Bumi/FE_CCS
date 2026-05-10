# 📱 FE_CCS Frontend Documentation - Peluk Bumi EMS

## 📋 Overview

Frontend aplikasi Peluk Bumi Environmental Monitoring System (EMS) dibangun dengan React 19 dan Vite untuk memberikan pengalaman pengguna yang modern dan responsif dalam monitoring aktivitas konservasi lingkungan dengan fokus pada workflow konservasi.

## 🏗️ Architecture

### System Architecture
```
┌─────────────────┐     HTTP/REST      ┌──────────────────────┐
│   FE_CCS        │ ◄────────────────► │   BE_CCS             │
│   React + Vite  │                    │   Laravel 12 (PHP)   │
│   :5173         │                    │   :8000              │
└─────────────────┘                    └──────────┬───────────┘
                                                  │ HTTP
                                                  ▼
                                       ┌──────────────────────┐
                                       │  Blockchain Service  │
                                       │  Node.js + Express   │
                                       │  :4000               │
                                       └──────────┬───────────┘
                                                  │ ethers.js
                                                  ▼
                                       ┌──────────────────────┐
                                       │  Polygon Amoy        │
                                       │  DocumentRegistry    │
                                       │  Smart Contract      │
                                       └──────────────────────┘
```

### Directory Structure
```
FE_CCS/
├── src/
│   ├── app/                    # App context and providers
│   │   └── context/           # Auth, Blockchain, Theme contexts
│   ├── features/               # Feature-based components
│   │   ├── admin/             # Admin features
│   │   ├── auth/              # Authentication features
│   │   ├── blockchain/         # Blockchain integration
│   │   ├── dashboard/          # Dashboard features
│   │   ├── evaluation/         # Evaluation workflow
│   │   ├── implementation/    # Implementation workflow
│   │   ├── landing/           # Landing page components
│   │   ├── monitoring/         # Monitoring workflow
│   │   ├── planning/          # Planning workflow
│   │   ├── reporting/         # Reporting features
│   │   └── verification/       # Verification features
│   ├── layouts/               # Layout components
│   │   ├── common/           # Common layout components
│   │   └── partials/         # Layout partials
│   ├── pages/                 # Page components
│   │   ├── admin/            # Admin pages
│   │   ├── auth/             # Authentication pages
│   │   ├── dashboard/        # Dashboard pages
│   │   ├── evaluation/       # Evaluation pages
│   │   ├── public/           # Public pages
│   │   ├── reporting/        # Reporting pages
│   │   ├── settings/         # Settings pages
│   │   └── verification/     # Verification pages
│   ├── shared/               # Shared components
│   │   ├── components/       # Reusable components
│   │   ├── services/         # API services
│   │   └── constants/        # Application constants
│   └── lib/                  # Utilities and helpers
├── contracts/                # Smart contracts
├── scripts/                 # Deployment scripts
└── public/                  # Static assets
```

## 🛠️ Tech Stack

### Core Technologies
- **React 19.1.1** - UI Framework dengan Concurrent Features
- **Vite 5.4.21** - Build Tool & Development Server
- **JavaScript ES6+** - Modern JavaScript features

### Styling & UI
- **Tailwind CSS 3.4.18** - Utility-first CSS framework
- **Material-UI 7.3.1** - Component library
- **@emotion/react & @emotion/styled** - CSS-in-JS styling
- **Lucide React 0.539.0** - Icon library
- **Heroicons 2.2.0** - Additional icon set
- **Framer Motion 12.23.12** - Animation library

### State Management & Data
- **React Context API** - Global state management
- **React Hook Form 7.62.0** - Form state management
- **Axios 1.11.0** - HTTP client
- **Formik 2.4.6** - Form handling
- **Yup 1.7.0** - Form validation

### Blockchain Integration
- **Ethers.js 6.15.0** - Ethereum interaction
- **Hardhat 3.4.3** - Smart contract development
- **@nomicfoundation/hardhat-ethers 4.0.10** - Hardhat + Ethers integration
- **Polygon Amoy Testnet** - Blockchain network

### Visualization & Maps
- **Chart.js 4.5.1** - Data visualization
- **React Chart.js 2** - React wrapper
- **React Leaflet 5.0.0** - Interactive maps
- **Leaflet 1.9.4** - Map library

### Additional Libraries
- **React Router 7.8.0** - Client-side routing
- **React Hot Toast 2.6.0** - Toast notifications
- **React Toastify 11.0.5** - Alternative toast notifications
- **QR Scanner Libraries** - Multiple QR code scanning options
- **PDF-lib 1.17.1** - PDF generation
- **JSZip 3.10.1** - File compression
- **heic2any 0.0.4** - Image conversion
- **jwt-decode 4.0.0** - JWT token decoding

## 🎨 Design System

### Color Palette
```css
/* Primary Colors */
--primary-50: #f0f9ff;
--primary-500: #517640;  /* Main brand color */
--primary-600: #465f39;
--primary-900: #1a2e16;

/* Secondary Colors */
--peach-50: #fffbeb;
--peach-500: #FFF0D8;
--peach-600: #fde68a;

/* Neutral Colors */
--gray-50: #f9fafb;
--gray-500: #6b7280;
--gray-900: #111827;

/* Semantic Colors */
--success: #10b981;
--warning: #f59e0b;
--error: #ef4444;
--info: #3b82f6;
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Modern web browser

### Installation
```bash
# Clone repository
git clone <repository-url>
cd FE_CCS

# Install dependencies
npm install

# Environment setup
cp .env.example .env
```

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run tests
npm run test

# Lint code
npm run lint
```
- **State Management**: React Context API
- **Routing**: React Router v6
- **Animasi**: Framer Motion
- **Maps**: React Leaflet
- **Forms**: Formik + validasi Yup
- **Notifications**: React Hot Toast
- **Icons**: React Icons (Feather Icons)
- **Blockchain**: Integrasi Web3 dengan smart contracts

## 📁 Struktur Proyek

```
src/
├── app/                    # Setup aplikasi inti
│   ├── config/             # File konfigurasi
│   ├── context/            # Provider React Context
│   └── routes/            # Definisi rute
├── features/               # Modul berbasis fitur
│   ├── admin/             # Fitur manajemen admin
│   ├── auth/              # Fitur autentikasi
│   ├── blockchain/        # Integrasi blockchain
│   ├── dashboard/         # Komponen dashboard
│   ├── evaluation/        # Sistem evaluasi
│   ├── implementation/    # Implementasi proyek
│   ├── landing/           # Komponen halaman landing
│   ├── monitoring/        # Monitoring proyek
│   ├── planning/          # Perencanaan proyek
│   ├── reporting/         # Pembuatan laporan
│   └── verification/      # Verifikasi QR
├── layouts/               # Komponen layout
│   ├── common/           # Utilitas layout bersama
│   └── partials/         # Bagian layout
├── pages/                # Komponen halaman
│   ├── admin/            # Halaman admin
│   ├── auth/             # Halaman autentikasi
│   ├── dashboard/        # Halaman dashboard
│   ├── evaluation/       # Halaman evaluasi
│   ├── public/           # Halaman publik
│   ├── reporting/        # Halaman laporan
│   ├── settings/         # Halaman pengaturan
│   └── verification/     # Halaman verifikasi
├── shared/               # Sumber daya bersama
│   ├── components/        # Komponen reusable
│   ├── services/         # Layanan API
│   └── utils/           # Fungsi utilitas
└── lib/                 # Wrapper library eksternal
```

## 🚦 Memulai

### Prasyarat

- Node.js 16+ 
- npm atau yarn package manager
- Git

### Instalasi

1. Clone repository:
```bash
git clone <repository-url>
cd FE_CCS
```

2. Install dependensi:
```bash
npm install
```

3. Atur variabel lingkungan:
```bash
cp .env.example .env
# Edit .env dengan konfigurasi Anda
```

4. Mulai server development:
```bash
npm run dev
```

5. Build untuk produksi:
```bash
npm run build
```

## 🔧 Variabel Lingkungan

Buat file `.env` di direktori root:

```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_BLOCKCHAIN_EXPLORER_BASE_URL=https://amoy.polygonscan.com
VITE_SMART_CONTRACT_ADDRESS=<alamat-kontrak-anda>
VITE_WEB3_PROVIDER_URL=https://rpc-amoy.polygon.technology/
```

## 📚 Skrip Tersedia

- `npm run dev` - Mulai server development
- `npm run build` - Build untuk produksi
- `npm run preview` - Pratinjau build produksi
- `npm run lint` - Jalankan ESLint
- `npm run lint:fix` - Perbaiki masalah ESLint

## 🎨 Sistem Desain

Aplikasi menggunakan sistem desain konsisten yang dibangun di atas:

- **Warna**: Tema hijau primer dengan dukungan mode gelap
- **Tipografi**: Font family Inter dengan ukuran konsisten
- **Spasi**: Skala spasi Tailwind CSS
- **Komponen**: Library komponen Shadcn/ui
- **Animasi**: Framer Motion untuk transisi yang halus

## 🔐 Autentikasi

Aplikasi menggunakan autentikasi berbasis JWT dengan alur berikut:

1. Pengguna login dengan email/password
2. Token JWT diterbitkan dan disimpan lokal
3. Mekanisme refresh token untuk sesi yang diperpanjang
4. Kontrol akses berbasis peran (Admin/Pengguna)

## 🌐 Integrasi API

Frontend berkomunikasi dengan API RESTful untuk:

- Manajemen pengguna
- Data proyek (perencanaan, implementasi, monitoring)
- Hasil evaluasi
- Pembuatan laporan
- Upload file

## ⛓ Integrasi Blockchain

Integrasi smart contract menyediakan:

- Pencatatan transaksi
- Verifikasi proyek
- Pembuatan kode QR untuk verifikasi publik
- Pelacakan aktivitas konservasi yang transparan

## 📱 Desain Responsif

Aplikasi sepenuhnya responsif dengan:

- Pendekatan mobile-first
- Optimasi tablet dan desktop
- Interaksi yang ramah sentuh
- Layout adaptif

## 🌙 Mode Gelap

Dukungan mode gelap bawaan dengan:

- Deteksi preferensi sistem
- Opsi toggle manual
- Preferensi pengguna yang persisten
- Tema yang konsisten di semua komponen

## 🧪 Pengujian

Aplikasi mencakup pengujian komprehensif:

- Pengujian unit untuk utilitas dan hooks
- Pengujian komponen dengan React Testing Library
- Pengujian integrasi untuk alur pengguna

## 📈 Performa

Optimisasi meliputi:

- Code splitting dengan lazy loading
- Optimasi gambar
- Optimasi ukuran bundle
- Strategi caching

## 🤝 Berkontribusi

1. Fork repository
2. Buat cabang fitur
3. Lakukan perubahan Anda
4. Tambahkan pengujian jika berlaku
5. Kirim pull request

## 📄 Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT - lihat file LICENSE untuk detail.

## 📞 Dukungan

Untuk dukungan dan pertanyaan:

- Buat issue di repository
- Periksa dokumentasi di `/docs`
- Tinjau komentar kode untuk konteks tambahan

---

*Diperbarui terakhir: Mei 2025*
