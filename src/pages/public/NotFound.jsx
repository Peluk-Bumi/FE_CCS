import { motion } from "framer-motion";
import { FiHome, FiAlertTriangle, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-peach/5 px-4 py-10 flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none [background-image:linear-gradient(to_right,rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />

      <motion.div
        className="relative w-full max-w-2xl bg-background/95 dark:bg-background/90 backdrop-blur-2xl rounded-3xl border border-border shadow-[0_20px_60px_-20px_rgba(81,118,64,0.15)] p-8 md:p-12 text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute -top-12 -right-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl dark:bg-primary/10" />
        <div className="absolute -bottom-16 -left-12 w-44 h-44 rounded-full bg-peach/30 blur-3xl dark:bg-peach/20" />

        <motion.div
          className="relative z-10 w-20 h-20 mx-auto rounded-2xl text-primary-foreground bg-gradient-to-br from-primary to-primary-dark text-foreground flex items-center justify-center shadow-lg mb-8"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.35 }}
        >
          <FiAlertTriangle className="w-10 h-10" />
        </motion.div>

        <h1 className="relative z-10 text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-dark to-primary dark:from-primary-light dark:via-primary dark:to-primary-light mb-4">404</h1>
        <p className="relative z-10 text-xl md:text-3xl font-extrabold text-foreground mb-4">Halaman Tidak Ditemukan</p>
        <p className="relative z-10 text-muted-foreground mb-8 max-w-md mx-auto">
          Link yang dibuka tidak tersedia atau sudah dipindahkan.
        </p>

        <motion.button
          onClick={() => navigate("/", { replace: true })}
          className="relative z-10 inline-flex items-center gap-3 px-8 py-4 rounded-2xl text-primary-foreground  bg-gradient-to-r from-primary to-primary-dark text-foreground font-semibold shadow-lg duration-500 transition-all"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FiHome className="w-5 h-5" />
          Kembali Ke Home
          <FiArrowRight className="w-4 h-4" />
        </motion.button>
      </motion.div>
    </div>
  );
}
