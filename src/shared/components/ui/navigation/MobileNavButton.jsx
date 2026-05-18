import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "../button"
import { cn } from "@/shared/utils/utils"
import { FiCheckCircle } from "react-icons/fi"

const MobileNavButton = React.forwardRef(
  (
    {
      className,
      variant = "default", // default | primary | destructive
      icon,
      children,
      disabled = false,
      active = false,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled

    const variantStyles = {
      default: "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800",
      primary: "text-white bg-primary border-primary",
      destructive: "text-red-500 bg-red-500/10 border-red-500/20"
    }

    return (
      <motion.div
        whileHover={!isDisabled ? { scale: 0.99, x: 7 } : {}}
        whileTap={!isDisabled ? { scale: 0.97 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      >
        <Button
          ref={ref}
          disabled={isDisabled}
          variant="ghost"
          className={cn(
            // base nav layout - optimized for mobile reachability
            "w-full flex items-center justify-start gap-4 px-6 py-8 rounded-2xl font-medium border border-primary/20 text-base min-h-[60px]",

            // states
            variantStyles[variant],

            active && "ring-2 ring-primary/50 bg-primary/10 text-primary border border-primary/20",

            className
          )}
          {...props}
        >
          {/* ICON */}
          {icon && (
            <span className="w-6 h-6 flex items-center justify-center shrink-0">
              {icon}
            </span>
          )}

          {/* TEXT (NO CENTER EVER) */}
          <span className="flex-1 text-left">{children}</span>

          {/* ACTIVE INDICATOR */}
          {active && (
            <span className="w-2 h-2 rounded-full ring-2 ring-primary/30 bg-primary shrink-0" />
          )}
        </Button>
      </motion.div>
    )
  }
)

MobileNavButton.displayName = "MobileNavButton"

export { MobileNavButton }
