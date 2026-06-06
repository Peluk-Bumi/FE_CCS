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
      type = "submit",
      ...props
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
          {...props}
          className={cn(
            // FORM LAYOUT (owned here, not Button)
            "relative w-full px-6 py-4 rounded-xl font-semibold shadow-lg transition-all",
            
            // variants (pure visual, no layout logic)
            variant === "primary" && "bg-primary text-primary-foreground hover:bg-primary-dark",
            variant === "secondary" && "bg-muted hover:bg-primary-light text-foreground hover:text-white",
            variant === "danger" && "bg-destructive text-white hover:bg-destructive/90",
            variant === "outline" && "border-2 border-gray-200 dark:border-gray-700 bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-none",
            variant === "ghost" && "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 shadow-none",
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
