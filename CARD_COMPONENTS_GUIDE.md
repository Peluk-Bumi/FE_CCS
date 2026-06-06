# Panduan Komponen Card untuk Implementasi dan Monitoring

## 📋 Ringkasan

Saya telah membuat tiga komponen card baru yang dirancang untuk menampilkan informasi dengan styling yang optimal dan tidak memakan banyak tempat:

1. **LocationCard** - Menampilkan detail lokasi yang dipilih di form Implementasi
2. **ImplementationDetailCard** - Menampilkan detail implementasi di form Monitoring
3. **MonitoringHistoryCard** - Menampilkan riwayat perubahan data monitoring dengan trend

---

## 🎯 1. LocationCard (Implementasi)

### Lokasi
```
FE_CCS/src/features/implementation/components/LocationCard.jsx
```

### Fitur
- ✅ Menampilkan 6 detail lokasi dalam grid 2 kolom (responsive)
- ✅ Compact dan ringkas, tidak memakan banyak tempat
- ✅ Styling modern dengan gradient background dan ikon yang jelas
- ✅ Alert kecil untuk konfirmasi pemilihan lokasi
- ✅ Hanya muncul ketika lokasi benar-benar dipilih

### Data yang Ditampilkan
| Field | Icon | Deskripsi |
|-------|------|-----------|
| Lembaga | FiCheckCircle | Nama perusahaan/lembaga |
| Kegiatan | FiActivity | Jenis kegiatan implementasi |
| Jenis Bibit | FaSeedling | Spesies bibit yang ditanam |
| Jumlah Bibit | FiPackage | Total bibit dalam format number |
| Koordinat | FiMapPin | Latitude & Longitude (mono font) |
| Tanggal Rencana | FiCalendar | Format tanggal lokal Indonesia |

### Penggunaan
```jsx
import { LocationCard } from '@/features/implementation';

function ImplementasiForm() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <>
      {/* ... form fields ... */}
      
      {/* Tampilkan card ketika lokasi dipilih */}
      <LocationCard 
        location={selectedLocation}
        isSelected={!!selectedLocation}
      />
    </>
  );
}
```

### Props
```typescript
interface LocationCardProps {
  location: {
    id: number;
    nama_perusahaan: string;
    jenis_kegiatan: string;
    jenis_bibit: string;
    jumlah_bibit: number;
    lat: number;
    long: number;
    tanggal: string;
  };
  isSelected: boolean; // Jika false, komponen tidak render
}
```

---

## 🎯 2. ImplementationDetailCard (Monitoring)

### Lokasi
```
FE_CCS/src/features/monitoring/components/ImplementationDetailCard.jsx
```

### Fitur
- ✅ Menampilkan 6 detail implementasi dalam grid 3 kolom (responsive)
- ✅ Progress bar untuk monitoring progress (completed/total bulan)
- ✅ Badge untuk menunjukkan progress bulan
- ✅ Compact design dengan informasi GPS terpisah
- ✅ Action alert yang memandu pengguna

### Data yang Ditampilkan
| Field | Icon | Deskripsi |
|-------|------|-----------|
| Lembaga | FiCheckCircle | Nama perusahaan |
| Kegiatan | FiActivity | Jenis kegiatan |
| Jenis Bibit | FaTree | Spesies bibit |
| Jumlah Bibit | FiPackage | Total bibit ditanam |
| Durasi Proyek | FiBarChart3 | Durasi dalam bulan |
| Interval Monitoring | FiTrendingUp | Frekuensi monitoring |
| Koordinat GPS | FiMapPin | Lat & Long detail |

### Penggunaan
```jsx
import { ImplementationDetailCard } from '@/features/monitoring';

function MonitoringForm() {
  const [selectedImplementasi, setSelectedImplementasi] = useState(null);
  const [monitoringByImplementasi, setMonitoringByImplementasi] = useState({});

  // Hitung progress
  const getMonitoringProgress = (id) => {
    const completed = (monitoringByImplementasi[String(id)] || []).length;
    const total = selectedImplementasi?.durasi_proyek || 6;
    return { completed, total };
  };

  return (
    <>
      {/* ... form fields ... */}
      
      <ImplementationDetailCard 
        implementation={selectedImplementasi}
        isSelected={!!selectedImplementasi}
        monitoringProgress={getMonitoringProgress(selectedImplementasi?.id)}
      />
    </>
  );
}
```

