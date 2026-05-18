import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiMenu, FiX } from "react-icons/fi"
import { cn } from "@/shared/utils/utils"

const MobileMenuButton = React.forwardRef(({ 
  className,
  disabled = false,
  onClick,
  isOpen = false,
  ...props 
}, ref) => {
  return (
    <motion.button
      ref={ref}
      className={cn(
        // floating button base styles
        "fixed sm:hidden bottom-24 right-6 z-50 h-14 w-14 inline-flex items-center justify-center rounded-2xl shadow-xl",
        
        // background with blur
        "bg-primary/60 hover:bg-primary/80 border border-white/20 transition-all touch-manipulation",
        
        // transitions
        "transition-all duration-300 ease-in-out",
        
        // hover states
        "hover:scale-110",
        
        // disabled states
        disabled && "opacity-50 cursor-not-allowed",
        
        className
      )}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isOpen ? "Tutup menu" : "Buka menu"}
      aria-expanded={isOpen}
      {...props}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FiX className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </motion.div>
        ) : (
          <motion.div
            key="open"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FiMenu className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
})

MobileMenuButton.displayName = "MobileMenuButton"

export { MobileMenuButton }

