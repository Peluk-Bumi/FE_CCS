import { FiUser, FiSettings, FiLogOut, FiCheckCircle, FiGrid, FiHome, FiInfo } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

export default function MobileMenu({ 
  isOpen, 
  onClose, 
  navItems, 
  currentPath, 
  user, 
  isAuthenticated, 
  onNavigate, 
  onLogout, 
  onVerifikasiNav 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ top: '72px', zIndex: 30 }}
          />

          {/* Mobile Menu Panel */}
          <motion.div
            className="fixed top-[72px] left-0 right-0 bg-white dark:bg-gray-900 shadow-xl max-h-[calc(100vh-72px)] overflow-y-auto lg:hidden z-40"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 sm:p-6 space-y-3">
              {/* Navigation Links */}
              {navItems.map((item, index) => (
                <motion.button
                  key={item.name}
                  onClick={() => onNavigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 sm:py-4 rounded-xl font-semibold transition-all ${
                    currentPath === item.path
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-2 border-green-600"
                      : "bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-2 border-transparent hover:border-green-300 dark:hover:border-green-800"
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                  {currentPath === item.path && (
                    <FiCheckCircle className="w-5 h-5 ml-auto text-green-600" />
                  )}
                </motion.button>
              ))}

              {/* Divider */}
              <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />

              {/* Verifikasi Button */}
              <motion.button
                onClick={onVerifikasiNav}
                className={`w-full flex items-center gap-3 px-4 py-3 sm:py-4 rounded-xl font-semibold transition-all ${
                  currentPath === "/verifikasi"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-2 border-green-600"
                    : "bg-green-50/50 dark:bg-green-900/10 text-green-700 dark:text-green-400 border-2 border-transparent hover:border-green-300 dark:hover:border-green-800"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiCheckCircle className="w-5 h-5" />
                <span>Verifikasi QR Code</span>
              </motion.button>

              {isAuthenticated ? (
                <>
                  {/* Dashboard Button */}
                  <motion.button
                    onClick={() => onNavigate(user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard')}
                    className="w-full flex items-center gap-3 px-4 py-3 sm:py-4 rounded-xl font-semibold bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 transition-all shadow-md"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiGrid className="w-5 h-5" />
                    <span>Dashboard</span>
                  </motion.button>

                  {/* Settings & Logout */}
                  <motion.button
                    onClick={() => {
                      onClose();
                      onNavigate(user?.role === "admin" ? "/admin/settings" : "/user/settings");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 sm:py-4 rounded-xl font-semibold bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-primary/10 dark:hover:bg-primary/20 transition-all"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiSettings className="w-5 h-5" />
                    <span>Pengaturan</span>
                  </motion.button>

                  <motion.button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 sm:py-4 rounded-xl font-semibold bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all border-2 border-red-200 dark:border-red-800"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.25 }}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiLogOut className="w-5 h-5" />
                    <span>Keluar</span>
                  </motion.button>
                </>
              ) : (
                /* Login Button - Mobile */
                <motion.button
                  onClick={() => onNavigate("/login")}
                  className="w-full flex items-center gap-3 px-4 py-3 sm:py-4 rounded-xl font-semibold bg-green-600 text-white hover:bg-green-700 transition-all shadow-md"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FiUser className="w-5 h-5" />
                  <span>Masuk / Daftar</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