### Props
```typescript
interface ImplementationDetailCardProps {
  implementation: {
    id: number;
    nama_perusahaan: string;
    jenis_kegiatan: string;
    jenis_bibit: string;
    jumlah_bibit: number;
    lat: number;
    long: number;
    durasi_proyek: number;
    monitoring_interval: number;
  };
  isSelected: boolean;
  monitoringProgress: {
    completed: number;  // Bulan yang sudah dimonitor
    total: number;      // Total durasi proyek
  };
}
```

---

## 🎯 3. MonitoringHistoryCard (Monitoring)

### Lokasi
```
FE_CCS/src/features/monitoring/components/MonitoringHistoryCard.jsx
```

### Fitur ⭐ TERBARU
- ✅ Timeline interaktif untuk setiap bulan monitoring
- ✅ **Riwayat perubahan data** dengan trend indicator (↑↓)
- ✅ **Perbandingan otomatis** dengan bulan sebelumnya
- ✅ Menampilkan 6 metrik utama untuk setiap periode
- ✅ Kondisi daun dengan status badge (warna hijau/kuning/merah)
- ✅ Hanya muncul jika ada riwayat monitoring sebelumnya

### Metrik yang Ditampilkan
| Metrik | Singkatan | Trend | Satuan |
|--------|-----------|-------|--------|
| Survival Rate | SR | ✓ | % |
| Tinggi Bibit | Tinggi | ✓ | cm |
| Diameter Batang | Diameter | ✓ | cm |
| Jumlah Daun | Daun | ✓ | unit |
| Bibit Mati | Mati | ✓ | unit |
| Bibit Ditanam | Ditanam | - | unit |
| Daun Mengering | - | - | %/status |
| Daun Layu | - | - | %/status |
| Daun Menguning | - | - | %/status |
| Bercak Daun | - | - | %/status |
| Hama/Serangga | - | - | %/status |

### Cara Kerja Trend
```
Metrik: Tinggi Bibit
Bulan 1: 10 cm
Bulan 2: 12 cm  → Trend: +2 cm (↑ hijau)
Bulan 3: 11 cm  → Trend: -1 cm (↓ merah)
Bulan 4: 11 cm  → Trend:  0 cm (= abu-abu)

Warna:
- Hijau (↑)  : Naik/Meningkat
- Merah (↓)  : Turun/Menurun
- Abu-abu (=): Stabil/Tidak berubah
```

### Penggunaan
```jsx
import { MonitoringHistoryCard } from '@/features/monitoring';

function MonitoringForm() {
  const [monitoringRecords, setMonitoringRecords] = useState([]);
  const [selectedImplementasi, setSelectedImplementasi] = useState(null);

  useEffect(() => {
    // Fetch monitoring records
    const records = await api.get(`/monitoring`);
    setMonitoringRecords(records.data?.data || []);
  }, []);

  return (
    <>
      {/* ... form fields ... */}
      
      {/* Tampilkan card hanya jika ada riwayat */}
      <MonitoringHistoryCard 
        monitoringRecords={monitoringRecords}
        selectedImplementasi={selectedImplementasi}
        currentValues={formik.values}
      />
    </>
  );
}
```

### Props
```typescript
interface MonitoringHistoryCardProps {
  monitoringRecords: Array<{
    id: number;
    implementasi_id: number;
    bulan_monitoring: number;
    jumlah_bibit_ditanam: number;
    jumlah_bibit_mati: number;
    tinggi_bibit: number;
    diameter_batang: number;
    jumlah_daun: number;
    survival_rate: number;
    daun_mengering: string;    // "<25%", "25–45%", dll
    daun_layu: string;
    daun_menguning: string;
    bercak_daun: string;
    daun_serangga: string;
    created_at: string;
  }>;
  selectedImplementasi?: {
    id: number;
    // ... other fields
  };
  currentValues?: object; // Optional, dari formik values
}
```

---

## 🎨 Styling & Warna

