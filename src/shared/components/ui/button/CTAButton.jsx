import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "../button"
import { cn } from "@/shared/utils/utils"

const CTAButton = React.forwardRef(({ 
  className, 
  size = "lg",
  loading = false,
  children,
  icon,
  disabled = false,
  ...props 
}, ref) => {
  return (
    <motion.div
      whileHover={!loading && !disabled ? { 
        scale: 1.05, 
        boxShadow: "0 25px 50px -12px rgba(81, 118, 64, 0.4)"
      } : {}}
      whileTap={!loading && !disabled ? { scale: 0.96 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        ref={ref}
        disabled={disabled || loading}
        variant="default"
        className={cn(
          // base CTA styles
          "relative group overflow-hidden rounded-xl font-bold text-lg",

          // layout styles
          "px-8 py-4",

          // CTA specific styling
          "bg-gradient-to-r from-primary via-primary/90 to-primary-dark text-white hover:shadow-2xl",
          
          // state
          loading && "opacity-70 cursor-not-allowed",
          className
        )}
      >
        {/* Animated Hover Overlay */}
        {!loading && (
          <motion.span 
            className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary to-primary/60 opacity-0"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        {/* Animated Shine Effect */}
        {!loading && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          />
        )}
        
        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-3">
          {loading ? (
            <>
              <motion.div 
                className="w-5 h-5 border-3 border-white border-t-transparent rounded-full" 
                animate={{ rotate: 360 }} 
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }} 
              />
              {children}
            </>
          ) : (
            <>
              {icon && <span className="flex-shrink-0">{icon}</span>}
              {children}
            </>
          )}
        </span>
      </Button>
    </motion.div>
  )
})

CTAButton.displayName = "CTAButton"

export { CTAButton }

