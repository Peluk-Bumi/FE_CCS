import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "../button"
import { cn } from "@/shared/utils/utils"

const DesktopNavButton = React.forwardRef(({ 
  className, 
  active = false,
  children,
  icon,
  disabled = false,
  iconOnly = false,
  ...props 
}, ref) => {
  return (
    <motion.div
      whileHover={!disabled ? { 
        scale: 1.05 
      } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <Button
        ref={ref}
        variant="ghost"
        disabled={disabled}
        className={cn(
          // base desktop nav styles
          "relative inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold transition-all group overflow-hidden",
          
          // active state
          active
            ? "text-white bg-white/20 shadow-lg"
            : "text-white/80 hover:text-white hover:bg-white/10",

          // border for consistency
          "border border-white/20 hover:border-white/40",
          
          className
        )}
        {...props}
      >
        {/* Active State Indicator */}
        {active && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-0.5 w-full justify-self-center bg-gradient-to-r from-peach-dark/50 via-peach-light to-peach-dark/50 rounded-full shadow-md shadow-primary/50"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        )}
        
        {/* Content */}
        <span className="relative z-10 flex items-center justify-center">
          {icon && <span className={cn("w-4 h-4", iconOnly ? "" : "mr-2")}>{icon}</span>}
          {!iconOnly && <span>{children}</span>}
        </span>
      </Button>
    </motion.div>
  )
})

DesktopNavButton.displayName = "DesktopNavButton"

export { DesktopNavButton }

