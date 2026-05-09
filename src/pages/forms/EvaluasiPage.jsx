import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiRefreshCw, FiAlertCircle, FiBarChart2 } from "react-icons/fi";
import { useAuth } from "../../contexts/AuthContext";
import { useEvaluasiData } from "../../hooks/useEvaluasiData";
import { buildAllCompanyReports } from "../../utils/evaluasi.engine";
import { getApiOrigin } from "../../config/apiConfig";
import EvaluasiModal from "../../components/evaluasi/EvaluasiModal";
import CompanyList from "../../components/evaluasi/CompanyList";
import PageHeader from "../../components/shared/PageHeader";

export default function EvaluasiPage() {
  const { user } = useAuth();
  const [selectedCompanyId, setSelectedCompanyId] = useState(null);

  const {
    loading,
    error,
    perencanaanList,
    implementasiList,
    monitoringList,
    refetch,
    pausePolling,
    resumePolling,
  } = useEvaluasiData(user?.role, {
    pollingInterval: 30000,
    enablePolling: true,
  });

  const companyReports = useMemo(() => {
    return buildAllCompanyReports(perencanaanList, implementasiList, monitoringList);
  }, [perencanaanList, implementasiList, monitoringList]);

  const selectedCompanyReport = useMemo(() => {
    return companyReports.find((item) => String(item.id) === String(selectedCompanyId)) || null;
  }, [companyReports, selectedCompanyId]);

  const apiOrigin = getApiOrigin();

  // Pause polling when modal is open to save resources
  const handleSelectCompany = (companyId) => {
    setSelectedCompanyId(companyId);
    pausePolling();
  };

  const handleCloseModal = () => {
    setSelectedCompanyId(null);
    resumePolling();
  };

  return (
    <div className="py-12">
      {/* Header */}
      <PageHeader
        badge="Evaluasi Hasil Laporan"
        badgeIcon={FiBarChart2}
        title="Evaluasi Hasil Laporan"
        description="Pilih perusahaan untuk melihat template evaluasi otomatis berdasarkan data monitoring"
      />

      <div className="max-w-5xl mx-auto">
        <motion.div
          className="glass bg-white/90 dark:bg-gray-900 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="p-8 md:p-12">
            {/* Refresh Button */}
            <div className="flex items-center justify-end mb-6">
              <button
                onClick={refetch}
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                <FiRefreshCw size={14} /> Muat Ulang Data
              </button>
            </div>

            {/* Company List */}
            <CompanyList
              companyReports={companyReports}
              onSelectCompany={handleSelectCompany}
              loading={loading}
              error={error}
            />
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedCompanyReport && (
          <EvaluasiModal
            report={selectedCompanyReport}
            onClose={handleCloseModal}
            apiOrigin={apiOrigin}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
