import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils/utils';

export function PanelTabs({ tabs, activeTab, onTabChange, className }) {
  return (
    <div className={cn("flex items-center gap-6 border-b border-gray-200 dark:border-gray-800 overflow-x-auto no-scrollbar", className)}>
      {tabs.map(tab => {
        const isActive = activeTab === (tab.path || tab.key);
        const Icon = tab.icon;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.path || tab.key)}
            className={cn(
              "relative flex items-center gap-2 py-4 text-sm font-medium transition-colors flex-shrink-0 border-b-2 border-transparent outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:rounded-sm",
              isActive 
                ? "text-primary dark:text-primary-light" 
                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="panelTabIndicator"
                className="absolute bottom-[-2px] left-0 right-0 h-0.5 bg-primary dark:bg-primary-light rounded-t-full"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            {Icon && <Icon className="w-4 h-4" />}
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={cn(
                "px-2 py-0.5 rounded-full text-xs font-bold ml-1 transition-colors",
                isActive ? "bg-primary/10 text-primary" : "bg-gray-100 dark:bg-gray-800 text-gray-500"
              )}>
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  );
}
