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
  type = "primary",
  iconOnly = false,
  ...props 
}, ref) => {
  // Type variants
  const typeStyles = {
    primary: "bg-gradient-to-r from-primary via-primary/90 to-primary-dark text-white hover:shadow-[0_25px_50px_-12px_rgba(81,118,64,0.4)]",
    secondary: "bg-white text-primary border-2 border-primary/20 hover:border-primary hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.1)] hover:bg-primary/10"
  }

  // Padding based on iconOnly mode
  const paddingStyles = iconOnly ? "p-3" : "p-8"

  return (
    <motion.div
      whileHover={!loading && !disabled ? { 
        scale: 1.05
      } : {}}
      whileTap={!loading && !disabled ? { scale: 0.96 } : {}}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Button
        ref={ref}
        disabled={disabled || loading}
        variant="default"
        {...props}
        className={cn(
          // base CTA styles
          "relative group overflow-hidden rounded-xl font-bold",

          // size styles
          iconOnly ? "text-base" : "text-lg",

          // layout styles
          paddingStyles,

          // CTA specific styling
          typeStyles[type],
          "shadow-lg",
          
          // state
          loading && "opacity-70 cursor-not-allowed",
          className
        )}
      >
        {/* Animated Hover Overlay */}
        {!loading && (
          <motion.span 
            className={cn(
              "absolute inset-0 opacity-0",
              type === "primary" 
                ? "bg-gradient-to-r from-primary/80 via-primary to-primary/60"
                : ""
            )}
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
                className="w-5 h-5 border-3 border-current border-t-transparent rounded-full" 
                animate={{ rotate: 360 }} 
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }} 
              />
              {!iconOnly && children}
            </>
          ) : (
            <>
              {icon && <span className="flex-shrink-0">{icon}</span>}
              {!iconOnly && children}
            </>
          )}
        </span>
      </Button>
    </motion.div>
  )
})

CTAButton.displayName = "CTAButton"

export { CTAButton }

