import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { cn } from "@/shared/utils/utils";

/**
 * Accordion Component
 * 
 * A collapsible section with smooth animation.
 * 
 * @param {string} title - The title of the accordion
 * @param {React.ElementType} [icon] - Optional icon component (e.g. from react-icons)
 * @param {boolean} [defaultOpen=false] - Whether the accordion is open by default
 * @param {React.ReactNode} children - The content inside the accordion
 * @param {string} [className] - Additional CSS classes for the container
 * @param {string} [titleClassName] - Additional CSS classes for the title text
 */
const Accordion = ({ 
  title, 
  icon: Icon, 
  defaultOpen = false, 
  children,
  className,
  titleClassName
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn(
      "rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden transition-colors",
      isOpen && "border-primary/30 dark:border-primary/30 shadow-sm",
      className
    )}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between gap-3 p-4 text-left transition-colors focus:outline-none focus-visible:bg-gray-50 dark:focus-visible:bg-gray-800",
          isOpen ? "bg-gray-50/50 dark:bg-gray-800/30" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
        )}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {Icon && (
            <div className={cn(
              "p-2 rounded-xl transition-colors shrink-0",
              isOpen ? "bg-primary/10 text-primary" : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
            )}>
              <Icon className="w-4 h-4" />
            </div>
          )}
          <h4 className={cn(
            "font-semibold text-sm transition-colors",
            isOpen ? "text-primary dark:text-primary-light" : "text-gray-900 dark:text-gray-100",
            titleClassName
          )}>
            {title}
          </h4>
        </div>
        <motion.div 
          animate={{ rotate: isOpen ? 180 : 0 }} 
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cn(
            "shrink-0 p-1 rounded-full",
            isOpen ? "text-primary bg-primary/5" : "text-gray-400"
          )}
        >
          <FiChevronDown className="w-4 h-4" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-gray-100 dark:border-gray-800/50 mt-1">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { Accordion };
