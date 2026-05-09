import { motion } from "framer-motion";

export default function PageHeader({
  badge,
  badgeIcon: BadgeIcon,
  title,
  description,
}) {
  return (
    <motion.div
      className="text-center mb-12"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {(badge || BadgeIcon) && (
        <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary-light/50 text-primary dark:text-primary-foreground px-4 py-2 rounded-full mb-4">
          {BadgeIcon && (
            <BadgeIcon className="w-5 h-5" />
          )}

          {badge && (
            <span className="text-sm font-semibold">
              {badge}
            </span>
          )}
        </div>
      )}

      <h1 className="text-4xl md:text-5xl pb-3 font-black bg-gradient-to-r from-primary-light via-primary to-primary-dark dark:to-primary-light bg-clip-text text-transparent">
        {title}
      </h1>

      {description && (
        <p className="text-gray-600 dark:text-gray-400 text-lg -mt-1">
          {description}
        </p>
      )}
    </motion.div>
  );
}