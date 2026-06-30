import * as React from "react"

import { cn } from "@/shared/utils/utils"

function Input({
  className,
  type,
  prefix,
  suffix,
  disabled,
  readOnly,
  ...props
}) {
  const hasPrefixOrSuffix = prefix || suffix;
  const isDisabledOrReadOnly = disabled || readOnly;
  
  if (!hasPrefixOrSuffix) {
    return (
      <input
        type={type}
        data-slot="input"
        disabled={disabled}
        readOnly={readOnly}
        className={cn(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-10 w-full min-w-0 rounded-xl border bg-transparent px-4 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed md:text-sm",
          "focus-visible:border-primary focus-visible:ring-primary/20 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          isDisabledOrReadOnly && "bg-primary/5 text-primary/80 dark:bg-primary/10 dark:text-primary/70 border-primary/20 cursor-not-allowed",
          className
        )}
        {...props} />
    );
  }

  return (
    <div className={cn(
      "flex items-center h-10 w-full min-w-0 rounded-xl border text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
      "focus-within:border-primary focus-within:ring-primary/20 focus-within:ring-[3px]",
      isDisabledOrReadOnly && "bg-primary/5 dark:bg-primary/10 border-primary/20 cursor-not-allowed",
      className
    )}>
      {prefix && (
        <span className={cn(
          "pl-4 py-2 text-gray-500 dark:text-gray-400 font-medium select-none flex-shrink-0",
          isDisabledOrReadOnly && "text-primary/60 dark:text-primary/40"
        )}>
          {prefix}
        </span>
      )}
      <input
        type={type}
        data-slot="input"
        disabled={disabled}
        readOnly={readOnly}
        className={cn(
          "flex-1 bg-transparent px-4 py-2 text-base outline-none file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed md:text-sm min-w-0 text-left",
          isDisabledOrReadOnly && "text-primary/80 dark:text-primary/70"
        )}
        {...props}
      />
      {suffix && (
        <span className={cn(
          "pr-4 py-2 text-gray-500 dark:text-gray-400 font-medium select-none flex-shrink-0",
          isDisabledOrReadOnly && "text-primary/60 dark:text-primary/40"
        )}>
          {suffix}
        </span>
      )}
    </div>
  );
}

export { Input }

