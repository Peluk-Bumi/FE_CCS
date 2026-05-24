import { useState, useRef, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import LoadingSpinner from "@/shared/components/layout/LoadingSpinner";
import { FiMapPin, FiCalendar, FiUser, FiPhone, FiBriefcase, FiCheckCircle, FiNavigation, FiLink, FiAlertCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "react-toastify/dist/ReactToastify.css";
import PageTitle from "@/shared/components/common/PageTitle";
import api from "@/shared/services/api";
import { useAuth } from "@/app/context/AuthContext";
import { FormButton } from "@/shared/components/ui/button/FormButton";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/components/ui/select";
import RadioCard from "@/shared/components/ui/radio-card";
import { cn } from "@/shared/utils/utils";
import QrCodeModal from "@/features/admin/components/laporan/QrCodeModal";
import { downloadQrDataUrl, generatePlanningQrDataUrl } from "../utils/planningQr";

// ✅ Fix Leaflet default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

import { renderToStaticMarkup } from "react-dom/server";

// ✅ Simple minimalist dot marker icon
const createSimpleMarker = (color) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: renderToStaticMarkup(
      <div className="relative flex items-center justify-center">
        <div 
          className="w-4 h-4 rounded-full border-2 border-white shadow-lg"
          style={{ backgroundColor: color }}
        />
        <div 
          className="absolute w-8 h-8 rounded-full animate-ping opacity-20"
          style={{ backgroundColor: color }}
        />
      </div>
    ),
    iconSize: [20, 20],
    iconAnchor: [10, 10],
    popupAnchor: [0, -10],
  });
};

const newMarkerIcon = createSimpleMarker("#3b82f6"); // Blue for planning

// ✅ Map click handler component
function LocationMarker({ onLocationSelect, selectedLocation }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
      toast.success("Lokasi berhasil ditandai di peta", {
        position: "top-center",
        autoClose: 2000
      });
    },
  });

  return selectedLocation ? (
    <Marker position={selectedLocation} icon={newMarkerIcon}>
      <Popup>
        <div className="text-center">
          <p className="font-semibold text-emerald-700">Lokasi Perencanaan</p>
          <p className="text-xs text-gray-600">
            {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
          </p>
        </div>
      </Popup>
    </Marker>
  ) : null;
}

