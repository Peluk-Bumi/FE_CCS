import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "../button"
import { cn } from "@/shared/utils/utils"

const FormButton = React.forwardRef(
  (
    {
      className,
      variant = "primary",
      loading = false,
      children,
      icon,
      disabled = false,
      type = "submit"
    },
    ref
  ) => {
    return (
      <motion.div
        whileHover={!loading && !disabled ? { scale: 1.02, y: -2 } : {}}
        whileTap={!loading && !disabled ? { scale: 0.98 } : {}}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          ref={ref}
          type={type}
          disabled={disabled || loading}
          variant="default"
          className={cn(
            // FORM LAYOUT (owned here, not Button)
            "relative w-full px-6 py-4 rounded-xl font-semibold shadow-lg",
            
            // variants (pure visual, no layout logic)
            variant === "primary" && "bg-primary text-primary-foreground",
            variant === "secondary" && "bg-muted hover:bg-primary-light text-foreground hover:text-white",
            variant === "danger" && "bg-red-500 text-white",
            loading && "cursor-not-allowed opacity-80",
            className
          )}
        >
          {/* Loading overlay */}
          {loading && (
            <span className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
            </span>
          )}

          {/* Content */}
          <span className={cn(
            "flex items-center justify-center gap-2",
            loading && "opacity-0"
          )}>
            {icon && <span className="flex-shrink-0">{icon}</span>}
            {children}
          </span>
        </Button>
      </motion.div>
    )
  }
)

FormButton.displayName = "FormButton"

export { FormButton }
