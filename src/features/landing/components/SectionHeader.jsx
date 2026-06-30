import React from "react";
import { motion } from "framer-motion";

export default function SectionHeader({ theme, badge, title, description, subtitle, align = "center" }) {
  const alignmentClasses = {
    center: "text-center",
    left: "text-left",
    right: "text-right"
  };

  const alignment = alignmentClasses[align] || alignmentClasses.center;

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
