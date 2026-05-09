import {
  formatDateId,
  deriveSurvivalRate,
  getHeightValue,
  leafConditionScore,
  getHealthLabel,
  parseNumber,
} from "../../utils/evaluasi.engine";
import { parseStoredFiles } from "../../utils/laporanPdf";
import { motion } from "framer-motion";

export default function MonitoringSection({ report, toAbsoluteFileUrl }) {
  const monitoringItems = report?.monitoringItems || [];

  if (!monitoringItems || monitoringItems.length === 0) {
    return (
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">Hasil & Pembahasan</h3>
        <div className="text-sm text-gray-600 dark:text-gray-400">Tidak ada data monitoring untuk ditampilkan.</div>
      </div>
    );
  }

  return (
    <div>
      <motion.h3
        className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Hasil & Pembahasan
      </motion.h3>
      <div className="space-y-6 text-sm text-gray-700 dark:text-gray-300">
        {monitoringItems.slice(0, 6).map((m, idx) => {
          const date = formatDateId(m?.tanggal_monitoring || m?.monitoring_date || m?.tanggal || m?.created_at) || "-";
          const survivalVal = m?.survival_rate ?? deriveSurvivalRate(m);
          const survival =
            survivalVal !== null && survivalVal !== undefined
              ? typeof survivalVal === "number"
                ? `${survivalVal.toFixed(2)}%`
                : survivalVal
              : "-";
          const height = getHeightValue(m) ?? "-";
          const diameter = parseNumber(m?.diameter_batang) ?? (parseNumber(m?.diameter) ?? "-");
          const healthScore = leafConditionScore(m);
          const healthLabel = healthScore !== null && healthScore !== undefined ? getHealthLabel([healthScore]) : "-";

          const files = parseStoredFiles(
            m?.dokumentasi_monitoring ||
              m?.dokumentasi ||
              m?.files ||
              m?.photos ||
              m?.dokumentasi_kegiatan ||
              m?.images ||
              []
          );

          return (
            <motion.div
              key={idx}
              className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-900/30"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx, duration: 0.4 }}
              whileHover={{ scale: 1.01, boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}
            >
              {/* Header */}
              <div className="bg-gray-50 dark:bg-gray-800/40 px-4 py-3 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
                <div className="text-xs font-semibold text-gray-600 dark:text-gray-300">Monitoring #{idx + 1}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{date}</div>
              </div>

              {/* Metrics */}
              <div className="px-4 py-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                  <div className="p-2 rounded bg-gray-50 dark:bg-gray-800/40">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Survival Rate</p>
                    <p className="text-gray-700 dark:text-gray-300">{survival}</p>
                  </div>
                  <div className="p-2 rounded bg-gray-50 dark:bg-gray-800/40">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Tinggi (cm)</p>
                    <p className="text-gray-700 dark:text-gray-300">{height}</p>
                  </div>
                  <div className="p-2 rounded bg-gray-50 dark:bg-gray-800/40">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Diameter (cm)</p>
                    <p className="text-gray-700 dark:text-gray-300">{diameter}</p>
                  </div>
                  <div className="p-2 rounded bg-gray-50 dark:bg-gray-800/40">
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Kesehatan</p>
                    <p className="text-gray-700 dark:text-gray-300">{healthLabel}</p>
                  </div>
                </div>
              </div>

              {/* Documentation Gallery */}
              {files && files.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-3">Dokumentasi Monitoring</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {files.map((filePath, fileIdx) => (
                      <a
                        key={`${idx}-${fileIdx}`}
                        href={toAbsoluteFileUrl(filePath)}
                        target="_blank"
                        rel="noreferrer"
                        className="group block"
                      >
                        <div className="h-28 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                          {/\.(mp4|mov|webm|ogg)$/i.test(filePath) ? (
                            <video
                              src={toAbsoluteFileUrl(filePath)}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              preload="metadata"
                            />
                          ) : (
                            <img
                              src={toAbsoluteFileUrl(filePath)}
                              alt={`Doc ${fileIdx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              loading="lazy"
                            />
                          )}
                        </div>
                        <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400 truncate">
                          {String(filePath).split("/").pop()}
                        </p>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
