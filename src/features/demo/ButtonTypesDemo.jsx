import {
  MobileNavButton
} from "@/shared/components/ui/navigation/MobileNavButton"
import {
  DesktopNavButton
} from "@/shared/components/ui/navigation/DesktopNavButton"
import {
  CTAButton
} from "@/shared/components/ui/button/CTAButton"
import {
  FormButton
} from "@/shared/components/ui/button/FormButton"

import {
  FiCheckCircle,
  FiDownload,
  FiUser,
  FiSettings,
  FiLogOut,
  FiHome,
  FiGrid,
} from "react-icons/fi"

const ButtonTypesDemo = () => {
  return (
    <div className="p-8 space-y-12 max-w-5xl mx-auto">

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
          <li>• NavButton = layout owner (spacing, alignment)</li>
          <li>• CTA = attention-driven component</li>
          <li>• FormButton = interaction + submission logic</li>
        </ul>
      </div>

      {/* REAL SCENARIOS */}
      <div className="space-y-10">

        {/* SIDEBAR SCENARIO */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Sidebar Navigation (Real Use Case)</h2>

          <div className="p-6 rounded-xl border space-y-2 bg-gray-50 dark:bg-gray-900">
            <MobileNavButton icon={<FiHome />} active>
              Home
            </MobileNavButton>

            <MobileNavButton icon={<FiGrid />}>
              Dashboard
            </MobileNavButton>

            <MobileNavButton variant="primary" icon={<FiCheckCircle />}>
              Verifikasi
            </MobileNavButton>

            <MobileNavButton icon={<FiSettings />} disabled>
              Settings
            </MobileNavButton>

            <MobileNavButton variant="destructive" icon={<FiLogOut />}>
              Logout
            </MobileNavButton>
          
          </div>
        </div>

        {/* DASHBOARD HEADER */}
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Dashboard Navigation</h2>

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

        <div className="flex flex-wrap gap-3">
          <MobileNavButton icon={<FiGrid />}>
            Default
          </MobileNavButton>

          <MobileNavButton icon={<FiGrid />} active>
            Active
          </MobileNavButton>

          <MobileNavButton icon={<FiGrid />} disabled>
            Disabled
          </MobileNavButton>
        </div>

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
  )
}

export default ButtonTypesDemo
