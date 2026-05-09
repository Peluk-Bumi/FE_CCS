import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Sidebar from "../components/common/Sidebar";
import { FiMenu } from "react-icons/fi";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  // Determine if user is admin based on role
  const isAdmin = user?.role === 'admin';

  return (
    <div className="min-h-screen flex">
      {/* Sidebar Desktop - Fixed */}
      <div className="hidden md:block md:fixed md:inset-y-0 md:left-0 md:w-64 md:z-30">
        <Sidebar isUser={!isAdmin} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* Sidebar Mobile - Overlay */}
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar Panel */}
          <div className="fixed inset-y-0 left-0 w-64 z-50 md:hidden">
            <Sidebar isUser={isUser} onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* Main Content Area - With left margin for desktop sidebar */}
      <div className="flex-1 md:ml-64 w-full">
        {/* Mobile Header */}
        <div className="md:hidden sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center shadow-sm">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light hover:bg-primary/20 dark:hover:bg-primary/40 transition-all"
            aria-label="Buka menu sidebar"
          >
            <FiMenu size={24} />
          </button>
          <h1 className="ml-4 text-lg font-bold bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            Peluk Bumi Admin
          </h1>
        </div>

        {/* Content Container - With max-width and consistent padding */}
        <div className="w-full h-full overflow-hidden bg-gradient-to-br from-light via-primary-light/10 to-primary/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-300">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
