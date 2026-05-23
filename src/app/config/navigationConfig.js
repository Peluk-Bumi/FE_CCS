// Central navigation configuration — single source of truth for all nav components
// (Sidebar, MobileSheetNavigation, MobileHeader, LandingMobileSheet)
export const navigationConfig = {

  // ── Admin menu items ────────────────────────────────────────────────────────
  adminMenuItems: [
    { label: "Dashboard",    path: "/admin/dashboard",    iconName: "FiHome"        },
    { label: "Implementasi", path: "/admin/implementasi", iconName: "FiCheckCircle" },
    { label: "Monitoring",   path: "/admin/monitoring",   iconName: "FiActivity"    },
    { label: "Pengguna",     path: "/admin/users",        iconName: "FiUsers"       },
  ],

  // ── User menu items ─────────────────────────────────────────────────────────
  // Same structure as admin — backend/API filters data by user automatically.
  // No separate "Pengguna" item for user (they go to /user/profile via profile dropdown).
  userMenuItems: [
    { label: "Dashboard",    path: "/user/dashboard",    iconName: "FiHome"        },
    { label: "Implementasi", path: "/user/implementasi", iconName: "FiCheckCircle" },
    { label: "Monitoring",   path: "/user/monitoring",   iconName: "FiActivity"    },
  ],

  planningMenu: {
    label: "Perencanaan",
    iconName: "FiClipboard",
    items: {
      all: {
        label: "All Perencanaan",
        getPath: (isAdmin) => isAdmin ? "/admin/perencanaan/all" : "/user/perencanaan/all",
      },
      create: {
        label: "Buat Perencanaan",
        getPath: (isAdmin) => isAdmin ? "/admin/perencanaan" : "/user/perencanaan",
      },
    },
  },

  evaluationMenu: {
    label: "Evaluasi",
    iconName: "FiBarChart2",
    items: {
      data: {
        label: "Data Evaluasi",
        getPath: (isAdmin) => isAdmin ? "/admin/evaluasi" : "/user/evaluasi",
      },
      informasi: {
        label: "Informasi Pengamatan",
        getPath: (isAdmin) => isAdmin ? "/admin/evaluasi/information" : "/user/evaluasi/information",
      },
      parameter: {
        label: "Parameter Kondisi Kesehatan",
        getPath: (isAdmin) => isAdmin ? "/admin/evaluasi/parameter" : "/user/evaluasi/parameter",
      },
    },
  },

  // ── Landing page nav items (public) ────────────────────────────────────────
  landingNavItems: [
    { label: "Beranda",    path: "/",       iconName: "FiHome"        },
    { label: "Tentang",    path: "/about",  iconName: "FiInfo"        },
    { label: "Verifikasi", path: "/verifikasi", iconName: "FiCheckCircle" },
    { label: "FAQ",        path: "/faqs",   iconName: "FiHelpCircle"  },
  ],

  // ── Mobile bottom tabs (< md) — quick access + Menu opens full sheet ───────
  // Gunakan nama yang sama dengan sidebar untuk konsistensi
  userMobileTabs: [
    { id: "home",       label: "Dashboard",    path: "/user/dashboard",    iconName: "FiHome"        },
    { id: "perencanaan", label: "Perencanaan", path: "/user/perencanaan",  iconName: "FiClipboard"   },
    { id: "implementasi", label: "Implementasi", path: "/user/implementasi", iconName: "FiCheckCircle" },
    { id: "menu",       label: "Menu",         action: "menu",             iconName: "FiMenu"        },
  ],

  adminMobileTabs: [
    { id: "home",     label: "Dashboard",    path: "/admin/dashboard",   iconName: "FiHome"      },
    { id: "perencanaan", label: "Perencanaan", path: "/admin/perencanaan",  iconName: "FiClipboard"   },
    { id: "implementasi", label: "Implementasi", path: "/admin/implementasi", iconName: "FiCheckCircle" },
    { id: "menu",     label: "Menu",         action: "menu",             iconName: "FiMenu"      },
  ],

  // ── Special menu items (appear below main nav, role-aware) ─────────────────
  specialMenuItems: {
    verifikasi: {
      label: "Verifikasi",
      iconName: "FiCheckCircle",
      // Public QR scanner — same route from landing nav & dashboard sheet
      path: "/verifikasi",
      getPath: () => "/verifikasi",
    },
    logHistory: {
      label: "Log History",
      iconName: "FiFileText",
      // /log-history is unambiguous — /laporan is the reports/PDF page
      getPath:  (isAdmin) => isAdmin ? "/admin/log-history" : "/user/log-history",
      getLabel: (isAdmin) => isAdmin ? "Log Sistem"    : "Log Aktivitas",
    },
  },

  // ── Helpers ─────────────────────────────────────────────────────────────────
  getMenuItems: (isAdmin) =>
    isAdmin ? navigationConfig.adminMenuItems : navigationConfig.userMenuItems,

  getPlanningMenuItems: (isAdmin) => [
    {
      key: "all",
      label: navigationConfig.planningMenu.items.all.label,
      path: navigationConfig.planningMenu.items.all.getPath(isAdmin),
      iconName: "FiClipboard",
    },
    {
      key: "create",
      label: navigationConfig.planningMenu.items.create.label,
      path: navigationConfig.planningMenu.items.create.getPath(isAdmin),
      iconName: "FiFileText",
    },
  ],

  getEvaluationMenuItems: (isAdmin) => [
    {
      key: "data",
      label: navigationConfig.evaluationMenu.items.data.label,
      path: navigationConfig.evaluationMenu.items.data.getPath(isAdmin),
      iconName: "FiBarChart2",
    },
    {
      key: "informasi",
      label: navigationConfig.evaluationMenu.items.informasi.label,
      path: navigationConfig.evaluationMenu.items.informasi.getPath(isAdmin),
      iconName: "FiFileText",
    },
    {
      key: "parameter",
      label: navigationConfig.evaluationMenu.items.parameter.label,
      path: navigationConfig.evaluationMenu.items.parameter.getPath(isAdmin),
      iconName: "FiActivity",
    },
  ],

  getSpecialMenuItems: (isAdmin) => [
    navigationConfig.specialMenuItems.verifikasi,
    navigationConfig.specialMenuItems.logHistory,
  ],

  getVerifikasiPath: () => navigationConfig.specialMenuItems.verifikasi.path,

  getMobileTabs: (isAdmin) =>
    isAdmin ? navigationConfig.adminMobileTabs : navigationConfig.userMobileTabs,

  getLogHistoryInfo: (isAdmin) => ({
    path:  navigationConfig.specialMenuItems.logHistory.getPath(isAdmin),
    label: navigationConfig.specialMenuItems.logHistory.getLabel(isAdmin),
  }),
};

export default navigationConfig;
