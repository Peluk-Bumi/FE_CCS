import React from 'react';
import { cn } from "@/shared/utils/utils";

const StatusBadge = ({ 
  label, 
  variant = 'default', 
  size = 'medium',
  className 
}) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700",
    success: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800",
    warning: "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800",
    error: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
    info: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    primary: "bg-primary/10 text-primary-dark border-primary/20 dark:bg-primary/20 dark:text-primary-light dark:border-primary/40",
  };

  const sizes = {
    small: "px-2 py-0.5 text-[10px]",
    medium: "px-3 py-1 text-xs",
    large: "px-4 py-1.5 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-bold rounded-full border transition-all duration-200 hover:shadow-md",
        variants[variant] || variants.default,
        sizes[size] || sizes.medium,
        className
      )}
    >
      <span
        className={cn(
          "rounded-full bg-current opacity-80",
          size === 'small' ? 'w-2 h-2' : 'w-2.5 h-2.5'
        )}
      />
      {label}
    </span>
  );
};

export default StatusBadge;
