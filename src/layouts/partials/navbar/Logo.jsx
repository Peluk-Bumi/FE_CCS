import { motion } from "framer-motion";

export default function Logo({ onNavigate }) {
  return (
    <motion.div
      className="group flex flex-shrink-0 cursor-pointer items-center space-x-2.5"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onNavigate}
    >
      <div className="relative flex items-center gap-2.5">
        <div className="relative">
          {/* Ambient glow */}
          <motion.div
            className="absolute inset-0 rounded-full blur-lg opacity-30 transition-opacity duration-300 group-hover:opacity-50"
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Logo */}
          <img
            src="/logo/logotype-transparent-peach.png"
            alt="CCS-System Logo"
            className="relative z-10 size-14 object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-[1.06] group-hover:rotate-3"
          />
        </div>

        {/* Text */}
        <div className="flex flex-col transition-transform duration-300 group-hover:translate-x-0.5 group-hover:scale-95">
          <h1 className="text-lg font-bold leading-tight text-white/90 transition-all duration-300 group-hover:text-white">
            PELUK BUMI
          </h1>

          <p className="hidden text-xs font-medium leading-tight text-white/75 transition-colors duration-300 group-hover:text-white/90 sm:block">
            Environmental Monitoring System
          </p>
        </div>
      </div>
    </motion.div>
  );
}