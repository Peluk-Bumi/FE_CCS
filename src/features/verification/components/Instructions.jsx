import { FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Instructions({ showPublicInfo = true }) {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-6">
        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
          <FiAlertCircle className="w-5 h-5 text-primary" />
          Cara Menggunakan
        </h4>
        <ol className="space-y-3">
          {["Izinkan akses kamera", "Pilih kamera jika ada lebih dari satu", "Arahkan ke QR Code", "Atau upload gambar/input manual", "Detail laporan akan ditampilkan"].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-xs text-gray-600 dark:text-gray-400">
              <span className="flex-shrink-0 w-5 h-5 bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light rounded-full flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {showPublicInfo && (
        <div className="bg-primary/10 dark:bg-primary/20 rounded-2xl border border-primary/20 dark:border-primary/30 p-6">
          <h4 className="font-bold text-primary dark:text-primary-light mb-3 flex items-center gap-2">
            <FiCheckCircle className="w-5 h-5" />
            Informasi Publik
          </h4>
          <p className="text-xs text-primary/80 dark:text-primary-light/80 mb-3">
            Halaman ini dapat diakses oleh siapa saja tanpa perlu login. Scan QR Code dari laporan untuk melihat detail lengkapnya.
          </p>
          <p className="text-xs text-primary/70 dark:text-primary-light/70">
            Transparansi: Semua data perencanaan kegiatan konservasi dapat diverifikasi melalui QR Code
          </p>
        </div>
      )}
    </motion.div>
  );
}
