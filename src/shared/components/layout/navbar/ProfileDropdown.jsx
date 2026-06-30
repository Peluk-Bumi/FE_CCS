import { useRef } from "react";
import { FiSettings, FiLogOut, FiGrid } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileDropdown({ user, isOpen, onToggle, onClose, onLogout, profileMenuItems, iconOnly = false }) {
  const dropdownRef = useRef(null);

  return (
    <>
      {/* Icon-only mode for md screens */}
      {iconOnly && (
        <div className="hidden md:block lg:hidden relative" ref={dropdownRef}>
          <motion.button
            onClick={onToggle}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl group transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title={user?.username || user?.name || "User"}
          >
            <div className="relative">
              <motion.div 
                className="h-9 w-9 rounded-full bg-gradient-to-br from-peach to-peach-dark flex items-center justify-center text-primary transition-all group-hover:shadow-[0_0_20px_rgba(225,240,216,0.5)] shadow-lg font-bold text-sm"
                animate={{ 
                  boxShadow: isOpen 
                    ? "0 0 20px rgba(225, 240, 216, 0.7)" 
                    : "" 
                }}
              >
                {(user?.username || user?.name || "U")[0].toUpperCase()}
              </motion.div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-green-300"></div>
            </div>
          </motion.button>
          
          {/* Dropdown Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 top-full mt-6 w-80 bg-white dark:bg-dark backdrop-blur-2xl rounded-2xl shadow-2xl border border-primary/20 dark:border-primary/60 overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-primary/10 to-primary-dark/10 dark:from-primary/20 dark:to-primary-dark/20 border-b border-primary/20 dark:border-primary/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-primary-foreground text-lg font-bold">
                      {(user?.username || user?.name || "U")[0].toUpperCase()}
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {user?.username || user?.name || "User"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user?.email || "user@example.com"}
                      </p>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        <span className="text-xs text-green-700 dark:text-green-400 font-medium">
                          {user?.role || "User"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Profile Menu Items */}
                <div className="p-2">
                  {profileMenuItems.map((item, index) => (
                    <motion.button
                      key={index}
                      onClick={item.onClick}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 dark:text-gray-200 hover:bg-primary-light/20 dark:hover:bg-green-800/60 rounded-xl transition-all"
                      whileHover={{ x: 4 }}
                    >
                      <item.icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  ))}
                  
                  <motion.button
                    onClick={onLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all border-t border-green-200/50 dark:border-green-800/50 mt-2"
                    whileHover={{ x: 4 }}
                  >
                    <FiLogOut className="w-5 h-5" />
                    <span className="font-medium">Keluar</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Full mode for lg screens */}
      {!iconOnly && (
        <div className="hidden lg:block relative" ref={dropdownRef}>
          <motion.button
            onClick={onToggle}
            className="inline-flex h-10 items-center space-x-2 px-3 py-2 rounded-xl group transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <motion.div 
                className="h-9 w-9 rounded-full bg-gradient-to-br from-peach to-peach-dark flex items-center justify-center text-primary transition-all group-hover:shadow-[0_0_20px_rgba(225,240,216,0.5)] shadow-lg font-bold text-sm"
                animate={{ 
                  boxShadow: isOpen 
                    ? "0 0 20px rgba(225, 240, 216, 0.7)" 
                    : "" 
                }}
              >
                {(user?.username || user?.name || "U")[0].toUpperCase()}
              </motion.div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-green-300"></div>
            </div>
            <div className="text-left hidden xl:block">
              <p className="text-sm font-semibold text-white truncate max-w-[120px]">
                {user?.username || user?.name || "User"}
              </p>
              <p className="text-xs text-white/75 font-medium">
                {user?.role || "User"}
              </p>
            </div>
          </motion.button>
          
          {/* Desktop Dropdown Menu */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute right-0 top-full mt-6 w-80 bg-white dark:bg-dark backdrop-blur-2xl rounded-2xl shadow-2xl border border-primary/20 dark:border-primary/60 overflow-hidden"
              >
                {/* Header */}
                <div className="p-4 bg-gradient-to-r from-primary/10 to-primary-dark/10 dark:from-primary/20 dark:to-primary-dark/20 border-b border-primary/20 dark:border-primary/50">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-primary-foreground text-lg font-bold">
                      {(user?.username || user?.name || "U")[0].toUpperCase()}
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {user?.username || user?.name || "User"}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user?.email || "user@example.com"}
                      </p>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                        <span className="text-xs text-green-700 dark:text-green-400 font-medium">
                          {user?.role || "User"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Profile Menu Items */}
                <div className="p-2">
                  {profileMenuItems.map((item, index) => (
                    <motion.button
                      key={index}
                      onClick={item.onClick}
                      className="flex items-center gap-3 w-full px-4 py-3 text-left text-gray-700 dark:text-gray-200 hover:bg-primary-light/20 dark:hover:bg-green-800/60 rounded-xl transition-all"
                      whileHover={{ x: 4 }}
                    >
                      <item.icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                      <span className="font-medium">{item.label}</span>
                    </motion.button>
                  ))}
                  
                  <motion.button
                    onClick={onLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all border-t border-green-200/50 dark:border-green-800/50 mt-2"
                    whileHover={{ x: 4 }}
                  >
                    <FiLogOut className="w-5 h-5" />
                    <span className="font-medium">Keluar</span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </>
  );
}
