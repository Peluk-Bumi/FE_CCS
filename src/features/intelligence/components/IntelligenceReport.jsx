import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiTrendingUp, 
  FiShield, 
  FiAlertTriangle, 
  FiFileText, 
  FiActivity,
  FiTarget,
  FiInfo
} from 'react-icons/fi';
import { getIntelligenceReport } from '../services/intelligenceService';
import SurvivalRateChart from './SurvivalRateChart';
import ESGScoreChart from './ESGScoreChart';
import LoadingSpinner from '@/shared/components/layout/LoadingSpinner';

const IntelligenceReport = ({ perencanaanId }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const data = await getIntelligenceReport(perencanaanId);
        setReport(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load intelligence report:', err);
        setError('Gagal memuat laporan intelijen. Pastikan data monitoring sudah tersedia.');
      } finally {
        setLoading(false);
      }
    };

    if (perencanaanId) {
      fetchReport();
    }
  }, [perencanaanId]);

  if (loading) return <div className="p-12 flex justify-center"><LoadingSpinner /></div>;

  if (error) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 rounded-2xl text-center">
        <FiAlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <p className="text-red-700 font-medium">{error}</p>
      </div>
    );
  }

  if (!report) return null;

  return (
    <div className="space-y-8">
      {/* Narrative Summary */}
      <motion.div 
        className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl">
            <FiFileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Analisis Intelijen Otomatis</h3>
            <p className="text-sm text-gray-500">Narasi dihasilkan berdasarkan data real-time dan algoritma ESG</p>
          </div>
        </div>
        <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed italic border-l-4 border-emerald-500 pl-6 py-2">
          "{report.summary}"
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Survival Rate Trend */}
        <motion.div 
          className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FiTrendingUp className="text-emerald-500" />
              Tren Survival Rate
            </h3>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
              Dinamis Per Ronde
            </span>
          </div>
          <SurvivalRateChart data={report.trend} />
        </motion.div>

        {/* ESG Score Breakdown */}
        <motion.div 
          className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <FiShield className="text-blue-500" />
              Skor ESG & Keberlanjutan
            </h3>
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-gray-500 mr-2">Rating:</span>
              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-black rounded-lg">
                {report.esg.rating}
              </span>
            </div>
          </div>
          <ESGScoreChart score={report.esg.total_score} breakdown={report.esg.breakdown} />
        </motion.div>
      </div>

      {/* Anomalies Detection */}
      <motion.div 
        className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <FiActivity className="text-orange-500" />
            Deteksi Anomali Data
          </h3>
          {report.anomalies.length === 0 ? (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
              <FiShield className="w-3 h-3" /> Data Aman
            </span>
          ) : (
            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1">
              <FiAlertTriangle className="w-3 h-3" /> {report.anomalies.length} Anomali
            </span>
          )}
        </div>

        {report.anomalies.length === 0 ? (
          <div className="flex items-center gap-4 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <FiShield className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Sistem tidak mendeteksi adanya anomali data. Semua parameter monitoring berada dalam batas wajar.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {report.anomalies.map((anomaly, idx) => (
              <div key={idx} className="flex items-start gap-4 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl">
                <FiAlertTriangle className="w-5 h-5 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-bold text-red-900 dark:text-red-200">{anomaly.message}</p>
                  <p className="text-xs text-red-700 dark:text-red-400 mt-1 uppercase tracking-wider">
                    Severity: {anomaly.severity} | Ronde: {anomaly.round}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default IntelligenceReport;
