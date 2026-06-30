import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/utils/utils";

export function SidebarTabs({ tabs, activeTab, onTabChange, className, forceMobile = false }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeTab]);

  return (
    <div className={cn("w-full", className)}>
      {/* Mobile: Wrapped Pills */}
      <div 
        ref={scrollRef}
        className={cn("flex flex-wrap pb-3 gap-2", !forceMobile && "md:hidden")}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === (tab.path || tab.key);
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              data-active={isActive}
              onClick={() => onTabChange(tab.path || tab.key)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors border",
                isActive
                  ? "bg-primary text-white border-primary shadow-sm"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50"
              )}
            >
              {Icon && <Icon className="w-4 h-4" />}
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-bold ml-1 transition-colors",
                  isActive ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-500"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Desktop: Vertical List */}
      <div className={cn("flex-col gap-1.5", forceMobile ? "hidden" : "hidden md:flex")}>
        {tabs.map((tab) => {
          const isActive = activeTab === (tab.path || tab.key);
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.path || tab.key)}
              className={cn(
                "relative flex items-center justify-between w-full px-4 py-3 rounded-xl text-sm font-medium transition-colors text-left",
                isActive
                  ? "text-primary dark:text-primary-light bg-primary/10 dark:bg-primary/20"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebarTabIndicator"
                  className="absolute left-0 top-2 bottom-2 w-1 bg-primary rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <div className="flex items-center gap-3">
                {Icon && <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-gray-400")} />}
                <span>{tab.label}</span>
              </div>
              {tab.count !== undefined && (
                <span className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-bold transition-colors",
                  isActive 
                    ? "bg-primary text-white" 
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500"
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
