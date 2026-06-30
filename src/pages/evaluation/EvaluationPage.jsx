import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiRefreshCw, FiBarChart2 } from "react-icons/fi";
import { useAuth } from "@/app/context/AuthContext";
import { useEvaluationData } from "@/features/evaluation/hooks/useEvaluationData";
import { buildAllCompanyReports } from "@/shared/utils/evaluationEngine";
import { getApiOrigin } from "@/app/config/apiConfig";
import EvaluationModal from "@/features/evaluation/components/EvaluationModal";
import LembagaList from "@/features/evaluation/components/LembagaList";
import PageTitle from "@/shared/components/common/PageTitle";
import { PageTabs } from "@/shared/components/ui/tabs";
import navigationConfig from "@/app/config/navigationConfig";

export default function EvaluasiPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [selectedLembagaId, setSelectedLembagaId] = useState(null);

  const {
    loading,
    error,
    perencanaanList,
    implementasiList,
    monitoringList,
    refetch,
    pausePolling,
    resumePolling,
  } = useEvaluationData(user, {
    pollingInterval: 30000,
    enablePolling: true,
  });

  const lembagaReports = useMemo(() => {
    return buildAllCompanyReports(perencanaanList, implementasiList, monitoringList);
  }, [perencanaanList, implementasiList, monitoringList]);

  const selectedLembagaReport = useMemo(() => {
    return lembagaReports.find((item) => String(item.id) === String(selectedLembagaId)) || null;
  }, [lembagaReports, selectedLembagaId]);

  const apiOrigin = getApiOrigin();

  // Evaluasi tabs from navigationConfig
  const evaluationTabs = navigationConfig.getEvaluationMenuItems(isAdmin);

  // Pause polling when modal is open to save resources
  const handleSelectLembaga = (lembagaId) => {
    setSelectedLembagaId(lembagaId);
    pausePolling();
  };

  const handleCloseModal = () => {
    setSelectedLembagaId(null);
    resumePolling();
  };

  return (
    <div className="py-6 md:py-12">
      {/* Header */}
      <PageTitle
        type="page"
        badge="Evaluasi Hasil Laporan"
        badgeIcon={FiBarChart2}
        title="Evaluasi Hasil Laporan"
        description="Pilih lembaga untuk melihat template evaluasi otomatis berdasarkan data monitoring"
      />

      {/* Sub-navigation tabs — mobile only, sidebar handles desktop */}
      <div className="md:hidden mb-4">
        <PageTabs tabs={evaluationTabs} />
      </div>

      <div className="max-w-5xl mx-auto">
        <motion.div
          className="glass bg-white/90 dark:bg-gray-900 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="p-8 md:p-12">
            {/* Refresh Button */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 mb-6">
              <button
                onClick={refetch}
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
              >
                <FiRefreshCw size={14} /> Muat Ulang Data
              </button>
            </div>

            {/* Lembaga List */}
            <LembagaList
              lembagaReports={lembagaReports}
              onSelectLembaga={handleSelectLembaga}
              loading={loading}
              error={error}
            />
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedLembagaReport && (
          <EvaluationModal
            report={selectedLembagaReport}
            onClose={handleCloseModal}
            apiOrigin={apiOrigin}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
