import React from "react";
import { motion } from "framer-motion";

/**
 * Reusable PartnerCard component for displaying partner logos
 * @param {Object} partner - Partner data containing name, logo, alt, and imageSize
 * @param {string} partner.name - Partner name
 * @param {string} partner.logo - Logo image path
 * @param {string} partner.alt - Alt text for image
 * @param {string} partner.imageSize - Tailwind height class (e.g., "h-16", "h-20")
 * @param {number} index - Index for key prop
 * @param {Object} props - Additional props to pass to motion.div
 */
export default function PartnerCard({ partner, index, ...props }) {
  return (
    <motion.div
      key={index}
      className="flex-shrink-0 p-5 rounded-lg border border-primary-light/20 transition-all flex items-center justify-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      {...props}
    >
      <img
        src={partner.logo}
        alt={partner.alt}
        title={partner.name}
        className={`${partner.imageSize || "h-12"} w-auto object-contain`}
      />
    </motion.div>
  );
}
