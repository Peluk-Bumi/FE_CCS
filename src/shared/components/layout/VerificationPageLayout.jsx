import React from 'react';

/**
 * VerificationPageLayout
 * 
 * Provides responsive layout for verification page with different UX for mobile vs desktop.
 * 
 * - Mobile (< 1024px): Single column, scanner full width, instructions below in expandable section
 * - Desktop (1024px+): Two-column grid layout, scanner left + instructions right
 * 
 * @component
 * @param {React.ReactNode} scannerSection - The QR scanner component (required)
 * @param {React.ReactNode} [instructionsSection] - Instructions or sidebar content
 * @param {React.ReactNode} [headerContent] - Page header/title section
 * @param {string} [className] - Additional CSS classes
 * 
 * @example
 * // Basic usage
 * <VerificationPageLayout
 *   headerContent={<PageHeader />}
 *   scannerSection={<QRScanner />}
 *   instructionsSection={<Instructions />}
 * />
 */
const VerificationPageLayout = ({
  scannerSection,
  instructionsSection,
  headerContent,
  className = ''
}) => {
  const [showInstructionsMobile, setShowInstructionsMobile] = React.useState(false);

  return (
    <div className={`min-h-screen ${className}`}>
      {/* Header Section */}
      {headerContent && (
        <div className="mb-8">
          {headerContent}
        </div>
      )}
      
      {/* Desktop Layout - Two Column Grid (1024px+) */}
      <div className="hidden lg:grid lg:grid-cols-2 lg:gap-6">
        {/* Scanner Section */}
        <div>
          {scannerSection}
        </div>
        
        {/* Instructions Section - Right side on desktop */}
        {instructionsSection && (
          <div>
            {instructionsSection}
          </div>
        )}
      </div>

      {/* Mobile Layout - Single Column (< 1024px) */}
      <div className="lg:hidden space-y-4">
        {/* Scanner Section - Full width on mobile */}
        <div className="w-full">
          {scannerSection}
        </div>
        
        {/* Instructions Section - Collapsible on mobile */}
        {instructionsSection && (
          <div className="w-full">
            <button
              onClick={() => setShowInstructionsMobile(!showInstructionsMobile)}
              className="w-full px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-between mb-2"
            >
              <span>Lihat Petunjuk</span>
              <span className={`transform transition-transform ${showInstructionsMobile ? 'rotate-180' : ''}`}>
                ▼
              </span>
            </button>
            
            {showInstructionsMobile && (
              <div className="mt-3 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                {instructionsSection}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VerificationPageLayout;
