import { useState, useEffect, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import api from "@/shared/services/api";
import { useAuth } from "@/app/context/AuthContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FiCheck, FiX, FiUpload, FiCheckCircle, FiMapPin, FiAlertCircle, FiCamera, FiFolder } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import LoadingSpinner from "@/shared/components/layout/LoadingSpinner";
import PageTitle from "@/shared/components/common/PageTitle";
import { FormButton } from "@/shared/components/ui/button/FormButton";
import ProjectStatusBadge from "@/shared/components/common/ProjectStatusBadge";
import { resolveProjectDisplay } from "@/shared/utils/projectDisplay";

const createSaplingMarkerIcon = (accentColor, leafColor) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="60" viewBox="0 0 44 60" fill="none">
      <path d="M22 58C22 58 10 44.5 10 31.5C10 20.6 16.4 12 22 12C27.6 12 34 20.6 34 31.5C34 44.5 22 58 22 58Z" fill="${accentColor}" opacity="0.18"/>
      <path d="M22 55C22 55 12.5 43.7 12.5 32.7C12.5 24.1 17.5 17 22 17C26.5 17 31.5 24.1 31.5 32.7C31.5 43.7 22 55 22 55Z" fill="${accentColor}"/>
      <path d="M22 45V27" stroke="#7a4e2d" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M22 35.5C19.5 33.8 16.9 32.8 13.8 32.4C15.4 36.4 18.5 38.6 22 39.5" fill="none" stroke="${leafColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22 31.8C24.2 29.5 27.2 28.1 31 27.6C29.5 31.6 26.5 34.1 22 35.1" fill="none" stroke="${leafColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22 28.2C20.2 25.8 17.6 24.3 14.3 23.9C15.7 27.4 18 29.7 22 30.6" fill="none" stroke="${leafColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M22 24.8C24 22.1 26.8 20.5 30.4 20.2C29.1 23.6 26.4 25.8 22 26.7" fill="none" stroke="${leafColor}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M13 52H31" stroke="#6b4b2a" stroke-width="3.2" stroke-linecap="round" opacity="0.9"/>
    </svg>
  `;

  return new L.Icon({
    iconUrl: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [44, 60],
    iconAnchor: [22, 58],
    popupAnchor: [0, -50],
    shadowSize: [41, 41],
  });
};

// ✅ Bibit pohon marker untuk lokasi yang sudah ada dan yang dipilih
const existingMarkerIcon = createSaplingMarkerIcon('#16a34a', '#22c55e');
const selectedMarkerIcon = createSaplingMarkerIcon('#15803d', '#86efac');
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
        nama_perusahaan_detail: "",
        lokasi: null,
        lokasi_detail: "",
        jenis_kegiatan: null,
        jenis_kegiatan_detail: "",
        jumlah_bibit: null,
        jumlah_bibit_detail: "",
        jenis_bibit: null,
        jenis_bibit_detail: "",
        tanggal: null,
        tanggal_detail: "",
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
          const tanggalDetail = values.kesesuaian?.tanggal_detail;
          if (tanggalDetail && tanggalDetail < minDateValue) {
            toast.error("Tanggal tidak boleh sebelum hari ini");
            setSubmitting(false);
            return;
          }
        }

        const formData = new FormData();
        formData.append("perencanaan_id", values.perencanaan_id);
        formData.append("kesesuaian", JSON.stringify(values.kesesuaian));
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
                          <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Nama Perusahaan</th>
                          <th className="p-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Lokasi</th>
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

              {/* ✅ DETAIL LOKASI TERPILIH - DITAMPILKAN DI BAWAH MAPS */}
              {selectedLocation && (
                <motion.div
                  className="mt-6 bg-gradient-to-br from-green-50 to-lime-50 dark:from-green-900/20 dark:to-lime-900/20 border-2 border-green-300 dark:border-green-700 rounded-2xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <motion.div
                      className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg"
                      whileHover={{ scale: 1.1, rotate: 10 }}
                    >
                      <FiCheckCircle className="w-6 h-6 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-green-900 dark:text-green-200 mb-1">
                        Lokasi Terpilih
                      </h3>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        Berikut adalah detail lokasi implementasi yang dipilih
                      </p>
                    </div>
                  </div>

                  {/* Detail Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Perusahaan */}
                    <motion.div
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-green-200 dark:border-green-700"
                      whileHover={{ translateY: -2 }}
                    >
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
                        Perusahaan
                      </p>
                      <p className="text-base font-bold text-gray-900 dark:text-gray-100 break-words">
                        {selectedLocation.nama_perusahaan}
                      </p>
                    </motion.div>

                    {/* Kegiatan */}
                    <motion.div
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-green-200 dark:border-green-700"
                      whileHover={{ translateY: -2 }}
                    >
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
                        Jenis Kegiatan
                      </p>
                      <p className="text-base font-bold text-gray-900 dark:text-gray-100 break-words">
                        {selectedLocation.jenis_kegiatan}
                      </p>
                    </motion.div>

                    {/* Bibit */}
                    <motion.div
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-green-200 dark:border-green-700"
                      whileHover={{ translateY: -2 }}
                    >
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
                        Jenis Bibit
                      </p>
                      <p className="text-base font-bold text-gray-900 dark:text-gray-100 break-words">
                        {selectedLocation.jenis_bibit}
                      </p>
                    </motion.div>

                    {/* Jumlah Bibit */}
                    <motion.div
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-green-200 dark:border-green-700"
                      whileHover={{ translateY: -2 }}
                    >
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
                        Jumlah Bibit
                      </p>
                      <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                        {selectedLocation.jumlah_bibit} Unit
                      </p>
                    </motion.div>

                    {/* Tanggal */}
                    <motion.div
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-green-200 dark:border-green-700"
                      whileHover={{ translateY: -2 }}
                    >
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
                        Tanggal Pelaksanaan
                      </p>
                      <p className="text-base font-bold text-gray-900 dark:text-gray-100">
                        {new Date(selectedLocation.tanggal_pelaksanaan).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </p>
                    </motion.div>

                    {/* Koordinat */}
                    <motion.div
                      className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-green-200 dark:border-green-700 md:col-span-2"
                      whileHover={{ translateY: -2 }}
                    >
                      <p className="text-xs font-semibold text-green-600 dark:text-green-400 mb-1">
                        Koordinat Lokasi
                      </p>
                      <p className="text-sm font-mono text-gray-900 dark:text-gray-100 bg-green-50 dark:bg-green-900/30 px-3 py-2 rounded-lg">
                        Latitude: {selectedLocation.lat} | Longitude: {selectedLocation.long}
                      </p>
                    </motion.div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6 pt-6 border-t border-green-200 dark:border-green-700">
                    <motion.button
                      type="button"
                      onClick={() => setSelectedLocation(null)}
                      className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Pilih Lokasi Lain
                    </motion.button>
                    <motion.button
                      type="button"
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium transition-all shadow-md"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiCheckCircle className="w-4 h-4" />
                      <span>Gunakan Lokasi Ini</span>
                    </motion.button>
                  </div>
                </motion.div>
              )}

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
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { field: 'nama_perusahaan', label: 'Nama Perusahaan', type: 'text' },
                  { field: 'lokasi', label: 'Lokasi', type: 'text' },
                  { field: 'jenis_kegiatan', label: 'Jenis Kegiatan', type: 'text' },
                  { field: 'jumlah_bibit', label: 'Jumlah Bibit', type: 'number' },
                  { field: 'jenis_bibit', label: 'Jenis Bibit', type: 'text' },
                  { field: 'tanggal', label: 'Tanggal', type: 'date' },
                ].map((item, index) => (
                  <motion.div
                    key={item.field}
                    className="p-4 rounded-xl border bg-white dark:bg-gray-800"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.06 * index }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-semibold text-gray-800 dark:text-gray-100">{item.label}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => formik.setFieldValue(`kesesuaian.${item.field}`, true)}
                          className={`px-3 py-1 rounded-lg text-sm font-semibold transition focus:outline-none ${formik.values.kesesuaian[item.field] === true ? 'bg-green-600 text-white shadow hover:bg-green-700' : 'bg-white border hover:bg-green-100 hover:text-green-800'}`}
                        >
                          Ya
                        </button>
                        <button
                          type="button"
                          onClick={() => formik.setFieldValue(`kesesuaian.${item.field}`, false)}
                          className={`px-3 py-1 rounded-lg text-sm font-semibold transition focus:outline-none ${formik.values.kesesuaian[item.field] === false ? 'bg-rose-600 text-white shadow hover:bg-rose-700' : 'bg-white border hover:bg-rose-100 hover:text-rose-800'}`}
                        >
                          Tidak
                        </button>
                      </div>
                    </div>

                    {formik.values.kesesuaian[item.field] === false && (
                      <div className="mt-3 p-3 bg-amber-50 border-l-4 border-amber-400 rounded">
                        {item.type === 'date' ? (
                          <input
                            type="date"
                            min={minDateValue}
                            value={formik.values.kesesuaian[`${item.field}_detail`]}
                            onChange={(e) => formik.setFieldValue(`kesesuaian.${item.field}_detail`, e.target.value)}
                            className="w-full rounded px-2 py-2"
                          />
                        ) : (
                          <input
                            type={item.type}
                            placeholder={`Masukkan ${item.label.toLowerCase()} jika berbeda`}
                            value={formik.values.kesesuaian[`${item.field}_detail`]}
                            onChange={(e) => formik.setFieldValue(`kesesuaian.${item.field}_detail`, e.target.value)}
                            className="w-full rounded px-2 py-2"
                          />
                        )}
                      </div>
                    )}
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
              <input
                id="pic_koorlap"
                name="pic_koorlap"
                placeholder="Masukkan nama PIC Koorlap"
                value={formik.values.pic_koorlap}
                onChange={formik.handleChange}
                className={`w-full px-4 py-3.5 rounded-xl border-2 bg-white dark:bg-gray-700 dark:text-gray-100 transition-all ${
                  formik.touched.pic_koorlap && formik.errors.pic_koorlap
                    ? "border-red-400 focus:ring-4 focus:ring-red-200"
                    : "border-gray-200 dark:border-gray-600 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                }`}
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


