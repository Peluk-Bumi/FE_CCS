import * as React from "react"
import { motion } from "framer-motion"
import { FiWifi, FiWifiOff, FiMapPin, FiRefreshCw } from "react-icons/fi"
import { cn } from "@/shared/utils/utils"

const FieldHeader = React.forwardRef(({ 
  title,
  location,
  status = "online", // online, offline, syncing
  onRefresh,
  isRefreshing = false,
  className,
  ...props 
}, ref) => {
  const statusConfig = {
    online: {
      icon: <FiWifi />,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/30",
      label: "Online"
    },
    offline: {
      icon: <FiWifiOff />,
      color: "text-red-600 dark:text-red-400", 
      bgColor: "bg-red-100 dark:bg-red-900/30",
      label: "Offline"
    },
    syncing: {
      icon: <FiRefreshCw className="animate-spin" />,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/30", 
      label: "Sync"
    }
  }

  const currentStatus = statusConfig[status] || statusConfig.online

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl",
        "border-b border-gray-200 dark:border-gray-700 px-4 py-3",
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Title Section */}
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
            {title || "Dashboard"}
          </h1>
          
          {/* Location & Status Row */}
          <div className="flex items-center gap-3 mt-1">
            {location && (
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <FiMapPin className="w-3 h-3" />
                <span className="truncate max-w-[120px]">{location}</span>
              </div>
            )}
            
            {/* Status Indicator */}
            <div className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
              currentStatus.bgColor,
              currentStatus.color
            )}>
              <span className="w-3 h-3">{currentStatus.icon}</span>
              <span>{currentStatus.label}</span>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        {onRefresh && (
          <motion.button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiRefreshCw className={cn(
              "w-4 h-4 text-gray-600 dark:text-gray-400",
              isRefreshing && "animate-spin"
            )} />
          </motion.button>
        )}
      </div>
    </motion.div>
  )
})

FieldHeader.displayName = "FieldHeader"

export { FieldHeader }

