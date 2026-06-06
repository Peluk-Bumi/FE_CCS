import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { motion } from 'framer-motion';
import { 
  FiMapPin, 
  FiCheckCircle, 
  FiActivity,
  FiPackage,
  FiCalendar,
  FiBarChart3,
  FiTrendingUp
} from 'react-icons/fi';
import { FaTree } from 'react-icons/fa';
import { Badge } from '@/shared/components/ui/badge';

const ImplementationDetailCard = ({ 
  implementation = null, 
  isSelected = false,
  monitoringProgress = { completed: 0, total: 6 }
}) => {
  if (!implementation || !isSelected) return null;

  const progressPercent = monitoringProgress.total > 0 
    ? (monitoringProgress.completed / monitoringProgress.total) * 100 
    : 0;

  const detailItems = [
    {
      icon: FiCheckCircle,
      label: 'Lembaga',
      value: implementation.nama_perusahaan,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      span: 'md:col-span-2'
    },
    {
      icon: FiActivity,
      label: 'Kegiatan',
      value: implementation.jenis_kegiatan,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      span: 'md:col-span-2'
    },
    {
      icon: FaTree,
      label: 'Jenis Bibit',
      value: implementation.jenis_bibit,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      icon: FiPackage,
      label: 'Jumlah',
      value: `${implementation.jumlah_bibit?.toLocaleString() || 0} batang`,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      icon: FiBarChart3,
      label: 'Durasi',
      value: `${implementation.durasi_proyek || 6} bulan`,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: FiTrendingUp,
      label: 'Interval',
      value: `Setiap ${implementation.monitoring_interval || 3} bulan`,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    }
  ];

  return (
    <motion.div
      className="mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card className="border-2 border-cyan-300 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 dark:border-cyan-700 overflow-hidden">
        <CardContent className="p-5">
          {/* Header with Progress */}
          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <FiCheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-cyan-900 dark:text-cyan-200">
                  Implementasi Terpilih
                </h3>
                <p className="text-xs text-cyan-600 dark:text-cyan-300">
                  Siap untuk monitoring
                </p>
              </div>
            </div>
            
            {/* Progress Badge */}
            <div className="flex flex-col items-end gap-1">
              <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs">
                {monitoringProgress.completed}/{monitoringProgress.total} Bulan
              </Badge>
              <div className="w-24 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Grid Items - Compact */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
            {detailItems.map((item, idx) => (
              <motion.div
                key={idx}
                className={`bg-white dark:bg-gray-800 rounded-lg p-3 border border-cyan-200 dark:border-cyan-700 hover:shadow-md transition-shadow ${item.span || ''}`}
                whileHover={{ translateY: -1 }}
              >
                <div className="flex items-start gap-2">
                  <div className={`p-1.5 rounded-full ${item.bgColor} flex-shrink-0`}>
                    <item.icon className={`w-3 h-3 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 line-clamp-1">
                      {item.label}
                    </p>
                    <p className="text-xs font-bold text-gray-900 dark:text-gray-100 break-words">
                      {item.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Coordinates Section */}
          {implementation.lat && implementation.long && (
            <motion.div
              className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-start gap-2">
                <FiMapPin className="w-3.5 h-3.5 text-purple-600 flex-shrink-0 mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 mb-1">
                    Koordinat GPS
                  </p>
                  <p className="text-[10px] font-mono text-gray-700 dark:text-gray-300 break-all">
                    LAT: {implementation.lat} | LONG: {implementation.long || implementation.lng}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Action Alert */}
          <div className="mt-3 flex items-center gap-2 p-2.5 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg border-l-4 border-l-cyan-500">
            <FiCheckCircle className="w-4 h-4 text-cyan-600 flex-shrink-0" />
            <p className="text-xs text-cyan-700 dark:text-cyan-300 font-medium">
              Implementasi dipilih. Lanjutkan pengisian data monitoring.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ImplementationDetailCard;
