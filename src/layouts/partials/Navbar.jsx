import { FiHome, FiInfo, FiGrid, FiSettings } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/app/context/AuthContext";
import { motion } from "framer-motion";
import { useTheme } from "@/app/context/ThemeContext";
import Logo from "./navbar/Logo";
import DesktopNavigation from "./navbar/DesktopNavigation";
import MobileMenu from "./navbar/MobileMenu";
import NavbarControls from "./navbar/NavbarControls";

export default function Navbar({ isUser = false }) {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [navigating, setNavigating] = useState(false);
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

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate("/");
  };

  const navItems = [
    { name: "Beranda", path: "/", icon: FiHome, color: "primary" },
    { name: "Tentang", path: "/about", icon: FiInfo, color: "blue" },
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
      setMobileMenuOpen(false);
      setDropdownOpen(false);
      return;
    }

    setNavigating(true);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    
    setTimeout(() => {
      navigate(path);
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
      setTimeout(() => setNavigating(false), 300);
    }, 150);
  };

  // Smart navigation ke verifikasi
  const handleVerifikasiNav = () => {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin/verifikasi");
      } else if (user?.role === "user") {
        navigate("/user/verifikasi");
      }
    } else {
      navigate("/verifikasi");
    }
  };

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 w-screen -ml-[calc((100vw-100%)/2)] bg-transparent transition-all duration-300"
      initial={{ y: 0 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="h-16 flex items-center justify-between rounded-full px-6 lg:px-8 backdrop-blur-2xl border border-primary-light  bg-gradient-to-r from-primary via-primary/85 to-primary-dark shadow-[0_12px_30px_-12px_rgba(81,118,64,0.75)]">
          {/* Logo Section */}
          <Logo onNavigate={() => handleNavigation("/")} />

          {/* Desktop Navigation - Centered */}
          <DesktopNavigation 
            navItems={navItems}
            currentPath={location.pathname}
            onNavigate={handleNavigation}
            onVerifikasiNav={handleVerifikasiNav}
          />

          {/* Right Section - Controls */}
          <NavbarControls
            user={user}
            isAuthenticated={isAuthenticated}
            dropdownOpen={dropdownOpen}
            mobileMenuOpen={mobileMenuOpen}
            onDropdownToggle={() => setDropdownOpen(!dropdownOpen)}
            onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
            onLogout={handleLogout}
            onNavigate={handleNavigation}
            profileMenuItems={profileMenuItems}
          />
        </div>
      </div>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        navItems={navItems}
        currentPath={location.pathname}
        user={user}
        isAuthenticated={isAuthenticated}
        onNavigate={handleNavigation}
        onLogout={handleLogout}
        onVerifikasiNav={handleVerifikasiNav}
      />
    </motion.nav>
  );
}