import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FiX, 
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
  FiFileText
} from "react-icons/fi"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/app/context/AuthContext"
import { useTheme } from "@/app/context/ThemeContext"
import { cn } from "@/shared/utils/utils"
import navigationConfig from "@/app/config/navigationConfig"

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

  // Use centralized navigation configuration for consistency
  const mainMenuItems = navigationConfig.getMenuItems(isAdmin)
  const specialMenuItems = navigationConfig.getSpecialMenuItems(isAdmin)

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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] md:hidden"
            onClick={onClose}
          />
          
          {/* Sheet */}
          <motion.div
            ref={ref}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-[70] md:hidden",
              "bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl",
              "max-h-[85vh] overflow-hidden flex flex-col",
              className
            )}
            {...props}
          >
            {/* Handle Bar */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                  Menu Navigasi
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Monitoring Lapangan
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            
            {/* Main Menu Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
              {mainMenuItems.map((item) => {
                const isActive = location.pathname === item.path
                return (
                  <motion.button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-primary/20"
                    }`}
                    whileHover={{ x: isActive ? 0 : 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className={isActive ? "text-white" : "text-primary dark:text-primary-light"}>
                      {getIcon(item.iconName)}
                    </span>
                    <span className="font-medium">{item.label}</span>
                    {isActive && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-white/80 animate-pulse" />
                    )}
                  </motion.button>
                )
              })}

              {/* Special Menu Items - Verifikasi, Pengguna, Log History */}
              {specialMenuItems.map((item) => {
                const itemPath = item.getPath ? item.getPath(isAdmin) : item.path;
                const itemLabel = item.getLabel ? item.getLabel(isAdmin) : item.label;
                const isActive = location.pathname === itemPath;

                return (
                  <motion.button
                    key={item.label}
                    onClick={() => handleNavigation(itemPath)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                      item.label === "Verifikasi"
                        ? `border ${
                            isActive
                              ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md border-primary"
                              : "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/40 border-primary/20 dark:border-primary/80"
                          }`
                        : isActive
                        ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className={isActive ? "text-white" : item.label === "Verifikasi" ? "" : "text-primary dark:text-primary-light"}>
                      {getIcon(item.iconName)}
                    </span>
                    <span className="font-medium">{itemLabel}</span>
                    {isActive && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-white/80 animate-pulse" />
                    )}
                  </motion.button>
                );
              })}
            </nav>

            {/* User Info Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
              <div className="relative">
                <motion.button
                  onClick={handleUserMenuClick}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 dark:hover:bg-primary/20 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="relative">
                    <motion.div 
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-sm font-bold shadow-lg"
                      whileHover={{ scale: 1.1 }}
                      animate={{ 
                        boxShadow: userMenuOpen 
                          ? "0 0 20px rgba(16, 185, 129, 0.4)" 
                          : "0 0 0px rgba(16, 185, 129, 0)" 
                      }}
                    >
                      {(user?.username || user?.name || "U")[0].toUpperCase()}
                    </motion.div>
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
                </motion.button>
                
                {/* User Menu Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="absolute bottom-full mb-2 left-0 right-0 bg-white dark:bg-gray-800 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                    >
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
                        <motion.button
                          onClick={() => {
                            toggleTheme()
                            setUserMenuOpen(false)
                          }}
                          className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all text-sm"
                          whileHover={{ x: 4 }}
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
                        </motion.button>

                        {/* Settings */}
                        <motion.button
                          onClick={handleSettings}
                          className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all text-sm"
                          whileHover={{ x: 4 }}
                        >
                          <FiSettings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          <span className="font-medium">Pengaturan</span>
                        </motion.button>
                        
                        {/* Logout */}
                        <motion.button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-3 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all border-t border-gray-200/50 dark:border-gray-700/50 mt-2 pt-2 text-sm"
                          whileHover={{ x: 4 }}
                        >
                          <FiLogOut className="w-4 h-4" />
                          <span className="font-medium">Keluar</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
})

MobileSheetNavigation.displayName = "MobileSheetNavigation"

export { MobileSheetNavigation }


