import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowLeft } from "react-icons/fi";
import { useAuth } from "@/app/context/AuthContext";

/**
 * Fullscreen mobile shell for public QR verification (/verifikasi).
 * Hides global Navbar via App.jsx fullscreenRoutes.
 */
export default function VerificationFullscreenLayout({ children }) {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const dashboardPath =
    user?.role === "admin"
      ? "/admin/dashboard"
      : user?.role === "user"
        ? "/user/dashboard"
        : "/";

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(isAuthenticated ? dashboardPath : "/");
    }
  };

  return (
    <motion.div
      className="min-h-[100dvh] flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <header className="sticky top-0 z-50 flex items-center justify-between gap-4 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))] bg-gradient-to-r from-primary via-primary/95 to-primary-dark dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900 backdrop-blur-xl border-b border-primary-light/30 dark:border-gray-700 shadow-sm shrink-0">
        {/* Left: Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors touch-manipulation flex-shrink-0"
          aria-label="Kembali"
        >
          <FiArrowLeft className="w-5 h-5" />
        </button>

        {/* Center: Title & Subtitle */}
        <div className="flex-1 text-center min-w-0">
          <h1 className="text-base font-bold text-white truncate">Verifikasi QR</h1>
          <p className="text-xs text-white/80 truncate">Scan & validasi tanpa login</p>
        </div>

        {/* Right: Logo Icon (Rounded) */}
        <button
          type="button"
          onClick={() => navigate("/")}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors touch-manipulation flex-shrink-0"
          aria-label="Beranda"
        >
          <img src="/logo/icon-peach.png" alt="" className="w-8 h-8 object-contain" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto min-h-0">{children}</div>
    </motion.div>
  );
}
