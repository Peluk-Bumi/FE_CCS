import { motion } from "framer-motion";
import { FiCamera } from "react-icons/fi";
import { useVerification } from "@/features/verification/hooks/useVerification";
import QRScanner from "@/features/verification/components/QRScanner";
import LaporanDetailModal from "@/features/verification/components/LaporanDetailModal";
import Instructions from "@/features/verification/components/Instructions";

export default function VerifikasiPublicPage() {
  const {
    state,
    actions,
    videoRef,
    EXPLORER_BASE_URL,
  } = useVerification();

  const {
    scanResult,
    scanning,
    error,
    deviceId,
    devices,
    laporanDetail,
    showDetailModal,
    loadingLaporan,
    scannerReady,
    useManualInput,
  } = state;

  const {
    setDeviceId,
    setLaporanDetail,
    setShowDetailModal,
    resetScan,
    handleFileUpload,
  } = actions;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-primary/10 to-white dark:from-green-950 dark:via-gray-950 dark:to-green-950 pt-28 pb-12 px-3 sm:px-6 lg:px-8 transition-colors">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header Card */}
        <motion.div
          className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700 mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-6 sm:px-8 sm:py-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3 mb-2">
              <motion.div
                className="p-2 bg-white/20 rounded-xl"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                <FiCamera className="text-2xl" />
              </motion.div>
              Verifikasi & Lihat Detail Laporan
            </h1>
            <p className="text-white/80 text-sm sm:text-base">
              Scan QR Code untuk melihat detail lengkap laporan perencanaan kegiatan konservasi
            </p>
          </div>
        </motion.div>

        {/* Main Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Scanner Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <QRScanner
              scanning={scanning}
              scannerReady={scannerReady}
              scanResult={scanResult}
              laporanDetail={laporanDetail}
              loadingLaporan={loadingLaporan}
              error={error}
              deviceId={deviceId}
              devices={devices}
              videoRef={videoRef}
              onDeviceChange={setDeviceId}
              onFileUpload={handleFileUpload}
              useManualInput={useManualInput}
            />
          </motion.div>

          {/* Instructions (jika belum scan) */}
          {!laporanDetail && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Instructions showPublicInfo={true} />
            </motion.div>
          )}
        </div>
      </div>

      {/* Laporan Detail Modal */}
      <LaporanDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setLaporanDetail(null);
        }}
        laporanDetail={laporanDetail}
        loadingLaporan={loadingLaporan}
        blockchainData={state.blockchainData}
        EXPLORER_BASE_URL={EXPLORER_BASE_URL}
        onReset={resetScan}
      />
    </div>
  );
}
