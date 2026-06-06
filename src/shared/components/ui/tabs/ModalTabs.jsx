import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils/utils';

export function ModalTabs({ tabs, activeTab, onTabChange, className }) {
  return (
    <div className=''>
      <div className={cn("flex items-center gap-1 px-4 py-3 bg-white dark:bg-gray-800/50 rounded-lg overflow-x-auto no-scrollbar border border-gray-200/50 dark:border-gray-700/50", className)}>
        {tabs.map(tab => {
          const isActive = activeTab === (tab.path || tab.key);
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.path || tab.key)}
              className={cn(
                "relative flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors flex-shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
                isActive 
                  ? "text-gray-900 dark:text-white" 
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="modalTabIndicator"
                  className="absolute inset-0 bg-primary rounded-md shadow-sm border border-primary-light/60"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 35 }}
                />
              )}
              <div className="relative z-10 flex items-center gap-1.5">
                {Icon && <Icon className={cn("w-3.5 h-3.5",
                  isActive ? "text-white" :""
                )} />}
                <span className={cn(
                  isActive ? "text-white" :""
                )}>
                  {tab.label}
                </span>
                {tab.count !== undefined && (
                  <span className={cn(
                    "px-1.5 py-0.5 rounded-md text-[10px] font-bold ml-0.5 transition-colors",
                    isActive ? "bg-gray-100 text-primary" : "bg-gray-200 dark:bg-gray-700/50 text-gray-500"
                  )}>
                    {tab.count}
                  </span>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  );
}
