# Panduan Integrasi Card Components di MonitoringForm

## ✅ Status Implementasi

### Implementasi Form ✅ SELESAI
- LocationCard sudah terintegrasi di ImplementasiForm
- Menggantikan detail section yang lama (lebih ringkas, ~90 baris menjadi 3 baris)
- Build status: **✅ Success** (tanpa error)

### Monitoring Form 🔄 PERSIAPAN INTEGRASI

Berikut adalah panduan step-by-step untuk mengintegrasikan dua card baru ke MonitoringForm:

---

## 📋 Komponen yang Diintegrasikan

### 1. ImplementationDetailCard
**Fungsi**: Menampilkan detail implementasi yang dipilih dengan progress monitoring

**File**: `FE_CCS/src/features/monitoring/components/ImplementationDetailCard.jsx`

**Props yang Diperlukan**:
```typescript
{
  implementation: object,        // Detail implementasi dari API
  isSelected: boolean,           // Apakah sudah dipilih
  monitoringProgress: {
    completed: number,           // Bulan yang sudah dimonitor
    total: number               // Total durasi proyek
  }
}
```

### 2. MonitoringHistoryCard
**Fungsi**: Menampilkan riwayat monitoring dengan trend data perubahan

**File**: `FE_CCS/src/features/monitoring/components/MonitoringHistoryCard.jsx`

**Props yang Diperlukan**:
```typescript
{
  monitoringRecords: array,     // Riwayat monitoring untuk implementasi ini
  selectedImplementasi: object, // Detail implementasi terpilih
  currentValues: object        // Optional, dari formik.values
}
```

---

## 🔧 Langkah Integrasi ke MonitoringForm

### Step 1: Update Import Statement

**File**: `FE_CCS/src/features/monitoring/components/MonitoringForm.jsx`

Tambahkan import untuk komponen baru:

```jsx
// Baris ~1-30, tambahkan baris ini:
import { ImplementationDetailCard, MonitoringHistoryCard } from '@/features/monitoring';

// Atau import langsung:
import ImplementationDetailCard from './ImplementationDetailCard';
import MonitoringHistoryCard from './MonitoringHistoryCard';
```

### Step 2: Temukan Lokasi Insert di MonitoringForm

Di MonitoringForm, cari section dimana `selectedImplementasi` ditampilkan.

Biasanya ada di sekitar area:
- Table/List implementasi yang dipilih
- Atau sebelum form fields mulai

### Step 3: Insert ImplementationDetailCard

**Tempat**: Setelah tabel lokasi implementasi atau sebelum bulan monitoring dipilih

```jsx
{/* ✅ IMPLEMENTATION DETAIL CARD */}
<ImplementationDetailCard 
  implementation={selectedImplementasi}
  isSelected={!!selectedImplementasi}
  monitoringProgress={{
    completed: monitoringByImplementasi[String(selectedImplementasi?.id)]?.length || 0,
    total: selectedImplementasi?.durasi_proyek || 6
  }}
/>
```

### Step 4: Insert MonitoringHistoryCard

**Tempat**: Setelah ImplementationDetailCard atau setelah select bulan monitoring

```jsx
{/* ✅ MONITORING HISTORY CARD - Tampilkan riwayat */}
<MonitoringHistoryCard 
  monitoringRecords={monitoringRecordsByImplementasi[String(selectedImplementasi?.id)] || []}
  selectedImplementasi={selectedImplementasi}
  currentValues={formik.values}
/>
```

---

## 📊 Contoh Integrasi Lengkap (Full Context)

Berikut adalah struktur yang disarankan di MonitoringForm.jsx:

