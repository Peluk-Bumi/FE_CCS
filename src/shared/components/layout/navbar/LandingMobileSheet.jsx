import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  FiX, FiHome, FiInfo, FiHelpCircle, FiCheckCircle,
  FiGrid, FiSettings, FiLogOut, FiUser,
  FiSun, FiMoon,
} from "react-icons/fi"
import { useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "@/app/context/AuthContext"
import { useTheme } from "@/app/context/ThemeContext"
import navigationConfig from "@/app/config/navigationConfig"

const ICON_MAP = {
  FiHome:        <FiHome />,
  FiInfo:        <FiInfo />,
  FiHelpCircle:  <FiHelpCircle />,
  FiCheckCircle: <FiCheckCircle />,
}

/**
 * LandingMobileSheet — bottom-sheet drawer for the public landing page.
 * Nav items: Beranda, Tentang, Verifikasi (from navigationConfig.landingNavItems).
 * Authenticated: Dashboard shortcut + user profile popup (same style as MobileSheetNavigation).
 * Unauthenticated: Login button.
 */
export default function LandingMobileSheet({ isOpen, onClose }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, isAuthenticated, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [userMenuOpen, setUserMenuOpen] = React.useState(false)

  const navItems = navigationConfig.landingNavItems

  const handleNav = (path) => {
    navigate(path)
    onClose()
  }

  const handleLogout = () => {
    logout()
    setUserMenuOpen(false)
    onClose()
    navigate("/")
  }

  const dashboardPath = user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard"
  const settingsPath  = user?.role === "admin" ? "/admin/settings"  : "/user/settings"

  // ── Shared nav button — same styling as Sidebar NavButton ────────────────
  const NavBtn = ({ path, iconName, label, isVerifikasi = false, children, onClick: onClickOverride }) => {
    const isActive = location.pathname === path
    const handleClick = onClickOverride ?? (() => handleNav(path))
    return (
      <motion.button
        onClick={handleClick}
        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
          isVerifikasi
            ? `border ${
                isActive
                  ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md border-primary"
                  : "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/40 border-primary/20 dark:border-primary/80"
              }`
            : isActive
            ? "bg-gradient-to-r from-primary to-primary-dark text-white shadow-md"
            : "text-gray-700 dark:text-gray-300 hover:bg-primary/10 dark:hover:bg-primary/20"
        }`}
        whileHover={{ x: isActive ? 0 : 5 }}
        whileTap={{ scale: 0.98 }}
      >
        {iconName && (
          <span className={isActive ? "text-white" : isVerifikasi ? "text-primary dark:text-primary-light" : "text-primary dark:text-primary-light"}>
            {ICON_MAP[iconName] ?? <FiHome />}
          </span>
        )}
        {children ?? <span className="font-medium">{label}</span>}
        {isActive && !children && (
          <span className="ml-auto h-2 w-2 rounded-full bg-white/80 animate-pulse" />
        )}
      </motion.button>
    )
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[75] md:hidden"
            onClick={onClose}
          />

          {/* Sheet - z-index lebih tinggi dari FAB (z-[80]) */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 z-[85] md:hidden bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-hidden flex flex-col"
          >
            {/* Handle bar */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Menu Navigasi</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Peluk Bumi</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <FiX className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide pb-20">
              {navItems.map((item) => (
                <NavBtn
                  key={item.path}
                  path={item.path}
                  iconName={item.iconName}
                  label={item.label}
                  isVerifikasi={item.label === "Verifikasi"}
                />
              ))}

              <div className="my-2 border-t border-gray-100 dark:border-gray-800" />

              {isAuthenticated ? (
                /* Dashboard shortcut */
                <motion.button
                  onClick={() => handleNav(dashboardPath)}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-dark text-white shadow-md"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-white"><FiGrid /></span>
                  <span className="font-medium">Dashboard</span>
                </motion.button>
              ) : (
                /* Login */
                <motion.button
                  onClick={() => handleNav("/login")}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/40 border border-primary/20 dark:border-primary/80"
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="text-primary dark:text-primary-light"><FiUser /></span>
                  <span className="font-medium">Masuk / Daftar</span>
                </motion.button>
              )}
            </nav>

            {/* ── User Profile Footer (authenticated only) ─────────────────── */}
            {isAuthenticated && (
              <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="relative">
                  {/* Profile trigger button */}
                  <motion.button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
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
                            : "0 0 0px rgba(16, 185, 129, 0)",
                        }}
                      >
                        {(user?.username || user?.name || "U")[0].toUpperCase()}
                      </motion.div>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {user?.username || user?.name || "User"}
                      </p>
                      <p className="text-xs text-primary dark:text-primary-light font-medium">
                        {user?.role || "user"}
                      </p>
                    </div>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
                  </motion.button>

                  {/* Profile popup — opens upward, same style as MobileSheetNavigation */}
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute bottom-full mb-2 left-0 right-0 bg-white dark:bg-gray-800 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
                      >
                        {/* Popup header */}
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
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                  {user?.role || "user"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Popup actions */}
                        <div className="p-2">
                          {/* Theme toggle */}
                          <motion.button
                            onClick={() => { toggleTheme(); setUserMenuOpen(false) }}
                            className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all text-sm"
                            whileHover={{ x: 4 }}
                          >
                            {theme === "dark"
                              ? <><FiSun className="w-4 h-4 text-peach" /><span className="font-medium">Mode Terang</span></>
                              : <><FiMoon className="w-4 h-4 text-gray-600" /><span className="font-medium">Mode Gelap</span></>
                            }
                          </motion.button>

                          {/* Settings */}
                          <motion.button
                            onClick={() => { handleNav(settingsPath); setUserMenuOpen(false) }}
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
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

