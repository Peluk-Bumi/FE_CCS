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
          whileHover={!isDisabled ? { scale: 0.995, x: 3 } : {}}
          whileTap={!isDisabled ? { scale: 0.98 } : {}}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <Button
            ref={ref}
            disabled={isDisabled}
            variant="ghost"
            onClick={onClick}
            className={cn(
              // base nav layout - clean without borders
              "w-full flex items-center justify-start gap-3 px-4 py-3 rounded-xl font-medium text-[15px] min-h-[48px]",

              // variant styles
              variantStyles[variant],

              // active state - clean background (not for accent)
              shouldShowActive && "bg-primary/10 text-primary dark:text-primary-light",

              className
            )}
            {...props}
          >
            {/* ICON */}
            {icon && (
              <span className="w-5 h-5 flex items-center justify-center shrink-0">
                {icon}
              </span>
            )}

            {/* TEXT */}
            <span className="flex-1 text-left">{children}</span>

            {/* SUBMENU CHEVRON */}
            {hasSubmenu && (
              <span className="shrink-0 text-gray-400">
                {isSubmenuOpen ? (
                  <FiChevronDown className="w-4 h-4" />
                ) : (
                  <FiChevronRight className="w-4 h-4" />
                )}
              </span>
            )}

            {/* ACTIVE INDICATOR - simple dot (not for accent) */}
            {active && !hasSubmenu && variant !== "accent" && (
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
                className="overflow-hidden ml-4 mt-1 space-y-0.5"
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
