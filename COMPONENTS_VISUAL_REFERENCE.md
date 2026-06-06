# 🎨 Visual Reference - Card Components

## LocationCard (Implementasi)

### Desktop View
```
┌─────────────────────────────────────────────────────────────────┐
│                     ✓ Lokasi Terpilih                          │
│         Detail implementasi yang dipilih                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Lembaga]            [Kegiatan]          [Jenis Bibit]       │
│  PT XYZ Corp          Program Reboisasi   Pohon Cemara        │
│                                                                 │
│  [Jumlah Bibit]       [Koordinat]         [Tanggal Rencana]   │
│  1,000 batang         -6.123, 106.456     15 Mei 2024        │
│                                                                 │
│                                                                 │
│  ✓ Lokasi berhasil dipilih. Lanjutkan pengisian dokumentasi.  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile View
```
┌─────────────────────────────────┐
│     ✓ Lokasi Terpilih           │
├─────────────────────────────────┤
│ [Lembaga]                       │
│ PT XYZ Corp                     │
│                                 │
│ [Kegiatan]                      │
│ Program Reboisasi               │
│                                 │
│ [Jenis Bibit]                   │
│ Pohon Cemara                    │
│                                 │
│ [Jumlah Bibit]                  │
│ 1,000 batang                    │
│                                 │
│ [Koordinat]                     │
│ LAT: -6.123                     │
│ LONG: 106.456                   │
│                                 │
│ [Tanggal]                       │
│ 15 Mei 2024                     │
│                                 │
│ ✓ Lokasi berhasil dipilih...   │
│                                 │
└─────────────────────────────────┘
```

### Colors & Styling
```
Background: Gradient hijau-emerald (from-green-50 to-emerald-50)
Border: 2px solid green-300
Icons: Green-600
Alert: Green-100 bg, green-500 left border
```

---

## ImplementationDetailCard (Monitoring)

### Desktop View
```
┌───────────────────────────────────────────────────────────────────┐
│ ✓ Implementasi Terpilih              [3/6 Bulan] ███░░░░░░░░░░  │
├───────────────────────────────────────────────────────────────────┤
│                                                                   │
│  [Lembaga]          [Kegiatan]         [Jenis Bibit]            │
│  PT XYZ Corp        Reboisasi          Pohon Cemara             │
│                                                                   │
│  [Jumlah]           [Durasi]           [Interval]               │
│  1,000 batang       6 bulan            Setiap 3 bulan          │
│                                                                   │
│  ─────────────────────────────────────────────────────────────  │
│  Koordinat GPS                                                   │
│  LAT: -6.123 | LONG: 106.456                                   │
│                                                                   │
│  ✓ Implementasi dipilih. Lanjutkan pengisian data monitoring.  │
│                                                                   │
└───────────────────────────────────────────────────────────────────┘
```

### With Progress Bar
```
Progress: 3/6 Bulan = 50%
┌────────────────────────┐
│ Monitoring Progress    │
├────────────────────────┤
│ Bulan: 3/6             │
│ [████████░░░░░░░░░░░░] 50%
│                        │
│ Monitoring aktif untuk │
│ ronde ke-2             │
└────────────────────────┘
```

### Colors & Styling
```
Background: Gradient cyan-blue (from-cyan-50 to-blue-50)
Border: 2px solid cyan-300
Primary: cyan-500 to blue-500 gradient
Icons: cyan-600
```

---

## MonitoringHistoryCard (Monitoring) ⭐ SPECIAL

### Desktop View - Full Timeline
```
┌──────────────────────────────────────────────────────────────────┐
│ 📊 Riwayat Monitoring                        [4 periode]         │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ●                                                               │
│  │  BULAN KE-3 (2024-03-15)  ...................... 2024-03-15 │
│  │  ├─ SR: 92.5%  ↑+2.5%                                       │
│  │  ├─ Tinggi: 45.2cm  ↑+3cm                                  │
│  │  ├─ Diameter: 8.5cm  ↑+0.5cm                              │
│  │  ├─ Daun: 25  ↑+3                                         │
│  │  ├─ Mati: 2   ↓-1                                         │
│  │  ├─ Ditanam: 100                                          │
│  │  └─ Kondisi: [✓ <25%] [✓ <25%] [⚠ 25-45%] [✓ <25%] [✓ <25%]
│  │                      Mengering  Layu  Menguning  Bercak   Hama
│  │
│  ├──────────────────────────────────────────────────────────
│  │
│  ●
│  │  BULAN KE-6 (2024-06-15)
│  │  ├─ SR: 89.2%  ↓-3.3%
│  │  ├─ Tinggi: 62.1cm  ↑+16.9cm
│  │  ├─ Diameter: 10.2cm  ↑+1.7cm
│  │  ├─ Daun: 28  ↑+3
│  │  ├─ Mati: 5   ↑+3
│  │  ├─ Ditanam: 100
│  │  └─ Kondisi: [⚠ 25-45%] [✓ <25%] [✓ <25%] [✓ <25%] [✓ <25%]
│  │
│  └──────────────────────────────────────────────────────────
│
│  ✓ Monitoring terbaru: Bulan ke-6
│    Survival rate: 89.2%
│
└──────────────────────────────────────────────────────────────────┘
```

### Mobile View - Compact
```
┌──────────────────────────────┐
│ 📊 Riwayat Monitoring        │
│              [4 periode]     │
├──────────────────────────────┤
│                              │
│ ● M3 (2024-03-15)           │
│ │ SR: 92.5% ↑2.5%           │
│ │ Tinggi: 45.2cm ↑3cm       │
│ │ Diameter: 8.5cm ↑0.5cm    │
│ │ Daun: 25 ↑3               │
│ │ Mati: 2 ↓1                │
│ │ Ditanam: 100              │
│ │ Kondisi: ✓ ✓ ✓ ✓ ✓       │
│ │
│ ├──────────────────────────
│ │
│ ● M6 (2024-06-15) *LATEST  │
│ │ SR: 89.2% ↓3.3%           │
│ │ Tinggi: 62.1cm ↑16.9cm    │
│ │ Diameter: 10.2cm ↑1.7cm   │
│ │ Daun: 28 ↑3               │
│ │ Mati: 5 ↑3                │
│ │ Ditanam: 100              │
│ │ Kondisi: ⚠ ✓ ✓ ✓ ✓      │
│ │
│ ✓ Latest: SR 89.2%          │
│                              │
└──────────────────────────────┘
```

### Trend Indicators
```
NAIK (Bagus)        TURUN (Perlu perhatian)    STABIL
─────────────────  ──────────────────────────  ──────
↑ Hijau (+)        ↓ Merah (-)                = Abu-abu (0)
Contoh:            Contoh:                    Contoh:
Tinggi +3cm        SR -3.3%                   Diameter +0cm
Daun +2 unit       Mati +3 unit               Ditanam 0 change
```

### Kondisi Badge Warna
```
HIJAU (✓ Bagus)      KUNING (⚠ Perlu perhatian)    MERAH (✗ Buruk)
─────────────────    ──────────────────────────    ────────────────
Daun <25%            Daun 25-45%                   Daun 50-74%
Sehat                Mulai ada masalah             Banyak masalah
```

### Colors & Styling
```
Background: Gradient biru-cyan (from-blue-50 to-cyan-50)
Border: 2px solid blue-300
Timeline: Blue dots dengan garis penghubung
Trend ↑: Green-600
Trend ↓: Red-600
Trend =: Gray-400
Badge Hijau: bg-green-100 text-green-800
Badge Kuning: bg-yellow-100 text-yellow-800
Badge Merah: bg-red-100 text-red-800
```

---

## Data Structure - Timeline Item

```javascript
{
  month: 3,
  record: {
    id: 1,
    implementasi_id: 101,
    bulan_monitoring: 3,
    jumlah_bibit_ditanam: 100,
    jumlah_bibit_mati: 2,
    tinggi_bibit: 45.2,
    diameter_batang: 8.5,
    jumlah_daun: 25,
    survival_rate: 92.5,
    daun_mengering: "<25%",
    daun_layu: "<25%",
    daun_menguning: "25-45%",
    bercak_daun: "<25%",
    daun_serangga: "<25%",
    created_at: "2024-03-15T10:30:00Z"
  },
  changes: {
    survival: { value: +2.5, percent: 2.8, direction: 'up' },
    height: { value: +3, percent: 7.1, direction: 'up' },
    diameter: { value: +0.5, percent: 6.3, direction: 'up' },
    leaves: { value: +3, percent: 13.6, direction: 'up' },
    dead: { value: -1, percent: -33.3, direction: 'down' }
  }
}
```

---

## Responsive Breakpoints

### LocationCard

```
Mobile (< 768px)       Tablet/Desktop (≥ 768px)
─────────────────      ──────────────────────────
Grid 2 kolom           Grid 3 kolom
Padding p-3            Padding p-6
Font xs                Font xs/sm
Icon w-3 h-3           Icon w-3.5 h-3.5

