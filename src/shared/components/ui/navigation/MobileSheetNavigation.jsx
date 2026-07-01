import * as React from "react"
import {
  FiSettings,
  FiLogOut,
  FiSun,
  FiMoon,
  FiHome,
  FiUsers,
  FiClipboard,
  FiCheckCircle,
  FiActivity,
  FiBarChart2,
  FiFileText,
  FiPlus
} from "react-icons/fi"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/app/context/AuthContext"
import { useTheme } from "@/app/context/ThemeContext"
import navigationConfig from "@/app/config/navigationConfig"
import BottomSheetContainer from "@/shared/components/ui/sheet/BottomSheetContainer"
import { PanelNavButton } from "@/shared/components/ui/navigation/PanelNavButton"

const MobileSheetNavigation = React.forwardRef(({
  isOpen,
  onClose,
  className,
  ...props
}, ref) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [userMenuOpen, setUserMenuOpen] = React.useState(false)

  // Check if user is admin
  const isAdmin = user?.role === 'admin'

  // Icon mapping function
  const getIcon = (iconName) => {
    const iconMap = {
      FiHome: <FiHome />,
      FiUsers: <FiUsers />,
      FiClipboard: <FiClipboard />,
      FiCheckCircle: <FiCheckCircle />,
      FiActivity: <FiActivity />,
      FiBarChart2: <FiBarChart2 />,
      FiFileText: <FiFileText />
    };
    return iconMap[iconName] || <FiHome />;
  };

  // Routes that have submenu (for detecting active parent)
  const planningBasePath = isAdmin ? "/admin/perencanaan" : "/user/perencanaan"
  const evaluationBasePath = isAdmin ? "/admin/evaluasi" : "/user/evaluasi"
  const isPlanningRoute = location.pathname.startsWith(planningBasePath)
  const isEvaluationRoute = location.pathname.startsWith(evaluationBasePath)

  // Main paths for parent items (first sub-item)
  const planningMainPath = isAdmin ? "/admin/perencanaan/all" : "/user/perencanaan/all"
  const evaluationMainPath = isAdmin ? "/admin/evaluasi" : "/user/evaluasi"

  const handleNavigation = (path) => {
    navigate(path)
    onClose()
  }

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    onClose()
    navigate("/")
  }

  const handleUserMenuClick = () => {
    setUserMenuOpen(!userMenuOpen)
  }

  const handleSettings = () => {
    navigate(isAdmin ? "/admin/settings" : "/user/settings")
    setUserMenuOpen(false)
    onClose()
  }

  return (
    <BottomSheetContainer
      isOpen={isOpen}
      onClose={onClose}
      title="Menu Navigasi"
      subtitle="Peluk Bumi"
      className={className}
      ref={ref}
      {...props}
    >
      {/* Main Menu Navigation - Mobile: Grid Layout */}
      <nav className="p-4 grid grid-cols-4 gap-2 overflow-y-auto scrollbar-hide pb-20">
        {/* 1. Dashboard */}
        <PanelNavButton
          layout="grid"
          icon={getIcon("FiHome")}
          active={location.pathname === (isAdmin ? "/admin/dashboard" : "/user/dashboard")}
          onClick={() => handleNavigation(isAdmin ? "/admin/dashboard" : "/user/dashboard")}
        >
          Dashboard
        </PanelNavButton>

        {/* 2. Perencanaan */}
        <PanelNavButton
          layout="grid"
          icon={getIcon("FiClipboard")}
          active={isPlanningRoute}
          onClick={() => handleNavigation(planningMainPath)}
        >
          Perencanaan
        </PanelNavButton>

        {/* 3. Implementasi */}
        <PanelNavButton
          layout="grid"
          icon={getIcon("FiCheckCircle")}
          active={location.pathname === (isAdmin ? "/admin/implementasi" : "/user/implementasi")}
          onClick={() => handleNavigation(isAdmin ? "/admin/implementasi" : "/user/implementasi")}
        >
          Implementasi
        </PanelNavButton>

        {/* 4. Monitoring */}
        <PanelNavButton
          layout="grid"
          icon={getIcon("FiActivity")}
          active={location.pathname === (isAdmin ? "/admin/monitoring" : "/user/monitoring")}
          onClick={() => handleNavigation(isAdmin ? "/admin/monitoring" : "/user/monitoring")}
        >
          Monitoring
        </PanelNavButton>

        {/* 5. Evaluasi */}
        <PanelNavButton
          layout="grid"
          icon={getIcon("FiBarChart2")}
          active={isEvaluationRoute}
          onClick={() => handleNavigation(evaluationMainPath)}
        >
          Evaluasi
        </PanelNavButton>

        {/* 6. Verifikasi - Special with accent variant */}
        <PanelNavButton
          layout="grid"
          icon={getIcon("FiCheckCircle")}
          active={location.pathname === "/verifikasi"}
          variant="accent"
          onClick={() => handleNavigation("/verifikasi")}
        >
          Verifikasi
        </PanelNavButton>

        {/* 7. Log History */}
        <PanelNavButton
          layout="grid"
          icon={getIcon("FiFileText")}
          active={location.pathname === (isAdmin ? "/admin/log-history" : "/user/log-history")}
          onClick={() => handleNavigation(isAdmin ? "/admin/log-history" : "/user/log-history")}
        >
          {isAdmin ? "Log Sistem" : "Log Aktivitas"}
        </PanelNavButton>

        {/* 8. Pengguna (Admin Only) */}
        {isAdmin && (
          <PanelNavButton
            layout="grid"
            icon={getIcon("FiUsers")}
            active={location.pathname === "/admin/users"}
            onClick={() => handleNavigation("/admin/users")}
          >
            Pengguna
          </PanelNavButton>
        )}
      </nav>
      {/* User Info Footer */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3">
        <div className="relative">
          <button
            onClick={handleUserMenuClick}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-sm font-bold shadow-lg">
                {(user?.username || user?.name || "U")[0].toUpperCase()}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {user?.username || user?.name || "User"}
              </p>
              <p className="text-xs text-primary dark:text-primary-light font-medium">
                {user?.role || "User"}
              </p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </button>

          {/* User Menu Dropdown */}
          {userMenuOpen && (
            <div className="absolute bottom-full mb-2 left-0 right-0 bg-white dark:bg-gray-800 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* Header */}
              <div className="p-3 bg-gradient-to-r from-primary/10 to-primary-dark/10 dark:from-primary/20 dark:to-primary-dark/20 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-sm font-bold">
                    {(user?.username || user?.name || "U")[0].toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                      {user?.username || user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                      {user?.email || "user@example.com"}
                    </p>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                        {user?.role || "User"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="p-2">
                {/* Theme Toggle */}
                {/* <button
                  onClick={() => {
                    toggleTheme()
                    setUserMenuOpen(false)
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all text-sm"
                >
                  {theme === "dark" ? (
                    <>
                      <FiSun className="w-4 h-4 text-peach" />
                      <span className="font-medium">Mode Terang</span>
                    </>
                  ) : (
                    <>
                      <FiMoon className="w-4 h-4 text-gray-600" />
                      <span className="font-medium">Mode Gelap</span>
                    </>
                  )}
                </button> */}

                {/* Settings */}
                <button
                  onClick={handleSettings}
                  className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all text-sm"
                >
                  <FiSettings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <span className="font-medium">Pengaturan</span>
                </button>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all border-t border-gray-200/50 dark:border-gray-700/50 mt-2 pt-2 text-sm"
                >
                  <FiLogOut className="w-4 h-4" />
                  <span className="font-medium">Keluar</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </BottomSheetContainer>
  )
})

MobileSheetNavigation.displayName = "MobileSheetNavigation"

export { MobileSheetNavigation }
