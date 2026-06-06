import { useState } from "react"
import {
  PanelNavButton
} from "@/shared/components/ui/navigation/PanelNavButton"
import {
  DesktopNavButton
} from "@/shared/components/ui/navigation/DesktopNavButton"
import { PageTabs } from "@/shared/components/ui/tabs"
import {
  CTAButton
} from "@/shared/components/ui/button/CTAButton"
import {
  FormButton
} from "@/shared/components/ui/button/FormButton"
import BottomSheetContainer from "@/shared/components/ui/sheet/BottomSheetContainer"
import FloatingActionButton from "@/shared/components/ui/button/FloatingActionButton"

import {
  FiCheckCircle,
  FiDownload,
  FiUser,
  FiSettings,
  FiLogOut,
  FiHome,
  FiGrid,
  FiPlus,
  FiActivity,
  FiBarChart2,
} from "react-icons/fi"

// Demo tabs for PageTabs showcase
const demoTabs = [
  { key: "data", label: "Data Evaluasi", path: "#data" },
  { key: "informasi", label: "Informasi Pengamatan", path: "#informasi" },
  { key: "parameter", label: "Parameter Kondisi", path: "#parameter" },
]

const ButtonTypesDemo = () => {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [simpleSheetOpen, setSimpleSheetOpen] = useState(false)
  const [fabOpen, setFabOpen] = useState(false)

  return (
    <div className="p-8 space-y-12 max-w-5xl mx-auto pb-32">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Button System Playground</h1>
        <p className="text-sm text-gray-500 mt-2">
          Visualisasi bagaimana setiap button hidup dalam konteks nyata, bukan sekadar katalog.
        </p>
      </div>

      {/* DESIGN RULES */}
      <div className="p-6 rounded-xl bg-gray-100 dark:bg-gray-800 space-y-2">
        <h2 className="text-xl font-semibold">Design System Rules</h2>
        <ul className="text-sm space-y-1">
          <li>• Button = styling primitive (no layout rules)</li>
          <li>• PanelNavButton = dashboard panel navigation (sidebar & mobile sheets)</li>
          <li>• DesktopNavButton = homepage/navbar navigation</li>
          <li>• CTA = attention-driven component</li>
          <li>• FormButton = interaction + submission logic</li>
          <li>• BottomSheetContainer = reusable sheet wrapper</li>
          <li>• FloatingActionButton = landing page floating menu</li>
        </ul>
      </div>

      {/* FLOATING ACTION BUTTON DEMO */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Floating Action Button (FAB)</h2>
        <p className="text-sm text-gray-500">
          FAB digunakan di landing page untuk navigasi mobile. Klik tombol di bawah untuk demo.
        </p>

        <div className="p-6 rounded-xl border bg-gray-50 dark:bg-gray-900 space-y-4">
          <div className="flex flex-wrap gap-4">
            <FormButton 
              variant="primary" 
              onClick={() => setFabOpen(!fabOpen)}
              icon={<FiPlus />}
            >
              {fabOpen ? 'Hide FAB Demo' : 'Show FAB Demo'}
            </FormButton>
          </div>
          
          <p className="text-xs text-gray-400">
            FAB akan muncul di pojok kanan bawah. Klik untuk membuka speed dial menu.
          </p>
        </div>
      </div>

      {/* PAGE TABS DEMO */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Page Tabs (Sub-navigation)</h2>
        <p className="text-sm text-gray-500">
          Tabs untuk sub-navigasi di dalam halaman. Digunakan di mobile untuk menampilkan submenu 
          (seperti Evaluasi, Perencanaan) sebagai tabs horizontal di dalam page.
        </p>

        <div className="space-y-4">
          {/* Tabs Demo */}
          <div className="rounded-xl border bg-white dark:bg-gray-900 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold">Evaluasi</h3>
              <p className="text-sm text-gray-500">Halaman dengan sub-navigasi tabs</p>
            </div>
            
            <PageTabs tabs={demoTabs} />
            
            <div className="p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Konten halaman akan ditampilkan di sini. Tabs di atas menggantikan submenu 
                yang ada di sidebar desktop.
              </p>
            </div>
          </div>

          {/* Info box */}
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Penggunaan:</strong> Untuk halaman seperti Evaluasi dan Perencanaan yang punya submenu,
              di desktop submenu tampil di sidebar, sedangkan di mobile submenu tampil sebagai PageTabs di dalam halaman.
            </p>
          </div>
        </div>
      </div>

      {/* SHEET COMPONENTS DEMO */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Sheet Components</h2>
        <p className="text-sm text-gray-500">
          BottomSheetContainer untuk membuat bottom sheet yang konsisten.
        </p>

        <div className="flex flex-wrap gap-4">
          <FormButton variant="primary" onClick={() => setSimpleSheetOpen(true)}>
            Open Simple Sheet
          </FormButton>
          <FormButton variant="secondary" onClick={() => setSheetOpen(true)}>
            Open Full Sheet
          </FormButton>
        </div>

        {/* Simple Sheet Demo */}
        <BottomSheetContainer
          isOpen={simpleSheetOpen}
          onClose={() => setSimpleSheetOpen(false)}
          title="Simple Sheet"
          subtitle="Demo BottomSheetContainer"
        >
          <div className="p-3 space-y-2">
            <p className="text-sm text-gray-600 dark:text-gray-400 px-2">
              Ini adalah contoh penggunaan BottomSheetContainer dengan konfigurasi sederhana.
            </p>
            <PanelNavButton icon={<FiHome />} onClick={() => setSimpleSheetOpen(false)}>
              Menu Item 1
            </PanelNavButton>
            <PanelNavButton icon={<FiGrid />} onClick={() => setSimpleSheetOpen(false)}>
              Menu Item 2
            </PanelNavButton>
            <PanelNavButton icon={<FiSettings />} onClick={() => setSimpleSheetOpen(false)}>
              Menu Item 3
            </PanelNavButton>
          </div>
        </BottomSheetContainer>

        {/* Full Sheet Demo */}
        <BottomSheetContainer
          isOpen={sheetOpen}
          onClose={() => setSheetOpen(false)}
          title="Full Featured Sheet"
          subtitle="With custom header and footer"
          headerRight={
            <button className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium">
              Action
            </button>
          }
        >
          <div className="p-3 space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Sheet ini mendemonstrasikan semua fitur BottomSheetContainer:
            </p>
            <ul className="text-sm text-gray-500 space-y-1 list-disc list-inside">
              <li>Custom headerRight element</li>
              <li>Title dan subtitle</li>
              <li>Handle bar (drag indicator)</li>
              <li>Close button</li>
              <li>Scroll lock saat terbuka</li>
              <li>Responsive z-index</li>
            </ul>
            <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
              <FormButton variant="primary" className="w-full" onClick={() => setSheetOpen(false)}>
                Close Sheet
              </FormButton>
            </div>
          </div>
        </BottomSheetContainer>
      </div>

      {/* REAL SCENARIOS */}
      <div className="space-y-10">

        {/* PANEL NAVIGATION - Sidebar & Sheet */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Panel Navigation (Sidebar & Sheet)</h2>
          <p className="text-sm text-gray-500">
            PanelNavButton digunakan untuk navigasi di dashboard sidebar dan bottom sheet.
            Keduanya menggunakan konfigurasi yang sama dari navigationConfig.
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Sidebar Demo */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Sidebar / Sheet Menu:</p>
              <div className="p-3 rounded-xl border space-y-0.5 bg-gray-50 dark:bg-gray-900">
                <PanelNavButton icon={<FiHome />} active>
                  Dashboard
                </PanelNavButton>

                {/* Perencanaan Submenu */}
                <PanelNavButton 
                  icon={<FiGrid />}
                  hasSubmenu
                  isSubmenuOpen={true}
                  subItems={
                    <>
                      <PanelNavButton active className="text-sm py-2.5 min-h-[40px]">All Perencanaan</PanelNavButton>
                      <PanelNavButton className="text-sm py-2.5 min-h-[40px]">Buat Perencanaan</PanelNavButton>
                    </>
                  }
                >
                  Perencanaan
                </PanelNavButton>

                <PanelNavButton icon={<FiCheckCircle />}>
                  Implementasi
                </PanelNavButton>

                <PanelNavButton icon={<FiActivity />}>
                  Monitoring
                </PanelNavButton>

                {/* Evaluasi Submenu */}
                <PanelNavButton 
                  icon={<FiBarChart2 />}
                  hasSubmenu
                  isSubmenuOpen={true}
                  subItems={
                    <>
                      <PanelNavButton className="text-sm py-2.5 min-h-[40px]">Data Evaluasi</PanelNavButton>
                      <PanelNavButton active className="text-sm py-2.5 min-h-[40px]">Informasi Pengamatan</PanelNavButton>
                      <PanelNavButton className="text-sm py-2.5 min-h-[40px]">Parameter Kondisi</PanelNavButton>
                    </>
                  }
                >
                  Evaluasi
                </PanelNavButton>

                <div className="my-1 border-t border-gray-200 dark:border-gray-700" />

                <PanelNavButton icon={<FiCheckCircle />} variant="accent">
                  Verifikasi
                </PanelNavButton>
              </div>
            </div>

            {/* Variants Demo */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-600">Variants:</p>
              <div className="p-3 rounded-xl border space-y-0.5 bg-gray-50 dark:bg-gray-900">
                <PanelNavButton icon={<FiHome />}>
                  Default
                </PanelNavButton>
                <PanelNavButton icon={<FiHome />} active>
                  Active
                </PanelNavButton>
                <PanelNavButton icon={<FiCheckCircle />} variant="accent">
                  Accent (Verifikasi)
                </PanelNavButton>
                <PanelNavButton icon={<FiLogOut />} variant="destructive">
                  Destructive (Logout)
                </PanelNavButton>
                <PanelNavButton icon={<FiSettings />} disabled>
                  Disabled
                </PanelNavButton>
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP NAVIGATION - Homepage */}
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Desktop Navigation (Homepage/Navbar)</h2>
          <p className="text-sm text-gray-500">
            DesktopNavButton untuk navigasi di navbar homepage.
          </p>

          <div className="p-6 rounded-xl border">
            <div className="h-16 sm:h-18 md:h-16 flex items-center justify-between rounded-full px-8 py-10 md:py-8 backdrop-blur-2xl border border-primary-light  bg-gradient-to-r from-primary via-primary/85 to-primary-dark shadow-[0_12px_30px_-12px_rgba(81,118,64,0.75)]">
              <DesktopNavButton icon={<FiGrid />}>Overview</DesktopNavButton>
              <DesktopNavButton icon={<FiUser />}>Users</DesktopNavButton>
              <DesktopNavButton active icon={<FiSettings />}>
                Settings
              </DesktopNavButton>
            </div>
          </div>
        </div>

        {/* FORM SCENARIO */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Form Interaction Flow</h2>

          <div className="p-6 rounded-xl border space-y-4 max-w-md">
            <input
              className="w-full p-3 border rounded-lg"
              placeholder="Email"
            />
            <input
              className="w-full p-3 border rounded-lg"
              placeholder="Password"
            />

            <div className="flex gap-3">
              <FormButton variant="secondary">
                Cancel
              </FormButton>

              <FormButton variant="primary" icon={<FiCheckCircle />}>
                Submit
              </FormButton>
            </div>
          </div>
        </div>

        {/* CTA LANDING */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Landing Page CTA</h2>

          <div className="p-10 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 text-center space-y-6">
            <h3 className="text-xl font-bold">Build Something Great</h3>
            <p className="text-sm text-gray-500">
              Convert visitors into users with clear action
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton type="primary" icon={<FiDownload />}>
                Get Started
              </CTAButton>
              
              <CTAButton type="secondary" icon={<FiCheckCircle />}>
                Learn More
              </CTAButton>
            </div>
          </div>
        </div>

        {/* CTA ICON-ONLY MODE (for navbar md-lg) */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">CTA Icon-Only Mode (Navbar md-lg)</h2>

          <div className="p-6 rounded-xl border space-y-4">
            <p className="text-sm text-gray-500">
              Use iconOnly prop for compact navbar display on md-lg screens
            </p>

            <div className="flex gap-3 items-center">
              <CTAButton type="primary" icon={<FiDownload />} iconOnly title="Download" />
              <CTAButton type="secondary" icon={<FiCheckCircle />} iconOnly title="Verify" />
              <CTAButton type="primary" icon={<FiSettings />} iconOnly title="Settings" />
            </div>

            <p className="text-xs text-gray-400 mt-4">
              These buttons show only icons on md-lg screens, then hide on smaller screens
            </p>
          </div>
        </div>

      </div>

      {/* STATE COMPARISON */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">State Comparison</h2>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">PanelNavButton States:</p>
          <div className="flex flex-wrap gap-2">
            <PanelNavButton icon={<FiGrid />}>
              Default
            </PanelNavButton>

            <PanelNavButton icon={<FiGrid />} active>
              Active
            </PanelNavButton>

            <PanelNavButton icon={<FiGrid />} disabled>
              Disabled
            </PanelNavButton>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">FormButton States:</p>
          <div className="flex flex-wrap gap-3">
            <FormButton variant="primary">
              Idle
            </FormButton>

            <FormButton variant="primary" loading>
              Loading
            </FormButton>

            <FormButton variant="primary" disabled>
              Disabled
            </FormButton>
          </div>
        </div>
      </div>

      {/* FAB DEMO - Fixed position when shown */}
      {fabOpen && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="pointer-events-auto">
            <FloatingActionButton context="landing" />
          </div>
        </div>
      )}

    </div>
  )
}

export default ButtonTypesDemo
