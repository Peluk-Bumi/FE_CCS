import { useNavigate, useLocation } from "react-router-dom";
import {
  FiX, FiSettings, FiLogOut,
  FiHome, FiUsers, FiClipboard, FiCheckCircle,
  FiActivity, FiBarChart2, FiFileText,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";
import { useState, useRef, useEffect } from "react";
import navigationConfig from "@/app/config/navigationConfig";
import { PanelNavButton } from "@/shared/components/ui/navigation/PanelNavButton";

// Icon map — driven by navigationConfig iconName strings
const ICON_MAP = {
  FiHome:        <FiHome />,
  FiUsers:       <FiUsers />,
  FiClipboard:   <FiClipboard />,
  FiCheckCircle: <FiCheckCircle />,
  FiActivity:    <FiActivity />,
  FiBarChart2:   <FiBarChart2 />,
  FiFileText:    <FiFileText />,
};

function getIcon(iconName) {
  return ICON_MAP[iconName] ?? <FiHome />;
}

export default function Sidebar({ isUser = false, onClose }) {
  const navigate    = useNavigate();
  const location    = useLocation();
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [planningOpen, setPlanningOpen] = useState(false);
  const [evaluationOpen, setEvaluationOpen] = useState(false);
  const dropdownRef = useRef(null);

  // isAdmin is the canonical flag used everywhere in this file
  const isAdmin = !isUser;

  // ── Navigation data from single source of truth ──────────────────────────
  const planningItems    = navigationConfig.getPlanningMenuItems(isAdmin);
  const evaluationItems  = navigationConfig.getEvaluationMenuItems(isAdmin);
  
  const planningBasePath  = isAdmin ? "/admin/perencanaan" : "/user/perencanaan";
  const evaluationBasePath = isAdmin ? "/admin/evaluasi" : "/user/evaluasi";
  const isPlanningRoute   = location.pathname.startsWith(planningBasePath);
  const isEvaluationRoute = location.pathname.startsWith(evaluationBasePath);

  useEffect(() => {
    if (isPlanningRoute) {
      setPlanningOpen(true);
    }
    if (isEvaluationRoute) {
      setEvaluationOpen(true);
    }
  }, [isPlanningRoute, isEvaluationRoute]);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    onClose?.();
    navigate("/");
  };

  const handleNavigation = (path) => {
    navigate(path);
    onClose?.();
  };

  return (
    <aside className="h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col shadow-xl transition-colors">

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800"
      >
        <motion.a
          href="/"
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="group flex items-end space-x-3 rounded-xl px-2 py-1 transition-all duration-300 hover:bg-primary/5 text-left"
        >
          <img
            src="/logo/Logotype with Icon.png"
            alt="Logo"
            className="h-16 w-16 object-contain transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:rotate-2"
          />
          <div className="-translate-y-1.5 transition-transform duration-300 group-hover:-translate-y-2 text-left">
            <h2 className="bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-lg font-bold text-transparent">
              PELUK BUMI
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-primary transition-colors duration-300">
              {isAdmin ? "Admin Panel" : "User Panel"}
            </p>
          </div>
        </motion.a>

        <motion.button
          onClick={onClose}
          className="md:hidden p-2 rounded-lg hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
        >
          <FiX size={20} className="text-gray-600 dark:text-gray-400" />
        </motion.button>
      </motion.div>

      {/* ── Main Navigation ─────────────────────────────────────────────────── */}
      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto scrollbar-hide">
        {/* 1. Dashboard */}
        <PanelNavButton
          icon={getIcon("FiHome")}
          active={location.pathname === (isAdmin ? "/admin/dashboard" : "/user/dashboard")}
          onClick={() => handleNavigation(isAdmin ? "/admin/dashboard" : "/user/dashboard")}
        >
          Dashboard
        </PanelNavButton>

        {/* 2. Perencanaan (Dropdown) */}
        <PanelNavButton
          icon={getIcon("FiClipboard")}
          active={isPlanningRoute}
          hasSubmenu
          isSubmenuOpen={planningOpen}
          onClick={() => setPlanningOpen(!planningOpen)}
          subItems={
            <>
              {planningItems.map((item) => (
                <PanelNavButton
                  key={item.key}
                  icon={getIcon(item.iconName)}
                  active={location.pathname === item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="text-sm py-2.5 min-h-[40px]"
                >
                  {item.label}
                </PanelNavButton>
              ))}
            </>
          }
        >
          Perencanaan
        </PanelNavButton>

        {/* 3. Implementasi */}
        <PanelNavButton
          icon={getIcon("FiCheckCircle")}
          active={location.pathname === (isAdmin ? "/admin/implementasi" : "/user/implementasi")}
          onClick={() => handleNavigation(isAdmin ? "/admin/implementasi" : "/user/implementasi")}
        >
          Implementasi
        </PanelNavButton>

        {/* 4. Monitoring */}
        <PanelNavButton
          icon={getIcon("FiActivity")}
          active={location.pathname === (isAdmin ? "/admin/monitoring" : "/user/monitoring")}
          onClick={() => handleNavigation(isAdmin ? "/admin/monitoring" : "/user/monitoring")}
        >
          Monitoring
        </PanelNavButton>

        {/* 5. Evaluasi (Dropdown) */}
        <PanelNavButton
          icon={getIcon("FiBarChart2")}
          active={isEvaluationRoute}
          hasSubmenu
          isSubmenuOpen={evaluationOpen}
          onClick={() => setEvaluationOpen(!evaluationOpen)}
          subItems={
            <>
              {evaluationItems.map((item) => (
                <PanelNavButton
                  key={item.key}
                  icon={getIcon(item.iconName)}
                  active={location.pathname === item.path}
                  onClick={() => handleNavigation(item.path)}
                  className="text-sm py-2.5 min-h-[40px]"
                >
                  {item.label}
                </PanelNavButton>
              ))}
            </>
          }
        >
          Evaluasi
        </PanelNavButton>

        {/* Divider */}
        <div className="my-2 border-t border-gray-200 dark:border-gray-700" />

        {/* 6. Verifikasi - Special with accent variant */}
        <PanelNavButton
          icon={getIcon("FiCheckCircle")}
          active={location.pathname === "/verifikasi"}
          variant="accent"
          onClick={() => handleNavigation("/verifikasi")}
        >
          Verifikasi
        </PanelNavButton>

        {/* 7. Pengguna (Admin Only) */}
        {isAdmin && (
          <PanelNavButton
            icon={getIcon("FiUsers")}
            active={location.pathname === "/admin/users"}
            onClick={() => handleNavigation("/admin/users")}
          >
            Pengguna
          </PanelNavButton>
        )}

        {/* 8. Log */}
        <PanelNavButton
          icon={getIcon("FiFileText")}
          active={location.pathname === (isAdmin ? "/admin/log-history" : "/user/log-history")}
          onClick={() => handleNavigation(isAdmin ? "/admin/log-history" : "/user/log-history")}
        >
          {isAdmin ? "Log Sistem" : "Log Aktivitas"}
        </PanelNavButton>
      </nav>

      {/* ── User Profile ────────────────────────────────────────────────────── */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <div className="relative" ref={dropdownRef}>
          {/* Profile trigger */}
          <motion.button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <motion.div
                className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-sm font-bold shadow-lg"
                whileHover={{ scale: 1.1 }}
                animate={{
                  boxShadow: dropdownOpen
                    ? "0 0 20px rgba(16, 185, 129, 0.4)"
                    : "0 0 0px rgba(16, 185, 129, 0)",
                }}
              >
                {(user?.username || user?.name || "U")[0].toUpperCase()}
              </motion.div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 animate-pulse" />
            </div>
            <div className="min-w-0 flex-1 text-left">
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                {user?.username || user?.name || "User"}
              </p>
              <p className="text-xs text-primary dark:text-primary-light font-medium">
                {user?.role || "User"}
              </p>
            </div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse flex-shrink-0" />
          </motion.button>

          {/* Popup — opens upward */}
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute bottom-full mb-2 left-0 right-0 bg-white dark:bg-gray-800 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
              >
                {/* Popup header */}
                <div className="p-3 bg-gradient-to-r from-primary/10 to-primary-dark/10 dark:from-primary/20 dark:to-primary-dark/20 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-sm font-bold">
                      {(user?.username || user?.name || "U")[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
                        {user?.username || user?.name || "User"}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                        {user?.email || "user@example.com"}
                      </p>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                          {user?.role || "User"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Popup actions */}
                <div className="p-2">
                  {/* Settings */}
                  <motion.button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleNavigation(isAdmin ? "/admin/settings" : "/user/settings");
                    }}
                    className="flex items-center gap-3 w-full px-3 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all text-sm"
                    whileHover={{ x: 4 }}
                  >
                    <FiSettings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <span className="font-medium">Pengaturan</span>
                  </motion.button>

                  {/* Logout */}
                  <motion.button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all border-t border-gray-200/50 dark:border-gray-700/50 mt-2 pt-2 text-sm"
                    whileHover={{ x: 4 }}
                  >
                    <FiLogOut className="w-4 h-4" />
                    <span className="font-medium">Keluar</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-800 text-center">
        <p className="text-xs font-extrabold text-gray-500 dark:text-gray-400">Peluk Bumi</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Environmental Monitoring System v{import.meta.env.VITE_APP_VERSION || "1.3.0"}
        </p>
      </div>
    </aside>
  );
}
