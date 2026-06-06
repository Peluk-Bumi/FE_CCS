import React, { useState } from 'react';
import { PageTabs, PanelTabs, SidebarTabs, ModalTabs } from '@/shared/components/ui/tabs';
import PageTitle from '@/shared/components/common/PageTitle';
import { FiLayout, FiCalendar, FiBarChart2, FiSettings, FiFileText, FiActivity, FiDatabase, FiGrid, FiFolder } from 'react-icons/fi';

export default function DemoTabsPage() {
  const [activePage, setActivePage] = useState('/demo/evaluasi');
  const [activePanel, setActivePanel] = useState('data');
  const [activeSidebar, setActiveSidebar] = useState('all');
  const [activeModal, setActiveModal] = useState('tab1');

  const pageTabsData = [
    { key: 'evaluasi', label: 'Data Evaluasi', path: '/demo/evaluasi', icon: FiDatabase, count: 5 },
    { key: 'informasi', label: 'Informasi', path: '/demo/evaluasi/information', icon: FiFileText },
    { key: 'parameter', label: 'Parameter', path: '/demo/evaluasi/parameter', icon: FiSettings },
  ];

  const panelTabsData = [
    { key: 'data', label: 'Ringkasan Data', icon: FiBarChart2 },
    { key: 'kegiatan', label: 'Aktivitas', icon: FiActivity, count: 12 },
    { key: 'pengaturan', label: 'Pengaturan Panel', icon: FiSettings },
  ];

  const sidebarTabsData = [
    { key: 'all', label: 'Semua Topik', icon: FiGrid, count: 24 },
    { key: 'umum', label: 'Umum', icon: FiFolder, count: 12 },
    { key: 'teknis', label: 'Teknis', icon: FiFolder, count: 8 },
    { key: 'akun', label: 'Akun', icon: FiFolder, count: 4 },
  ];

  const modalTabsData = [
    { key: 'tab1', label: 'General', icon: FiLayout },
    { key: 'tab2', label: 'Advanced', icon: FiSettings, count: 2 },
    { key: 'tab3', label: 'Logs', icon: FiFileText },
  ];

  return (
    <div className="p-4 md:p-8 space-y-12 max-w-5xl mx-auto">
      <PageTitle
        type="page"
        badge="UI Components"
        badgeIcon={FiLayout}
        title="Semantic Tabs Demo"
        description="Komponen tabs fungsional. Tersedia 4 tipe berdasarkan letak penggunaannya (Page, Panel, Sidebar, Modal)."
      />

      {/* Explanation */}
      <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-sm text-blue-800 dark:text-blue-200 space-y-1">
        <p className="font-semibold">Semantic Variants:</p>
        <p>• <strong>PageTabs</strong>: Untuk level halaman utama (background tebal, shadow).</p>
        <p>• <strong>PanelTabs</strong>: Untuk di dalam Card/Panel (lebih ringan, menyatu dengan background putih).</p>
        <p>• <strong>SidebarTabs</strong>: Untuk layout dua kolom (Vertikal di desktop, Wrapped-Pills di mobile).</p>
        <p>• <strong>ModalTabs</strong>: Untuk jendela modal yang padat (compact size).</p>
        <p className="mt-2 text-xs italic">Semua variant mendukung fitur Icon dan Badge (Count) secara seragam.</p>
      </div>

      {/* ═══════════ PAGE TABS ═══════════ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">1. PageTabs (Level Halaman)</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gunakan di level halaman (seperti navigasi sub-menu utama). Memiliki card wrapper sendiri agar menonjol di atas background gradien/abu-abu.</p>
        </div>
        
        {/* Simulate a gray/gradient background page */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/50 dark:to-gray-900 border border-gray-200 dark:border-gray-800 space-y-6">
          <PageTabs
            tabs={pageTabsData}
            activeTab={activePage}
            onTabChange={setActivePage}
          />
          <DemoContent label={pageTabsData.find(t => t.path === activePage || t.key === activePage)?.label} />
        </div>
      </section>

      {/* ═══════════ PANEL TABS ═══════════ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">2. PanelTabs (Dalam Card)</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gunakan di dalam sebuah Card/Panel putih bersih. Desainnya flush (menyatu) tanpa tambahan background kotak.</p>
        </div>
        
        <DemoCard>
          <div className="px-6 border-b border-gray-100 dark:border-gray-800">
            <PanelTabs
              tabs={panelTabsData}
              activeTab={activePanel}
              onTabChange={setActivePanel}
              className="mt-2"
            />
          </div>
          <div className="p-6">
            <DemoContent label={panelTabsData.find(t => t.key === activePanel)?.label} />
          </div>
        </DemoCard>
      </section>

      {/* ═══════════ SIDEBAR TABS ═══════════ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">3. SidebarTabs (FAQ Style)</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gunakan pada layout 2-kolom seperti halaman FAQ. Vertikal di desktop, otomatis berubah jadi Wrapped-Pills di Mobile.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <DemoCard>
              <SidebarTabs
                tabs={sidebarTabsData}
                activeTab={activeSidebar}
                onTabChange={setActiveSidebar}
              />
            </DemoCard>
          </div>
          <div className="md:col-span-3">
            <DemoContent label={`Kategori: ${sidebarTabsData.find(t => t.key === activeSidebar)?.label}`} />
          </div>
        </div>

        {/* Mobile Preview forced */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Mobile Preview (Wrapped Pills):</p>
          <DemoCard>
            <SidebarTabs
              tabs={sidebarTabsData}
              activeTab={activeSidebar}
              onTabChange={setActiveSidebar}
              forceMobile={true}
            />
          </DemoCard>
        </div>
      </section>

      {/* ═══════════ MODAL TABS ═══════════ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">4. ModalTabs (Kompak)</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Gunakan di dalam Modal dialog. Ukurannya ringkas untuk menghemat ruang layar vertikal.</p>
        </div>
        
        {/* Simulate a modal popup */}
        <div className="max-w-md mx-auto">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden shadow-xl shadow-black/5">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold">Edit Settings</h3>
            </div>
            <div className="px-6 py-3">
              <ModalTabs
                tabs={modalTabsData}
                activeTab={activeModal}
                onTabChange={setActiveModal}
              />
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800/20 min-h-[150px]">
              <DemoContent label={modalTabsData.find(t => t.key === activeModal)?.label} />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

/* ── Helper Components ────────────────────────────── */
function DemoCard({ children }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
      {children}
    </div>
  );
}

function DemoContent({ label }) {
  return (
    <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-dashed border-gray-200 dark:border-gray-700 p-5 min-h-[80px] flex items-center justify-center">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Konten aktif: <code className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded text-xs font-mono">{label}</code>
      </p>
    </div>
  );
}
