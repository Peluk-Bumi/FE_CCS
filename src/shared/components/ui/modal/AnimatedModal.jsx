import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { cn } from "@/shared/utils/utils";
import { ModalTabs } from "@/shared/components/ui/tabs";
import { createPortal } from "react-dom";

// Root Modal Wrapper
export function AnimatedModal({ isOpen, onClose, children, className }) {
  if (typeof document === 'undefined') return null;
  
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div key="modal-overlay" className={cn("fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6", className)}>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          {children}
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

// Modal Content (Container)
export function AnimatedModalContent({ children, className, size = "md", height = "auto" }) {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
    "3xl": "max-w-3xl",
    "4xl": "max-w-4xl",
    "5xl": "max-w-5xl",
    full: "max-w-[95vw]",
  };

  const heightClasses = {
    auto: "max-h-[92vh]",
    "fixed-sm": "h-[400px]",
    "fixed-md": "h-[600px]",
    "fixed-lg": "h-[800px] max-h-[92vh]",
    "fixed-full": "h-[92vh]",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 20 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-gray-100 dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden w-full flex flex-col",
        sizeClasses[size] || sizeClasses.md,
        heightClasses[height] || heightClasses.auto,
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </motion.div>
  );
}

// Modal Header
export function AnimatedModalHeader({ children, className, variant = "primary", icon: Icon, title, subtitle, onClose }) {
  // primary (default): uses gradient background, no bottom border
  // plain: white/dark background, no bottom border, plain text
  // attention: red/warning background
  const variantClasses = {
    primary: "bg-gradient-to-r from-primary to-primary-dark text-white",
    plain: "bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100",
    attention: "bg-gradient-to-r from-rose-500 to-rose-600 text-white",
  };

  return (
    <div className={cn("px-6 py-5 sm:px-8 sm:py-6 flex items-center justify-between gap-4 flex-shrink-0", variantClasses[variant] || variantClasses.primary, className)}>
      <div className="flex flex-1 items-center gap-4 min-w-0">
        {Icon && (
          <div className={cn(
            "p-3 flex-shrink-0 rounded-2xl flex items-center justify-center", 
            (variant === "primary" || variant === "attention") ? "bg-gray-100/15 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
          )}>
            <Icon className="w-8 h-8" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          {title ? (
            <div className="flex flex-col">
              <h3 className={cn("font-bold text-lg leading-tight", variant === "plain" ? "text-gray-900 dark:text-gray-100" : "text-white")}>
                {title}
              </h3>
              {subtitle && (
                <p className={cn("text-sm mt-0.5", variant === "plain" ? "text-gray-600 dark:text-gray-400" : "text-white/80")}>
                  {subtitle}
                </p>
              )}
            </div>
          ) : (
            children
          )}
        </div>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className={cn(
            "p-2 rounded-lg transition-colors flex-shrink-0",
            (variant === "primary" || variant === "attention") ? "hover:bg-gray-100/20 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
          )}
        >
          <FiX className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

// Modal Body / Scrollable Content
export function AnimatedModalBody({ children, className }) {
  return (
    <div className={cn("p-6 overflow-y-auto flex-1", className)}>
      {children}
    </div>
  );
}

// Modal Footer
export function AnimatedModalFooter({ children, className }) {
  return (
    <div className={cn("px-6 py-4 flex justify-end gap-3 flex-shrink-0 bg-gray-50 dark:bg-gray-800/50", className)}>
      {children}
    </div>
  );
}

// Modal Tab
export function AnimatedModalTab({ tabs, activeTab, onTabChange, className }) {
  if (!tabs || tabs.length === 0) return null;
  return (
    <div className={cn("border-b border-primary/50 dark:border-gray-700 bg-gray-100 dark:bg-gray-800/50 p-6 sm:px-8 flex-shrink-0", className)}>
      <ModalTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </div>
  );
}

// ==========================================
// PRE-BUILT MODAL VARIANTS
// ==========================================

export function StandardModal({ isOpen, onClose, title, subtitle, icon, size = "md", height, footer, children, bodyClassName }) {
  return (
    <AnimatedModal isOpen={isOpen} onClose={onClose}>
      <AnimatedModalContent size={size} height={height}>
        <AnimatedModalHeader variant="plain" icon={icon} title={title} subtitle={subtitle} onClose={onClose} />
        <AnimatedModalBody className={bodyClassName}>
          {children}
        </AnimatedModalBody>
        {footer && <AnimatedModalFooter>{footer}</AnimatedModalFooter>}
      </AnimatedModalContent>
    </AnimatedModal>
  );
}

export function ActionModal({ isOpen, onClose, title, subtitle, icon, size = "md", height, footer, children, bodyClassName }) {
  return (
    <AnimatedModal isOpen={isOpen} onClose={onClose}>
      <AnimatedModalContent size={size} height={height}>
        <AnimatedModalHeader variant="primary" icon={icon} title={title} subtitle={subtitle} onClose={onClose} />
        <AnimatedModalBody className={bodyClassName}>
          {children}
        </AnimatedModalBody>
        {footer && <AnimatedModalFooter>{footer}</AnimatedModalFooter>}
      </AnimatedModalContent>
    </AnimatedModal>
  );
}

export function AttentionModal({ isOpen, onClose, title, subtitle, icon, size = "sm", height, footer, children, bodyClassName }) {
  return (
    <AnimatedModal isOpen={isOpen} onClose={onClose}>
      <AnimatedModalContent size={size} height={height}>
        <AnimatedModalHeader variant="attention" icon={icon} title={title} subtitle={subtitle} onClose={onClose} />
        <AnimatedModalBody className={cn("flex flex-col items-center text-center py-8", bodyClassName)}>
          {children}
        </AnimatedModalBody>
        {footer && <AnimatedModalFooter className="justify-center">{footer}</AnimatedModalFooter>}
      </AnimatedModalContent>
    </AnimatedModal>
  );
}

export function TabbedModal({ 
  isOpen, onClose, title, subtitle, icon, 
  size = "2xl", height = "fixed-md", 
  tabs, activeTab, onTabChange, 
  footer, children, bodyClassName 
}) {
  return (
    <AnimatedModal isOpen={isOpen} onClose={onClose}>
      <AnimatedModalContent size={size} height={height}>
        <AnimatedModalHeader variant="primary" icon={icon} title={title} subtitle={subtitle} onClose={onClose} />
        <AnimatedModalTab tabs={tabs} activeTab={activeTab} onTabChange={onTabChange} />
        <AnimatedModalBody className={cn("bg-gray-100 dark:bg-gray-800/50 px-6 md:px-8 pt-5 pb-6 md:pt-6 md:pb-8", bodyClassName)}>
          {children}
        </AnimatedModalBody>
        {footer && <AnimatedModalFooter>{footer}</AnimatedModalFooter>}
      </AnimatedModalContent>
    </AnimatedModal>
  );
}
