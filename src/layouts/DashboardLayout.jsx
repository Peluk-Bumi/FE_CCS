import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "@/app/context/AuthContext";
import Sidebar from "@/shared/components/layout/Sidebar";
import { MobileHeader } from "@/shared/components/ui/navigation/MobileHeader";
import { MobileSheetNavigation } from "@/shared/components/ui/navigation/MobileSheetNavigation";
import { FloatingSheetTrigger } from "@/shared/components/ui/sheet/FloatingSheetTrigger";

export default function DashboardLayout() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";

  return (
    <div className="min-h-screen flex">

      {/* ── Desktop Sidebar — fixed, hidden on mobile ─────────────────────── */}
      <div className="hidden md:block md:fixed md:inset-y-0 md:left-0 md:w-64 md:z-30">
        <Sidebar isUser={!isAdmin} onClose={() => {}} />
      </div>

      {/* ── Mobile: bottom-sheet navigation ──────────────────────────────── */}
      <MobileSheetNavigation
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />

      {/* ── Mobile: floating trigger button (bottom-left) ─────────────────── */}
      <FloatingSheetTrigger
        isOpen={sheetOpen}
        onClick={() => setSheetOpen((prev) => !prev)}
      />

      {/* ── Main content area ─────────────────────────────────────────────── */}
      <div className="flex-1 md:ml-64 w-full flex flex-col min-h-screen">

        {/* Mobile sticky header — hidden on md+ */}
        <MobileHeader />

        {/* Page content */}
        <div className="flex-1 w-full bg-gradient-to-br from-light via-primary-light/10 to-primary/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 pb-24 md:pb-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
