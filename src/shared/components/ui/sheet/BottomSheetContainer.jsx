import React, { useEffect, forwardRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';

/**
 * BottomSheetContainer
 * 
 * Provides consistent padding and sizing for bottom sheet components.
 * Automatically handles mobile behavior (slides up from bottom) and desktop behavior (centered modal).
 * 
 * - Mobile: Full-width, slides up from bottom, rounded top corners
 * - Desktop: Centered modal with backdrop
 * - Content Padding: 80px bottom padding on mobile (pb-20)
 * - Lock Scroll: Body scroll locked when sheet is open
 * 
 * @component
 * @param {React.ReactNode} children - Bottom sheet content
 * @param {boolean} isOpen - Whether sheet is open
 * @param {Function} onClose - Callback when closing
 * @param {string} [title] - Sheet title/header
 * @param {string} [subtitle] - Sheet subtitle/description
 * @param {string} [className] - Additional CSS classes
 * @param {string} [maxHeight='85vh'] - Maximum height of sheet
 * @param {boolean} [showHandle=true] - Show drag handle bar at top
 * @param {boolean} [showCloseButton=true] - Show close button in header
 * @param {React.ReactNode} [headerRight] - Custom element on the right side of header
 * @param {string} [backdropZIndex='z-[75]'] - Z-index for backdrop
 * @param {string} [sheetZIndex='z-[85]'] - Z-index for sheet
 * 
 * @example
 * // Basic usage
 * <BottomSheetContainer
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Options"
 * >
 *   <MenuItem>Option 1</MenuItem>
 *   <MenuItem>Option 2</MenuItem>
 * </BottomSheetContainer>
 * 
 * @example
 * // With custom header
 * <BottomSheetContainer
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Menu Navigasi"
 *   subtitle="Peluk Bumi"
 *   headerRight={<CustomButton />}
 * >
 *   <NavigationItems />
 * </BottomSheetContainer>
 */
const BottomSheetContainer = forwardRef(({
  children,
  isOpen,
  onClose,
  title,
  subtitle,
  className = '',
  maxHeight = '85vh',
  showHandle = true,
  showCloseButton = true,
  headerRight,
  backdropZIndex = 'z-[75]',
  sheetZIndex = 'z-[85]',
}, ref) => {
  // Lock body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop - Mobile only (md:hidden) */}
          <motion.div
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm ${backdropZIndex} md:hidden`}
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            role="presentation"
            aria-hidden="true"
          />

          {/* Bottom Sheet */}
          <motion.div
            ref={ref}
            className={`
              fixed bottom-0 left-0 right-0 ${sheetZIndex} md:hidden
              bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl
              overflow-hidden flex flex-col
              ${className}
            `}
            style={{ maxHeight }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            role="dialog"
            aria-modal="true"
          >
            {/* Handle Bar */}
            {showHandle && (
              <div className="flex justify-center py-3">
                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
              </div>
            )}

            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-6 pb-4">
                <div className="flex-1 min-w-0">
                  {title && (
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 truncate">
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {subtitle}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {headerRight}
                  {showCloseButton && (
                    <button
                      onClick={onClose}
                      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                      aria-label="Tutup"
                    >
                      <IoClose className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Content with bottom padding for mobile */}
            <div className="flex-1 overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
});

BottomSheetContainer.displayName = 'BottomSheetContainer';

export default BottomSheetContainer;
