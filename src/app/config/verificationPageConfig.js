/**
 * Verification Page Configuration
 * Single source of truth for page headers, navigation, and layout
 * Ensures consistency between desktop navbar, mobile header, and responsive layouts
 */

export const verificationPageConfig = {
  // ── Public Verification Page Configuration ──────────────────────────────────
  public: {
    // Header configuration for all screen sizes
    header: {
      title: "Verifikasi & Lihat Detail Laporan",
      subtitle: "Scan QR Code untuk melihat detail lengkap laporan perencanaan kegiatan konservasi",
      icon: "FiCamera",
      // Desktop: Shows in prominent card header
      // Mobile: Shows as page title/subtitle or in collapsible header
    },

    // Navigation breadcrumb for page hierarchy
    breadcrumb: {
      items: [
        { label: "Beranda", path: "/" },
        { label: "Verifikasi", path: "/verifikasi" },
      ],
    },

    // Mobile-specific header options
    mobileHeader: {
      showTitle: true,
      showSubtitle: false, // Too long for mobile header
      collapsible: true,   // Can collapse to save space
      variant: "compact",  // Desktop: "default", Mobile: "compact"
    },

    // Desktop-specific header options
    desktopHeader: {
      showTitle: true,
      showSubtitle: true,
      variant: "card", // Shows as full-width card with gradient
      withIcon: true,
    },

    // Layout configuration for responsive behavior
    layout: {
      // Desktop (1024px+)
      desktop: {
        sections: {
          header: { display: "card", spacing: "mb-8" },
          scanner: { display: "grid-left", width: "lg:col-span-1" },
          instructions: { display: "grid-right", width: "lg:col-span-1" },
        },
        grid: "lg:grid-cols-2 lg:gap-6",
        containerClass: "max-w-7xl mx-auto",
      },

      // Tablet (768px - 1023px)
      tablet: {
        sections: {
          header: { display: "compact", spacing: "mb-6" },
          scanner: { display: "full-width", width: "w-full" },
          instructions: { display: "full-width", width: "w-full" },
        },
        grid: "space-y-4",
        containerClass: "max-w-4xl mx-auto",
      },

      // Mobile (< 768px)
      mobile: {
        sections: {
          header: { display: "minimal", spacing: "mb-4" },
          scanner: { display: "full-width", width: "w-full" },
          instructions: { display: "collapsible", width: "w-full" },
        },
        grid: "space-y-3",
        containerClass: "w-full px-3",
      },
    },

    // Header styling for different viewports
    styling: {
      desktop: {
        headerCard: "rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700",
        headerGradient: "bg-gradient-to-r from-primary to-primary-dark",
        headerPadding: "px-6 py-6 sm:px-8 sm:py-8",
        titleSize: "text-2xl sm:text-3xl font-bold",
        subtitleSize: "text-sm sm:text-base",
      },

      mobile: {
        headerCard: "rounded-xl shadow-md border border-gray-100 dark:border-gray-800",
        headerGradient: "bg-gradient-to-r from-primary to-primary-dark",
        headerPadding: "px-4 py-4",
        titleSize: "text-xl font-bold",
        subtitleSize: "text-xs",
      },
    },

    // Section visibility rules
    sectionVisibility: {
      instructions: {
        desktop: "visible",        // Always visible on desktop
        tablet: "visible",         // Always visible on tablet
        mobile: "collapsible",     // Collapsible on mobile
      },
      header: {
        desktop: "prominent",      // Full header card with description
        tablet: "normal",          // Normal header
        mobile: "compact",         // Minimal header
      },
    },
  },

  // ── Admin/Authenticated Verification Page (if needed) ─────────────────────
  admin: {
    // Similar structure for admin-only features
    header: {
      title: "Verification Management",
      subtitle: "Manage and verify submitted reports",
      icon: "FiCheckCircle",
    },

    layout: {
      desktop: {
        grid: "lg:grid-cols-3 lg:gap-6",
        // Left: Scanner/Report list
        // Middle: Detail viewer
        // Right: Actions/Tools
      },

      mobile: {
        grid: "space-y-4",
        // Stacked: Report list, Detail, Actions
      },
    },
  },

  // ── Helper functions ────────────────────────────────────────────────────────
  /**
   * Get appropriate header config based on viewport
   * @param {string} viewport - 'mobile', 'tablet', or 'desktop'
   * @returns {object} Header config for the viewport
   */
  getHeaderConfig: (viewport = "desktop") => {
    return verificationPageConfig.public[
      viewport === "mobile" || viewport === "tablet" 
        ? viewport + "Header" 
        : "desktopHeader"
    ];
  },

  /**
   * Get layout config based on viewport
   * @param {string} viewport - 'mobile', 'tablet', or 'desktop'
   * @returns {object} Layout config for the viewport
   */
  getLayoutConfig: (viewport = "desktop") => {
    const layoutConfig = verificationPageConfig.public.layout;
    return layoutConfig[viewport] || layoutConfig.desktop;
  },

  /**
   * Get styling based on viewport
   * @param {string} viewport - 'mobile', 'tablet', or 'desktop'
   * @returns {object} Styling config for the viewport
   */
  getStylingConfig: (viewport = "desktop") => {
    const styling = verificationPageConfig.public.styling;
    return styling[viewport] || styling.desktop;
  },

  /**
   * Get section visibility for a viewport
   * @param {string} sectionName - 'instructions', 'header', etc.
   * @param {string} viewport - 'mobile', 'tablet', or 'desktop'
   * @returns {string} Visibility state: 'visible', 'collapsible', 'hidden', etc.
   */
  getSectionVisibility: (sectionName, viewport = "desktop") => {
    const visibility = verificationPageConfig.public.sectionVisibility[sectionName];
    return visibility ? visibility[viewport] : "visible";
  },
};

export default verificationPageConfig;
