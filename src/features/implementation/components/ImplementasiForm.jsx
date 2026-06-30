import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "@/shared/services/api";
import { useAuth } from "@/app/context/AuthContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FiNavigation, FiX, FiUpload, FiCheckCircle, FiMapPin, FiAlertCircle, FiCamera, FiFolder } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import LoadingSpinner from "@/shared/components/layout/LoadingSpinner";
import PageTitle from "@/shared/components/common/PageTitle";
import { FormButton } from "@/shared/components/ui/button/FormButton";
import ProjectStatusBadge from "@/shared/components/common/ProjectStatusBadge";
import { resolveProjectDisplay } from "@/shared/utils/projectDisplay";
import { Input } from "@/shared/components/ui/input";
import RadioCard from "@/shared/components/ui/radio-card";
import { cn } from "@/shared/utils/utils";
import { renderToStaticMarkup } from "react-dom/server";
import { FaSeedling } from "react-icons/fa";
import LocationCard from "@/shared/components/ui/card/LocationCard";

// ✅ Enhanced transparent minimalist marker icon using CSS variables
const createIconMarker = (isSelected = false) => {
  const opacity = isSelected ? 0.95 : 0.75;
  // Use CSS variable for primary color with opacity
  const backgroundColor = `rgba(16, 185, 129, ${opacity})`; // Fallback to emerald-500
  const primaryColor = isSelected ? "var(--primary-dark, #059669)" : "var(--primary, #10b981)";

  return L.divIcon({
    className: "custom-div-icon",
    html: renderToStaticMarkup(
      <div className="relative flex items-center justify-center">
        {/* Outer Glow for Selected */}
        {isSelected && (
          <div 
            className="absolute w-12 h-12 rounded-full animate-ping opacity-20"
            style={{ backgroundColor: primaryColor }}
          />
        )}
        {/* Circular Background with Transparency */}
        <div 
          className={`flex items-center justify-center rounded-full border-2 border-white shadow-xl transition-all ${
            isSelected ? "w-10 h-10 scale-110" : "w-8 h-8"
          }`}
          style={{ backgroundColor: primaryColor, opacity: opacity, backdropFilter: "blur(2px)" }}
        >
          <FaSeedling className="text-white w-1/2 h-1/2" />
        </div>
        {/* Bottom Pointer */}
        <div 
          className="absolute -bottom-1 w-2 h-2 rotate-45 border-r-2 border-b-2 border-white shadow-sm"
          style={{ backgroundColor: primaryColor, opacity: opacity }}
        />
      </div>
    ),
    iconSize: isSelected ? [40, 40] : [32, 32],
    iconAnchor: isSelected ? [20, 20] : [16, 16],
    popupAnchor: [0, -20],
  });
};

// ✅ Bibit pohon marker untuk lokasi yang sudah ada dan yang dipilih
const existingMarkerIcon = createIconMarker(false);
const selectedMarkerIcon = createIconMarker(true);
const DOCUMENTATION_MAX_FILES = 10;
const DOCUMENTATION_MAX_FILE_SIZE_MB = 10;
const DOCUMENTATION_MAX_FILE_SIZE_BYTES = DOCUMENTATION_MAX_FILE_SIZE_MB * 1024 * 1024;
const DOCUMENTATION_SUPPORTED_FORMATS = [
  'JPG',
  'JPEG',
  'PNG',
  'SVG',
  'HEIC',
];
const DOCUMENTATION_ACCEPT = '.jpg,.jpeg,.png,.svg,.heic,image/*';

const getLocalTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const ImplementasiForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [existingLocations, setExistingLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [perencanaans, setPerencanaans] = useState([]);
  const [selectedPerencanaan, setSelectedPerencanaan] = useState(null);
  const [loadingPerencanaan, setLoadingPerencanaan] = useState(true);
  // ✅ ADD NEW STATES
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const { user } = useAuth();
  const minDateValue = getLocalTodayString();

  const validationSchema = Yup.object({
    perencanaan_id: Yup.string().required("Wajib pilih perencanaan"),
    pic_koorlap: Yup.string().required("Wajib diisi"),
    dokumentasi: Yup.mixed().required("Wajib diisi"),
    geotagging: Yup.string().required("Wajib diisi - Pilih lokasi dari peta"),
  });

  const formik = useFormik({
    initialValues: {
      perencanaan_id: "",
      kesesuaian: {
        nama_perusahaan: null,
        lokasi: null,
        jenis_kegiatan: null,
        jumlah_bibit: null,
        jenis_bibit: null,
        tanggal: null,
        realisasi_aktual: {
          nama_perusahaan: "",
          lat: "",
          long: "",
          jenis_kegiatan: "",
          jumlah_bibit: "",
          jenis_bibit: "",
          tanggal: "",
        },
      },
      pic_koorlap: "",
      dokumentasi: null,
      geotagging: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setSubmitting(true);
      try {
        if (values.kesesuaian?.tanggal === false) {
          const tanggalDetail = values.kesesuaian?.realisasi_aktual?.tanggal;
          if (tanggalDetail && tanggalDetail < minDateValue) {
            toast.error("Tanggal tidak boleh sebelum hari ini");
            setSubmitting(false);
            return;
          }
        }

        // Clean up realisasi_aktual: only send fields that are marked as false
        const cleanedAktual = {};
        Object.keys(values.kesesuaian).forEach(key => {
          if (values.kesesuaian[key] === false && key !== 'realisasi_aktual') {
            if (key === 'lokasi') {
              cleanedAktual.lat = values.kesesuaian.realisasi_aktual.lat;
              cleanedAktual.long = values.kesesuaian.realisasi_aktual.long;
            } else {
              cleanedAktual[key] = values.kesesuaian.realisasi_aktual[key];
            }
          }
        });

        const payloadKesesuaian = {
          ...values.kesesuaian,
          realisasi_aktual: cleanedAktual
        };

        const formData = new FormData();
        formData.append("perencanaan_id", values.perencanaan_id);
        formData.append("kesesuaian", JSON.stringify(payloadKesesuaian));
        formData.append("pic_koorlap", values.pic_koorlap);
        if (Array.isArray(values.dokumentasi)) {
          values.dokumentasi.forEach((file) => formData.append("dokumentasi[]", file));
        }
        formData.append("geotagging", values.geotagging);

        const response = await api.post("/implementasi", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.status === 201 || response.status === 200) {
          const submittedPerencanaanId = String(values.perencanaan_id);
          setPerencanaans((prev) => prev.filter((item) => String(item.id) !== submittedPerencanaanId));
          setExistingLocations((prev) => prev.filter((item) => String(item.id) !== submittedPerencanaanId));
          setSuccess(true);
          toast.success("✅ Implementasi berhasil disimpan!");
          setTimeout(() => {
            formik.resetForm();
            setSelectedLocation(null);
            setSelectedPerencanaan(null);
            setSuccess(false);
          }, 2500);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        const errorMsg = error.response?.data?.message || error.message || "Gagal menyimpan implementasi";
        toast.error(`❌ ${errorMsg}`);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // ✅ Fetch daftar perencanaan dan lokasi (combined)
  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const role = user?.role;
        const perencanaanEndpoint = role === 'admin' ? '/perencanaan/all' : '/perencanaan';
        const implementasiEndpoint = role === 'admin' ? '/implementasi/all' : '/implementasi';

        const [perencanaanResponse, implementasiResponse] = await Promise.all([
          api.get(perencanaanEndpoint),
          api.get(implementasiEndpoint),
        ]);

        const data = perencanaanResponse.data?.data || perencanaanResponse.data || [];
        const implementasiData = implementasiResponse.data?.data || implementasiResponse.data || [];
        const usedPerencanaanIds = new Set(
          (Array.isArray(implementasiData) ? implementasiData : [])
            .map((impl) => String(impl?.perencanaan_id ?? ""))
            .filter(Boolean)
        );

        const availableData = data.filter((item) => {
          const alreadyImplemented = item?.is_implemented === true || item?.is_implemented === 1 || item?.is_implemented === "1";
          const alreadyUsedInImplementasi = usedPerencanaanIds.has(String(item?.id));
          return !alreadyImplemented && !alreadyUsedInImplementasi;
        });
        
        if (isMounted) {
          setPerencanaans(availableData);
          setExistingLocations(availableData);
          
          if (availableData.length > 0) {
            console.log(`✅ ${availableData.length} lokasi perencanaan siap implementasi ditemukan`);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (isMounted) {
          setPerencanaans([]);
          setExistingLocations([]);
        }
      } finally {
        if (isMounted) {
          setLoadingPerencanaan(false);
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  // ✅ Handle perencanaan selection
  const handlePerencanaanSelect = (perencanaan) => {
    setSelectedPerencanaan(perencanaan);
    formik.setFieldValue("perencanaan_id", perencanaan.id);
    // Auto-select lokasi dari perencanaan yang dipilih
    handleLocationSelect(perencanaan);
  };

  // ✅ Handle marker selection
  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
    setSelectedPerencanaan(location);

    if (location?.id) {
      formik.setFieldValue("perencanaan_id", String(location.id));
    }

    // Format geotagging as "lat,long"
    const lat = location?.lat;
    const lng = location?.long ?? location?.lng;

    if (lat !== undefined && lng !== undefined) {
      const geotagging = `${lat},${lng}`;
      formik.setFieldValue("geotagging", geotagging);
    }
  };

  // ✅ HANDLE DRAG AND DROP
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(Array.from(files));
    }
  };

  // ✅ PROCESS FILES (supports images, videos, HEIC conversion)
  const processFiles = async (files) => {
    const accepted = [];

    for (const file of files) {
      const name = (file.name || '').toLowerCase();
      const isHeic = name.endsWith('.heic') || name.endsWith('.heif') || /heic|heif/.test(file.type);
      const isImage = file.type && file.type.startsWith('image/');
      const isVideo = file.type && file.type.startsWith('video/');
      const isSupportedByExtension = name.match(/\.(jpg|jpeg|png|gif|webp|heic|heif|mp4|mov|webm|ogg)$/);

      if (file.size > DOCUMENTATION_MAX_FILE_SIZE_BYTES) {
        toast.error(`❌ ${file.name} melebihi ${DOCUMENTATION_MAX_FILE_SIZE_MB} MB`);
        continue;
      }

      if (isHeic) {
        try {
          const heic2anyModule = await import('heic2any');
          const heic2any = heic2anyModule.default || heic2anyModule;
          const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.9 });
          if (Array.isArray(converted)) {
            converted.forEach((b, i) => {
              const f = new File([b], `${name.replace(/\.heic|\.heif/, '')}-${i + 1}.jpg`, { type: 'image/jpeg' });
              accepted.push(f);
            });
          } else if (converted) {
            const f = new File([converted], `${name.replace(/\.heic|\.heif/, '')}.jpg`, { type: 'image/jpeg' });
            accepted.push(f);
          }
        } catch (err) {
          console.warn('[Implementasi] HEIC conversion failed:', err);
        }
        continue;
      }

      if (isImage || isVideo) {
        accepted.push(file);
      } else {
        if (isSupportedByExtension) {
          accepted.push(file);
        }
      }
    }

    if (accepted.length === 0) {
      toast.error('❌ Silakan pilih file JPG, JPEG, PNG, WEBP, GIF, HEIC, HEIF, MP4, MOV, WEBM, atau OGG!');
      return;
    }

    const currentFiles = formik.values.dokumentasi || [];
    const availableSlots = Math.max(DOCUMENTATION_MAX_FILES - currentFiles.length, 0);

    if (availableSlots === 0) {
      toast.error(`❌ Maksimal ${DOCUMENTATION_MAX_FILES} file dokumentasi`);
      return;
    }

    const newFiles = [...currentFiles, ...accepted.slice(0, availableSlots)];
    formik.setFieldValue('dokumentasi', newFiles);
    setShowUploadModal(false);

    if (accepted.length > availableSlots) {
      toast.warning(`⚠️ Hanya ${availableSlots} file yang ditambahkan karena batas maksimal ${DOCUMENTATION_MAX_FILES} file`);
    } else {
      toast.success(`✅ ${accepted.length} file berhasil ditambahkan!`);
    }
  };

  // ✅ HANDLE FILE INPUT
  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files) {
      processFiles(Array.from(files));
    }
  };

  // ✅ HANDLE CAMERA
  const handleCameraCapture = (e) => {
    const files = e.target.files;
    if (files) {
      processFiles(Array.from(files));
    }
  };

  // ✅ OPEN CAMERA
  const openCamera = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  // ✅ OPEN FILE PICKER
  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="py-12">
      {/* Header */}
      <PageTitle
        type="page"
        badge="Formulir Implementasi"
        badgeIcon={FiCheckCircle}
        title="Form Implementasi Kegiatan"
        description="Dokumentasi pelaksanaan kegiatan konservasi"
      />

      {/* Success Animation */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="mb-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-6 text-white text-center"
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
            <h3 className="text-2xl font-bold mb-2">Data Tersimpan!</h3>
            <p>Implementasi kegiatan berhasil didokumentasikan</p>
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
            
            {/* ✅ SELECT LOCATION FROM MAP - PERTAMA */}
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                <FiMapPin className="w-5 h-5 text-green-600 dark:text-green-400" />
                Pilih Lokasi Implementasi
                <span className="text-red-500">*</span>
              </label>

              {/* Info Box */}
              <div className="mb-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-700 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <FiMapPin className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-bold text-green-900 dark:text-green-200 mb-2">
                      📍 Pilih dari Lokasi yang Sudah Direncanakan
                    </h4>
                    <p className="text-sm text-green-800 dark:text-green-300">
                      Klik pada marker biru di peta untuk memilih lokasi implementasi. 
                      Lokasi ini berasal dari data perencanaan yang sudah dibuat sebelumnya.
                    </p>
                  </div>
                </div>
              </div>

              {existingLocations.length > 0 && (
                <div className="mb-6 overflow-hidden rounded-2xl border border-gray-200/80 bg-white/90 shadow-sm dark:border-gray-700 dark:bg-gray-900/90">
                  <div className="flex flex-col gap-1 border-b border-gray-200 px-4 py-4 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Daftar Lokasi Siap Implementasi</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Pilih baris untuk menyorot lokasi di peta dan menjaga kolom tetap konsisten.</p>
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{existingLocations.length} lokasi tersedia</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-[760px] w-full border-separate border-spacing-0">
                      <thead className="bg-gray-50/80 dark:bg-gray-800/60">
                        <tr className="border-b border-gray-200 dark:border-gray-700">
                          <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Status</th>
                          <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Nama Lembaga</th>
                          <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Lokasi & Geotagging</th>
                          <th className="p-3 text-center text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {existingLocations.map((location) => {
                          const { company, location: locationName, status } = resolveProjectDisplay(location);
                          const isSelected = selectedLocation?.id === location.id;

                          return (
                            <tr
                              key={location.id}
                              className={`border-b border-gray-100 dark:border-gray-800 transition-colors ${isSelected ? 'bg-green-50/80 dark:bg-green-900/20' : 'hover:bg-gray-50/80 dark:hover:bg-gray-800/50'}`}
                            >
                              <td className="p-3 align-top">
                                <ProjectStatusBadge status={status} size="small" />
                              </td>
                              <td className="p-3 align-top">
                                <div className="font-medium text-gray-900 dark:text-gray-100">{company}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{location.jenis_kegiatan}</div>
                              </td>
                              <td className="p-3 align-top">
                                <div className="text-sm text-gray-700 dark:text-gray-300">{locationName}</div>
                                <div className="text-[10px] font-mono text-gray-400 dark:text-gray-500 mt-1 flex items-center gap-1">
                                  <FiNavigation className="w-2.5 h-2.5" />
                                  LAT: {location.lat} | LONG: {location.long || location.lng}
                                </div>
                              </td>
                              <td className="p-3 align-top text-center">
                                <button
                                  type="button"
                                  onClick={() => handlePerencanaanSelect(location)}
                                  className={`inline-flex items-center justify-center rounded-lg px-3 py-2 text-xs font-semibold transition ${isSelected ? 'bg-green-600 text-white shadow hover:bg-green-700' : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-200 dark:hover:bg-green-900/50'}`}
                                >
                                  {isSelected ? 'Dipilih' : 'Pilih Lokasi'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Map */}
              {loading ? (
                <div className="h-96 rounded-2xl bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Memuat lokasi perencanaan...</p>
                  </div>
                </div>
              ) : existingLocations.length === 0 ? (
                <div className="h-96 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-700 flex items-center justify-center">
                  <div className="text-center p-8">
                    <FiAlertCircle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-amber-900 dark:text-amber-200 mb-2">
                      Belum Ada Lokasi Perencanaan
                    </h3>
                    <p className="text-amber-700 dark:text-amber-300">
                      Silakan buat perencanaan terlebih dahulu untuk menandai lokasi.
                    </p>
                  </div>
                </div>
              ) : (
                <motion.div
                  className="rounded-2xl overflow-hidden border-2 border-green-200 dark:border-green-700 shadow-xl"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <MapContainer
                    center={[-2.5489, 118.0149]}
                    zoom={5}
                    style={{ height: "500px", width: "100%" }}
                    className="z-0"
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {existingLocations.map((location) => {
                      const lat = parseFloat(location.lat);
                      const lng = parseFloat(location.long ?? location.lng);
                      const isSelected = selectedLocation?.id === location.id;
                      
                      // Skip invalid coordinates
                      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
                        return null;
                      }
                      
                      return (
                        <Marker
                          key={location.id}
                          position={[lat, lng]}
                          icon={isSelected ? selectedMarkerIcon : existingMarkerIcon}
                          eventHandlers={{
                            click: () => handleLocationSelect(location),
                          }}
                        >
                          <Popup>
                            <div className="text-center">
                              <p className="font-bold text-green-700">{location.nama_perusahaan}</p>
                              <p className="text-xs text-gray-600 mb-2">
                                {location.jenis_kegiatan}
                              </p>
                              <button
                                onClick={() => handleLocationSelect(location)}
                                className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-lg transition-colors"
                              >
                                Pilih Lokasi Ini
                              </button>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                </motion.div>
              )}

              {/* ✅ DETAIL LOKASI TERPILIH - MENGGUNAKAN LOCATIONCARD COMPONENT */}
              <LocationCard 
                location={selectedLocation}
                isSelected={!!selectedLocation}
              />

              {/* Validation Error */}
              {formik.touched.geotagging && formik.errors.geotagging && (
                <motion.p
                  className="text-red-500 text-sm mt-3 flex items-center gap-1"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <FiAlertCircle className="w-4 h-4" />
                  {formik.errors.geotagging}
                </motion.p>
              )}
            </motion.div>

            {/* Checklist Kesesuaian */}
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
                Checklist Kesesuaian Perencanaan
              </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { field: 'nama_perusahaan', label: 'Nama Lembaga', type: 'text', description: 'Kesesuaian identitas lembaga penyelenggara' },
                  { field: 'lokasi', label: 'Koordinat Lokasi', type: 'coords', description: 'Kesesuaian titik GPS/geotagging di peta' },
                  { field: 'jenis_kegiatan', label: 'Jenis Kegiatan', type: 'text', description: 'Kesesuaian jenis aktivitas konservasi' },
                  { field: 'jumlah_bibit', label: 'Jumlah Bibit', type: 'number', suffix: 'bibit', description: 'Kesesuaian total bibit yang ditanam' },
                  { field: 'jenis_bibit', label: 'Jenis Bibit', type: 'text', description: 'Kesesuaian varietas bibit yang digunakan' },
                  { field: 'tanggal', label: 'Tanggal', type: 'date', description: 'Kesesuaian waktu pelaksanaan kegiatan' },
                ].map((item, index) => (
                  <motion.div
                    key={item.field}
                    className={cn(
                      "p-6 rounded-3xl border transition-all duration-300",
                      formik.values.kesesuaian[item.field] === false 
                        ? "border-amber-200 bg-amber-50/40 dark:bg-amber-900/10 shadow-sm" 
                        : "border-gray-100 bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm hover:shadow-md"
                    )}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * index }}
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.label}</div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{item.description}</p>
                        </div>
                        <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-gray-900/50 p-1.5 rounded-xl border border-gray-100 dark:border-gray-700">
                          <button
                            type="button"
                            onClick={() => formik.setFieldValue(`kesesuaian.${item.field}`, true)}
                            className={cn(
                              "px-4 py-2 text-xs font-bold rounded-lg transition-all",
                              formik.values.kesesuaian[item.field] === true
                                ? "bg-emerald-500 text-white shadow-lg"
                                : "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                            )}
                          >
                            Ya
                          </button>
                          <button
                            type="button"
                            onClick={() => formik.setFieldValue(`kesesuaian.${item.field}`, false)}
                            className={cn(
                              "px-4 py-2 text-xs font-bold rounded-lg transition-all",
                              formik.values.kesesuaian[item.field] === false
                                ? "bg-amber-500 text-white shadow-lg"
                                : "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700"
                            )}
                          >
                            Tidak
                          </button>
                        </div>
                      </div>

                      <AnimatePresence>
                        {formik.values.kesesuaian[item.field] === false && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-2 p-4 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm border border-amber-200 dark:border-amber-800 rounded-2xl shadow-inner">
                              <label className="text-[10px] uppercase tracking-widest font-black text-amber-600 dark:text-amber-400 mb-3 block">
                                Realisasi Aktual
                              </label>
                              
                              {item.type === 'coords' ? (
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-gray-400">LATITUDE</span>
                                    <Input
                                      type="number"
                                      placeholder="Contoh: -6.123"
                                      value={formik.values.kesesuaian.realisasi_aktual.lat}
                                      onChange={(e) => formik.setFieldValue('kesesuaian.realisasi_aktual.lat', e.target.value)}
                                      className="w-full bg-white dark:bg-gray-800 border-amber-100 focus:border-amber-400 h-10 text-sm font-mono"
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <span className="text-[10px] font-bold text-gray-400">LONGITUDE</span>
                                    <Input
                                      type="number"
                                      placeholder="Contoh: 106.123"
                                      value={formik.values.kesesuaian.realisasi_aktual.long}
                                      onChange={(e) => formik.setFieldValue('kesesuaian.realisasi_aktual.long', e.target.value)}
                                      className="w-full bg-white dark:bg-gray-800 border-amber-100 focus:border-amber-400 h-10 text-sm font-mono"
                                    />
                                  </div>
                                </div>
                              ) : item.type === 'date' ? (
                                <Input
                                  type="date"
                                  min={minDateValue}
                                  value={formik.values.kesesuaian.realisasi_aktual[item.field]}
                                  onChange={(e) => formik.setFieldValue(`kesesuaian.realisasi_aktual.${item.field}`, e.target.value)}
                                  className="w-full bg-white dark:bg-gray-800 border-amber-100 focus:border-amber-400 h-10 text-sm"
                                />
                              ) : (
                                <Input
                                  type={item.type}
                                  placeholder={`Masukkan ${item.label.toLowerCase()} aktual...`}
                                  value={formik.values.kesesuaian.realisasi_aktual[item.field]}
                                  onChange={(e) => formik.setFieldValue(`kesesuaian.realisasi_aktual.${item.field}`, e.target.value)}
                                  suffix={item.suffix}
                                  className="w-full bg-white dark:bg-gray-800 border-amber-100 focus:border-amber-400 h-10 text-sm"
                                />
                              )}
                              <p className="mt-2 text-[10px] text-amber-500 italic font-medium flex items-center gap-1">
                                <FiAlertCircle className="w-3 h-3" />
                                Nilai ini akan dicatat sebagai realisasi lapangan
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* PIC Koorlap */}
            <motion.div
              className="mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                PIC Koorlap <span className="text-red-500">*</span>
              </label>
              <Input
                id="pic_koorlap"
                name="pic_koorlap"
                placeholder="Masukkan nama PIC Koorlap"
                value={formik.values.pic_koorlap}
                onChange={formik.handleChange}
                className={cn(
                  formik.touched.pic_koorlap && formik.errors.pic_koorlap
                    ? "border-red-400"
                    : ""
                )}
              />
              {formik.touched.pic_koorlap && formik.errors.pic_koorlap && (
                <p className="text-red-500 text-sm mt-2">{formik.errors.pic_koorlap}</p>
              )}
            </motion.div>

            {/* Upload Dokumentasi dengan Drag-Drop */}
            <motion.div
              className="mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Dokumentasi Implementasi <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Format: {DOCUMENTATION_SUPPORTED_FORMATS.join(', ')}. Maks {DOCUMENTATION_MAX_FILE_SIZE_MB} MB per file, maksimal {DOCUMENTATION_MAX_FILES} file.
              </p>

              {/* ✅ DRAG DROP AREA */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`relative p-8 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ${
                  dragActive
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20 scale-105"
                    : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 hover:border-primary hover:bg-primary/10 dark:hover:bg-primary/20"
                }`}
              >
                {/* Hidden File Inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={DOCUMENTATION_ACCEPT}
                  multiple
                  onChange={handleFileSelect}
                  className="sr-only"
                  id="file-input"
                />
                
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept={DOCUMENTATION_ACCEPT}
                  capture="environment"
                  onChange={handleCameraCapture}
                  className="sr-only"
                  id="camera-input"
                />

                {/* Content */}
                <motion.div
                  className="flex flex-col items-center justify-center"
                  animate={dragActive ? { scale: 1.03 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {formik.values.dokumentasi && formik.values.dokumentasi.length > 0 ? (
                    <>
                      <div className="w-full flex items-center justify-between mb-4">
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Preview Dokumentasi ({formik.values.dokumentasi.length})
                        </p>
                        <motion.button
                          type="button"
                          onClick={() => setShowUploadModal(true)}
                          className="relative group px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium shadow-md overflow-hidden transition-all duration-300"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          {/* hover overlay */}
                          <span className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary to-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* content */}
                          <span className="relative z-10">Tambah Foto</span>
                        </motion.button>
                      </div>

                      <motion.div
                        className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {formik.values.dokumentasi.map((file, index) => (
                          <motion.div
                            key={index}
                            className="relative group"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.05 * index }}
                            whileHover={{ scale: 1.03 }}
                          >
                            <div className="relative w-full h-32 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-600 shadow-md bg-white dark:bg-gray-800">
                              {/\.(mp4|mov|webm|ogg)$/i.test(file.name) ? (
                                <video
                                  src={URL.createObjectURL(file)}
                                  className="w-full h-full object-cover"
                                  preload="metadata"
                                />
                              ) : (
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Preview ${index}`}
                                  className="w-full h-full object-cover"
                                />
                              )}
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all" />
                              <motion.button
                                type="button"
                                onClick={() => {
                                  const newFiles = [...formik.values.dokumentasi];
                                  newFiles.splice(index, 1);
                                  formik.setFieldValue("dokumentasi", newFiles);
                                }}
                                className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-all"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <FiX className="w-4 h-4 text-white" />
                              </motion.button>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 truncate">
                              {file.name}
                            </p>
                          </motion.div>
                        ))}
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div
                        className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4"
                        animate={dragActive ? { rotate: 360 } : { rotate: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <FiUpload className={`w-8 h-8 ${dragActive ? 'text-green-600' : 'text-green-600 dark:text-green-400'}`} />
                      </motion.div>

                      <p className="text-center mb-2">
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 block">
                          {dragActive ? "Lepaskan gambar di sini" : "Drag & Drop gambar di sini"}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 block mt-1">
                          atau gunakan tombol di bawah
                        </span>
                      </p>

                      {/* Upload Buttons - ONLY SHOWN WHEN NOT DRAGGING */}
                      {!dragActive && (
                        <motion.button
                          type="button"
                          onClick={() => setShowUploadModal(true)}
                          className="relative group mt-4 px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium shadow-lg overflow-hidden transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {/* hover overlay */}
                          <span className="absolute inset-0 bg-gradient-to-r from-primary-dark via-primary to-primary-light opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          {/* content */}
                          <span className="relative z-10">Pilih Gambar</span>
                        </motion.button>
                      )}
                    </>
                  )}
                </motion.div>
              </div>

              {formik.touched.dokumentasi && formik.errors.dokumentasi && (
                <p className="text-red-500 text-sm mt-2">{formik.errors.dokumentasi}</p>
              )}
            </motion.div>
                        
            {/* Submit Button */}
            <FormButton
              type="submit"
              loading={submitting}
              icon={<FiCheckCircle className="w-5 h-5" />}
            >
              {submitting ? "Menyimpan..." : "Simpan Data Implementasi"}
            </FormButton>
          </form>
        </motion.div>

      {/* ✅ MODAL UPLOAD OPTIONS */}
      <AnimatePresence>
        {showUploadModal && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowUploadModal(false)}
            />
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-sm p-6 relative">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/20 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>

                <div className="text-center mb-6">
                  <motion.div
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mx-auto mb-4"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                  >
                    <FiUpload className="w-7 h-7 text-white" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
                    Upload Dokumentasi
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Pilih sumber dokumentasi. Format {DOCUMENTATION_SUPPORTED_FORMATS.join(', ')} | Maks {DOCUMENTATION_MAX_FILE_SIZE_MB} MB/file | Maks {DOCUMENTATION_MAX_FILES} file
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Camera Option */}
                  <motion.button
                    type="button"
                    onClick={openCamera}
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl border-2 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 text-green-700 dark:text-green-300 font-semibold transition-all"
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center"
                      whileHover={{ rotate: 10 }}
                    >
                      <FiCamera className="w-5 h-5 text-white" />
                    </motion.div>
                    <div className="text-left">
                      <p className="font-semibold">Ambil Foto</p>
                      <p className="text-xs opacity-80">Gunakan kamera perangkat</p>
                    </div>
                  </motion.button>

                  {/* File Picker Option */}
                  <motion.button
                    type="button"
                    onClick={openFilePicker}
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-xl border-2 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/40 text-green-700 dark:text-green-300 font-semibold transition-all"
                    whileHover={{ scale: 1.02, translateY: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div
                      className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center"
                      whileHover={{ rotate: -10 }}
                    >
                      <FiFolder className="w-5 h-5 text-white" />
                    </motion.div>
                    <div className="text-left">
                      <p className="font-semibold">Pilih dari Galeri</p>
                      <p className="text-xs opacity-80">Pilih dari file tersimpan</p>
                    </div>
                  </motion.button>
                </div>

                <motion.button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="w-full mt-4 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Batal
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImplementasiForm;