### LocationCard
- **Border**: Hijau (#059669)
- **Background**: Gradient hijau-emerald
- **Icon**: Warna hijau cerah
- **Alert**: Hijau dengan border kiri

### ImplementationDetailCard
- **Border**: Cyan (#0891b2)
- **Background**: Gradient cyan-blue
- **Icon**: Warna biru cerah
- **Alert**: Cyan dengan border kiri

### MonitoringHistoryCard
- **Border**: Biru (#0284c7)
- **Background**: Gradient biru-cyan
- **Timeline**: Biru dengan garis penghubung
- **Trend**: Hijau (naik), Merah (turun), Abu-abu (stabil)
- **Badge**: Hijau/Kuning/Merah sesuai kondisi

---

## 📊 Contoh Integrasi Penuh

### ImplementasiForm.jsx
```jsx
import { LocationCard } from '@/features/implementation';

// Tambahkan di bagian yang menampilkan detail lokasi terpilih
return (
  <div>
    {/* ... existing map and table ... */}
    
    {/* TAMBAHKAN INI */}
    <LocationCard 
      location={selectedLocation}
      isSelected={!!selectedLocation}
    />
    
    {/* ... form fields ... */}
  </div>
);
```

### MonitoringForm.jsx
```jsx
import { ImplementationDetailCard, MonitoringHistoryCard } from '@/features/monitoring';

// Tambahkan di bagian yang menampilkan detail implementasi
return (
  <div>
    {/* ... existing map and table ... */}
    
    {/* TAMBAHKAN INI - Detail Implementasi */}
    <ImplementationDetailCard 
      implementation={selectedImplementasi}
      isSelected={!!selectedImplementasi}
      monitoringProgress={{
        completed: monitoringByImplementasi[String(selectedImplementasi?.id)]?.length || 0,
        total: selectedImplementasi?.durasi_proyek || 6
      }}
    />
    
    {/* TAMBAHKAN INI - Riwayat Monitoring */}
    <MonitoringHistoryCard 
      monitoringRecords={monitoringRecordsByImplementasi[String(selectedImplementasi?.id)] || []}
      selectedImplementasi={selectedImplementasi}
      currentValues={formik.values}
    />
    
    {/* ... form fields ... */}
  </div>
);
```

---

## ✅ Keuntungan

### 1. **Efisiensi Ruang**
- Grid 2-3 kolom yang responsive
- Compact padding dan font size
- Tidak ada informasi yang redundan

### 2. **Informasi Tepat**
- Hanya menampilkan data yang relevan
- Organized dalam kategori
- Easy to scan

### 3. **Visual Feedback**
- Warna-coding untuk cepat identifikasi
- Trend indicator untuk monitoring
- Progress bar untuk konteks

### 4. **User Experience**
- Muncul hanya ketika diperlukan
- Smooth animations
- Clear action indicators

### 5. **Maintenance**
- Komponen terpisah dan reusable
- Props-based configuration
- Mudah untuk update atau extend

---

## 🚀 Integrasi ke ImplementasiForm

Sekarang saya akan mengintegrasikan LocationCard ke ImplementasiForm.jsx secara otomatis.

File akan diupdate:
- `FE_CCS/src/features/implementation/components/ImplementasiForm.jsx` - Menambahkan import dan render LocationCard

---

## 📝 Catatan

- Semua komponen **responsive** di semua ukuran device
- Menggunakan **framer-motion** untuk animasi smooth
- Kompatibel dengan **dark mode**
- Menggunakan **lucide-react** icons yang sudah ada
- Styling menggunakan **Tailwind CSS**

---

## ❓ FAQ

**Q: Bagaimana jika data terlalu panjang?**
A: Gunakan `line-clamp-1` atau `text-ellipsis` untuk truncate, atau font size kecil untuk fit.

**Q: Bisa di-customize warna?**
A: Ya, edit warna di komponen atau pass sebagai prop.

**Q: Apa kalau tidak ada riwayat monitoring?**
A: MonitoringHistoryCard tidak akan render jika array kosong (conditional render di fungsi).

**Q: Kompatibel dengan mobile?**
A: Ya, semua grid responsive dengan breakpoints MD.

---

