# Kesesuaian 7 Layer — FE_CCS (Frontend)

Referensi: [ANALISIS_7_LAYER_2_DIMENSI.md](../../ANALISIS_7_LAYER_2_DIMENSI.md)  
Pembaruan: **19 Mei 2026**

## Ringkasan

| Layer | Status | Komponen utama |
|-------|--------|----------------|
| **1 — Application** | ✅ (~85%) | Dashboard, workflow EMS, halaman publik & verifikasi QR |
| **2 — Contract** | ✅ (~70%) | `features/blockchain`, wallet, konfigurasi chain via env |
| **5 — Network** | ⚠️ (~55%) | Polling interval ~10s; tanpa WebSocket client |
| **6 — Data** | ✅ (~60%) | Geotag via peta di form implementasi; PDF/laporan |

---

## Layer 1 — Application Layer

### Sesuai rencana simplified
- React dashboard + halaman verifikasi publik
- Mode publik tanpa login

### Implementasi
| Area | Lokasi |
|------|--------|
| Verifikasi publik (QR) | `src/pages/verification/PublicVerificationPage.jsx` (`VerifikasiPublicPage`) |
| Verifikasi terautentikasi | `src/pages/verification/VerificationPage.jsx` |
| Landing & legal | `src/pages/public/` |
| Workflow EMS | `features/planning`, `implementation`, `monitoring`, `evaluation`, `reporting` |
| Admin | `src/pages/dashboard/AdminDashboardPage.jsx` |

### Gap vs contoh di analisis
- Tidak ada komponen terpisah `PublicVerification.jsx` dengan grid semua aktivitas; alur utama = scan QR / unggah → detail laporan via API publik.
- Toggle `isPublicMode` di satu `Dashboard` belum ada; routing terpisah sudah memenuhi sebagian kebutuhan.

---

## Layer 2 — Contract Layer (klien)

### Implementasi
- `src/config/blockchainConfig.js`, `src/features/blockchain/`
- Provider factory, security guard, error boundary (v1.4.0)
- Env: `VITE_BLOCKCHAIN_*` (Sepolia default di changelog terbaru)

### Gap
- Tidak ada pemanggilan `validatePlanting` on-chain (kontrak belum menyediakan)
- Skrip Hardhat masih di `package.json` FE — deploy kontrak seharusnya di **BC_CCS**

---

## Layer 5 — Network Layer

### Implementasi
- Axios ke `VITE_API_URL`
- Polling dashboard / blockchain state

### Gap
- Tidak ada klien WebSocket untuk `sync_update` seperti di contoh analisis

---

## Layer 6 — Data Layer (UI)

### Implementasi
- **Geotagging:** `ImplementasiForm.jsx` — pilih koordinat di peta → `geotagging` string
- **Laporan/PDF:** `features/reporting/utils/reportPdf.js` — menampilkan geotag implementasi

### Gap
- Ekstraksi EXIF dari foto di browser belum ada

---

## Versi & dokumentasi terkait

- Versi paket: `1.4.0` (`package.json`)
- Deploy frontend: [docs/DEPLOYMENT.md](DEPLOYMENT.md)
- Arsitektur: [docs/ARCHITECTURE.md](ARCHITECTURE.md)

---

## Checklist tindak lanjut (FE_CCS)

- [ ] Halaman daftar aktivitas publik (jika BE menyediakan endpoint agregat)
- [ ] Hapus atau arahkan skrip `deploy:amoy` ke dokumentasi BC_CCS
- [ ] WebSocket client (opsional) saat BE/BC menyediakan channel
- [ ] Badge/incentive UI setelah API badge di BE siap