```jsx
return (
  <div className="py-12">
    {/* Header */}
    <PageTitle {...pageProps} />

    {/* Success Message */}
    {success && <SuccessAnimation />}

    {/* Form Card */}
    <motion.div className="form-container">
      <form onSubmit={formik.handleSubmit}>
        
        {/* 1. MAP & LOCATION SELECTION */}
        <section className="mb-10">
          <label className="form-label">
            <FiMapPin /> Pilih Lokasi Implementasi untuk Monitoring
          </label>
          
          {/* Info Box */}
          <div className="info-box">...</div>

          {/* Implementasi Table */}
          <div className="locations-table">
            {/* Tabel lokasi */}
          </div>

          {/* Map */}
          <MapContainer>...</MapContainer>

          {/* ✅ TAMBAHKAN INI: Detail Card */}
          <ImplementationDetailCard 
            implementation={selectedImplementasi}
            isSelected={!!selectedImplementasi}
            monitoringProgress={{
              completed: monitoringByImplementasi[String(selectedImplementasi?.id)]?.length || 0,
              total: selectedImplementasi?.durasi_proyek || 6
            }}
          />

          {/* ✅ TAMBAHKAN INI: History Card */}
          <MonitoringHistoryCard 
            monitoringRecords={monitoringRecordsByImplementasi[String(selectedImplementasi?.id)] || []}
            selectedImplementasi={selectedImplementasi}
            currentValues={formik.values}
          />
        </section>

        {/* 2. MONITORING DATA FIELDS */}
        <section className="mb-10">
          <label className="form-label">Data Monitoring</label>
          
          {/* Bulan Monitoring */}
          <Select name="bulan_monitoring">...</Select>

          {/* Jumlah Bibit, Survival Rate, dll */}
          <Input name="jumlah_bibit_ditanam" />
          <Input name="jumlah_bibit_mati" />
          {/* ... fields lainnya */}
        </section>

        {/* 3. LEAF CONDITIONS */}
        <section className="mb-10">
          {renderRadioGroup('mengering', 'Daun Mengering')}
          {renderRadioGroup('layu', 'Daun Layu')}
          {/* ... kondisi lainnya */}
        </section>

        {/* 4. DOCUMENTATION UPLOAD */}
        <section className="mb-10">
          {/* Drag-drop upload area */}
        </section>

        {/* Submit Button */}
        <FormButton type="submit" loading={submitting}>
          Simpan Monitoring
        </FormButton>
      </form>
    </motion.div>
  </div>
);
```

---

## 🎯 Data Flow & Props

### Bagaimana Data Mengalir:

```
MonitoringForm Component
├── [LOAD] Ambil data implementasi
├── [LOAD] Ambil riwayat monitoring
│
├── User pilih implementasi
│  └── state: selectedImplementasi
│  └── state: monitoringByImplementasi (bulan yg sudah monitoring)
│  └── state: monitoringRecordsByImplementasi (riwayat detail)
│
├── ImplementationDetailCard
│  ├── Props: selectedImplementasi
│  ├── Props: monitoringProgress (dari monitoringByImplementasi)
│  └── Tampilkan: Lembaga, Kegiatan, Durasi, Interval, Koordinat
│
├── MonitoringHistoryCard
│  ├── Props: monitoringRecordsByImplementasi[id]
│  ├── Props: selectedImplementasi
│  └── Tampilkan: Timeline dengan trend setiap bulan
│
└── Form Fields
    ├── Bulan Monitoring (auto-filled dengan next month)
    ├── Jumlah Bibit
    ├── Survival Rate (auto-calc)
    └── Kondisi Daun
```

---

## 📐 Styling & Layout Tips

### Responsive Behavior

Kedua card sudah responsive:

```
Mobile (< 768px)
├── ImplementationDetailCard: Grid 2 kolom
└── MonitoringHistoryCard: Timeline penuh lebar

Tablet/Desktop (≥ 768px)
├── ImplementationDetailCard: Grid 3 kolom
└── MonitoringHistoryCard: Timeline dengan sidebar
```

### Spacing

Rekomendasi spacing antar section:

```jsx
{/* Section 1 */}
<section className="mb-10">
  <label>Pilih Lokasi</label>
  {/* Map */}
  <ImplementationDetailCard />  {/* mb-6 built-in */}
</section>

<section className="mb-10">
  <label>Data Monitoring</label>
  <MonitoringHistoryCard />     {/* mb-6 built-in */}
  {/* Form fields */}
</section>
```

