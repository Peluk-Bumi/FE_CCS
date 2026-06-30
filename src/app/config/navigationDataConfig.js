/**
 * Navigation Data Configuration
 * Single source of truth for sidebar, bottom sheets, FAB menu, and mobile tabs
 * Ensures consistent navigation across all viewports and components
 */

export const navigationDataConfig = {
  // ── Public/Landing Navigation ──────────────────────────────────────────────
  landing: {
    // Used by: Landing page navbar, FAB menu, mobile sheet
    items: [
      {
        id: "home",
        label: "Beranda",
        path: "/",
        iconName: "FiHome",
        description: "Halaman utama",
        category: "main",
      },
      {
        id: "about",
        label: "Tentang",
        path: "/about",
        iconName: "FiInfo",
        description: "Tentang Peluk Bumi",
        category: "main",
      },
      {
        id: "verification",
        label: "Verifikasi",
        path: "/verifikasi",
        iconName: "FiCheckCircle",
        description: "Scan & verifikasi laporan",
        category: "main",
        // Highlighted on public pages
        prominent: true,
      },
      {
        id: "faq",
        label: "FAQ",
        path: "/faqs",
        iconName: "FiHelpCircle",
        description: "Pertanyaan yang sering diajukan",
        category: "main",
      },
    ],

    // Responsive display rules
    display: {
      desktop: {
        // Desktop navbar: Show all items horizontally
        format: "horizontal",
        maxVisible: 4,
        variant: "navbar",
      },
      tablet: {
        // Tablet: Show main items, overflow in menu
        format: "mixed",
        maxVisible: 3,
        variant: "compact-navbar",
      },
      mobile: {
        // Mobile: Show in FAB speed dial
        format: "vertical",
        maxVisible: "all",
        variant: "fab-menu",
      },
    },

    // Styling for different contexts
    styling: {
      navbar: {
        containerClass: "flex gap-6 lg:gap-8",
        itemClass: "text-gray-700 hover:text-primary transition-colors",
        activeClass: "text-primary font-semibold",
      },
      fab: {
        containerClass: "relative",
        itemClass: "w-12 h-12 rounded-full flex items-center justify-center",
        activeClass: "bg-gradient-to-br from-primary to-primary-dark text-white",
      },
      sheet: {
        containerClass: "space-y-2",
        itemClass: "px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700",
        activeClass: "bg-primary text-white",
      },
    },
  },

  // ── Authenticated User Navigation ──────────────────────────────────────────
  user: {
    // Used by: Sidebar, mobile bottom sheet, mobile FAB
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        path: "/user/dashboard",
        iconName: "FiHome",
        description: "Dashboard pengguna",
        category: "main",
      },
      {
        id: "perencanaan",
        label: "Perencanaan",
        path: "/user/perencanaan",
        iconName: "FiClipboard",
        description: "Kelola perencanaan",
        category: "main",
      },
      {
        id: "implementasi",
        label: "Implementasi",
        path: "/user/implementasi",
        iconName: "FiCheckCircle",
        description: "Kelola implementasi",
        category: "main",
      },
      {
        id: "monitoring",
        label: "Monitoring",
        path: "/user/monitoring",
        iconName: "FiActivity",
        description: "Monitor kegiatan",
        category: "main",
      },
      {
        id: "verification",
        label: "Verifikasi",
        path: "/verifikasi",
        iconName: "FiCheckCircle",
        description: "Scan & verifikasi laporan",
        category: "secondary",
        separator: true, // Visual separator before this item
      },
      {
        id: "logHistory",
        label: "Log Aktivitas",
        path: "/user/log-history",
        iconName: "FiFileText",
        description: "Riwayat aktivitas",
        category: "secondary",
      },
    ],

    // Responsive display rules
    display: {
      desktop: {
        // Desktop sidebar: Show all items vertically
        format: "vertical",
        maxVisible: "all",
        variant: "sidebar",
      },
      tablet: {
        // Tablet: Show in collapsible sidebar or drawer
        format: "vertical",
        maxVisible: "all",
        variant: "drawer",
      },
      mobile: {
        // Mobile: Bottom sheet with all items
        format: "vertical",
        maxVisible: "all",
        variant: "bottom-sheet",
      },
    },

    // Styling for different contexts
    styling: {
      sidebar: {
        containerClass: "space-y-1 p-4",
        itemClass: "px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
        activeClass: "bg-primary text-white",
        separatorClass: "my-2 border-t border-gray-200 dark:border-gray-700",
      },
      drawer: {
        containerClass: "space-y-1 p-3",
        itemClass: "px-3 py-2 rounded-lg text-sm",
        activeClass: "bg-primary text-white",
      },
      sheet: {
        containerClass: "space-y-2 p-4",
        itemClass: "px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700",
        activeClass: "bg-primary text-white",
        separatorClass: "my-2 border-t border-gray-200 dark:border-gray-700",
      },
    },
  },

  // ── Admin Navigation ───────────────────────────────────────────────────────
  admin: {
    // Used by: Admin sidebar, admin bottom sheet, admin FAB
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        path: "/admin/dashboard",
        iconName: "FiHome",
        description: "Dashboard admin",
        category: "main",
      },
      {
        id: "perencanaan",
        label: "Perencanaan",
        path: "/admin/perencanaan",
        iconName: "FiClipboard",
        description: "Kelola perencanaan",
        category: "main",
      },
      {
        id: "implementasi",
        label: "Implementasi",
        path: "/admin/implementasi",
        iconName: "FiCheckCircle",
        description: "Kelola implementasi",
        category: "main",
      },
      {
        id: "monitoring",
        label: "Monitoring",
        path: "/admin/monitoring",
        iconName: "FiActivity",
        description: "Monitor kegiatan",
        category: "main",
      },
      {
        id: "verification",
        label: "Verifikasi",
        path: "/verifikasi",
        iconName: "FiCheckCircle",
        description: "Scan & verifikasi laporan",
        category: "secondary",
        separator: true,
      },
      {
        id: "users",
        label: "Pengguna",
        path: "/admin/users",
        iconName: "FiUsers",
        description: "Kelola pengguna",
        category: "secondary",
      },
      {
        id: "logHistory",
        label: "Log Sistem",
        path: "/admin/log-history",
        iconName: "FiFileText",
        description: "Riwayat sistem",
        category: "secondary",
      },
    ],

    display: {
      desktop: { format: "vertical", maxVisible: "all", variant: "sidebar" },
      tablet: { format: "vertical", maxVisible: "all", variant: "drawer" },
      mobile: { format: "vertical", maxVisible: "all", variant: "bottom-sheet" },
    },

    styling: {
      sidebar: {
        containerClass: "space-y-1 p-4",
        itemClass: "px-4 py-2.5 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
        activeClass: "bg-primary text-white",
        separatorClass: "my-2 border-t border-gray-200 dark:border-gray-700",
      },
      drawer: {
        containerClass: "space-y-1 p-3",
        itemClass: "px-3 py-2 rounded-lg text-sm",
        activeClass: "bg-primary text-white",
      },
      sheet: {
        containerClass: "space-y-2 p-4",
        itemClass: "px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700",
        activeClass: "bg-primary text-white",
        separatorClass: "my-2 border-t border-gray-200 dark:border-gray-700",
      },
    },
  },

  // ── Helper functions ────────────────────────────────────────────────────────
  /**
   * Get navigation items for a specific context
   * @param {string} context - 'landing', 'user', or 'admin'
   * @returns {array} Array of navigation items
   */
  getItems: (context = "landing") => {
    return navigationDataConfig[context]?.items || navigationDataConfig.landing.items;
  },

  /**
   * Get display config for a context and viewport
   * @param {string} context - 'landing', 'user', or 'admin'
   * @param {string} viewport - 'desktop', 'tablet', or 'mobile'
   * @returns {object} Display configuration
   */
  getDisplayConfig: (context = "landing", viewport = "desktop") => {
    const contextConfig = navigationDataConfig[context];
    return contextConfig?.display[viewport] || contextConfig?.display.desktop;
  },

  /**
   * Get styling for a context and variant
   * @param {string} context - 'landing', 'user', or 'admin'
   * @param {string} variant - 'sidebar', 'sheet', 'fab', 'navbar', etc.
   * @returns {object} Styling configuration
   */
  getStyling: (context = "landing", variant = "sidebar") => {
    const contextConfig = navigationDataConfig[context];
    return contextConfig?.styling[variant] || {};
  },

  /**
   * Filter items by category
   * @param {string} context - 'landing', 'user', or 'admin'
   * @param {string} category - 'main', 'secondary', etc.
   * @returns {array} Filtered navigation items
   */
  getItemsByCategory: (context = "landing", category = "main") => {
    return navigationDataConfig.getItems(context)
      .filter(item => item.category === category);
  },

  /**
   * Find a single navigation item by id
   * @param {string} context - 'landing', 'user', or 'admin'
   * @param {string} itemId - Item ID to find
   * @returns {object} Navigation item or undefined
   */
  findItem: (context = "landing", itemId) => {
    return navigationDataConfig.getItems(context)
      .find(item => item.id === itemId);
  },
};

export default navigationDataConfig;
