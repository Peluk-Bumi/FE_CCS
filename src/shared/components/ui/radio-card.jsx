import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/shared/utils/utils";

const RadioCard = ({ 
  label, 
  checked, 
  disabled, 
  onClick,
  onChange,
  readOnly,
  className,
  ...props 
}) => {
  return (
    <motion.label
      className={cn(
        "relative group cursor-pointer",
        disabled ? "cursor-not-allowed opacity-60" : "",
        className
      )}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      <input
        type="radio"
        className="peer sr-only"
        checked={checked}
        disabled={disabled}
        readOnly={readOnly}
        onChange={onChange || (() => {})}
        onClick={onClick}
        {...props}
      />
      <div className={cn(
        "flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-300",
        disabled
          ? "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
          : checked
          ? "border-primary bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 shadow-md"
          : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-primary/50 dark:hover:border-primary/50"
      )}>
        <div className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
          disabled
            ? "border-gray-300 dark:border-gray-600"
            : checked
            ? "border-primary bg-primary"
            : "border-gray-300 dark:border-gray-500"
        )}>
          <AnimatePresence>
            {checked && !disabled && (
              <motion.div
                className="w-2.5 h-2.5 rounded-full bg-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            )}
          </AnimatePresence>
        </div>
        <span className={cn(
          "font-semibold text-sm",
          disabled
            ? "text-gray-500 dark:text-gray-400"
            : checked
            ? "text-primary dark:text-primary-light"
            : "text-gray-700 dark:text-gray-300"
        )}>
          {label}
        </span>
      </div>
    </motion.label>
  );
};

export default RadioCard;