Koordinat section:     Koordinat section:
full-width             full-width
```

### ImplementationDetailCard

```
Mobile (< 768px)       Tablet/Desktop (≥ 768px)
─────────────────      ──────────────────────────
Grid 2 kolom           Grid 3 kolom (span-2 for some)
Stack vertical         Side-by-side
Padding p-5            Padding p-5
Progress bar left      Progress bar right
```

### MonitoringHistoryCard

```
Mobile (< 768px)       Tablet/Desktop (≥ 768px)
─────────────────      ──────────────────────────
Timeline left          Timeline left
Metrics stacked        Metrics 2-3 grid
Full width             Full width
Dot size w-8 h-8       Dot size w-10 h-10
Connector line thin    Connector line thin
```

---

## Animation Sequences

### LocationCard Mount
```
1. Container: opacity 0 → 1, y: 20 → 0 (500ms)
2. Header dot hover: scale 1 → 1.1, rotate 0 → 10 (200ms)
3. Detail items: cascade with 100ms delay (200ms each)
4. Items hover: translateY 0 → -2px (300ms)
```

### ImplementationDetailCard Mount
```
1. Container: opacity 0 → 1, y: 20 → 0 (500ms)
2. Progress badge: scale 0 → 1 (spring 200ms)
3. Detail items: cascade with 100ms delay (200ms each)
4. Items hover: translateY 0 → -1px (300ms)
5. GPS section: fade-in 300ms delay
```

### MonitoringHistoryCard Mount
```
1. Container: opacity 0 → 1, y: 20 → 0 (500ms)
2. Timeline items: cascade from top
   - each item: x: -20 → 0, opacity 0 → 1 (500ms)
   - delay: index * 100ms
