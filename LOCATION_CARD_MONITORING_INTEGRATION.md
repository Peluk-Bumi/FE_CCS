# 📍 ImplementationLocationCard - Integration Guide

## Overview

Komponen `ImplementationLocationCard` telah dibuat untuk menampilkan lokasi implementasi terpilih di halaman Monitoring dengan styling yang **identik** dengan `LocationCard` di halaman Implementasi.

---

## 📦 Komponen

### ImplementationLocationCard
**File**: `FE_CCS/src/features/monitoring/components/ImplementationLocationCard.jsx`

**Perbedaan dengan LocationCard**:
- ✅ Styling 100% identik (hijau, gradient, border)
- ✅ Icon dan colors yang sama
- ✅ Grid layout 2-3 kolom responsive
- ✅ Alert message disesuaikan untuk monitoring context
- ✅ Field labels disesuaikan (e.g., "Tanggal Implementasi" instead of "Tanggal Rencana")

**Props**:
```typescript
interface ImplementationLocationCardProps {
  implementation: {
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

## 🔧 Integration Steps

### Step 1: Import Komponen

Di `FE_CCS/src/features/monitoring/components/MonitoringForm.jsx`, tambahkan import:

```jsx
import { ImplementationLocationCard } from '@/features/monitoring';

// Atau import langsung:
import ImplementationLocationCard from './ImplementationLocationCard';
```

### Step 2: Add to MonitoringForm

Temukan bagian dimana `selectedImplementasi` ditampilkan (biasanya setelah tabel/map implementasi).

Tambahkan komponen ini:

```jsx
{/* ✅ LOKASI IMPLEMENTASI TERPILIH - SAMA STYLING DENGAN IMPLEMENTASI PAGE */}
<ImplementationLocationCard 
  implementation={selectedImplementasi}
  isSelected={!!selectedImplementasi}
/>
```

### Step 3: Positioning

**Rekomendasi penempatan**:
1. Setelah map lokasi implementasi
2. Sebelum detail implementasi card
3. Sebelum form fields mulai

**Contoh struktur**:
```jsx
<section>
  {/* Map */}
  <MapContainer>...</MapContainer>

  {/* ✅ TAMBAHKAN INI */}
  <ImplementationLocationCard 
    implementation={selectedImplementasi}
    isSelected={!!selectedImplementasi}
  />

  {/* Detail Implementation */}
  <ImplementationDetailCard {...props} />

  {/* History */}
  <MonitoringHistoryCard {...props} />

  {/* Form Fields */}
  {/* Bulan Monitoring, Data Input, etc */}
</section>
```

### Step 4: Build & Test

```bash
cd FE_CCS
npm run build
```

Verify:
- ✅ Build passes (no errors)
- ✅ Component renders correctly
- ✅ Styling matches LocationCard
- ✅ Responsive on mobile/desktop
- ✅ Dark mode works

---

## 🎨 Styling Comparison

### Visual Parity

| Aspect | LocationCard | ImplementationLocationCard |
|--------|------|------|
| **Border** | green-300 | green-300 |
| **Background** | from-green-50 to-emerald-50 | from-green-50 to-emerald-50 |
| **Header Icon** | green-500 to emerald-600 | green-500 to emerald-600 |
| **Grid** | 2-3 kolom responsive | 2-3 kolom responsive |
| **Item Styling** | white bg, green border | white bg, green border |
| **Icons** | Warna-coded | Warna-coded |
| **Alert** | green-100 bg | green-100 bg |
| **Dark Mode** | ✅ Support | ✅ Support |

### CSS Classes Used

Both components use identical classes:

```
Border:      border-2 border-green-300
Background:  bg-gradient-to-br from-green-50 to-emerald-50
Dark:        dark:from-green-900/20 dark:to-emerald-900/20
Dark Border: dark:border-green-700
Header BG:   from-green-500 to-emerald-600
Grid:        grid-cols-2 md:grid-cols-3 gap-3
Item:        bg-white dark:bg-gray-800 rounded-lg
Item Border: border-green-200 dark:border-green-700
Alert:       bg-green-100 dark:bg-green-900/30
Alert Left:  border-l-4 border-l-green-500
```

---

## 📊 Content Comparison

### LocationCard (Implementasi)
```
Header: "Lokasi Terpilih"
Subtitle: "Detail implementasi yang dipilih"

Fields:
1. Lembaga
2. Kegiatan
3. Jenis Bibit
4. Jumlah Bibit
5. Koordinat
6. Tanggal Rencana

Alert: "Lokasi berhasil dipilih. Lanjutkan pengisian dokumentasi."
```

### ImplementationLocationCard (Monitoring)
```
Header: "Lokasi Implementasi Terpilih"
Subtitle: "Siap untuk monitoring dan pengumpulan data"

Fields:
1. Lembaga
2. Kegiatan
3. Jenis Bibit
4. Jumlah Bibit
5. Koordinat
6. Tanggal Implementasi  ← Field label disesuaikan

