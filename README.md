# FE_CCS — Frontend Peluk Bumi CCS

Aplikasi web **Peluk Bumi Environmental Monitoring System (EMS)**: dashboard konservasi (perencanaan, implementasi, monitoring, evaluasi), pelaporan PDF/QR, integrasi blockchain, dan **verifikasi publik** tanpa login.

- **Stack:** React 19, Vite 5, Tailwind CSS, Ethers.js  
- **Versi:** 1.5.0 (`package.json`)
- **Mobile UI:** v1.5.0 dengan MobileHeader, BottomTabBar, responsive design

## Quick start

```bash
cd FE_CCS
npm install
cp .env.example .env
# Set VITE_API_URL, VITE_BLOCKCHAIN_* (lihat .env.example)
npm run dev
```

Buka: http://localhost:5173

## Peran dalam monorepo

| Service | URL default | Versi |
|---------|-------------|-------|
| FE_CCS (ini) | :5173 | 1.5.0 |
| BE_CCS API | :8000 | 1.4.0 |
| BC_CCS blockchain | :4000 | - |

## Struktur singkat

```
FE_CCS/
├── src/
│   ├── features/     # planning, implementation, monitoring, blockchain, verification, …
│   ├── pages/        # route-level pages (termasuk public/, verification/)
│   ├── layouts/      # DashboardLayout, VerificationFullscreenLayout
│   └── shared/       # komponen & utilitas bersama (MobileHeader, BottomTabBar, dll)
├── docs/             # dokumentasi teknis
├── README.md
└── CHANGELOG.md
```

## Fitur Mobile UI (v1.5.0)

### 📱 MobileHeader
- Sticky header di top dengan back button & page title
- Context-aware titles untuk setiap route
- Logo button untuk quick navigation
- Dark mode support

### 🗂️ BottomTabBar
- Fixed bottom navigation untuk dashboard
- Dynamic tabs berdasarkan user role (admin/user)
- Active state indicator dengan smooth animations
- Menu tab untuk full navigation sheet
- Safe area support untuk notch devices

### 🎨 Responsive Design
- Mobile-first approach
- Responsive breakpoints (md: 768px)
- Touch-optimized components (44px+ touch targets)
- Full dark mode support
- Smooth animations (60fps)

### ♿ Accessibility
- WCAG AA compliant
- ARIA labels pada semua interactive elements
- Keyboard navigation support
- Screen reader compatible

## Dokumentasi

| Dokumen | Isi |
|---------|-----|
| [docs/README.md](docs/README.md) | Setup & arsitektur ringkas |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Pola feature-based |
| [docs/API.md](docs/API.md) | Integrasi API backend |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Netlify / build produksi |
| [docs/FOLDER_STRUCTURE.md](docs/FOLDER_STRUCTURE.md) | Struktur folder |
| [docs/SEVEN_LAYER_ALIGNMENT.md](docs/SEVEN_LAYER_ALIGNMENT.md) | Kesesuaian 7 layer (frontend) |

### Mobile UI Documentation
- [MOBILE_UI_UPDATE_DOCUMENTATION.md](../MOBILE_UI_UPDATE_DOCUMENTATION.md) - Technical documentation
- [MOBILE_CHANGES_SUMMARY.md](../MOBILE_CHANGES_SUMMARY.md) - Visual summary
- [MOBILE_FEATURES_DETAILED.md](../MOBILE_FEATURES_DETAILED.md) - Deep dive ke features
- [COMMIT_PLAN.md](../COMMIT_PLAN.md) - Detailed commit breakdown

Deploy ke Netlify: lihat [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) (bukan duplikasi di README ini).

## Scripts

| Perintah | Keterangan |
|----------|------------|
| `npm run dev` | Development server |
| `npm run build` | Build produksi → `dist/` |
| `npm run lint` | ESLint |
| `npm run preview` | Preview build lokal |

> Deploy smart contract dilakukan di **BC_CCS**, bukan di FE.

## Riwayat perubahan

Lihat [CHANGELOG.md](CHANGELOG.md).

## Lisensi

MIT
