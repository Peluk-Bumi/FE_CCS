import React from 'react';
import { useTheme } from "@/app/context/ThemeContext";

/**
 * PagePaddingContainer
 * 
 * Universal wrapper for standard pages (About, FAQ, Verification).
 * Automatically handles:
 * - Theme-aware backgrounds (light/dark mode gradients)
 * - Minimum screen height (min-h-screen)
 * - Top padding for navbar clearance (pt-16 md:pt-20)
 * - Responsive bottom padding for mobile (pb-16 md:pb-0)
 * 
 * @component
 * @param {React.ReactNode} children - Page content to wrap
 * @param {string} [className] - Additional Tailwind classes for the wrapper
 */
const PagePaddingContainer = ({
  children,
  className = ''
}) => {
  const { theme } = useTheme();
  
  // Apply responsive bottom padding on mobile only
  const basePadding = 'max-md:pb-16';
  
  return (
    <div className={`min-h-screen pt-16 md:pt-20 transition-colors duration-300 ${basePadding} ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-green-950 via-gray-950 to-green-950' 
        : 'bg-white'
    } ${className}`}>
      {children}
    </div>
  );
};

export default PagePaddingContainer;
