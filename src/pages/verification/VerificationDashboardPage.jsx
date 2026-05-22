import { motion } from "framer-motion";
import { FiCamera } from "react-icons/fi";
import PageTitle from "@/shared/components/common/PageTitle";
import { useVerification } from "@/features/verification/hooks/useVerification";
import QRScanner from "@/features/verification/components/QRScanner";
import LaporanDetailModal from "@/features/verification/components/LaporanDetailModal";
import Instructions from "@/features/verification/components/Instructions";

export default function VerifikasiDashboardPage() {
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
    <div className="py-12">
      <PageTitle
        type="page"
        badge="Verifikasi QR"
        badgeIcon={FiCamera}
        title="Verifikasi QR Code"
        description="Scan QR Code untuk melihat detail lengkap laporan perencanaan kegiatan konservasi"
      />
      
      {/* Main Grid */}
      <motion.div 
        className="grid lg:grid-cols-2 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Scanner Section */}
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

        {/* Instructions (jika belum scan) */}
        {!laporanDetail && (
          <Instructions showPublicInfo={false} />
        )}
      </motion.div>

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

