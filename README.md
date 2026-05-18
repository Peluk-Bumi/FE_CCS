# FE_CCS — Frontend Peluk Bumi CCS

Aplikasi web **Peluk Bumi Environmental Monitoring System (EMS)**: dashboard konservasi (perencanaan, implementasi, monitoring, evaluasi), pelaporan PDF/QR, integrasi blockchain, dan **verifikasi publik** tanpa login.

- **Stack:** React 19, Vite 5, Tailwind CSS, Ethers.js  
- **Versi:** 1.4.0 (`package.json`)

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

| Service | URL default |
|---------|-------------|
| FE_CCS (ini) | :5173 |
| BE_CCS API | :8000 |
| BC_CCS blockchain | :4000 |

## Struktur singkat

```
FE_CCS/
├── src/
│   ├── features/     # planning, implementation, monitoring, blockchain, verification, …
│   ├── pages/        # route-level pages (termasuk public/, verification/)
│   └── shared/       # komponen & utilitas bersama
├── docs/             # dokumentasi teknis
├── README.md
└── CHANGELOG.md
```

## Dokumentasi

| Dokumen | Isi |
|---------|-----|
| [docs/README.md](docs/README.md) | Setup & arsitektur ringkas |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Pola feature-based |
| [docs/API.md](docs/API.md) | Integrasi API backend |
| [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) | Netlify / build produksi |
| [docs/FOLDER_STRUCTURE.md](docs/FOLDER_STRUCTURE.md) | Struktur folder |
| [docs/SEVEN_LAYER_ALIGNMENT.md](docs/SEVEN_LAYER_ALIGNMENT.md) | Kesesuaian 7 layer (frontend) |

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
