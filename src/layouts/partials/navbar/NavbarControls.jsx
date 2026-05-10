import { FiUser, FiMenu, FiX } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import ProfileDropdown from "./ProfileDropdown";

export default function NavbarControls({ 
  user, 
  isAuthenticated, 
  dropdownOpen, 
  mobileMenuOpen, 
  onDropdownToggle, 
  onMobileMenuToggle, 
  onLogout, 
  onNavigate,
  profileMenuItems
}) {
  return (
    <div className="flex items-center space-x-2 lg:space-x-3">
      {isAuthenticated ? (
        <>
          {/* Profile Dropdown - Desktop */}
          <ProfileDropdown
            user={user}
            isOpen={dropdownOpen}
            onToggle={onDropdownToggle}
            onClose={() => {}}
            onLogout={onLogout}
            profileMenuItems={profileMenuItems}
          />
        </>
      ) : (
        <>
          {/* Login Button - Desktop Only */}
          <motion.button
            onClick={() => onNavigate("/login")}
            className="hidden lg:inline-flex h-10 items-center space-x-2 px-4 rounded-xl text-sm font-bold text-primary-foreground hover:bg-white/10 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <FiUser className="w-4 h-4" />
            <span>Masuk</span>
          </motion.button>
        </>
      )}

      {/* Mobile Menu Button */}
      <motion.button 
        className="lg:hidden h-10 w-10 inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all"
        onClick={onMobileMenuToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <AnimatePresence mode="wait">
          {mobileMenuOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiX className="w-5 h-5 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FiMenu className="w-5 h-5 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
