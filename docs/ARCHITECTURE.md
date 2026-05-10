# 📱 Peluk Bumi EMS - Arsitektur Frontend

## 📋 Gambaran Umum Arsitektur

Frontend Peluk Bumi Environmental Monitoring System (EMS) mengikuti pola arsitektur modern yang skalabel dengan pemisahan tanggung jawab yang jelas dan organisasi berbasis fitur.

## 🏗️ Prinsip Arsitektur Inti

### 1. Organisasi Berbasis Fitur
Kodebase diorganisasikan di sekitar fitur bisnis bukan lapisan teknis:

```
features/
├── admin/              # Alat manajemen admin
├── auth/               # Autentikasi & otorisasi
├── blockchain/         # Integrasi blockchain
├── dashboard/          # Komponen dashboard
├── evaluation/         # Sistem evaluasi otomatis
├── implementation/     # Implementasi proyek
├── landing/            # Landing page components
├── monitoring/         # Monitoring proyek & pengumpulan data
├── planning/           # Alur kerja perencanaan proyek
├── reporting/          # Pembuatan & ekspor laporan
└── verification/       # Verifikasi kode QR
```

### 2. Sumber Daya Bersama
Fungsionalitas umum tersentralisasi di direktori `shared/`:

```
shared/
├── components/        # Komponen UI yang dapat digunakan kembali
│   ├── charts/         # Komponen visualisasi data
│   ├── common/         # Komponen UI umum
│   ├── form/           # Komponen form
│   ├── layout/         # Komponen layout
│   ├── map/            # Komponen peta
│   └── stats/          # Komponen statistik
├── services/         # Lapisan layanan API
└── utils/           # Fungsi utilitas murni
```

### 3. Sistem Layout
Komponen layout dipisahkan dari logika bisnis:

```
layouts/
├── AppLayout.jsx      # Layout utama aplikasi
├── DashboardLayout.jsx # Layout untuk dashboard
├── common/            # Utilitas layout (LoadingSpinner, ScrollToTop)
└── partials/          # Bagian layout (Navbar, Footer, Sidebar)
```

## 🔄 Arsitektur Alur Data

### Manajemen State
Aplikasi menggunakan React Context untuk state global:

```
App.jsx
├── AuthProvider        # State autentikasi pengguna (app/context/AuthContext.jsx)
├── BlockchainProvider  # State koneksi blockchain (app/context/BlockchainContext.jsx)
└── ThemeProvider      # State tema UI (app/context/ThemeContext.jsx)
```

### Pola Alur Data
1. **Aksi Pengguna** → Komponen memicu aksi
2. **Panggilan API** → Layanan menangani request HTTP
3. **Pembaruan State** → Provider konteks memperbarui state global
4. **Render Ulang UI** → Komponen mencerminkan state baru

### Komunikasi Komponen
- **Props**: Alur data induk ke anak
- **Context**: Berbagi state global di seluruh komponen
- **Custom Hooks**: Logika bisnis yang dikapsulasi
- **Events**: Penanganan interaksi pengguna

## 🎨 Arsitektur Komponen

### Hirarki Komponen
```
App.jsx
├── app/
│   ├── config/           # Konfigurasi aplikasi
│   ├── context/          # React Context providers
│   └── routes/           # Konfigurasi rute (AppRoutes.jsx)
├── layouts/
│   ├── AppLayout.jsx     # Layout utama
│   ├── DashboardLayout.jsx # Layout dashboard
│   ├── common/           # Utilitas layout
│   └── partials/         # Navbar, Footer, Sidebar
├── pages/                # Komponen halaman
│   ├── admin/            # Halaman admin
│   ├── auth/             # Halaman autentikasi
│   ├── dashboard/        # Halaman dashboard
│   ├── evaluation/       # Halaman evaluasi
│   ├── public/           # Halaman publik
│   ├── reporting/        # Halaman laporan
│   ├── settings/         # Halaman pengaturan
│   └── verification/     # Halaman verifikasi
├── features/             # Komponen fitur berbasis domain
│   ├── admin/            # Fitur admin
│   ├── auth/             # Fitur autentikasi
│   ├── blockchain/       # Fitur blockchain
│   ├── dashboard/        # Fitur dashboard
│   ├── evaluation/       # Fitur evaluasi
│   ├── implementation/   # Fitur implementasi
│   ├── landing/          # Fitur landing page
│   ├── monitoring/       # Fitur monitoring
│   ├── planning/         # Fitur perencanaan
│   ├── reporting/        # Fitur pelaporan
│   └── verification/     # Fitur verifikasi
└── shared/               # Komponen bersama
    ├── components/       # UI components reusable
    ├── services/         # API services
    └── utils/           # Utility functions
```

