import React from "react";
import { motion } from "framer-motion";

export default function PageTitle({ 
  type = "page", // "page" or "section"
  badge,
  badgeIcon: BadgeIcon,
  title,
  description,
  subtitle,
  align = "center",
  theme = "light"
}) {
  const alignmentClasses = {
    center: "text-center",
    left: "text-left",
    right: "text-right"
  };

  const alignment = alignmentClasses[align] || alignmentClasses.center;

  // Page Header Style
  if (type === "page") {
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

  // Section Header Style
  return (
    <motion.div
      className={`mb-12 ${alignment}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      {badge && (
        <motion.div
          className={`inline-flex items-center rounded-full px-4 py-2 text-sm mb-3 border ${
            theme === 'dark'
              ? 'bg-primary text-white border-primary'
              : 'bg-primary text-white border-primary'
          }`}
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          {badge}
        </motion.div>
      )}

      <h2 
        className="text-3xl md:text-4xl font-black mb-3 text-gray-900"
      >
        {title}
      </h2>

      {description && (
        <p className={`text-lg max-w-3xl mx-auto mb-2 transition-colors ${
          align === 'center' ? 'mx-auto' : ''
        } ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          {description}
        </p>
      )}

      {subtitle && (
        <p className={`text-sm max-w-2xl mx-auto transition-colors ${
          align === 'center' ? 'mx-auto' : ''
        } ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
