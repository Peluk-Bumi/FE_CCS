import * as React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  FiHome,
  FiUsers,
  FiClipboard,
  FiCheckCircle,
  FiActivity,
  FiGrid,
  FiPlus,
  FiFileText,
} from "react-icons/fi"
import { cn } from "@/shared/utils/utils"
import navigationConfig from "@/app/config/navigationConfig"

const ICON_MAP = {
  FiHome: FiHome,
  FiUsers: FiUsers,
  FiClipboard: FiClipboard,
  FiCheckCircle: FiCheckCircle,
  FiActivity: FiActivity,
  FiGrid: FiGrid,
  FiPlus: FiPlus,
}

export function BottomTabBar({ isAdmin, onMenuPress, isMenuOpen }) {
  const navigate = useNavigate()
  const location = useLocation()
  const tabs = navigationConfig.getMobileTabs(isAdmin)
  const [isActionMenuOpen, setIsActionMenuOpen] = React.useState(false)

  const isTabActive = (tab) => {
    if (tab.action === "menu") return isMenuOpen
    if (tab.action === "create") return isActionMenuOpen
    if (!tab.path) return false
    if (tab.path.endsWith("/dashboard")) return location.pathname === tab.path
    return location.pathname === tab.path || location.pathname.startsWith(`${tab.path}/`)
  }


  const speedDialItems = [
    {
      icon: <FiClipboard className="w-5 h-5 md:w-6 md:h-6" />,
      label: "Perencanaan",
      path: isAdmin ? "/admin/perencanaan" : "/user/perencanaan",
    },
    {
      icon: <FiCheckCircle className="w-5 h-5 md:w-6 md:h-6" />,
      label: "Implementasi",
      path: isAdmin ? "/admin/implementasi" : "/user/implementasi",
      isCenter: true,
    },
    {
      icon: <FiActivity className="w-5 h-5 md:w-6 md:h-6" />,
      label: "Monitoring",
      path: isAdmin ? "/admin/monitoring" : "/user/monitoring",
    },
  ];

  // Close action menu when location changes
  React.useEffect(() => {
    setIsActionMenuOpen(false)
  }, [location.pathname])

  const handleActionClick = (path) => {
    setIsActionMenuOpen(false)
    navigate(path)
  }

  return (
    <>
      {/* Backdrop for action menu */}
      <AnimatePresence>
        {isActionMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[70] md:hidden"
            onClick={() => setIsActionMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <nav
        className={cn(
          "md:hidden fixed bottom-0 left-0 right-0 z-[75]",
          "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl",
          "border-t border-gray-200 dark:border-gray-700",
          "pb-[var(--sab)]"
        )}
        aria-label="Navigasi utama"
      >
        {/* Floating Action Menu */}
        <AnimatePresence>
          {isActionMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              style={{ translateX: "-50%" }}
              className="absolute bottom-20 left-1/2 flex gap-2 items-end justify-center z-[80]"
            >
              {speedDialItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center gap-1 w-20 ${item.isCenter ? "mb-3" : ""}`}
                >
                  <button
                    onClick={() => handleActionClick(item.path)}
                    className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-white dark:bg-gray-800 text-primary flex items-center justify-center shadow-xl shadow-black/10 active:scale-95 transition-transform border border-gray-100 dark:border-gray-700"
                  >
                    {item.icon}
                  </button>
                  <span className="text-[10px] md:text-xs font-semibold bg-white px-2 py-1 rounded-lg text-primary dark:text-gray-200 whitespace-nowrap">
                    {item.label}
                  </span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="flex items-stretch justify-around h-16 max-w-lg mx-auto relative px-2"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          {tabs.map((tab) => {
            const Icon = ICON_MAP[tab.iconName] || FiHome
            const active = isTabActive(tab)
            const isActionBtn = tab.action === "create"

            const handleClick = () => {
              if (tab.action === "menu") {
                onMenuPress()
                setIsActionMenuOpen(false)
                return
              }
              if (tab.action === "create") {
                setIsActionMenuOpen(!isActionMenuOpen)
                if (isMenuOpen) onMenuPress() // close menu if open
                return
              }
              if (tab.path && location.pathname !== tab.path) {
                navigate(tab.path)
              }
              if (isMenuOpen) onMenuPress()
              setIsActionMenuOpen(false)
            }

            if (isActionBtn) {
              return (
                <div key={tab.id} className="relative -top-5 px-2 flex justify-center">
                  <motion.button
                    type="button"
                    onClick={handleClick}
                    className={cn(
                      "flex items-center justify-center w-14 h-14 rounded-full shadow-lg text-white transition-all",
                      isActionMenuOpen
                        ? "bg-gray-800 dark:bg-gray-700 rotate-45 scale-105 shadow-xl"
                        : "bg-gradient-to-br from-primary to-primary-dark hover:scale-105 active:scale-95"
                    )}
                    aria-label={tab.label}
                  >
                    <Icon className="w-6 h-6" strokeWidth={2.5} />
                  </motion.button>
                </div>
              )
            }

            return (
              <button
                key={tab.id}
                type="button"
                onClick={handleClick}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-1 min-w-0 px-1 pt-1",
                  "touch-manipulation transition-colors",
                  active
                    ? "text-primary dark:text-primary-light"
                    : "text-gray-500 dark:text-gray-400"
                )}
                aria-label={tab.label}
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
                    active && "bg-primary/10 dark:bg-primary/20"
                  )}
                >
                  <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                </span>
                <span
                  className={cn(
                    "text-[10px] font-medium truncate max-w-full leading-tight",
                    active && "font-semibold"
                  )}
                >
                  {tab.label}
                </span>
              </button>
            )
          })}
        </motion.div>
      </nav>
    </>
  )
}
