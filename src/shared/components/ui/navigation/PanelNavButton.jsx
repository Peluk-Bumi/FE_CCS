import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiChevronDown, FiChevronRight } from "react-icons/fi"
import { Button } from "../button"
import { cn } from "@/shared/utils/utils"

/**
 * PanelNavButton
 * 
 * A navigation button component for dashboard panels (sidebar & mobile sheets).
 * Used in admin/user dashboard sidebar and bottom sheet navigation.
 * 
 * Features:
 * - Clean design without borders for better visual clarity
 * - Smooth hover and tap animations
 * - Active state with subtle background
 * - Support for icon and text content
 * - Special "accent" variant for Verifikasi with full primary background
 * - Submenu support with expandable items
 * 
 * @component
 * @param {string} [variant='default'] - Button variant: 'default', 'primary', 'accent', 'destructive'
 * @param {React.ReactNode} [icon] - Icon element to display
 * @param {boolean} [active=false] - Whether the button is in active state
 * @param {boolean} [disabled=false] - Whether the button is disabled
 * @param {Function} [onClick] - Click handler
 * @param {string} [className] - Additional CSS classes
 * @param {React.ReactNode} children - Button text content
 * @param {boolean} [hasSubmenu=false] - Whether this button has submenu items
 * @param {boolean} [isSubmenuOpen=false] - Whether submenu is expanded
 * @param {React.ReactNode} [subItems] - Submenu items to render when expanded
 * 
 * @example
 * // Regular nav button
 * <PanelNavButton icon={<FiHome />} active onClick={() => navigate('/dashboard')}>
 *   Dashboard
 * </PanelNavButton>
 * 
 * @example
 * // Verifikasi with accent variant (full primary bg)
 * <PanelNavButton icon={<FiCheckCircle />} variant="accent">
 *   Verifikasi
 * </PanelNavButton>
 * 
 * @example
 * // With submenu
 * <PanelNavButton
 *   icon={<FiClipboard />}
 *   hasSubmenu
 *   isSubmenuOpen={open}
 *   onClick={() => setOpen(!open)}
 *   subItems={
 *     <>
 *       <PanelNavButton>Sub Item 1</PanelNavButton>
 *       <PanelNavButton>Sub Item 2</PanelNavButton>
 *     </>
 *   }
 * >
 *   Perencanaan
 * </PanelNavButton>
 */
const PanelNavButton = React.forwardRef(
  (
    {
      className,
      variant = "default", // default | primary | accent | destructive
      layout = "list", // list | grid
      icon,
      children,
      disabled = false,
      active = false,
      onClick,
      hasSubmenu = false,
      isSubmenuOpen = false,
      subItems,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled

    const variantStyles = {
      default: "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800",
      primary: "text-white bg-primary hover:bg-primary-dark",
      accent: "text-white bg-primary hover:bg-primary-dark shadow-sm", // Full primary bg for Verifikasi
      destructive: "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
    }

    // For accent variant, don't apply active state styling (it's already prominent)
    const shouldShowActive = active && variant !== "accent"

    return (
      <div className="w-full">
        <motion.div
          whileHover={!isDisabled ? { scale: 0.995, x: layout === "list" ? 3 : 0, y: layout === "grid" ? -2 : 0 } : {}}
          whileTap={!isDisabled ? { scale: 0.98 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Button
            ref={ref}
            disabled={isDisabled}
            variant="ghost"
            onClick={onClick}
            className={cn(
              // base nav layout
              "w-full rounded-xl font-medium transition-all",
              layout === "grid"
                ? "flex flex-col items-center justify-center gap-1 p-2 text-[11px] h-[84px]"
                : "flex items-center justify-start gap-3 px-4 py-3 text-[15px] min-h-[48px] h-auto",
              // variant styles
              variantStyles[variant],

              // active state - clean background (not for accent)
              shouldShowActive && "bg-primary/10 text-primary dark:text-primary-light border-primary/20",

              className
            )}
            {...props}
          >
            {/* ICON */}
            {icon && (
              <span className={cn(
                "flex items-center justify-center shrink-0 transition-colors",
                layout === "grid" ? "w-9 h-9 rounded-full mb-0.5" : "w-5 h-5",
                variant === "accent" ? "text-white" : "text-primary",
                shouldShowActive && layout === "grid" && "bg-primary text-white"
              )}>
                {React.cloneElement(icon, {
                  className: layout === "grid" ? "w-6 h-6" : ""
                })}
              </span>
            )}

            {/* TEXT */}
            <span className={cn(
              layout === "grid"
              ? "text-center w-full leading-tight whitespace-normal break-words"
              : "flex-1 text-left whitespace-normal break-words min-w-0",
              shouldShowActive && layout === "grid" && "font-bold"
            )}>{children}</span>

            {/* SUBMENU CHEVRON */}
            {hasSubmenu && layout === "list" && (
              <span className="shrink-0 text-gray-400">
                {isSubmenuOpen ? (
                  <FiChevronDown className="w-4 h-4" />
                ) : (
                  <FiChevronRight className="w-4 h-4" />
                )}
              </span>
            )}

            {/* ACTIVE INDICATOR - simple dot (not for accent, list only) */}
            {active && !hasSubmenu && variant !== "accent" && layout === "list" && (
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
            )}
          </Button>
        </motion.div>

        {/* SUBMENU ITEMS */}
        {hasSubmenu && (
          <AnimatePresence initial={false}>
            {isSubmenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="overflow-x-hidden ml-4 mt-1 space-y-0.5"
              >
                {subItems}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    )
  }
)

PanelNavButton.displayName = "PanelNavButton"

export { PanelNavButton }
