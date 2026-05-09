import { FiCamera, FiAlertCircle, FiCheckCircle, FiUpload } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function QRScanner({
  scanning,
  scannerReady,
  scanResult,
  laporanDetail,
  loadingLaporan,
  error,
  deviceId,
  devices,
  videoRef,
  onDeviceChange,
  onFileUpload,
  useManualInput,
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
        <FiCamera className="w-6 h-6 text-primary" />
        Scanner QR Code
      </h2>

      {/* Error Alert */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <FiAlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Camera Selection */}
      {devices.length > 1 && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Pilih Kamera
          </label>
          <select
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary focus:border-primary transition-all font-medium"
            onChange={(e) => onDeviceChange(e.target.value)}
            value={deviceId}
          >
            {devices.map((d) => (
              <option key={d.deviceId} value={d.deviceId}>
                {d.label || `Kamera ${d.deviceId.substring(0, 8)}`}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Scanner atau Manual Input */}
      <AnimatePresence mode="wait">
        {!useManualInput && scannerReady && scanning && !scanResult ? (
          <motion.div
            key="scanner"
            className="relative rounded-2xl overflow-hidden border-4 border-primary shadow-2xl bg-gray-900 mb-6"
            style={{ aspectRatio: '1/1' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {/* Video Stream untuk QR Code */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              onLoadedMetadata={() => {
                console.log('[QRScanner] Video loaded');
              }}
            />

            {/* Scanning Frame */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="absolute inset-8 border-2 border-primary-light rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.4)]"></div>
              <motion.div
                className="absolute w-48 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full"
                animate={{ y: [-60, 60] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>

            {/* Instructions */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-center">
              <p className="text-white text-sm font-medium">Arahkan kamera ke QR Code</p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* File Upload */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          📸 Upload Gambar QR Code
        </label>
        <label className="flex flex-col items-center justify-center w-full p-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
          <span className="text-sm text-gray-600 dark:text-gray-400">Klik untuk upload gambar</span>
          <input
            type="file"
            accept="image/*"
            onChange={onFileUpload}
            className="sr-only"
          />
        </label>
      </div>

      {/* Success State */}
      {scanResult && !laporanDetail && (
        <motion.div
          className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-2xl p-8 text-center aspect-square flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <FiCheckCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          </motion.div>
          <p className="text-blue-700 dark:text-blue-300 font-bold text-lg mb-2">QR Code Valid ✅</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            {loadingLaporan ? '⏳ Memuat detail laporan...' : '🔄 Sedang memproses...'}
          </p>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            className="mt-4"
          >
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full"></div>
          </motion.div>
        </motion.div>
      )}

      {/* Success State - Show Detail */}
      {scanResult && laporanDetail && (
        <motion.div
          className="bg-primary/10 dark:bg-primary/20 border-2 border-primary dark:border-primary-light rounded-2xl p-8 text-center aspect-square flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <FiCheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          </motion.div>
          <p className="text-primary dark:text-primary-light font-bold text-lg mb-2">✅ Berhasil Terverifikasi</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Lihat detail laporan di sebelah kanan
          </p>
        </motion.div>
      )}
    </div>
  );
}