### Pola Komponen

#### 1. Komponen Cerdas
- Mengelola state mereka sendiri
- Menangani logika bisnis
- Terhubung ke layanan
- Contoh: `PlanningForm.jsx`, `MonitoringForm.jsx`

#### 2. Komponen Presentasional
- Menerima data melalui props
- Fokus pada rendering UI
- Tidak ada logika bisnis
- Contoh: `PageTitle.jsx`, `LoadingSpinner.jsx`

#### 3. Komponen Kontainer
- Jembatan antara data dan presentasi
- Menangani pengambilan dan transformasi data
- Mengirim data yang diproses ke anak-anak

## 🛠️ Arsitektur Lapisan Layanan

### Pola Layanan API
```javascript
// shared/services/api.js
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
});

// Interceptor Request/Response untuk autentikasi, penanganan kesalahan
```

### Layanan Fitur
Setiap fitur memiliki file layanan yang didedikasikan:

```javascript
// shared/services/ - API services terpusat
export const perencanaanService = {
  getAll: async () => { /* ... */ },
  create: async (data) => { /* ... */ },
  update: async (id, data) => { /* ... */ },
  delete: async (id) => { /* ... */ }
};

export const implementasiService = { /* ... */ };
export const monitoringService = { /* ... */ };
export const evaluasiService = { /* ... */ };
```

### Tanggung Jawab Layanan
- **Komunikasi HTTP**: Penanganan request/respons API
- **Penanganan Kesalahan**: Pemrosesan kesalahan yang konsisten
- **Transformasi Data**: Normalisasi respons API
- **Caching**: Manajemen data lokal

## 🎯 Arsitektur Routing

### Struktur Rute
```javascript
// app/routes/AppRoutes.jsx
<Routes>
  {/* Rute Publik */}
  <Route path="/" element={<LandingPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/contact" element={<ContactPage />} />
  
  {/* Rute Admin Terproteksi */}
  <Route path="/admin/*" element={
    <ProtectedRoute role="admin">
      <DashboardLayout />
    </ProtectedRoute>
  }>
    <Route path="dashboard" element={<AdminDashboardPage />} />
    <Route path="users" element={<UsersPage />} />
    <Route path="reports" element={<ReportsPage />} />
    {/* ... */}
  </Route>
  
  {/* Rute Pengguna Terproteksi */}
  <Route path="/dashboard" element={
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  }>
    <Route index element={<UserDashboardPage />} />
    <Route path="planning" element={<PlanningPage />} />
    <Route path="implementation" element={<ImplementationPage />} />
    <Route path="monitoring" element={<MonitoringPage />} />
    <Route path="evaluation" element={<EvaluationPage />} />
    <Route path="reporting" element={<ReportingPage />} />
    <Route path="settings" element={<SettingsPage />} />
  </Route>
  
  {/* Rute Verifikasi Publik */}
  <Route path="/verify" element={<VerificationPage />} />
  <Route path="/verify/:id" element={<VerificationDetailPage />} />
</Routes>
```

### Perlindungan Rute
- **Komponen ProtectedRoute**: Kontrol akses berbasis peran
- **Integrasi Konteks Auth**: Pemeriksaan state autentikasi
- **Logika Redirect**: Navigasi otomatis untuk akses tidak sah

## 🎨 Arsitektur UI

