import { FiUser } from "react-icons/fi";
import { motion } from "framer-motion";
import ProfileDropdown from "./ProfileDropdown";

// Mobile menu button removed — FloatingSheetTrigger in Navbar handles mobile nav
export default function NavbarControls({ 
  user, 
  isAuthenticated, 
  dropdownOpen, 
  onDropdownToggle, 
  onLogout, 
  onNavigate,
  profileMenuItems
}) {
  return (
    <div className="flex items-center space-x-2 lg:space-x-3">
      {isAuthenticated ? (
        <ProfileDropdown
          user={user}
          isOpen={dropdownOpen}
          onToggle={onDropdownToggle}
          onClose={() => {}}
          onLogout={onLogout}
          profileMenuItems={profileMenuItems}
        />
      ) : (
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
      )}
    </div>
  );
}