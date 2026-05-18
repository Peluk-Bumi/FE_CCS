import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FiPlus, 
  FiX, 
  FiCamera, 
  FiMapPin, 
  FiUpload,
  FiActivity
} from "react-icons/fi"
import { useNavigate } from "react-router-dom"
import { cn } from "@/shared/utils/utils"

const FieldFloatingButton = React.forwardRef(({ 
  className,
  actions = null,
  position = "bottom-right", // bottom-right, bottom-left, bottom-center
  ...props 
}, ref) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const navigate = useNavigate()

  // Default field actions
  const defaultActions = [
    {
      id: 'activity',
      label: 'Tambah Aktivitas',
      icon: <FiActivity />,
      color: 'primary',
      path: '/user/implementasi?action=new'
    },
    {
      id: 'monitoring',
      label: 'Tambah Monitoring',
      icon: <FiActivity />,
      color: 'primary',
      path: '/user/monitoring?action=new'
    },
    {
      id: 'report',
      label: 'Buat Laporan',
      icon: <FiUpload />,
      color: 'blue',
      path: '/user/verifikasi'
    }
  ]

  const currentActions = actions || defaultActions

  const getPositionClasses = () => {
    const positions = {
      'bottom-right': 'bottom-20 right-6',
      'bottom-left': 'bottom-20 left-6',
      'bottom-center': 'bottom-20 left-1/2 -translate-x-1/2'
    }
    return positions[position] || positions['bottom-left'] // Default to bottom-left to avoid collision
  }

  const getItemPositionStyles = (index) => {
    // Calculate vertical offset for each item
    const bottomOffset = 32 + (index * 16) // Each item 16px higher than the previous
    
    if (position === 'bottom-center') {
      return {
        bottom: `${bottomOffset}px`,
        left: '50%',
        transform: 'translateX(-50%)'
      }
    } else if (position === 'bottom-left') {
      return {
        bottom: `${bottomOffset}px`,
        left: '24px'
      }
    } else {
      return {
        bottom: `${bottomOffset}px`,
        right: '24px'
      }
    }
  }

  const handleActionClick = (action) => {
    if (action.path) {
      navigate(action.path)
    }
    if (action.onClick) {
      action.onClick()
    }
    setIsOpen(false)
  }

  const getColorClasses = (color) => {
    const colorMap = {
      primary: {
        bg: 'bg-primary hover:bg-primary-dark',
        icon: 'text-white'
      },
      emerald: {
        bg: 'bg-emerald-500 hover:bg-emerald-600',
        icon: 'text-white'
      },
      blue: {
        bg: 'bg-blue-500 hover:bg-blue-600',
        icon: 'text-white'
      },
      purple: {
        bg: 'bg-purple-500 hover:bg-purple-600',
        icon: 'text-white'
      }
    }
    return colorMap[color] || colorMap.primary
  }

  return (
    <div className="fixed z-50 md:hidden">
      {/* Action Items */}
      <AnimatePresence>
        {isOpen && currentActions.map((action, index) => {
          const colorClasses = getColorClasses(action.color)
          
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, scale: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                transition: {
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 200,
                  damping: 20
                }
              }}
              exit={{ 
                opacity: 0, 
                scale: 0, 
                y: 20,
                transition: {
                  delay: (currentActions.length - index - 1) * 0.05
                }
              }}
              onClick={() => handleActionClick(action)}
              className={cn(
                "fixed flex items-center gap-3 px-4 py-3 rounded-full shadow-lg",
                "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
                "hover:shadow-xl transition-all"
              )}
              style={getItemPositionStyles(index)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                colorClasses.bg
              )}>
                <span className="text-sm">{colorClasses.icon}</span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
                {action.label}
              </span>
            </motion.button>
          )
        })}
      </AnimatePresence>

      {/* Main FAB */}
      <motion.button
        ref={ref}
        className={cn(
          "fixed w-14 h-14 rounded-full shadow-xl transition-all",
          "bg-primary hover:bg-primary-dark border border-white/20",
          "flex items-center justify-center text-white",
          getPositionClasses(),
          className
        )}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        {...props}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 180, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiX className="w-6 h-6" />
            </motion.div>
          ) : (
            <motion.div
              key="add"
              initial={{ rotate: 180, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -180, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiPlus className="w-6 h-6" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[-1] md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
})

FieldFloatingButton.displayName = "FieldFloatingButton"

export { FieldFloatingButton }

