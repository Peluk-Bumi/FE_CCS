import { FiHome, FiInfo, FiHelpCircle, FiGrid, FiSettings, FiBookOpen } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/app/context/AuthContext";
import { motion } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";
import Logo from "./navbar/Logo";
import DesktopNavigation from "./navbar/DesktopNavigation";
import NavbarControls from "./navbar/NavbarControls";
import LandingMobileSheet from "./navbar/LandingMobileSheet";
import { FloatingSheetTrigger } from "@/shared/components/ui/sheet/FloatingSheetTrigger";

export default function Navbar({ isUser = false }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const { theme, toggleTheme } = useTheme();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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

  // Lock body scroll when sheet is open
  useEffect(() => {
    document.body.style.overflow = sheetOpen ? "hidden" : "unset";
    return () => { document.body.style.overflow = "unset"; };
  }, [sheetOpen]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setSheetOpen(false);
    navigate("/");
  };

  const navItems = [
    { name: "Beranda", path: "/", icon: FiHome, color: "primary" },
    { name: "Tentang", path: "/about", icon: FiInfo, color: "blue" },
    { name: "Panduan", path: "/panduan", icon: FiBookOpen, color: "emerald" },
    { name: "FAQ", path: "/faqs", icon: FiHelpCircle, color: "teal" },
  ];

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
      setSheetOpen(false);
      setDropdownOpen(false);
      return;
    }
    setSheetOpen(false);
    setDropdownOpen(false);
    setTimeout(() => {
      navigate(path);
      window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, 150);
  };

  const handleVerifikasiNav = () => {
    setSheetOpen(false);
    setDropdownOpen(false);
    navigate("/verifikasi");
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
          <div className="h-16 flex items-center sm:justify-between justify-center rounded-full px-6 lg:px-12 backdrop-blur-2xl border border-primary-light bg-gradient-to-r from-primary via-primary/85 to-primary-dark shadow-[0_12px_30px_-12px_rgba(81,118,64,0.75)]">
            {/* Logo */}
            <Logo onNavigate={() => handleNavigation("/")} />

            {/* Desktop Navigation */}
            <DesktopNavigation
              navItems={navItems}
              currentPath={location.pathname}
              onNavigate={handleNavigation}
              onVerifikasiNav={handleVerifikasiNav}
            />

            {/* Right Controls — desktop profile / login only; mobile button removed */}
            <div className="absolute right-6 lg:right-12">
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

      {/* Mobile bottom-sheet navigation — landing-specific */}
      <LandingMobileSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />

      {/* Floating trigger — bottom-left, only on mobile */}
      <FloatingSheetTrigger
        isOpen={sheetOpen}
        onClick={() => setSheetOpen((prev) => !prev)}
      />
    </>
  );
}