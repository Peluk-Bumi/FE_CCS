# 📁 Struktur Folder Proyek - Peluk Bumi EMS

## 📋 Overview

Proyek Peluk Bumi Environmental Monitoring System (EMS) menggunakan arsitektur **Feature-based + Shared Layer** yang terstruktur untuk memudahkan pengembangan, pemeliharaan, dan skala aplikasi.

## Struktur Utama

```
src/
├── app/                    # Global system configuration
├── features/               # Feature-based modules
├── shared/                 # Reusable components and utilities
├── pages/                  # Routing and page composition
├── layouts/                # Layout components
├── assets/                 # Static assets
├── App.jsx                 # Main application component
├── main.jsx                # Application entry point
└── index.css               # Global styles
```

---

## 📁 app/ - Global System Configuration

Folder `app/` berisi semua konfigurasi global, context, providers, dan routing yang digunakan di seluruh aplikasi.

### Struktur:
```
app/
├── context/               # Global React contexts
│   ├── AuthContext.jsx     # Authentication context
│   ├── BlockchainContext.jsx # Blockchain state management
│   └── ThemeContext.jsx    # Theme management
├── routes/                # Application routing
│   ├── AppRoutes.jsx       # Main router configuration
│   └── ProtectedRoute.jsx # Route protection wrapper
├── config/                # Configuration files
│   └── apiConfig.js       # API configuration
└── providers/             # React providers
```

### Penggunaan:
- **Context**: State management global (auth, theme, blockchain)
- **Routes**: Konfigurasi routing dan proteksi route
- **Config**: Konfigurasi API, environment, dan constants
- **Providers**: Provider wrappers untuk aplikasi

---

## 🚀 features/ - Feature-based Modules

Folder `features/` berisi modul-modul berdasarkan fitur/business domain. Setiap fitur memiliki struktur yang konsisten.

### Struktur Standard Feature:
```
features/[feature-name]/
├── components/            # Feature-specific components
├── hooks/               # Custom hooks untuk feature
├── services/            # API calls dan business logic
├── utils/               # Helper functions
└── index.js             # Export统一 untuk feature
```