---

## 🔍 Debugging Tips

### Jika Card tidak muncul:

1. **Check kondisi render**:
   ```jsx
   console.log('selectedImplementasi:', selectedImplementasi);
   console.log('monitoringRecords:', monitoringRecordsByImplementasi);
   ```

2. **Verifikasi props**:
   - Pastikan `selectedImplementasi` memiliki semua field
   - Pastikan `monitoringRecords` adalah array
   - Pastikan `monitoringProgress` memiliki `completed` dan `total`

3. **Check import**:
   - Pastikan path import benar
   - Verifikasi kedua komponen sudah di-export

### Jika styling tidak sesuai:

1. **Ensure Tailwind CSS loaded**: Check browser console untuk warnings
2. **Check dark mode**: Toggle dark mode untuk verify styling
3. **Check breakpoints**: Gunakan developer tools untuk resize

---

## ✨ Advanced: Customization

### Mengubah Warna Card

Edit di file masing-masing komponen:

**ImplementationDetailCard**:
```jsx
// Baris 12-13, ganti:
className="border-2 border-cyan-300 bg-gradient-to-br from-cyan-50 to-blue-50"
// Menjadi warna lain, contoh:
className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-violet-50"
```

**MonitoringHistoryCard**:
```jsx
// Baris 110-111, ganti:
className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50"
// Menjadi warna lain
```

### Mengubah Komponen yang Ditampilkan

Jika ingin hide beberapa field:

**ImplementationDetailCard**:
```jsx
// Edit detailItems array (baris ~15-50)
const detailItems = [
  // { icon: FiCheckCircle, ... }, // Comment untuk hide
  // Atau hapus item yang tidak perlu
];
```

---

## 📚 Referensi File

### Komponen Baru
- `FE_CCS/src/features/monitoring/components/ImplementationDetailCard.jsx` (250 baris)
- `FE_CCS/src/features/monitoring/components/MonitoringHistoryCard.jsx` (350 baris)

### File yang Diupdate
- `FE_CCS/src/features/monitoring/index.js` (export ditambah)
- `FE_CCS/src/features/implementation/index.js` (export LocationCard ditambah)
- `FE_CCS/src/features/implementation/components/ImplementasiForm.jsx` (LocationCard integrated)

### Dokumentasi
- `FE_CCS/CARD_COMPONENTS_GUIDE.md` (Panduan lengkap)
- `FE_CCS/INTEGRATION_GUIDE_MONITORING.md` (File ini)

---

## ✅ Checklist Integrasi

- [ ] Import ImplementationDetailCard dan MonitoringHistoryCard di MonitoringForm
- [ ] Tambahkan ImplementationDetailCard setelah map/tabel implementasi
- [ ] Tambahkan MonitoringHistoryCard sebelum form fields
- [ ] Test responsive design (mobile, tablet, desktop)
- [ ] Test dark mode toggle
- [ ] Verify data flow (console logging)
- [ ] Test dengan data real dari API
- [ ] Run npm run build (verify no errors)
- [ ] Test di browser untuk styling & animations

---

## 🚀 Next Steps

1. **Integrate** komponen ke MonitoringForm sesuai panduan
2. **Test** di browser dengan data sesungguhnya
3. **Adjust** styling jika diperlukan
4. **Deploy** ke production

---

## ❓ FAQ

**Q: Card muncul di atas atau bawah form fields?**
A: Rekomendasi: Atas (setelah map). Ini lebih logical karena user pilih lokasi dulu, lihat history, baru isi form.

**Q: Bisakah card di-hide dengan toggle button?**
A: Ya, bungkus dengan conditional render menggunakan state toggle.

**Q: Apa kalau history kosong?**
A: MonitoringHistoryCard otomatis tidak render jika array kosong (sudah di-handle di komponen).

**Q: Bisa custom jumlah kolom grid?**
A: Ya, edit className grid di masing-masing komponen.

---

