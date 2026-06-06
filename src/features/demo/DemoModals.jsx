import { useState } from "react";
import { FiLayout, FiAlertCircle, FiCheckCircle, FiTrash2, FiInfo, FiLayers, FiActivity } from "react-icons/fi";
import {
  AnimatedModal,
  AnimatedModalContent,
  AnimatedModalHeader,
  AnimatedModalBody,
  AnimatedModalFooter,
  ActionModal,
  AttentionModal,
  TabbedModal,
  StandardModal
} from "@/shared/components/ui/modal/AnimatedModal";
import { FormButton } from "@/shared/components/ui/button/FormButton";
import PageTitle from "@/shared/components/common/PageTitle";
import { ModalTabs } from "@/shared/components/ui/tabs";

export function DemoModals() {
  const [openAction, setOpenAction] = useState(false);
  const [openAttention, setOpenAttention] = useState(false);
  const [openTabbed, setOpenTabbed] = useState(false);
  const [openPlain, setOpenPlain] = useState(false);
  
  const [activeTab, setActiveTab] = useState("detail");

  const modalTabsData = [
    { key: "detail", label: "Detail", icon: FiInfo },
    { key: "aktivitas", label: "Aktivitas", icon: FiActivity },
  ];

  return (
    <div className="p-4 md:p-8 space-y-12 max-w-5xl mx-auto">
      <PageTitle
        type="page"
        badge="UI Components"
        badgeIcon={FiLayout}
        title="Animated Modals"
        description="Komponen modal kustom berbasis framer-motion yang mendukung animasi smooth dan struktur modular."
      />

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Live Modals</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Klik tombol di bawah ini untuk melihat contoh modal yang muncul (overlay) di atas layar.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-6">
          <div className="flex flex-wrap gap-4">
            <div className="w-auto">
              <FormButton onClick={() => setOpenAction(true)} variant="outline" className="px-4 py-2 w-auto h-auto min-w-[200px]" icon={<FiCheckCircle />}>
                Action / Confirmation
              </FormButton>
            </div>
            <div className="w-auto">
              <FormButton onClick={() => setOpenAttention(true)} variant="danger" className="px-4 py-2 w-auto h-auto min-w-[200px]" icon={<FiAlertCircle />}>
                Attention / Alert
              </FormButton>
            </div>
            <div className="w-auto">
              <FormButton onClick={() => setOpenTabbed(true)} variant="secondary" className="px-4 py-2 w-auto h-auto min-w-[200px]" icon={<FiLayers />}>
                Tabbed Modal
              </FormButton>
            </div>
            <div className="w-auto">
              <FormButton onClick={() => setOpenPlain(true)} variant="ghost" className="px-4 py-2 w-auto h-auto min-w-[200px]" icon={<FiLayout />}>
                Plain / Minimal
              </FormButton>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-8 mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Inline Preview (Komposisi Modal)</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Anda dapat melihat langsung tampilan dari berbagai variasi ukuran, header, dan footer yang membangun sebuah modal di bawah ini, tanpa harus membukanya.
          </p>
        </div>

        {/* Inline Preview: Action Modal */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">1. Action / Confirmation (Primary Header)</h3>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm bg-white dark:bg-gray-900 flex flex-col max-w-md">
            <AnimatedModalHeader variant="primary" icon={FiCheckCircle} onClose={() => {}}>
              <h3 className="font-bold text-lg">Konfirmasi Tindakan</h3>
              <p className="text-xs text-white/80 mt-0.5">Primary header adalah varian default</p>
            </AnimatedModalHeader>
            <AnimatedModalBody>
              <p className="text-gray-600 dark:text-gray-300">
                Apakah Anda yakin ingin menyimpan perubahan ini? Data yang sudah disimpan akan langsung diterapkan ke sistem.
              </p>
            </AnimatedModalBody>
            <AnimatedModalFooter>
              <FormButton variant="ghost" className="px-4 py-2 w-full sm:w-auto h-auto">Batal</FormButton>
              <FormButton variant="primary" className="px-4 py-2 w-full sm:w-auto h-auto">Simpan Perubahan</FormButton>
            </AnimatedModalFooter>
          </div>
        </div>

        {/* Inline Preview: Attention Modal */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">2. Attention / Alert (Attention Header)</h3>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm bg-white dark:bg-gray-900 flex flex-col max-w-sm">
            <AnimatedModalHeader variant="attention" icon={FiAlertCircle} onClose={() => {}}>
              <h3 className="font-bold text-lg">Peringatan Kritis!</h3>
            </AnimatedModalHeader>
            <AnimatedModalBody className="flex flex-col items-center text-center py-8">
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
                <FiTrash2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Hapus Data?</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Data yang dihapus tidak dapat dikembalikan. Harap pastikan sebelum melanjutkan.
              </p>
            </AnimatedModalBody>
            <AnimatedModalFooter className="justify-center">
              <FormButton variant="danger" className="px-4 py-2 w-full h-auto">Saya Mengerti</FormButton>
            </AnimatedModalFooter>
          </div>
        </div>

        {/* Inline Preview: Plain Modal */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">3. Plain / Minimal (Plain Header)</h3>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm bg-white dark:bg-gray-900 flex flex-col max-w-md">
            <AnimatedModalHeader variant="plain" icon={FiLayout} onClose={() => {}}>
              <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">Pengaturan Dasar</h3>
            </AnimatedModalHeader>
            <AnimatedModalBody>
              <p className="text-gray-600 dark:text-gray-300">
                Modal ini menggunakan header putih standar ("plain"). Berguna untuk modal yang tidak memerlukan penekanan visual berlebih.
              </p>
            </AnimatedModalBody>
            <AnimatedModalFooter>
              <FormButton variant="ghost" className="px-4 py-2 w-full sm:w-auto h-auto">Tutup</FormButton>
              <FormButton variant="primary" className="px-4 py-2 w-full sm:w-auto h-auto">Terapkan</FormButton>
            </AnimatedModalFooter>
          </div>
        </div>

      </section>

      {/* 1. Action / Confirmation Modal */}
      <ActionModal
        isOpen={openAction}
        onClose={() => setOpenAction(false)}
        size="md"
        icon={FiCheckCircle}
        title="Konfirmasi Tindakan"
        subtitle="Primary header adalah varian default"
        footer={
          <>
            <FormButton variant="ghost" className="px-4 py-2 w-full sm:w-auto h-auto" onClick={() => setOpenAction(false)}>Batal</FormButton>
            <FormButton variant="primary" className="px-4 py-2 w-full sm:w-auto h-auto" onClick={() => setOpenAction(false)}>Simpan Perubahan</FormButton>
          </>
        }
      >
        <p className="text-gray-600 dark:text-gray-300">
          Apakah Anda yakin ingin menyimpan perubahan ini? Data yang sudah disimpan akan langsung diterapkan ke sistem.
        </p>
      </ActionModal>

      {/* 2. Attention / Alert Modal */}
      <AttentionModal
        isOpen={openAttention}
        onClose={() => setOpenAttention(false)}
        size="sm"
        icon={FiAlertCircle}
        title="Peringatan Kritis!"
        footer={
          <FormButton variant="danger" className="w-full px-4 py-2 h-auto" onClick={() => setOpenAttention(false)}>Saya Mengerti</FormButton>
        }
      >
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
          <FiTrash2 className="w-8 h-8" />
        </div>
        <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">Hapus Data?</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Data yang dihapus tidak dapat dikembalikan. Harap pastikan sebelum melanjutkan.
        </p>
      </AttentionModal>

      {/* 3. Tabbed Modal (Fixed Height) */}
      <TabbedModal
        isOpen={openTabbed}
        onClose={() => setOpenTabbed(false)}
        size="2xl"
        height="fixed-md"
        icon={FiLayers}
        title="Detail Laporan Berkala"
        subtitle="Tinggi modal dibuat tetap (fixed-md) agar header tidak bergeser saat ganti tab."
        tabs={modalTabsData}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        footer={
          <FormButton variant="outline" className="px-4 py-2 w-full sm:w-auto h-auto" onClick={() => setOpenTabbed(false)}>Tutup</FormButton>
        }
      >
        {activeTab === "detail" && (
          <div className="space-y-4">
            <p className="text-gray-600 dark:text-gray-300">
              Berikut adalah informasi detail terkait laporan penanaman. Area modal ini mendukung konten yang dapat di-scroll secara mandiri tanpa memengaruhi header dan tab di atasnya.
            </p>
            <div className="h-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl flex items-center justify-center">
              <span className="text-gray-400">Placeholder Konten Detail</span>
            </div>
          </div>
        )}
        {activeTab === "aktivitas" && (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="font-semibold text-gray-800 dark:text-gray-200">Aktivitas {i}</p>
                <p className="text-sm text-gray-500">Pembaruan sistem dilakukan pada sesi ini.</p>
              </div>
            ))}
          </div>
        )}
      </TabbedModal>

      {/* 4. Plain Modal */}
      <StandardModal
        isOpen={openPlain}
        onClose={() => setOpenPlain(false)}
        size="md"
        icon={FiLayout}
        title="Pengaturan Dasar"
        footer={
          <>
            <FormButton variant="ghost" className="px-4 py-2 w-full sm:w-auto h-auto" onClick={() => setOpenPlain(false)}>Tutup</FormButton>
            <FormButton variant="primary" className="px-4 py-2 w-full sm:w-auto h-auto" onClick={() => setOpenPlain(false)}>Terapkan</FormButton>
          </>
        }
      >
        <p className="text-gray-600 dark:text-gray-300">
          Modal ini menggunakan header putih standar ("plain"). Berguna untuk modal yang tidak memerlukan penekanan visual berlebih.
        </p>
      </StandardModal>

    </div>
  );
}


