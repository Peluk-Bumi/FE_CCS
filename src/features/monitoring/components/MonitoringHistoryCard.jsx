import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiTrendingDown,
  FiMinus,
  FiArrowRight,
  FiBarChart2,
  FiCalendar,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import { Badge } from '@/shared/components/ui/badge';

const MonitoringHistoryCard = ({ 
  monitoringRecords = [], 
  selectedImplementasi = null,
  currentValues = {}
}) => {
  if (!selectedImplementasi || monitoringRecords.length === 0) return null;

  // Format dan urutkan records berdasarkan bulan monitoring
  const sortedRecords = useMemo(() => {
    return [...monitoringRecords]
      .filter(r => r.implementasi_id === selectedImplementasi.id)
      .sort((a, b) => Number(a.bulan_monitoring || 0) - Number(b.bulan_monitoring || 0));
  }, [monitoringRecords, selectedImplementasi?.id]);

  if (sortedRecords.length === 0) return null;

  // Hitung perubahan dan trend
  const calculateChange = (current, previous) => {
    if (!previous || current === null || previous === null) return null;
    const prev = Number(previous);
    const curr = Number(current);
    if (!Number.isFinite(prev) || !Number.isFinite(curr)) return null;
    return {
      value: curr - prev,
      percent: prev !== 0 ? ((curr - prev) / Math.abs(prev)) * 100 : 0,
      direction: curr > prev ? 'up' : curr < prev ? 'down' : 'stable'
    };
  };

  // Buat timeline dengan detail perubahan
  const timelineData = sortedRecords.map((record, idx) => {
    const previous = idx > 0 ? sortedRecords[idx - 1] : null;
    
    return {
      month: Number(record.bulan_monitoring),
      record,
      changes: {
        survival: calculateChange(record.survival_rate, previous?.survival_rate),
        height: calculateChange(record.tinggi_bibit, previous?.tinggi_bibit),
        diameter: calculateChange(record.diameter_batang, previous?.diameter_batang),
        leaves: calculateChange(record.jumlah_daun, previous?.jumlah_daun),
        dead: calculateChange(record.jumlah_bibit_mati, previous?.jumlah_bibit_mati)
      }
    };
  });

  // Trend badge untuk kondisi daun
  const getConditionBadge = (value) => {
    if (!value) return <Badge variant="outline" className="text-xs">Belum diisi</Badge>;
    const percentage = parseInt(value);
    if (percentage <= 25) return <Badge variant="outline" className="text-xs bg-green-100 text-green-800">✓ {value}</Badge>;
    if (percentage <= 50) return <Badge variant="outline" className="text-xs bg-yellow-100 text-yellow-800">⚠ {value}</Badge>;
    return <Badge variant="outline" className="text-xs bg-red-100 text-red-800">✗ {value}</Badge>;
  };

  // Trend indicator
  const TrendIndicator = ({ change, label, unit = '' }) => {
    if (!change) return <span className="text-xs text-gray-400">-</span>;
    
    const Icon = change.direction === 'up' ? FiTrendingUp : change.direction === 'down' ? FiTrendingDown : FiMinus;
    const color = change.direction === 'up' ? 'text-green-600' : change.direction === 'down' ? 'text-red-600' : 'text-gray-400';
    
    return (
      <div className="flex items-center gap-1">
        <Icon className={`w-3.5 h-3.5 ${color}`} />
        <span className={`text-xs font-semibold ${color}`}>
          {change.direction === 'down' && '-'}
          {Math.abs(change.value).toFixed(2)}{unit}
        </span>
      </div>
    );
  };

  return (
    <motion.div
      className="mt-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card className="border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 dark:border-blue-700">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FiBarChart2 className="w-5 h-5 text-blue-600" />
            Riwayat Monitoring
            <Badge variant="secondary" className="ml-auto">
              {sortedRecords.length} periode
            </Badge>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Timeline */}
          <div className="space-y-3">
            <AnimatePresence>
              {timelineData.map((item, idx) => (
                <motion.div
                  key={`month-${item.month}`}
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  {/* Timeline Connector */}
                  {idx < timelineData.length - 1 && (
                    <div className="absolute left-5 top-12 w-0.5 h-8 bg-gradient-to-b from-blue-300 to-transparent"></div>
                  )}

                  {/* Timeline Item */}
                  <div className="flex gap-4">
                    {/* Timeline Dot */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full border-2 border-blue-400 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center ${idx === timelineData.length - 1 ? 'ring-2 ring-offset-2 ring-blue-500' : ''}`}>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-300">
                          M{item.month}
                        </span>
                      </div>
                    </div>

                    {/* Timeline Content */}
                    <div className="flex-1 pb-4">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-blue-200 dark:border-blue-700">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <FiCalendar className="w-3.5 h-3.5 text-gray-500" />
                            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                              Bulan ke-{item.month}
                            </span>
                          </div>
                          <span className="text-[10px] text-gray-400">
                            {new Date(item.record.created_at).toLocaleDateString('id-ID', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>

                        {/* Key Metrics Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-3 p-2 bg-gray-50 dark:bg-gray-700/30 rounded">
                          {/* Survival Rate */}
                          <div className="text-center">
                            <p className="text-[10px] text-gray-600 dark:text-gray-400 font-semibold mb-1">
                              SR
                            </p>
                            <div className="flex items-baseline justify-center gap-1">
                              <p className="text-sm font-bold text-blue-600">
                                {Number(item.record.survival_rate || 0).toFixed(1)}%
                              </p>
                              {idx > 0 && (
                                <TrendIndicator 
                                  change={item.changes.survival} 
                                  label="SR"
                                  unit="%"
                                />
                              )}
                            </div>
                          </div>

                          {/* Height */}
                          <div className="text-center">
                            <p className="text-[10px] text-gray-600 dark:text-gray-400 font-semibold mb-1">
                              Tinggi
                            </p>
                            <div className="flex items-baseline justify-center gap-1">
                              <p className="text-sm font-bold text-green-600">
                                {Number(item.record.tinggi_bibit || 0).toFixed(1)}cm
                              </p>
                              {idx > 0 && (
                                <TrendIndicator 
                                  change={item.changes.height}
                                  unit="cm"
                                />
                              )}
                            </div>
                          </div>

                          {/* Diameter */}
                          <div className="text-center">
                            <p className="text-[10px] text-gray-600 dark:text-gray-400 font-semibold mb-1">
                              Diameter
                            </p>
                            <div className="flex items-baseline justify-center gap-1">
                              <p className="text-sm font-bold text-purple-600">
                                {Number(item.record.diameter_batang || 0).toFixed(1)}cm
                              </p>
                              {idx > 0 && (
                                <TrendIndicator 
                                  change={item.changes.diameter}
                                  unit="cm"
                                />
                              )}
                            </div>
                          </div>

                          {/* Leaves */}
                          <div className="text-center">
                            <p className="text-[10px] text-gray-600 dark:text-gray-400 font-semibold mb-1">
                              Jumlah Daun
                            </p>
                            <div className="flex items-baseline justify-center gap-1">
                              <p className="text-sm font-bold text-orange-600">
                                {Number(item.record.jumlah_daun || 0)}
                              </p>
                              {idx > 0 && (
                                <TrendIndicator 
                                  change={item.changes.leaves}
                                />
                              )}
                            </div>
                          </div>

                          {/* Dead Count */}
                          <div className="text-center">
                            <p className="text-[10px] text-gray-600 dark:text-gray-400 font-semibold mb-1">
                              Mati
                            </p>
                            <div className="flex items-baseline justify-center gap-1">
                              <p className="text-sm font-bold text-red-600">
                                {Number(item.record.jumlah_bibit_mati || 0)}
                              </p>
                              {idx > 0 && (
                                <TrendIndicator 
                                  change={item.changes.dead}
                                />
                              )}
                            </div>
                          </div>

                          {/* Planted */}
                          <div className="text-center">
                            <p className="text-[10px] text-gray-600 dark:text-gray-400 font-semibold mb-1">
                              Ditanam
                            </p>
                            <p className="text-sm font-bold text-teal-600">
                              {Number(item.record.jumlah_bibit_ditanam || 0)}
                            </p>
                          </div>
                        </div>

                        {/* Leaf Conditions */}
                        <div className="grid grid-cols-5 gap-1.5 pt-2 border-t border-gray-200 dark:border-gray-700">
                          <div className="text-center">
                            <p className="text-[9px] text-gray-600 dark:text-gray-400 font-semibold mb-1">
                              Mengering
                            </p>
                            {getConditionBadge(item.record.daun_mengering)}
                          </div>
                          <div className="text-center">
                            <p className="text-[9px] text-gray-600 dark:text-gray-400 font-semibold mb-1">
                              Layu
                            </p>
                            {getConditionBadge(item.record.daun_layu)}
                          </div>
                          <div className="text-center">
                            <p className="text-[9px] text-gray-600 dark:text-gray-400 font-semibold mb-1">
                              Menguning
                            </p>
                            {getConditionBadge(item.record.daun_menguning)}
                          </div>
                          <div className="text-center">
                            <p className="text-[9px] text-gray-600 dark:text-gray-400 font-semibold mb-1">
                              Bercak
                            </p>
                            {getConditionBadge(item.record.bercak_daun)}
                          </div>
                          <div className="text-center">
                            <p className="text-[9px] text-gray-600 dark:text-gray-400 font-semibold mb-1">
                              Hama
                            </p>
                            {getConditionBadge(item.record.daun_serangga)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Status Summary */}
          {sortedRecords.length > 0 && (
            <div className="mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg border-l-4 border-l-blue-500 flex items-start gap-2">
              <FiCheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-blue-700 dark:text-blue-300">
                <p className="font-semibold">
                  Monitoring terbaru: Bulan ke-{sortedRecords[sortedRecords.length - 1].bulan_monitoring}
                </p>
                <p className="text-[11px] mt-1">
                  Survival rate: {Number(sortedRecords[sortedRecords.length - 1].survival_rate || 0).toFixed(1)}%
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MonitoringHistoryCard;
