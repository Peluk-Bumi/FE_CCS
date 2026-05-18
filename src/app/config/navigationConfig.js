// Central navigation configuration — single source of truth for all nav components
// (Sidebar, MobileSheetNavigation, MobileHeader, LandingMobileSheet)
export const navigationConfig = {

  // ── Admin menu items ────────────────────────────────────────────────────────
  adminMenuItems: [
    { label: "Dashboard",    path: "/admin/dashboard",    iconName: "FiHome"        },
    { label: "Pengguna",     path: "/admin/users",        iconName: "FiUsers"       },
    { label: "Perencanaan",  path: "/admin/perencanaan",  iconName: "FiClipboard"   },
    { label: "Implementasi", path: "/admin/implementasi", iconName: "FiCheckCircle" },
    { label: "Monitoring",   path: "/admin/monitoring",   iconName: "FiActivity"    },
    { label: "Evaluasi",     path: "/admin/evaluasi",     iconName: "FiBarChart2"   },
  ],

  // ── User menu items ─────────────────────────────────────────────────────────
  // Same structure as admin — backend/API filters data by user automatically.
  // No separate "Pengguna" item for user (they go to /user/profile via profile dropdown).
  userMenuItems: [
    { label: "Dashboard",    path: "/user/dashboard",    iconName: "FiHome"        },
    { label: "Perencanaan",  path: "/user/perencanaan",  iconName: "FiClipboard"   },
    { label: "Implementasi", path: "/user/implementasi", iconName: "FiCheckCircle" },
    { label: "Monitoring",   path: "/user/monitoring",   iconName: "FiActivity"    },
    { label: "Evaluasi",     path: "/user/evaluasi",     iconName: "FiBarChart2"   },
  ],

  // ── Landing page nav items (public) ────────────────────────────────────────
  landingNavItems: [
    { label: "Beranda",    path: "/",       iconName: "FiHome"        },
    { label: "Tentang",    path: "/about",  iconName: "FiInfo"        },
    { label: "Verifikasi", path: "/verifikasi", iconName: "FiCheckCircle" },
  ],

  // ── Special menu items (appear below main nav, role-aware) ─────────────────
  specialMenuItems: {
    verifikasi: {
      label: "Verifikasi",
      iconName: "FiCheckCircle",
      getPath: (isAdmin) => isAdmin ? "/admin/verifikasi" : "/user/verifikasi",
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

  getSpecialMenuItems: (isAdmin) => [
    navigationConfig.specialMenuItems.verifikasi,
    navigationConfig.specialMenuItems.logHistory,
  ],

  getVerifikasiPath: (isAdmin) =>
    navigationConfig.specialMenuItems.verifikasi.getPath(isAdmin),

  getLogHistoryInfo: (isAdmin) => ({
    path:  navigationConfig.specialMenuItems.logHistory.getPath(isAdmin),
    label: navigationConfig.specialMenuItems.logHistory.getLabel(isAdmin),
  }),
};

export default navigationConfig;