// ✅ Komponen untuk menghandle map view updates
function MapViewUpdater({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}

const getLocalTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const PerencanaanForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([-2.5489, 118.0149]); // Indonesia center
  const [mapZoom, setMapZoom] = useState(5); // Default: show Indonesia region
  const { user } = useAuth();
  const isUserCreator = user?.role === "user";
  const resolvedCompanyName = (
    user?.nama_perusahaan ||
    user?.company_name ||
    user?.organization ||
    user?.name ||
    user?.username ||
    user?.email ||
    ""
  ).trim();
  const isAdmin = user?.role === 'admin';
  const [adminUsers, setAdminUsers] = useState([]);
  const minDateValue = getLocalTodayString();

  // Fetch user list for admin to choose company name
  useEffect(() => {
    if (!isAdmin) return;
    let mounted = true;
    (async () => {
      try {
        const res = await api.get('/users/institution', { params: { limit: 100 } });
        const list = res.data?.data || res.data || [];
        if (!mounted) return;
        setAdminUsers(list.map(u => ({
          id: u.id,
          label: u.label || u.name || u.company_name || u.nama_perusahaan || u.username || u.email || `User ${u.id}`
        })));
      } catch (err) {
        console.error("Failed to fetch institution users:", err);
      }
    })();
    return () => { mounted = false };
  }, [isAdmin]);

  const validationSchema = Yup.object({
    nama_perusahaan: Yup.string().required("Wajib diisi"),
    identitas_blok: Yup.string().nullable(),
    nama_pic: Yup.string().required("Wajib diisi"),
    narahubung: Yup.string().required("Wajib diisi"),
    jenis_kegiatan: Yup.string().required("Pilih salah satu"),
    lokasi: Yup.string().required("Wajib diisi - Masukkan nama desa/wilayah"),
    lat: Yup.number().required("Latitude diperlukan - Klik pada peta"),
    lng: Yup.number().required("Longitude diperlukan - Klik pada peta"),
    jumlah_bibit: Yup.number().required("Wajib diisi").positive("Harus positif"),
    jenis_bibit: Yup.string().required("Wajib diisi"),
    tanggal_pelaksanaan: Yup.string()
      .required("Wajib diisi")
      .test("not-backdate", "Tanggal pelaksanaan tidak boleh sebelum hari ini", (value) => {
        if (!value) return false;
        return value >= minDateValue;
      }),
  });

  const formik = useFormik({
    initialValues: {
      user_id: "",
      nama_perusahaan: "",
      identitas_blok: "",
      nama_pic: "",
      narahubung: "",
      jenis_kegiatan: "",
      lokasi: "",
      lat: "",
      lng: "",
      jumlah_bibit: "",
      jenis_bibit: "",
      tanggal_pelaksanaan: "",
      durasi_proyek: 6,
      monitoring_interval: 3,
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      setSubmitting(true);
      
      try {
        const payload = isUserCreator
          ? { ...values, nama_perusahaan: resolvedCompanyName }
          : { ...values };

        if (isUserCreator && !payload.nama_perusahaan) {
          toast.error("Nama lembaga user belum tersedia. Silakan lengkapi profil akun Anda.");
          return;
        }

        console.log('[PerencanaanForm] ========== FORM SUBMISSION START ==========');
        console.log('[PerencanaanForm] Form data:', payload);

        // Backend now records blockchain transaction for this activity.
        const response = await api.post('/perencanaan', payload);
        const savedPerencanaan = response.data?.data || response.data || null;
        const blockchain = response.data?.blockchain || savedPerencanaan?.blockchain || {};

        if (blockchain.tx_hash) {
          toast.success('✅ Data tersimpan dan transaksi blockchain berhasil dibuat!');
        } else if (blockchain.doc_hash) {
          toast.warning('⚠️ Data tersimpan, blockchain belum terkonfirmasi.');
        } else {
          toast.warning('⚠️ Data tersimpan, blockchain gagal diproses.');
        }

        resetForm();
        setSelectedLocation(null);
        setSuccess(true);

        if (savedPerencanaan?.id) {
          const generatedQr = await generatePlanningQrDataUrl(savedPerencanaan);
          setQrCodeData({
            url: generatedQr,
            verified: Boolean(blockchain.tx_hash || blockchain.doc_hash),
          });
          setQrModalOpen(true);
        }

      } catch (err) {
        console.error('[PerencanaanForm] Error:', err);
        const errorMsg = err.response?.data?.message || err.message || 'Gagal menyimpan data';
        toast.error('❌ ' + errorMsg);
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (isUserCreator && resolvedCompanyName) {
      formik.setFieldValue("nama_perusahaan", resolvedCompanyName);
      if (user?.id) {
        formik.setFieldValue("user_id", user.id);
      }
    }
  }, [isUserCreator, resolvedCompanyName, user?.id]);

  // ✅ Handle map click untuk menandai lokasi
  const handleLocationSelect = (latlng) => {
    setSelectedLocation(latlng);
    formik.setFieldValue("lat", latlng.lat);
    formik.setFieldValue("lng", latlng.lng);
  };

  // ✅ Get current location sebagai starting point
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Browser tidak mendukung geolocation!");
      return;
    }

    toast.info("📍 Mendapatkan lokasi Anda...", { autoClose: 2000 });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newCenter = [latitude, longitude];
        setMapCenter(newCenter);
        setMapZoom(13);
        handleLocationSelect({ lat: latitude, lng: longitude });
        toast.success("✅ Peta dipusatkan ke lokasi Anda!", { autoClose: 2000 });
      },
      (error) => {
        console.error("Geolocation error:", error);
        toast.warning("⚠️ Tidak dapat mendapatkan lokasi, menggunakan lokasi default");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const inputFields = [
    { name: "nama_perusahaan", label: "Nama Lembaga", icon: FiBriefcase, placeholder: "Yayasan Contoh Indonesia" },
    { name: "nama_pic", label: "Nama PIC", icon: FiUser, placeholder: "John Doe" },
    { name: "narahubung", label: "Narahubung", icon: FiPhone, placeholder: "812-3456-7890", prefix: "+62" },
    { name: "jumlah_bibit", label: "Jumlah Bibit", icon: FiCheckCircle, type: "number", placeholder: "100", suffix: "bibit" },
    { name: "jenis_bibit", label: "Jenis Bibit", icon: FiCheckCircle, placeholder: "Pilih jenis pohon atau tulis manual" },
    { name: "tanggal_pelaksanaan", label: "Tanggal Pelaksanaan", icon: FiCalendar, type: "date" },
    { name: "durasi_proyek", label: "Durasi Proyek", icon: FiCalendar, type: "number", disabled: true, readonly: true, suffix: "bulan" },
    { name: "monitoring_interval", label: "Interval Monitoring", icon: FiCalendar, type: "number", disabled: true, readonly: true, suffix: "bulan" },
  ];

  const treeSpeciesOptions = [
    "Rhizophora apiculata",
    "Rhizophora mucronata",
    "Avicennia marina",
    "Bruguiera gymnorrhiza",
    "Sonneratia alba",
    "Bakau",
    "Mahoni",
    "Trembesi",
    "Pine",
    "Oak",
    "Maple",
    "Eucalyptus",
    "Acacia",
    "Cedar",
    "Mangrove campuran",
  ];
  return (
    <div className="py-12">
        {/* Header */}

        <PageTitle
          type="page"
          badge="Formulir Perencanaan"
          badgeIcon={FiCheckCircle}
          title="Form Perencanaan Kegiatan"
          description="Isi data dengan lengkap untuk merencanakan kegiatan konservasi"
        />
        

        {/* Success Animation */}
        <AnimatePresence>
          {success && (
            <motion.div
              className="mb-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <FiCheckCircle className="w-16 h-16 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-2xl font-bold mb-2">Berhasil Disimpan!</h3>
              <p>Data perencanaan Anda telah tersimpan dengan baik</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Card */}
        <motion.div
          className="glass bg-white/90 dark:bg-gray-900 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <form onSubmit={formik.handleSubmit} className="p-8 md:p-12">
            {/* Input Fields Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {inputFields.map((field, index) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="group"
                >
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    <field.icon className="w-5 h-5 text-primary dark:text-primary-light" />
                    {field.label}
                  </label>
                  <div className="relative">
                    {field.name === "nama_perusahaan" && isAdmin ? (
                      <Select
                        value={String(formik.values.user_id || "")}
                        onValueChange={(val) => {
                          const selectedUser = adminUsers.find((item) => String(item.id) === String(val));
                          if (selectedUser) {
                            formik.setFieldValue("nama_perusahaan", selectedUser.label);
                            formik.setFieldValue("user_id", selectedUser.id);
                          }
                        }}
                        disabled={field.disabled}
                      >
                        <SelectTrigger
                          className={cn(
                            formik.touched[field.name] && formik.errors[field.name]
                              ? "border-red-400"
                              : ""
                          )}
                        >
                          <SelectValue placeholder="Pilih Nama Lembaga" />
                        </SelectTrigger>
                        <SelectContent>
                          {adminUsers.map((option) => (
                            <SelectItem key={option.id} value={String(option.id)}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={field.type || "text"}
                        name={field.name}
                        placeholder={field.placeholder}
                        value={formik.values[field.name]}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        min={field.type === "date" ? minDateValue : undefined}
                        list={field.name === "jenis_bibit" ? "global-tree-species" : undefined}
                        disabled={field.disabled}
                        readOnly={field.readonly || (field.name === "nama_perusahaan" && isUserCreator)}
                        prefix={field.prefix}
                        suffix={field.suffix}
                        className={cn(
                          formik.touched[field.name] && formik.errors[field.name]
                            ? "border-red-400"
                            : ""
                        )}
                      />
                    )}
                    {field.name === "jenis_bibit" && (
                      <datalist id="global-tree-species">
                        {treeSpeciesOptions.map((species) => (
                          <option key={species} value={species} />
                        ))}
                      </datalist>
                    )}
                    {field.name === "nama_perusahaan" && isUserCreator && (
                      <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-300">
                        Diambil otomatis dari akun user yang sedang login.
                      </p>
                    )}
                    {field.name === "nama_perusahaan" && isAdmin && (
                      <p className="mt-2 text-xs text-emerald-600 dark:text-emerald-300">
                        Pilih nama user dari daftar untuk mengisi nama lembaga.
                      </p>
                    )}
                  </div>
                  {formik.touched[field.name] && formik.errors[field.name] && (
                    <motion.p
                      className="text-red-500 text-sm mt-3 flex items-center gap-1"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <FiAlertCircle className="w-4 h-4" />
                      {formik.errors[field.name]}
                    </motion.p>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Jenis Kegiatan */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                <FiCheckCircle className="w-5 h-5 text-primary dark:text-primary-light" />
                Jenis Kegiatan
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: "Planting Mangrove", value: "Planting Mangrove", disabled: false },
                  { label: "Coral Transplanting", value: "Coral Transplanting", disabled: true },
                ].map((option) => (
                  <RadioCard
                    key={option.value}
                    label={option.label}
                    name="jenis_kegiatan"
                    value={option.value}
                    checked={formik.values.jenis_kegiatan === option.value}
                    disabled={option.disabled}
                    onChange={formik.handleChange}
                    className="h-full"
                  />
                ))}
              </div>
              <p className="mt-3 text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl px-4 py-3">
                Catatan: Coral Transplanting untuk kegiatan mendatang dan sementara tidak bisa dipilih.
              </p>
              {formik.touched.jenis_kegiatan && formik.errors.jenis_kegiatan && (
                <motion.p
                  className="text-red-500 text-sm mt-3 flex items-center gap-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <FiAlertCircle className="w-4 h-4" />
                  {formik.errors.jenis_kegiatan}
                </motion.p>
              )}
            </motion.div>

            {/* ✅ INTERACTIVE MAP - Tandai Lokasi Baru */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                <FiMapPin className="w-5 h-5 text-primary dark:text-primary-light" />
                Tandai Lokasi di Peta
                <span className="text-red-500">*</span>
              </label>

              {/* Info Box */}
              <div className="mb-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FiMapPin className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-2">
                      <span className="inline-flex items-center gap-2">
                        <FiMapPin className="w-4 h-4" />
                        <span>Cara Menandai Lokasi</span>
                      </span>
                    </h4>
                    <ol className="text-sm text-blue-800 dark:text-blue-300 space-y-1 list-decimal list-inside">
                      <li>Klik tombol "Pusatkan ke Lokasi Saya" untuk memudahkan (opsional)</li>
                      <li><strong>Klik pada peta</strong> di lokasi yang diinginkan</li>
                      <li>Marker hijau akan muncul di lokasi yang dipilih</li>
                      <li>Koordinat otomatis tersimpan</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Map Controls & Location Info */}
              <div className="space-y-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <FiMapPin className="w-4 h-4 text-primary" />
                      Nama Lokasi / Wilayah <span className="text-red-500">*</span>
                    </label>
                    <Input
                      name="lokasi"
                      placeholder="Contoh: Desa Bakau, Kec. Pesisir"
                      value={formik.values.lokasi}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={cn(formik.touched.lokasi && formik.errors.lokasi ? "border-red-400" : "")}
                    />
                    {formik.touched.lokasi && formik.errors.lokasi && (
                      <p className="text-red-500 text-xs mt-1">{formik.errors.lokasi}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                      <FiLink className="w-4 h-4 text-primary" />
                      Identitas Blok (Opsional)
                    </label>
                    <Input
                      name="identitas_blok"
                      placeholder="Contoh: Blok A / Petak 03"
                      value={formik.values.identitas_blok}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Coordinates Display */}
                  <div className="flex-1 flex gap-2">
                    <Input
                      type="text"
                      value={formik.values.lat ? `LAT: ${formik.values.lat.toFixed(6)}` : "Latitude belum ditandai"}
                      readOnly
                      className="flex-1 font-mono text-sm bg-gray-50 dark:bg-gray-800"
                    />
                    <Input
                      type="text"
                      value={formik.values.lng ? `LNG: ${formik.values.lng.toFixed(6)}` : "Longitude belum ditandai"}
                      readOnly
                      className="flex-1 font-mono text-sm bg-gray-50 dark:bg-gray-800"
                    />
                  </div>
                  
                  {/* Center Map Button */}
                  <motion.button
                    type="button"
                    onClick={getCurrentLocation}
                    className="relative group flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg overflow-hidden transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* hover overlay */}
                    <span className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary to-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* content */}
                    <span className="relative z-10 flex items-center gap-2">
                      <FiNavigation className="w-5 h-5" />
                      <span className="hidden sm:inline">Pusatkan ke Lokasi Saya</span>
                      <span className="sm:hidden">Lokasi Saya</span>
                    </span>
                  </motion.button>
                </div>
              </div>

              {/* Interactive Map */}
              <motion.div
                className="rounded-2xl overflow-hidden border-2 border-primary/20 dark:border-primary/30 shadow-xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: "500px", width: "100%" }}
                  className="z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapViewUpdater center={mapCenter} zoom={mapZoom} />
                  <LocationMarker 
                    onLocationSelect={handleLocationSelect}
                    selectedLocation={selectedLocation}
                  />
                </MapContainer>
              </motion.div>

              {/* Validation Error */}
              {formik.touched.lokasi && formik.errors.lokasi && (
                <motion.p
                  className="text-red-500 text-sm mt-3 flex items-center gap-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <FiAlertCircle className="w-4 h-4" />
                  {formik.errors.lokasi}
                </motion.p>
              )}

              {/* Success indicator */}
              {selectedLocation && (
                <motion.div
                  className="mt-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700 rounded-xl p-4"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                    <FiCheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Pin Lokasi berhasil ditandai!</span>
                  </div>
                  <p className="text-sm text-primary dark:text-primary-light mt-1">
                    Koordinat: <span className="font-mono">{formik.values.lat?.toFixed(6)}, {formik.values.lng?.toFixed(6)}</span>
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <FormButton
                type="submit"
                loading={submitting}
                icon={<FiCheckCircle className="w-5 h-5" />}
              >
                {submitting ? "Menyimpan data & transaksi..." : "Simpan Kegiatan"}
              </FormButton>
            </motion.div>
          </form>
        </motion.div>

      <QrCodeModal
        open={qrModalOpen}
        qrCodeData={qrCodeData}
        onClose={() => setQrModalOpen(false)}
        onDownload={() => qrCodeData?.url && downloadQrDataUrl(qrCodeData.url, "qr-perencanaan.png")}
        title="QR Code Perencanaan"
        noteTitle="QR ini dipakai untuk verifikasi monitoring"
        noteDescription="Simpan QR ini atau unduh kembali dari halaman All Perencanaan. Saat dipindai, QR akan mengarahkan user ke halaman monitoring perencanaan yang sesuai."
        downloadLabel="Download QR Perencanaan (PNG)"
      />
    </div>
  );
};

export default PerencanaanForm;

