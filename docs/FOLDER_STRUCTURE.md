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
- **blockchain/** - Integrasi blockchain dan wallet
- **dashboard/** - Dashboard admin dan user
- **demo/** - Demo components untuk development
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
│   │   ├── FAQAdmin.jsx
│   │   ├── FAQList.jsx
│   │   ├── PageTitle.jsx
│   │   ├── ProjectProgressBar.jsx
│   │   ├── ProjectStatusBadge.jsx
│   │   └── index.js      # Centralized exports
│   ├── layout/           # Layout components
│   │   ├── Footer.jsx
│   │   ├── LoadingSpinner.jsx
│   │   ├── Navbar.jsx
│   │   ├── ScrollToTop.jsx
│   │   ├── Sidebar.jsx
│   │   ├── navbar/       # Navigation sub-components
│   │   │   ├── DesktopNavigation.jsx
│   │   │   ├── LandingMobileSheet.jsx
│   │   │   ├── Logo.jsx
│   │   │   ├── MobileMenu.jsx
│   │   │   ├── NavbarControls.jsx
│   │   │   ├── ProfileDropdown.jsx
│   │   │   └── index.js  # Centralized exports
│   │   └── index.js      # Centralized exports
│   ├── ui/               # Shadcn-based components
│   │   ├── button.jsx    # Shadcn button primitive
│   │   ├── card.jsx      # Shadcn card primitive
│   │   ├── input.jsx     # Shadcn input primitive
│   │   ├── button/       # Custom button variations
│   │   ├── card/         # Custom card variations
│   │   ├── navigation/   # Navigation components
│   │   └── sheet/        # Sheet components
│   ├── charts/           # Chart components
│   ├── table/            # Table components
│   ├── form/             # Form components
│   ├── modal/            # Modal components
│   ├── map/              # Map components
│   └── stats/            # Statistics components
├── hooks/                # Reusable custom hooks
│   └── index.js          # Centralized exports (placeholder)
├── services/             # Shared API services
├── utils/                # Utility functions
│   ├── utils.js
│   ├── partnersLoader.js
│   ├── validation.js
│   ├── devHelper.js
│   ├── evaluationEngine.js
│   ├── factories/        # Factory pattern implementations
│   │   ├── providerFactory.js
│   │   └── index.js      # Centralized exports
│   ├── guards/           # Guard/middleware utilities
│   │   ├── securityGuard.js
│   │   └── index.js      # Centralized exports
│   └── index.js          # (optional) Centralized exports
└── constants/            # Application constants
```

### Penggunaan:
- **Common**: FAQAdmin, FAQList, PageTitle, ProjectProgressBar, ProjectStatusBadge
- **Layout**: Navbar, Sidebar, Footer, LoadingSpinner, ScrollToTop
- **UI**: Shadcn primitives (button, card, input) + custom variations
- **Charts**: Komponen visualisasi data
- **Hooks**: useLocalStorage, useDebounce, dll (placeholder untuk future)
- **Services**: API client, auth service, dll
- **Utils**: Formatters, validators, helpers, factories, guards
- **Constants**: Application constants

### Best Practices - Index Files

Setiap folder di `shared/components/` memiliki `index.js` untuk centralized exports:

```javascript
// /src/shared/components/common/index.js
export { default as FAQAdmin } from './FAQAdmin';
export { default as FAQList } from './FAQList';
export { default as PageTitle } from './PageTitle';
export { default as ProjectProgressBar } from './ProjectProgressBar';
export { default as ProjectStatusBadge } from './ProjectStatusBadge';
```

Ini memungkinkan import yang lebih clean:
```javascript
// Instead of:
import { FAQAdmin } from '../shared/components/common/FAQAdmin';

// Use:
import { FAQAdmin } from '../shared/components/common';
```

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
│   ├── License.jsx
│   ├── MonitoringAccess.jsx
│   ├── NotFound.jsx
│   ├── PolicyPage.jsx
│   ├── TermsAndConditions.jsx
│   └── ...
├── auth/                 # Authentication pages
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   └── ...
├── admin/                # Admin pages
│   ├── ActivityPage.jsx
│   ├── RecentActivity.jsx
│   ├── UserPage.jsx
│   └── ...
├── dashboard/            # Dashboard pages
│   ├── AdminDashboardPage.jsx
│   ├── UserDashboardPage.jsx
│   └── ...
├── evaluation/           # Evaluation pages
│   ├── EvaluationPage.jsx
│   └── ...
├── reporting/            # Reporting pages
│   ├── ReportsPage.jsx
│   └── ...
├── settings/             # Settings pages
│   ├── Settings.jsx
│   └── ...
└── verification/         # Verification pages
    ├── PublicVerificationPage.jsx
    ├── VerificationDashboardPage.jsx
    ├── VerificationPage.jsx
    └── ...
```

### Penggunaan & Aturan Level Routing:
- **Public**: Halaman yang dapat diakses tanpa login
- **Auth**: Login, register, forgot password
- **Admin**: Halaman khusus admin
- **Dashboard**: Dashboard untuk admin dan user
- **Evaluation**: Halaman evaluasi utama
- **Demo**: Halaman `DemoIndex` (Route Level 1)

**PENTING: Aturan Pemisahan L1 dan L2 Routes:**
Folder `src/pages` **hanya** boleh berisi komponen yang bertindak sebagai **halaman utama (Level 1 Routes)**, misal: `/demo`, `/evaluasi`.
Sedangkan untuk **sub-halaman (Level 2 Routes)** dan komponen spesifik fitur (misal: `/demo/buttons`, `/demo/cards`), harus disimpan di dalam folder **`src/features/`**. Ini bertujuan untuk mencegah folder `pages/` membengkak dan memisahkan dengan tegas antara entri halaman dan komponen-komponen logik yang membentuk fitur tersebut.

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
// ✅ Benar: Import dari shared dengan index.js
import { FAQAdmin, PageTitle } from '../shared/components/common';
import { Navbar, Footer } from '../shared/components/layout';
import { useAuth } from '../app/context/AuthContext';

// ✅ Benar: Import dari feature index
import { EvaluationPage } from '../features/evaluation';

// ✅ Benar: Import dari shared utils
import { formatDate } from '../shared/utils';
import { securityGuard } from '../shared/utils/guards';

// ❌ Salah: Import deep nesting
import { FAQAdmin } from '../shared/components/common/FAQAdmin';
import { useAuth } from '../../../app/context/AuthContext';
```

### 2. Component Organization

**UI Components (Shadcn-based):**
- Primitives: button.jsx, card.jsx, input.jsx, dll
- Variations: button/, card/, navigation/, sheet/
- Location: `/src/shared/components/ui/`

**Generic Components (Custom):**
- FAQAdmin, FAQList, PageTitle, ProjectProgressBar, dll
- Location: `/src/shared/components/common/`

**Layout Components:**
- Navbar, Sidebar, Footer, LoadingSpinner, dll
- Location: `/src/shared/components/layout/`

### 3. Feature Structure
Setiap feature harus memiliki struktur yang konsisten:
- `components/` - UI components
- `hooks/` - Custom hooks
- `services/` - API calls
- `utils/` - Helper functions
- `index.js` - Centralized exports

### 4. Naming Conventions
- **Files**: PascalCase untuk components (UserProfile.jsx)
- **Folders**: kebab-case atau camelCase (user-profile / userProfile)
- **Components**: PascalCase (UserProfile)
- **Hooks**: camelCase dengan prefix 'use' (useUserData)
- **Services**: camelCase (userService)
- **Utils**: camelCase (formatDate)

### 5. File Organization
- Satu file per component
- Index files untuk exports (centralized imports)
- Group related files together
- Keep files focused and small

### 6. Utilities Organization
Utilities diorganisir dalam subfolder berdasarkan pattern:
- `factories/` - Factory pattern implementations
- `guards/` - Guard/middleware utilities
- Root level - General utilities (utils.js, validation.js, dll)

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

4. **Component Files**:
   ```javascript
   // Lama
   import { FAQAdmin } from '../components/FAQAdmin';
   
   // Baru
   import { FAQAdmin } from '../shared/components/common';
   ```

5. **Layout Files**:
   ```javascript
   // Lama
   import { Navbar } from '../layouts/partials/Navbar';
   
   // Baru
   import { Navbar } from '../shared/components/layout';
   ```

6. **Utility Files**:
   ```javascript
   // Lama
   import { formatDate } from '../lib/utils';
   
   // Baru
   import { formatDate } from '../shared/utils';
   ```

7. **Factory/Guard Files**:
   ```javascript
   // Lama
   import { providerFactory } from '../shared/factories/providerFactory';
   
   // Baru
   import { providerFactory } from '../shared/utils/factories';
   ```

---

## 📁 Reserved Features

Folder-folder berikut ini reserved untuk future implementation:

### /src/features/auth/
- **Status**: Reserved untuk authentication features
- **Current**: Kosong (authentication context ada di `/src/app/context/AuthContext.jsx`)
- **Future**: Akan diisi dengan auth-specific components, hooks, services

### /src/features/button/
- **Status**: Reserved untuk button-related features
- **Current**: Kosong (button components ada di `/src/shared/components/ui/button/`)
- **Future**: Akan diisi dengan button-specific features jika diperlukan

---

## 📚 Demo Components

### /src/features/demo/
Folder ini berisi demo dan example components untuk development:
- `ButtonTypesDemo.jsx` - Demonstrasi berbagai tipe button dan variations
- `DashboardCardDemo.jsx` - Demonstrasi dashboard card components
- `index.js` - Centralized exports

**Purpose:**
- Development reference untuk component usage
- Testing playground untuk new features
- Documentation dari component capabilities
- Isolated environment untuk component testing

**Usage:**
```javascript
import { ButtonTypesDemo, DashboardCardDemo } from '@/features/demo';
```

**Note:**
- Components ini untuk development only
- Tidak boleh digunakan di production
- Gunakan sebagai reference saat membuat components baru

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

*Last Updated: 19 Mei 2026*
*Status: ✅ Reorganization Complete - All Best Practices Applied*