### Sistem Desain
- **Tailwind CSS 3.4.18**: Styling berbasis utilitas
- **Material-UI 7.3.1**: Component library tambahan
- **@emotion/react & @emotion/styled**: CSS-in-JS styling
- **Lucide React 0.539.0**: Icon library
- **Heroicons 2.2.0**: Additional icon set
- **Tema Kustom**: Skema warna Peluk Bumi (Primary: #517640, Peach: #FFF0D8)

### Library Komponen
```javascript
// shared/components/
├── charts/             # Komponen visualisasi data (Chart.js)
│   ├── Charts.jsx      # Chart components (PieChart, BarChart)
│   └── index.js
├── common/             # Komponen UI umum
│   ├── Button.jsx      # Komponen tombol
│   ├── Card.jsx        # Komponen kartu
│   ├── Input.jsx       # Input form
│   ├── Modal.jsx       # Komponen modal
│   ├── Table.jsx       # Komponen tabel
│   └── index.js
├── form/               # Komponen form
│   ├── FormField.jsx   # Field form dengan validasi
│   └── index.js
├── layout/             # Komponen layout
│   ├── PageTitle.jsx   # Judul halaman
│   └── index.js
├── map/                # Komponen peta
│   ├── Map.jsx         # Komponen peta (React Leaflet)
│   └── index.js
└── stats/              # Komponen statistik
    ├── StatsCard.jsx  # Kartu statistik
    └── index.js
```

### Strategi Styling
- **Berkomponen**: Gaya dalam batas komponen
- **Desain Responsif**: Pendekatan mobile-first dengan breakpoints Tailwind
- **Mode Gelap**: Styling yang sadar tema dengan ThemeContext
- **Animasi**: Integrasi Framer Motion 12.23.12

## ⛓ Arsitektur Integrasi Blockchain

### Integrasi Web3
```javascript
// features/blockchain/services/blockchainService.js
import { ethers } from 'ethers';
import DocumentRegistry from '@/contracts/DocumentRegistry.json';

export const walletService = {
  connectWallet: async () => { /* MetaMask connection */ },
  switchToAmoy: async () => { /* Switch to Polygon Amoy */ },
  getContract: async () => { /* Get contract instance */ },
  getContractWithSigner: async () => { /* Contract with signer */ }
};

export const blockchainService = {
  storeDocument: async (documentType, documentId, metadata) => { /* Store on blockchain */ },
  getDocument: async (docId) => { /* Retrieve from blockchain */ },
  verifyDocument: async (transactionHash) => { /* Verify transaction */ }
};
```

### Interaksi Smart Contract
- **Ethers.js 6.15.0**: Library untuk interaksi Ethereum
- **Polygon Amoy Testnet**: Blockchain network untuk testing
- **DocumentRegistry**: Smart contract untuk document tracking
- **MetaMask Integration**: Wallet connection dan transaction signing
- **Manajemen Transaksi**: Antrian dan logika retry
- **Pendengaran Event**: Pembaruan blockchain real-time
- **Penanganan Kesalahan**: Pemrosesan kesalahan spesifik Web3
- **IPFS Gateway**: Untuk file storage dan retrieval

## 🔐 Arsitektur Keamanan

### Alur Autentikasi
1. **Login**: Autentikasi email/password
2. **Penerbitan Token**: JWT dengan kedaluwarsa
3. **Penyimpanan Token**: Penyimpanan lokal yang aman
4. **Refresh Token**: Perpanjangan otomatis
5. **Validasi Peran**: Akses berbasis izin

### Langkah Keamanan
- **Validasi Input**: Validasi React Hook Form 7.62.0 + Yup 1.7.0
- **Pencegahan XSS**: Perlindungan bawaan React
- **Pencegahan CSRF**: Request berbasis token
- **Keamanan API**: HTTPS + header autentikasi
- **JWT Token Management**: Token storage dan refresh
- **Rate Limiting**: API request throttling

## 📈 Arsitektur Performa

### Pemisahan Kode
```javascript
// Lazy loading untuk pemisahan berbasis rute
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboardPage'));
const UserDashboard = lazy(() => import('../pages/dashboard/UserDashboardPage'));
const PlanningPage = lazy(() => import('../pages/planning/PlanningPage'));

// Usage dengan Suspense
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/admin/dashboard" element={<AdminDashboard />} />
    <Route path="/dashboard" element={<UserDashboard />} />
  </Routes>
</Suspense>
```

### Strategi Optimisasi
- **Vite Build Optimization**: Automatic code splitting dan tree shaking
- **Bundle Analysis**: `npm run build:analyze`
- **Manual Chunks**: Vendor, router, charts, blockchain separation
- **Image Optimization**: WebP format, lazy loading, responsive images
- **Service Worker**: Caching strategy untuk offline support
- **Preload Critical Resources**: Preloading untuk critical CSS dan JS

## 🧪 Arsitektur Pengujian

### Struktur Pengujian
```
src/
├── __tests__/          # Utilitas dan mock pengujian
├── components/         # Pengujian komponen (Jest + React Testing Library)
├── features/          # Pengujian fitur
├── hooks/            # Pengujian hook
├── services/         # Pengujian layanan API
├── utils/           # Pengujian utilitas
└── setupTests.js      # Konfigurasi testing
```

### Strategi Pengujian
- **Pengujian Unit**: Pengujian fungsi/komponen individual
- **Pengujian Integrasi**: Pengujian interaksi komponen
- **Pengujian E2E**: Pengujian alur pengguna lengkap
- **Layanan Mock**: Mock API untuk pengujian

## 🚀 Arsitektur Deployment

### Proses Build
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@mui/material', '@mui/icons-material'],
          charts: ['chart.js', 'react-chartjs-2'],
          blockchain: ['ethers'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
});
```

### Konfigurasi Lingkungan
- **Development**: Hot reload, alat dev
- **Staging**: Lingkungan seperti produksi
- **Production**: Build dioptimalkan, minifikasi

## 🔄 Pola Manajemen State

### Pola Konteks
```javascript
// app/context/AuthContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import authService from '@/shared/services/authService';

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload.user, token: action.payload.token, loading: false };
    case 'LOGOUT':
      return { ...state, user: null, token: null, loading: false };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: authService.user,
    token: authService.token,
    loading: false,
  });

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    const result = await authService.login(email, password);
    if (result.success) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: { user: result.user, token: result.token } });
    }
    return result;
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Custom Hooks
```javascript
// shared/hooks/useApi.js
import { useState, useEffect, useCallback } from 'react';

export const useApi = (apiFunction, dependencies = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiFunction(...args);
      setData(result);
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  return { data, loading, error, refetch: execute };
};

// shared/hooks/usePerencanaan.js
import { useApi } from './useApi';
import { perencanaanService } from '@/shared/services/perencanaanService';

export const usePerencanaan = (params = {}) => {
  const { data, loading, error, refetch } = useApi(
    () => perencanaanService.getAll(params),
    [JSON.stringify(params)]
  );

  const create = async (formData) => {
    const result = await perencanaanService.create(formData);
    refetch();
    return result;
  };

  return { data, loading, error, create, refetch };
};
```

## 📊 Monitoring & Analitik

### Pelacakan Kesalahan
- **Global Error Boundary**: Menangkap kesalahan React dengan fallback UI
- **Pencatatan Kesalahan API**: Pelacakan kesalahan tingkat layanan dengan axios interceptors
- **Pemantauan Performa**: Metrik waktu muat dan interaksi dengan Performance API
- **Error Toast Notifications**: React Hot Toast untuk user feedback

### Integrasi Analitik
- **Google Analytics**: Tracking penggunaan dan performa (opsional)
- **Custom Event Tracking**: Pelacakan fitur dan user interactions
- **Performance Metrics**: Core Web Vitals monitoring
- **Error Reporting**: Sentry integration untuk production error tracking
- **User Behavior Analytics**: Heatmaps dan session recording (opsional)

---

*Dokumentasi arsitektur ini mencerminkan kondisi Peluk Bumi Environmental Monitoring System (EMS) saat ini per Mei 2026*