3. Timeline dot: standard fade
4. Items on view: smooth animations
5. Hover: translateY -2px, shadow increase
```

---

## Interaction States

### Button States (If any)

```
Default               Hover              Active
─────────────         ──────────────     ────────────
bg-gray-100          bg-gray-200        bg-primary-500
text-gray-700        text-gray-800      text-white
no shadow            shadow-md          shadow-lg

Transition: all 200ms ease-in-out
```

### Card States

```
Not Selected         Selected              Hovered
────────────────     ────────────────     ──────────────
opacity: 1           opacity: 1           shadow: md → lg
shadow: sm           shadow: md           scale: 1 → 1.02
border: gray         border: color        translateY: 0
                     bg: light-color      
```

---

## Icon Usage

### LocationCard Icons
```
FiCheckCircle    - Header indicator
FiMapPin         - Koordinat field
FiCheckCircle    - Lembaga field
FiActivity       - Kegiatan field
FaSeedling       - Jenis Bibit field
FiPackage        - Jumlah Bibit field
FiCalendar       - Tanggal field
```

### ImplementationDetailCard Icons
```
FiCheckCircle    - Header indicator
FiMapPin         - Koordinat field
FiCheckCircle    - Lembaga field
FiActivity       - Kegiatan field
FaTree           - Jenis Bibit field
FiPackage        - Jumlah field
FiBarChart3      - Durasi field
FiTrendingUp     - Interval field
```

### MonitoringHistoryCard Icons
```
FiBarChart2      - Header indicator
FiTrendingUp     - Trend naik
FiTrendingDown   - Trend turun
FiMinus          - Trend stabil
FiCalendar       - Tanggal field
FiCheckCircle    - Success status
FiAlertCircle    - Alert status
```

---

## Typography Hierarchy

```
Level 1 (Heading):
  Component Title
  font-bold text-lg/base
  color: primary-900

Level 2 (Subheading):
  Section Label
  font-semibold text-sm/xs
  color: primary-600

Level 3 (Value):
  Data Display
  font-bold text-sm/xs
  color: gray-900

Level 4 (Helper):
  Secondary Info
  font-medium text-xs/[10px]
  color: gray-500
```

---

## Space Metrics

```
Component Padding:   p-5  (20px)  or  p-6  (24px)
Section Gap:         gap-2.5 (10px), gap-3 (12px), gap-4 (16px)
Item Padding:        p-3  (12px)  or  p-4  (16px)
Margin Between:      mb-3 (12px), mb-4 (16px), mb-6 (24px)
Border Radius:       rounded-lg (8px), rounded-xl (12px)
Border Width:        border-2 (2px)
```

---

## Summary Table

| Aspect | LocationCard | Implementation | MonitoringHistory |
|--------|------|------|------|
| **Grid** | 2-3 kolom | 3 kolom | Timeline |
| **Color** | Green | Cyan/Blue | Blue |
| **Items** | 6 fields | 7 fields | 6 metrics + badges |
| **Trend** | None | Progress bar | ↑↓= indicators |
| **Height** | ~180px | ~200px | ~400px+ (per item) |
| **Animation** | Smooth fade | Spring + cascade | Cascade timeline |
| **Dark Mode** | ✅ Full | ✅ Full | ✅ Full |
| **Mobile** | ✅ Responsive | ✅ Responsive | ✅ Responsive |

---