### Daftar Features:
- **admin/** - Manajemen admin dan user management
- **auth/** - Autentikasi dan authorization
- **blockchain/** - Integrasi blockchain dan wallet
- **dashboard/** - Dashboard admin dan user
- **evaluation/** - Evaluasi dan monitoring
- **implementation/** - Implementasi proyek
- **landing/** - Landing page components
- **monitoring/** - Monitoring data real-time
- **planning/** - Perencanaan proyek
- **reporting/** - Laporan dan analytics
- **verification/** - Verifikasi data dan QR scan

### Penggunaan:
- **Components**: UI components spesifik untuk fitur
- **Hooks**: Custom hooks untuk state management fitur
- **Services**: API calls dan business logic
- **Utils**: Helper functions untuk fitur
- **Index.js**: Centralized exports untuk easy import

---

## 🔧 shared/ - Reusable Components & Utilities

Folder `shared/` berisi semua komponen, hooks, services, dan utilities yang dapat digunakan kembali di seluruh aplikasi.

### Struktur:
```
shared/
├── components/
│   ├── common/           # Generic UI components
│   ├── layout/           # Layout components
│   ├── charts/           # Chart components
│   ├── table/            # Table components
│   ├── form/             # Form components
│   ├── modal/            # Modal components
│   ├── map/              # Map components
│   └── stats/            # Statistics components
├── hooks/               # Reusable custom hooks
├── services/            # Shared API services
├── utils/               # Utility functions
└── constants/           # Application constants
```

### Penggunaan:
- **Common**: LoadingSpinner, Button, Input, dll
- **Layout**: Navbar, Sidebar, Footer, dll
- **Charts**: Komponen visualisasi data
- **Hooks**: useLocalStorage, useDebounce, dll
- **Services**: API client, auth service, dll
- **Utils**: Formatters, validators, helpers

---

## 📄 pages/ - Routing & Page Composition

Folder `pages/` berisi komponen halaman yang digunakan untuk routing. Setiap halaman berfungsi sebagai composition layer yang tipis.

### Struktur:
```
pages/
├── public/               # Public pages
│   ├── LandingPage.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   └── ...
├── auth/                 # Authentication pages
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── ...
├── admin/                # Admin pages
│   ├── AdminDashboardPage.jsx
│   ├── UserPage.jsx
│   └── ...
├── user/                 # User pages
│   ├── UserDashboardPage.jsx
│   └── ...
├── evaluation/           # Evaluation pages
│   ├── EvaluationPage.jsx
│   └── ...
├── reporting/            # Reporting pages
│   ├── ReportsPage.jsx
│   └── ...
└── verification/         # Verification pages
    ├── VerificationPage.jsx
    ├── VerificationDashboardPage.jsx
    └── ...
```

### Penggunaan:
- **Public**: Halaman yang dapat diakses tanpa login
- **Auth**: Login, register, forgot password
- **Admin**: Halaman khusus admin
- **User**: Halaman khusus user
- **Feature**: Halaman untuk setiap fitur domain

---

## 🎨 layouts/ - Layout Components

Folder `layouts/` berisi komponen layout yang digunakan untuk mengatur struktur halaman.

### Struktur:
```
layouts/
├── DashboardLayout.jsx    # Layout untuk dashboard
└── PublicLayout.jsx      # Layout untuk halaman publik
```

---

## 📦 assets/ - Static Assets

Folder `assets/` berisi semua static assets seperti gambar, icons, dan file statis lainnya.

### Struktur:
```
assets/
├── react.svg            # React logo/icon
└── (subfolders lainnya sesuai kebutuhan)
```

### Catatan:
- Folder `styles/` telah dihapus karena tidak digunakan
- Gunakan hanya assets yang benar-benar diperlukan
- Static assets sebaiknya ditempatkan di `public/` folder untuk production

---

## 🎯 Best Practices

### 1. Import Patterns
```javascript
// ✅ Benar: Import dari feature index
import { useAuth } from '../app/context/AuthContext';
import { EvaluationPage } from '../features/evaluation';

// ✅ Benar: Import dari shared
import { LoadingSpinner } from '../shared/components/common';
import { formatDate } from '../shared/utils';

// ❌ Salah: Import deep nesting
import { useAuth } from '../../../app/context/AuthContext';
```

### 2. Feature Structure
Setiap feature harus memiliki struktur yang konsisten:
- `components/` - UI components
- `hooks/` - Custom hooks
- `services/` - API calls
- `utils/` - Helper functions
- `index.js` - Centralized exports

### 3. Naming Conventions
- **Files**: PascalCase untuk components (UserProfile.jsx)
- **Folders**: kebab-case atau camelCase (user-profile / userProfile)
- **Components**: PascalCase (UserProfile)
- **Hooks**: camelCase dengan prefix 'use' (useUserData)
- **Services**: camelCase (userService)
- **Utils**: camelCase (formatDate)

### 4. Separation of Concerns
- **Features**: Business logic dan domain-specific UI
- **Shared**: Reusable components dan utilities
- **Pages**: Routing dan composition layer
- **App**: Global configuration dan providers

### 5. File Organization
- Satu file per component
- Index files untuk exports
- Group related files together
- Keep files focused and small

---

## 🔄 Migration Guide

### Dari Struktur Lama ke Baru

1. **Context Files**:
   ```javascript
   // Lama
   import { useAuth } from '../contexts/AuthContext';
   
   // Baru
   import { useAuth } from '../app/context/AuthContext';
   ```

2. **Route Files**:
   ```javascript
   // Lama
   import AppRoutes from '../routes/AppRoutes';
   
   // Baru
   import AppRoutes from '../app/routes/AppRoutes';
   ```

3. **Config Files**:
   ```javascript
   // Lama
   import apiConfig from '../config/apiConfig';
   
   // Baru
   import apiConfig from '../app/config/apiConfig';
   ```

---

## 📚 Referensi

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

---

## 🤝 Kontribusi

Saat menambahkan fitur baru:
1. Buat folder di `features/`
2. Ikuti struktur standar feature
3. Tambahkan `index.js` untuk exports
4. Update dokumentasi ini
5. Test import paths

Saat menambahkan shared components:
1. Tempatkan di folder yang sesuai di `shared/components/`
2. Export dari index file jika perlu
3. Update dokumentasi

---

*Last Updated: 10 Mei 2026*
