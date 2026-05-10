import { motion } from "framer-motion";

export default function DesktopNavigation({ navItems, currentPath, onNavigate, onVerifikasiNav }) {
  return (
    <div className="hidden lg:flex items-center space-x-4 absolute left-1/2 transform -translate-x-1/2">
      {navItems.map((item, index) => (
        <motion.button
          key={item.name}
          onClick={() => onNavigate(item.path)}
          className={`relative h-10 px-4 inline-flex items-center rounded-xl text-sm font-semibold transition-all group overflow-hidden ${
            currentPath === item.path
              ? "text-white bg-white/20 shadow-lg shadow-primary/50"
              : "text-white/80 hover:text-white hover:bg-white/10"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08 }}
        >
          <item.icon className="w-4 h-4 mr-2" />
          <span>{item.name}</span>
          {currentPath === item.path && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 w-full justify-self-center bg-gradient-to-r from-peach-dark/50 via-peach-light to-peach-dark/50 rounded-full shadow-md shadow-primary/50"
              layoutId="activeNav"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </motion.button>
      ))}

      {/* Verifikasi Button */}
      <motion.button
        onClick={onVerifikasiNav}
        className="mx-2 relative h-10 px-4 inline-flex items-center rounded-xl text-sm font-semibold text-white bg-white/10 hover:bg-white/20 transition-all border border-white/20 hover:border-white/40"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <span>Verifikasi</span>
      </motion.button>
    </div>
  );
}