Alert: "Lokasi implementasi berhasil dipilih. Lanjutkan pengisian data monitoring."
```

---

## 🚀 Complete Integration Example

### Full MonitoringForm Structure

```jsx
import { 
  ImplementationLocationCard,
  ImplementationDetailCard,
  MonitoringHistoryCard 
} from '@/features/monitoring';

function MonitoringForm() {
  const [selectedImplementasi, setSelectedImplementasi] = useState(null);
  const [monitoringByImplementasi, setMonitoringByImplementasi] = useState({});
  const [monitoringRecordsByImplementasi, setMonitoringRecordsByImplementasi] = useState({});

  return (
    <div className="py-12">
      {/* Page Header */}
      <PageTitle {...pageProps} />

      {/* Success Message */}
      {success && <SuccessAnimation />}

      {/* Form Card */}
      <motion.div className="form-container">
        <form onSubmit={formik.handleSubmit}>
          
          {/* 1. SELECT LOCATION & MAP */}
          <section className="mb-10">
            <label className="form-label">
              <FiMapPin /> Pilih Lokasi Implementasi untuk Monitoring
            </label>

            {/* Info Box */}
            <div className="info-box">...</div>

            {/* Table/List */}
            <div className="table-container">
              {/* Implementasi List */}
            </div>

            {/* Map */}
            <MapContainer>...</MapContainer>

            {/* ✅ ADD THIS - Styling sama dengan Implementasi Page */}
            <ImplementationLocationCard 
              implementation={selectedImplementasi}
              isSelected={!!selectedImplementasi}
            />
          </section>

          {/* 2. IMPLEMENTATION DETAIL CARD */}
          <ImplementationDetailCard 
            implementation={selectedImplementasi}
            isSelected={!!selectedImplementasi}
            monitoringProgress={{
              completed: monitoringByImplementasi[String(selectedImplementasi?.id)]?.length || 0,
              total: selectedImplementasi?.durasi_proyek || 6
            }}
          />

          {/* 3. MONITORING HISTORY CARD */}
          <MonitoringHistoryCard 
            monitoringRecords={monitoringRecordsByImplementasi[String(selectedImplementasi?.id)] || []}
            selectedImplementasi={selectedImplementasi}
            currentValues={formik.values}
          />

          {/* 4. MONITORING DATA FORM */}
          <section className="mb-10">
            <label className="form-label">Data Monitoring</label>
            
            {/* Bulan Monitoring */}
            <Select name="bulan_monitoring">...</Select>

            {/* Data Fields */}
            <Input name="jumlah_bibit_ditanam" />
            {/* ... other fields */}
          </section>

          {/* 5. FORM SUBMISSION */}
          <FormButton type="submit" loading={submitting}>
            Simpan Monitoring
          </FormButton>
        </form>
      </motion.div>
    </div>
  );
}
```

---

## ✅ Verification Checklist

- [ ] Import ImplementationLocationCard di MonitoringForm
- [ ] Add component dengan props yang benar
- [ ] Verify styling matches LocationCard (color, border, bg)
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test dark mode toggle
- [ ] Verify data mapping (implementation fields)
- [ ] Check alert message di-render
- [ ] Run build test: `npm run build`
- [ ] Test dengan data real dari API
- [ ] Cross-browser test

---

## 🎯 Styling Verification

Untuk memastikan styling identik, cek hal berikut:

1. **Border & Background** (should be green)
   ```
   ✓ 2px green-300 border
   ✓ Gradient dari green-50 ke emerald-50
   ✓ Dark mode: green-900/20 to emerald-900/20 dengan green-700 border
   ```

2. **Header** (should match)
   ```
   ✓ White icon di gradient green-500 to emerald-600 circular bg
   ✓ Text "Lokasi Implementasi Terpilih" 
   ✓ Subtitle "Siap untuk monitoring dan pengumpulan data"
   ```

3. **Grid Items** (should be same)
   ```
   ✓ 2 kolom di mobile, 3 kolom di desktop
   ✓ White background dengan green border
   ✓ Hover shadow effect
   ✓ Warna-coded icons
   ```

4. **Alert** (should match)
   ```
   ✓ Green-100 background
   ✓ Green-500 left border
   ✓ Green check icon
   ✓ Green text
   ```

---

## 📝 Notes

- Komponen ini adalah "copy" dari LocationCard dengan styling identik
- Hanya content/label yang disesuaikan untuk monitoring context
- Reusable dan dapat di-customize lebih lanjut jika diperlukan
- Dark mode fully supported
- Responsive untuk semua ukuran device

---

## 🔗 Related Components

- `LocationCard` - Original di Implementasi page
- `ImplementationDetailCard` - Detail info dengan progress bar
- `MonitoringHistoryCard` - Riwayat monitoring dengan trend

---

**Status**: ✅ Ready for Integration  
**Last Updated**: 2026-06-05

