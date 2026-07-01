import * as React from "react"
import { motion } from "framer-motion"
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiActivity,
  FiMapPin,
  FiCheckCircle
} from "react-icons/fi"
import { cn } from "@/shared/utils/utils"

// FieldDashboardCard — unified styling, no per-type color variants.
// All cards share the same bg/border. Icon gets a group-hover glow effect.
const FieldDashboardCard = React.forwardRef(({ 
  title,
  value,
  subtitle,
  icon,
  trend,
  trendUp = true,
  type = "default", // kept for API compat but no longer drives colors
  onClick,
  className,
  valueClassName,
  ...props 
}, ref) => {
  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      className={cn(
        // Base card
        "group w-full p-4 rounded-2xl border-2 transition-all",
        "active:scale-95 touch-manipulation",
        "min-h-[120px] flex flex-col justify-between",
        // Unified colors — no per-type variants
        "bg-white dark:bg-gray-800",
        "border-gray-100 dark:border-gray-700",
        "shadow-lg",
        onClick && "hover:shadow-xl hover:-translate-y-1 cursor-pointer",
        className
      )}
      whileHover={{ scale: onClick ? 1.02 : 1 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {/* Header — text left, icon right */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 text-left pr-2">
          <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 line-clamp-2 break-words">
            {title}
          </h3>
          <div className={cn("text-2xl font-black text-gray-900 dark:text-gray-100 leading-none break-words", valueClassName)}>
            {value}
          </div>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 break-words">
              {subtitle}
            </p>
          )}
        </div>

        {/* Icon — group-hover: bg darkens, icon scales up */}
        {icon && (
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300",
            "bg-primary/5 border border-primary/60 text-primary-dark",
            "group-hover:bg-primary-dark dark:group-hover:bg-primary-light",
            "group-hover:text-white group-hover:scale-105 group-hover:shadow-md"
          )}>
            {React.isValidElement(icon)
              ? React.cloneElement(icon, { className: "w-5 h-5" })
              : icon}
          </div>
        )}
      </div>

      {/* Footer — trend badge + tap hint */}
      {trend && (
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold transition-colors",
            trendUp
              ? "bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light group-hover:bg-primary/20 dark:group-hover:bg-primary/30"
              : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 group-hover:bg-red-200 dark:group-hover:bg-red-800/40"
          )}>
            {trendUp ? <FiTrendingUp className="w-3 h-3" /> : <FiTrendingDown className="w-3 h-3" />}
            <span>{trend}</span>
          </div>

          {onClick && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Tap untuk detail →
            </span>
          )}
        </div>
      )}
    </motion.button>
  )
})

FieldDashboardCard.displayName = "FieldDashboardCard"

// ── Specialized wrappers ──────────────────────────────────────────────────────

export const LocationStatusCard = ({ location, area, status, ...props }) => (
  <FieldDashboardCard
    title="Lokasi Aktif"
    value={location}
    subtitle={`${area} hektar`}
    icon={<FiMapPin className="w-5 h-5" />}
    trend={status}
    trendUp={true}
    {...props}
  />
)

export const TreeProgressCard = ({ planted, target, percentage, ...props }) => (
  <FieldDashboardCard
    title="Pohon Ditanam"
    value={planted}
    subtitle={`dari target ${target}`}
    icon={<FiCheckCircle className="w-5 h-5" />}
    trend={`${percentage}%`}
    trendUp={true}
    {...props}
  />
)

export const ActivityStatusCard = ({ completed, total, activeToday, ...props }) => (
  <FieldDashboardCard
    title="Aktivitas"
    value={completed}
    subtitle={`${total} total kegiatan`}
    icon={<FiActivity className="w-5 h-5" />}
    trend={`${activeToday} hari ini`}
    trendUp={activeToday > 0}
    {...props}
  />
)

export const ProgressCard = ({ percentage, label, subtitle, ...props }) => (
  <FieldDashboardCard
    title="Progress"
    value={`${percentage}%`}
    subtitle={subtitle}
    icon={<FiCheckCircle className="w-5 h-5" />}
    trend={label}
    trendUp={true}
    {...props}
  />
)

export { FieldDashboardCard }

