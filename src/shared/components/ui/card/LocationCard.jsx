import React from 'react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { motion } from 'framer-motion';
import { 
  FiMapPin, 
  FiCheckCircle, 
  FiPackage,
  FiActivity,
  FiCalendar
} from 'react-icons/fi';
import { FaSeedling } from 'react-icons/fa';

/**
 * LocationCard — komponen reusable untuk menampilkan detail lokasi terpilih.
 *
 * Props:
 *  - location       : object data lokasi utama (untuk mode default)
 *  - planningData   : object data perencanaan (untuk mode comparison)
 *  - actualData     : object data implementasi aktual (untuk mode comparison)
 *  - mode           : 'default' | 'comparison' (default: 'default')
 *  - isSelected     : boolean, tampilkan hanya bila true (default: false)
 *  - title          : judul header card (default: 'Lokasi Terpilih')
 *  - subtitle       : teks subjudul header (default: 'Detail lokasi yang dipilih')
 *  - alertText      : teks di bagian alert bawah
 *  - dateLabel      : label baris tanggal (default: 'Tanggal')
 *  - extraContent   : node React tambahan yang dirender di bawah grid detail
 */
const LocationCard = ({
  location,
  planningData,
  actualData,
  mode = 'default',
  isSelected = false,
  title = 'Lokasi Terpilih',
  subtitle = 'Detail lokasi yang dipilih',
  alertText,
  dateLabel = 'Tanggal',
  extraContent = null,
}) => {
  if (!isSelected) return null;
  if (mode === 'default' && !location) return null;
  if (mode === 'comparison' && (!planningData || !actualData)) return null;

  // Helper function to safely parse and format dates
  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    try {
      return new Date(dateStr).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch {
      return '-';
    }
  };

  const getTanggal = (data) => {
    return data?.tanggal_pelaksanaan || data?.tanggal_rencana || data?.tanggal || data?.created_at;
  };

  // Helper to resolve actual value from `actualData` taking `realisasi_aktual` into account
  const getActualValue = (data, key) => {
    if (!data) return null;
    let actual = data.realisasi_aktual;
    if (actual === undefined || actual === null) {
      actual = data.perencanaan?.implementasi?.realisasi_aktual;
    }
    if (typeof actual === 'string') {
      try {
        actual = JSON.parse(actual);
      } catch (e) {
        actual = null;
      }
    }
    return (actual && typeof actual === 'object' && actual[key] !== undefined && actual[key] !== null && actual[key] !== "") 
      ? actual[key] 
      : data[key];
  };

  const detailItems = [
    {
      icon: FiCheckCircle,
      label: 'Lembaga',
      value: mode === 'default' ? location?.nama_perusahaan : null,
      planningValue: mode === 'comparison' ? planningData?.nama_perusahaan : null,
      actualValue: mode === 'comparison' ? getActualValue(actualData, 'nama_perusahaan') : null,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: FiActivity,
      label: 'Kegiatan',
      value: mode === 'default' ? location?.jenis_kegiatan : null,
      planningValue: mode === 'comparison' ? planningData?.jenis_kegiatan : null,
      actualValue: mode === 'comparison' ? getActualValue(actualData, 'jenis_kegiatan') : null,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: FaSeedling,
      label: 'Jenis Bibit',
      value: mode === 'default' ? location?.jenis_bibit : null,
      planningValue: mode === 'comparison' ? planningData?.jenis_bibit : null,
      actualValue: mode === 'comparison' ? getActualValue(actualData, 'jenis_bibit') : null,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100'
    },
    {
      icon: FiPackage,
      label: 'Jumlah Bibit',
      value: mode === 'default' ? `${location?.jumlah_bibit?.toLocaleString() || 0} batang` : null,
      planningValue: mode === 'comparison' ? `${planningData?.jumlah_bibit?.toLocaleString() || 0} batang` : null,
      actualValue: mode === 'comparison' ? `${getActualValue(actualData, 'jumlah_bibit')?.toLocaleString() || 0} batang` : null,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      icon: FiMapPin,
      label: 'Koordinat',
      value: mode === 'default' ? `${location?.lat}, ${location?.long || location?.lng}` : null,
      planningValue: mode === 'comparison' ? `${planningData?.lat}, ${planningData?.long || planningData?.lng}` : null,
      actualValue: mode === 'comparison' ? `${getActualValue(actualData, 'lat') || actualData?.lat}, ${getActualValue(actualData, 'long') || actualData?.long || getActualValue(actualData, 'lng') || actualData?.lng}` : null,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      isCoordinate: true
    },
    {
      icon: FiCalendar,
      label: dateLabel,
      value: mode === 'default' ? formatDate(getTanggal(location)) : null,
      planningValue: mode === 'comparison' ? formatDate(getTanggal(planningData)) : null,
      actualValue: mode === 'comparison' ? formatDate(getActualValue(actualData, 'tanggal_pelaksanaan') || getActualValue(actualData, 'tanggal') || getTanggal(actualData)) : null,
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
      <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 dark:border-green-700 overflow-hidden shadow-xl">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5 border-b border-green-200 dark:border-green-700/50 pb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              <FiCheckCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-green-900 dark:text-green-200">
                {title}
              </h3>
              <p className="text-sm text-green-600 dark:text-green-300">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Grid Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {detailItems.map((item, idx) => {
              const isDifferent = mode === 'comparison' && item.planningValue !== item.actualValue && item.planningValue && item.actualValue;
              
              return (
                <motion.div
                  key={idx}
                  className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-green-200 dark:border-green-700/50 hover:shadow-md transition-all duration-300"
                  whileHover={{ translateY: -2 }}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${item.bgColor} flex-shrink-0 mt-0.5`}>
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                        {item.label}
                      </p>
                      
                      {mode === 'default' ? (
                        <p className={`text-sm font-bold text-gray-900 dark:text-gray-100 break-words ${item.isCoordinate ? 'font-mono text-[11px]' : ''}`}>
                          {item.value || '-'}
                        </p>
                      ) : (
                        <div className="flex flex-col gap-1.5 mt-2">
                          {isDifferent ? (
                            <>
                              <div className={`flex flex-col rounded-md px-2.5 py-1.5 border bg-amber-50/50 border-amber-100 dark:bg-amber-900/10 dark:border-amber-900/30`}>
                                <span className="text-[9px] uppercase font-bold tracking-wider text-amber-600 dark:text-amber-500 mb-0.5">Perencanaan</span>
                                <span className={`text-xs break-words text-gray-500 line-through dark:text-gray-400 ${item.isCoordinate ? 'font-mono text-[10px]' : ''}`}>
                                  {item.planningValue || '-'}
                                </span>
                              </div>
                              <div className={`flex flex-col rounded-md px-2.5 py-1.5 border bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800`}>
                                <span className={`text-[9px] uppercase font-bold tracking-wider mb-0.5 text-emerald-600 dark:text-emerald-400`}>Implementasi Aktual</span>
                                <span className={`text-xs font-bold break-words text-emerald-700 dark:text-emerald-300 ${item.isCoordinate ? 'font-mono text-[10px]' : ''}`}>
                                  {item.actualValue || '-'}
                                </span>
                              </div>
                            </>
                          ) : (
                            <div className={`flex flex-col rounded-md px-2.5 py-1.5 border bg-green-50/50 border-green-200 dark:bg-green-900/20 dark:border-green-800`}>
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="text-[9px] uppercase font-bold tracking-wider text-green-600 dark:text-green-400">Sesuai Perencanaan</span>
                                <FiCheckCircle className="w-3 h-3 text-green-500" />
                              </div>
                              <span className={`text-xs font-bold break-words text-green-800 dark:text-green-300 ${item.isCoordinate ? 'font-mono text-[10px]' : ''}`}>
                                {item.actualValue || item.planningValue || '-'}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {extraContent}

          {/* Action Alert */}
          {alertText && (
            <div className="mt-6 flex items-center gap-3 p-4 bg-green-100/80 dark:bg-green-900/40 rounded-xl border-l-4 border-l-green-500 shadow-sm">
              <FiCheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-sm text-green-800 dark:text-green-200 font-medium leading-relaxed">
                {alertText}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default LocationCard;
