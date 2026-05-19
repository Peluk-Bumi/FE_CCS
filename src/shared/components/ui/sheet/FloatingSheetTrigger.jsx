import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FiMenu, FiX } from "react-icons/fi"
import { cn } from "@/shared/utils/utils"

const FloatingSheetTrigger = React.forwardRef(({ 
  isOpen,
  onClick,
  className,
  position = "bottom-right",
  ...props 
}, ref) => {
  const getPositionClasses = () => {
    const safeBottom = "bottom-[max(2.5rem,env(safe-area-inset-bottom,0px)+1rem)]"
    const positions = {
      "bottom-right": `${safeBottom} right-6`,
      "bottom-left": `${safeBottom} left-6`,
      "bottom-center": `${safeBottom} left-1/2 -translate-x-1/2`,
    }
    return positions[position] || positions["bottom-right"]
  }

  return (
    <motion.button
      ref={ref}
      className={cn(
        // floating button base styles
        "fixed md:hidden h-14 w-14 inline-flex items-center justify-center rounded-2xl shadow-xl",
        
        // z-index above sheet (z-[85]) and backdrop (z-[75])
        "z-[80]",

        // background with blur
        "bg-primary hover:bg-primary-dark border border-white/20 transition-all touch-manipulation",
        
        // transitions
        "transition-all duration-300 ease-in-out",
        
        // hover states
        "hover:scale-110",
        
        getPositionClasses(),
        className
      )}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
      aria-expanded={isOpen}
      {...props}
    >
      <AnimatePresence mode="wait">
        {isOpen ? (
          <motion.div
            key="close"
            initial={{ rotate: -180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 180, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FiX className="w-6 h-6 text-white" />
          </motion.div>
        ) : (
          <motion.div
            key="open"
            initial={{ rotate: 180, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -180, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <FiMenu className="w-6 h-6 text-white" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
})

FloatingSheetTrigger.displayName = "FloatingSheetTrigger"

export { FloatingSheetTrigger }

