import * as React from "react"
import { motion } from "framer-motion"
import { 
  FiPlus, 
  FiMapPin, 
  FiCamera, 
  FiUpload,
  FiActivity,
  FiCheckCircle
} from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { cn } from "@/shared/utils/utils"

const ContextActions = React.forwardRef(({ 
  context = "dashboard", // dashboard, monitoring, location, report
  actions = null, // Custom actions override
  className,
  ...props 
}, ref) => {
  const navigate = useNavigate()

  // Default context-based actions
  const defaultActions = {
    dashboard: [
      {
        id: 'add-activity',
        label: 'Tambah Aktivitas',
        icon: <FiPlus />,
        color: 'primary',
        path: '/user/implementasi?action=new'
      },
      {
        id: 'add-monitoring',
        label: 'Tambah Monitoring',
        icon: <FiActivity />,
        color: 'primary',
        path: '/user/monitoring?action=new'
      },
      {
        id: 'create-report',
        label: 'Buat Laporan',
        icon: <FiUpload />,
        color: 'blue',
        path: '/user/verifikasi'
      }
    ],
    monitoring: [
      {
        id: 'add-monitoring',
        label: 'Tambah Monitoring',
        icon: <FiActivity />,
        color: 'primary',
        path: '/user/monitoring?action=new'
      },
      {
        id: 'add-activity',
        label: 'Tambah Aktivitas',
        icon: <FiPlus />,
        color: 'primary',
        path: '/user/implementasi?action=new'
      }
    ],
    location: [
      {
        id: 'add-activity',
        label: 'Aktivitas Baru',
        icon: <FiPlus />,
        color: 'primary',
        path: '/user/implementasi?action=new'
      },
      {
        id: 'add-monitoring',
        label: 'Tambah Monitoring',
        icon: <FiActivity />,
        color: 'primary',
        path: '/user/monitoring?action=new'
      }
    ],
    report: [
      {
        id: 'create-report',
        label: 'Buat Laporan',
        icon: <FiUpload />,
        color: 'blue',
        path: '/user/verifikasi'
      },
      {
        id: 'add-activity',
        label: 'Tambah Aktivitas',
        icon: <FiPlus />,
        color: 'primary',
        path: '/user/implementasi?action=new'
      }
    ]
  }

  const currentActions = actions || defaultActions[context] || defaultActions.dashboard

  const handleActionClick = (action) => {
    if (action.path) {
      navigate(action.path)
    }
    if (action.onClick) {
      action.onClick()
    }
  }

  const getColorClasses = (color) => {
    const colorMap = {
      primary: {
        bg: 'bg-primary/10 dark:bg-primary/20',
        hoverBg: 'hover:bg-primary/20 dark:hover:bg-primary/30',
        icon: 'text-primary dark:text-primary-light'
      },
      emerald: {
        bg: 'bg-emerald-10 dark:bg-emerald-20',
        hoverBg: 'hover:bg-emerald-20 dark:hover:bg-emerald-30',
        icon: 'text-emerald-600 dark:text-emerald-400'
      },
      blue: {
        bg: 'bg-blue-10 dark:bg-blue-20',
        hoverBg: 'hover:bg-blue-20 dark:hover:bg-blue-30',
        icon: 'text-blue-600 dark:text-blue-400'
      }
    }
    return colorMap[color] || colorMap.primary
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3 pb-2",
        className
      )}
      {...props}
    >
      {currentActions.map((action, index) => {
        const colorClasses = getColorClasses(action.color)
        
        return (
          <motion.button
            key={action.id}
            onClick={() => handleActionClick(action)}
            className={cn(
              "flex items-center gap-2 px-3 py-3 rounded-2xl w-full",
              "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
              "shadow-sm hover:shadow-md transition-all",
              colorClasses.hoverBg
            )}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
              colorClasses.bg,
              colorClasses.icon
            )}>
              {action.icon}
            </div>
            
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {action.label}
              </p>
              {action.subtitle && (
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {action.subtitle}
                </p>
              )}
            </div>
          </motion.button>
        )
      })}
    </motion.div>
  )
})

ContextActions.displayName = "ContextActions"

export { ContextActions }

