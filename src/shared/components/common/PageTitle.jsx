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
        className="text-center mb-16 flex flex-col items-center justify-center max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {(badge || BadgeIcon) && (
          <div className="inline-flex items-center gap-2 bg-primary/10 dark:bg-primary/20 text-primary dark:text-primary-light px-4 py-1.5 rounded-full mb-5 font-semibold text-sm border border-primary/20">
            {BadgeIcon && (
              <BadgeIcon className="w-4 h-4" />
            )}
            {badge && (
              <span>{badge}</span>
            )}
          </div>
        )}

        <h1 className="text-4xl md:text-5xl lg:text-6xl pb-4 font-bold tracking-tight text-primary dark:text-primary-light">
          {title}
        </h1>

        <div className="w-24 md:w-32 h-1.5 bg-gradient-to-r from-primary to-primary-light dark:from-primary-light dark:to-primary mx-auto rounded-full mb-6"></div>

        {(description || subtitle) && (
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-3xl leading-relaxed">
            {description || subtitle}
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
