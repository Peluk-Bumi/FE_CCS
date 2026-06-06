import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils/utils';
import { useLocation, useNavigate } from 'react-router-dom';

export function PageTabs({ tabs, activeTab, onTabChange, className }) {
  const location = useLocation();
  const navigate = useNavigate();
  
  const currentTab = activeTab !== undefined ? activeTab : location.pathname;
  const handleTabChange = onTabChange || ((path) => navigate(path));

  return (
    <div className={cn("p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm flex flex-wrap items-center gap-2", className)}>
      {tabs.map(tab => {
        const isActive = currentTab === (tab.path || tab.key);
        const Icon = tab.icon;
        return (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.path || tab.key)}
            className={cn(
              "relative flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-colors",
              isActive 
                ? "text-primary dark:text-primary-light" 
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800/50"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="pageTabIndicator"
                className="absolute inset-0 bg-primary/10 dark:bg-gray-800 rounded-xl shadow-sm"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <div className="relative z-10 flex items-center gap-2">
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
            </div>
          </button>
        )
      })}
    </div>
  );
}
