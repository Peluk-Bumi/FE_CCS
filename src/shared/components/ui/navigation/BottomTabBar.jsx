import * as React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import {
  FiHome,
  FiUsers,
  FiClipboard,
  FiCheckCircle,
  FiActivity,
  FiGrid,
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
}

/**
 * Mobile bottom tab bar for dashboard (user & admin).
 * "Menu" tab opens the full navigation sheet (same items as sidebar).
 */
export function BottomTabBar({ isAdmin, onMenuPress, isMenuOpen }) {
  const navigate = useNavigate()
  const location = useLocation()
  const tabs = navigationConfig.getMobileTabs(isAdmin)

  const isTabActive = (tab) => {
    if (tab.action === "menu") {
      return isMenuOpen
    }
    if (!tab.path) return false
    if (tab.path.endsWith("/dashboard")) {
      return location.pathname === tab.path
    }
    return (
      location.pathname === tab.path ||
      location.pathname.startsWith(`${tab.path}/`)
    )
  }

  return (
    <nav
      className={cn(
        "md:hidden fixed bottom-0 left-0 right-0 z-[75]",
        "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl",
        "border-t border-gray-200 dark:border-gray-700",
        "pb-[var(--sab)]"
      )}
      aria-label="Navigasi utama"
    >
      <motion.div
        className="flex items-stretch justify-around h-16 max-w-lg mx-auto"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        {tabs.map((tab) => {
          const Icon = ICON_MAP[tab.iconName] || FiHome
          const active = isTabActive(tab)

          const handleClick = () => {
            if (tab.action === "menu") {
              onMenuPress()
              return
            }
            if (tab.path && location.pathname !== tab.path) {
              navigate(tab.path)
            }
            if (isMenuOpen) {
              onMenuPress()
            }
          }

          return (
            <button
              key={tab.id}
              type="button"
              onClick={handleClick}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-0.5 min-w-0 px-1",
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
                  "flex h-9 w-9 items-center justify-center rounded-xl transition-all",
                  active && "bg-primary/15 dark:bg-primary/25"
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
  )
}
