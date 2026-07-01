import { FiHome, FiInfo, FiHelpCircle, FiGrid, FiSettings, FiCheckCircle, FiBookOpen } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/app/context/AuthContext";
import { motion } from "framer-motion";
import Logo from "./navbar/Logo";
import DesktopNavigation from "./navbar/DesktopNavigation";
import NavbarControls from "./navbar/NavbarControls";
import navigationConfig from "@/app/config/navigationConfig";

export default function Navbar({ isUser = false }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/");
  };

  const navItems = navigationConfig.landingNavItems.map((item) => {
    let iconComp = FiHome;
    if (item.iconName === "FiInfo") iconComp = FiInfo;
    if (item.iconName === "FiBookOpen") iconComp = FiBookOpen;
    if (item.iconName === "FiCheckCircle") iconComp = FiCheckCircle;
    if (item.iconName === "FiHelpCircle") iconComp = FiHelpCircle;

    let color = "primary";
    if (item.path.includes("about")) color = "blue";
    if (item.path.includes("panduan")) color = "emerald";
    if (item.path.includes("verifikasi")) color = "green";
    if (item.path.includes("faq")) color = "teal";

    return { name: item.label, path: item.path, icon: iconComp, color };
  });

  const profileMenuItems = [
    {
      label: "Dashboard",
      icon: FiGrid,
      onClick: () => {
        setDropdownOpen(false);
        navigate(user?.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
      },
    },
    {
      label: "Pengaturan",
      icon: FiSettings,
      onClick: () => {
        setDropdownOpen(false);
        navigate(user?.role === "admin" ? "/admin/settings" : "/user/settings");
      },
    },
  ];

  const handleNavigation = (path) => {
    if (location.pathname === path) {
      setDropdownOpen(false);
      return;
    }
    setDropdownOpen(false);
    setTimeout(() => {
      navigate(path);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, 150);
  };

  return (
    <>
      <motion.nav
        className="fixed top-0 left-0 right-0 z-50 w-screen -ml-[calc((100vw-100%)/2)] bg-transparent transition-all duration-300"
        initial={{ y: 0 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="relative h-16 flex items-center justify-center md:justify-between rounded-full px-6 lg:px-12 backdrop-blur-2xl border border-primary-light bg-gradient-to-r from-primary via-primary/85 to-primary-dark shadow-[0_12px_30px_-12px_rgba(81,118,64,0.75)]">
            {/* 1. Logo (Selalu tampil, di tengah pada mobile, di kiri pada desktop) */}
            <div className="flex items-center">
              <Logo onNavigate={() => handleNavigation("/")} />
            </div>

            {/* 2. Desktop Navigation (Sembunyi di mobile, di tengah pada desktop) */}
            <div className="hidden md:flex items-center">
              <DesktopNavigation
                navItems={navItems}
                currentPath={location.pathname}
                onNavigate={handleNavigation}
              />
            </div>

            {/* 3. Navbar Controls (Sembunyi di mobile, di kanan pada desktop) */}
            <div className="hidden md:flex items-center">
              <NavbarControls
                user={user}
                isAuthenticated={isAuthenticated}
                dropdownOpen={dropdownOpen}
                onDropdownToggle={() => setDropdownOpen(!dropdownOpen)}
                onLogout={handleLogout}
                onNavigate={handleNavigation}
                profileMenuItems={profileMenuItems}
              />
            </div>
          </div>
        </div>
      </motion.nav>
    </>
  );
}