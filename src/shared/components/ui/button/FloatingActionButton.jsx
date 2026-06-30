import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCompass, FiX, FiHome, FiInfo, FiCheckCircle, FiHelpCircle, FiLogIn, FiLogOut, FiUser, FiGrid } from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/app/context/AuthContext';
import navigationDataConfig from '@/app/config/navigationDataConfig';

const FloatingActionButton = ({ context = 'landing', visibleOn = 'mobile', position = 'bottom-right', isPanel = false }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const { isAuthenticated, user, logout } = useAuth();

  const navItems = navigationDataConfig.getItems(context);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) setMenuOpen(false);
    }
    function handleEscape(event) {
      if (event.key === 'Escape') setMenuOpen(false);
    }
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [menuOpen]);

  const handleNav = (path) => { navigate(path); setMenuOpen(false); };
  const handleLogout = () => { logout(); setMenuOpen(false); navigate('/'); };

  const visibilityClasses = {
    mobile: 'hidden max-md:block',
    desktop: 'md:hidden',
    all: 'block',
  };

  const ICON_MAP = {
    FiHome: <FiHome className="w-5 h-5" />,
    FiInfo: <FiInfo className="w-5 h-5" />,
    FiHelpCircle: <FiHelpCircle className="w-5 h-5" />,
    FiCheckCircle: <FiCheckCircle className="w-5 h-5" />,
  };

  const authItems = isAuthenticated
    ? [
        { id: 'dashboard', label: `Dashboard (${user?.name || 'User'})`, path: user?.role === 'admin' ? '/admin/dashboard' : '/user/dashboard', iconName: 'FiGrid', category: 'user' },
        { id: 'logout', label: 'Logout', action: 'logout', iconName: 'FiLogOut', category: 'user' },
      ]
    : [
        { id: 'login', label: 'Login', path: '/login', iconName: 'FiLogIn', category: 'auth', prominent: true },
      ];

  const renderItem = (item, index, delay) => {
    const isActive = location.pathname === item.path;
    const isProminent = item.prominent;
    return (
      <motion.div
        key={item.id}
        initial={{ scale: 0, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0, y: 20, opacity: 0 }}
        transition={{ delay: delay * 0.03, duration: 0.15, ease: 'easeOut' }}
        className="flex items-center gap-3 relative z-50 pr-2"
      >
        <motion.span
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          transition={{ delay: delay * 0.03 + 0.05, duration: 0.15 }}
          className="px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white text-sm font-medium shadow-md whitespace-nowrap"
        >
          {item.label}
        </motion.span>

        <motion.button
          onClick={() => item.action === 'logout' ? handleLogout() : handleNav(item.path)}
          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all flex-shrink-0 ${
            isProminent
              ? isActive
                ? 'bg-gradient-to-br from-primary to-primary-dark text-white border-2 border-primary'
                : 'bg-white dark:bg-gray-800 text-primary dark:text-primary-light border-2 border-primary/50'
              : isActive
              ? 'bg-gradient-to-br from-primary to-primary-dark text-white'
              : item.category === 'user'
              ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30'
              : item.category === 'auth'
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-700'
              : 'bg-white dark:bg-gray-800 text-primary dark:text-primary-light hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          aria-label={item.label}
          title={item.label}
        >
          {item.iconName === 'FiLogIn' && <FiLogIn className="w-5 h-5" />}
          {item.iconName === 'FiLogOut' && <FiLogOut className="w-5 h-5" />}
          {item.iconName === 'FiUser' && <FiUser className="w-5 h-5" />}
          {item.iconName === 'FiGrid' && <FiGrid className="w-5 h-5" />}
          {ICON_MAP[item.iconName]}
        </motion.button>
      </motion.div>
    );
  };

  return (
    <div
      ref={menuRef}
      className={`${visibilityClasses[visibleOn]} fixed ${isPanel ? 'bottom-28' : 'bottom-14'} right-12 z-40 transition-transform duration-300`}
      style={{ paddingBottom: 'max(1rem, var(--sab))' }}
    >
      {/* Backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>

      {/* Speed Dial Stack */}
      <div className="absolute bottom-0 right-0 flex flex-col gap-5 items-end z-40 w-auto pointer-events-auto">
        <AnimatePresence>
          {menuOpen && (
            <>
              {/* Nav Items */}
              {navItems.map((item, index) => renderItem(item, index, index))}

              {/* Separator — hardcoded di antara nav dan auth */}
              <motion.div
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                exit={{ scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className=" w-full h-1.5 bg-gradient-to-br from-light to-primary-light origin-right z-30 rounded-full"
              />

              {/* Auth Items */}
              {authItems.map((item, index) => renderItem(item, index, navItems.length + 1 + index))}
            </>
          )}
        </AnimatePresence>

        {/* Main FAB Trigger */}
        <motion.button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu Navigasi"
          aria-expanded={menuOpen}
          title="Menu Navigasi"
          className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-dark hover:from-primary-dark hover:to-green-700 text-white shadow-lg hover:shadow-xl flex items-center justify-center transition-shadow duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary z-40 relative"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          <AnimatePresence mode="wait">
            {menuOpen ? (
              <motion.div key="close" initial={{ rotate: -90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: 90, scale: 0 }} transition={{ duration: 0.15 }}>
                <FiX className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 90, scale: 0 }} animate={{ rotate: 0, scale: 1 }} exit={{ rotate: -90, scale: 0 }} transition={{ duration: 0.15 }}>
                <FiCompass className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};

export default FloatingActionButton;