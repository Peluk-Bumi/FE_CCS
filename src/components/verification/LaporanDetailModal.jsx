import { FiCheckCircle, FiShield, FiExternalLink, FiRefreshCw, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function LaporanDetailModal({
  isOpen,
  onClose,
  laporanDetail,
  loadingLaporan,
  blockchainData,
  EXPLORER_BASE_URL,
  onReset,
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-w-2xl w-full max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-primary to-primary-dark px-6 py-4 flex items-center justify-between">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <FiCheckCircle className="w-5 h-5" />
                Detail Laporan
                {loadingLaporan && (
                  <motion.span
                    className="text-xs bg-white/20 px-2 py-1 rounded-full"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    Loading...
                  </motion.span>
                )}
              </h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <FiX className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto scrollbar-premium flex-1">

              {/* Warning if data is from QR fallback */}
              {!laporanDetail.nama_perusahaan && laporanDetail.blockchain_doc_hash && (
                <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 font-semibold">⚠️ Data Terbatas</p>
                  <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                    Server tidak merespons, menampilkan data dari blockchain. Detail lengkap mungkin tidak tersedia.
                  </p>
                </div>
              )}

              {/* Header Info */}
              <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 rounded-xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg flex-shrink-0">
                    <FiCheckCircle className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">
                      {laporanDetail.nama_perusahaan || (laporanDetail.blockchain_doc_hash ? '🔗 Data dari Blockchain' : 'Detail Laporan')}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ID: <span className="font-mono">{laporanDetail.id}</span>
                    </p>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex gap-2 flex-wrap">
                  {laporanDetail.is_implemented && (
                    <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light text-xs font-semibold flex items-center gap-1">
                      <FiCheckCircle className="w-3 h-3" />
                      Sudah Implementasi
                    </span>
                  )}
                  {laporanDetail.blockchain_doc_hash && (
                    <span className="px-3 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center gap-1">
                      🔗 Verified Blockchain
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light">
                    {laporanDetail.jenis_kegiatan}
                  </span>
                </div>
              </div>

              {/* Detail Fields */}
              {loadingLaporan ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      className="h-12 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1 }}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {laporanDetail.nama_pic && (
                    <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">Nama PIC</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {laporanDetail.nama_pic}
                      </p>
                    </div>
                  )}

                  {laporanDetail.narahubung && (
                    <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">Narahubung</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {laporanDetail.narahubung}
                      </p>
                    </div>
                  )}

                  {laporanDetail.jenis_bibit && (
                    <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">Jenis Bibit</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {laporanDetail.jenis_bibit}
                      </p>
                    </div>
                  )}

                  {laporanDetail.jumlah_bibit && (
                    <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">Jumlah Bibit</p>
                      <p className="text-lg font-bold text-primary dark:text-primary-light">
                        {laporanDetail.jumlah_bibit} unit
                      </p>
                    </div>
                  )}

                  {laporanDetail.tanggal_pelaksanaan && (
                    <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">Tanggal Pelaksanaan</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {new Date(laporanDetail.tanggal_pelaksanaan).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  )}

                  {laporanDetail.lokasi && (
                    <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">Lokasi</p>
                      <p className="text-sm font-mono text-gray-900 dark:text-gray-100 break-all">
                        {laporanDetail.lokasi}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Blockchain Info */}
              {laporanDetail?.blockchain_doc_hash || blockchainData?.blockchain_doc_hash ? (
                <div className="pb-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-2 flex items-center gap-2">
                    <FiShield className="w-4 h-4" /> Blockchain
                    {loadingLaporan && (
                      <motion.span
                        className="w-2 h-2 bg-blue-500 rounded-full"
                        animate={{ opacity: [1, 0.3, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                      />
                    )}
                  </p>
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 space-y-2">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Doc Hash:</p>
                      <code className="text-xs font-mono text-blue-700 dark:text-blue-300 break-all">
                        {laporanDetail?.blockchain_doc_hash || blockchainData?.blockchain_doc_hash}
                      </code>
                    </div>
                    {(laporanDetail?.blockchain_tx_hash || blockchainData?.blockchain_tx_hash) && (
                      <div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">TX Hash:</p>
                        <a
                          href={`${EXPLORER_BASE_URL}/tx/${laporanDetail?.blockchain_tx_hash || blockchainData?.blockchain_tx_hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-mono text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary break-all flex items-center gap-1"
                        >
                          {laporanDetail?.blockchain_tx_hash || blockchainData?.blockchain_tx_hash}
                          <FiExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              {/* Dibuat Tanggal */}
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-semibold mb-1">
                  Dibuat pada
                </p>
                <p className="text-xs text-gray-700 dark:text-gray-300">
                  {new Date(laporanDetail.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>

              {/* Scan Ulang Button */}
              <motion.button
                onClick={onReset}
                className="w-full mt-6 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-xl font-medium transition-all shadow-md"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiRefreshCw className="w-4 h-4" />
                Scan QR Lain
              </motion.button>
            </div>

            {/* Modal Footer - Close Button */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex justify-end gap-3">
              <motion.button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Tutup
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
