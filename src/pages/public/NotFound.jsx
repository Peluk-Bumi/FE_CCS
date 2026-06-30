import { motion } from "framer-motion";
import { FiHome, FiAlertTriangle, FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f4f7f1] px-4 py-8 sm:px-6 lg:px-10 flex items-center">
      <div className="absolute inset-0">
        <img
          src="/images/login-bg.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-10 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/80 to-primary/10 dark:from-slate-950/88 dark:via-slate-950/82 dark:to-slate-900/92" />
        <div className="absolute inset-0 pointer-events-none [background-image:linear-gradient(to_right,rgba(148,163,184,0.07)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.07)_1px,transparent_1px)] [background-size:46px_46px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        <motion.div
          className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] items-center"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
        >
          <div className="max-w-2xl">
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-white/65 px-4 py-2 text-sm font-medium text-foreground shadow-[0_8px_30px_-15px_rgba(81,118,64,0.35)] backdrop-blur-xl dark:bg-slate-950/60"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
            >
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
              404 • Halaman tidak ditemukan
            </motion.div>

            <motion.h1
              className="mt-6 text-5xl font-black tracking-tight text-foreground sm:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.12 }}
            >
              Sepertinya kamu tersesat.
            </motion.h1>

            <motion.p
              className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.18 }}
            >
              Link yang dibuka tidak tersedia, sudah dipindahkan, atau memang belum ada.
              Kembali ke beranda untuk melanjutkan ke halaman yang benar.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col gap-3 sm:flex-row"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.24 }}
            >
              <motion.button
                onClick={() => navigate("/", { replace: true })}
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-primary to-primary-dark px-7 py-4 font-semibold text-white shadow-[0_18px_45px_-18px_rgba(81,118,64,0.65)] transition-transform"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiHome className="h-5 w-5" />
                Kembali ke Beranda
                <FiArrowRight className="h-4 w-4" />
              </motion.button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="inline-flex items-center justify-center rounded-2xl border border-border/70 bg-white/70 px-7 py-4 font-semibold text-foreground backdrop-blur-xl transition-colors hover:bg-white dark:bg-slate-950/50 dark:hover:bg-slate-900/70"
              >
                Kembali ke Halaman Sebelumnya
              </button>
            </motion.div>

            <motion.div
              className="mt-10 grid gap-4 sm:grid-cols-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.3 }}
            >
              {[
                { value: "404", label: "Halaman" },
                { value: "1", label: "Klik untuk kembali" },
                { value: "100%", label: "Aman dilanjutkan" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-3xl border border-border/70 bg-white/70 p-5 shadow-[0_16px_40px_-24px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:bg-slate-950/50"
                >
                  <div className="text-2xl font-black text-primary">{item.value}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.55, delay: 0.18 }}
          >
            <div className="absolute -top-8 -right-6 h-28 w-28 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-peach/30 blur-3xl" />

            <div className="relative overflow-hidden rounded-[2rem] border border-white/50 bg-white/72 p-6 shadow-[0_25px_80px_-35px_rgba(15,23,42,0.45)] backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/65 sm:p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-peach/20" />

              <div className="relative flex h-full flex-col justify-between gap-6">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary-dark dark:bg-primary/20">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    Error Routing
                  </div>
                  <div className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm dark:bg-slate-900/70">
                    UI Match Landing Page
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-center">
                  <div className="relative flex h-44 w-44 items-center justify-center rounded-full border border-primary/10 bg-gradient-to-br from-primary/10 via-white/60 to-peach/15 shadow-[0_0_0_18px_rgba(81,118,64,0.05)] dark:from-primary/15 dark:via-slate-900/80 dark:to-peach/10">
                    <motion.div
                      className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-[0_20px_50px_-18px_rgba(81,118,64,0.7)]"
                      initial={{ rotate: -4 }}
                      animate={{ rotate: [ -4, 4, -4 ] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <FiAlertTriangle className="h-11 w-11" />
                    </motion.div>
                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-4 py-2 text-sm font-black text-white shadow-xl">
                      404
                    </div>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    "Periksa alamat URL yang dibuka",
                    "Gunakan tombol kembali ke beranda",
                    "Tunggu dan muat ulang bila perlu",
                    "Hubungi tim jika tautan seharusnya aktif",
                  ].map((tip) => (
                    <div
                      key={tip}
                      className="rounded-2xl border border-border/60 bg-white/75 px-4 py-3 text-sm text-foreground shadow-sm dark:bg-slate-950/55"
                    >
                      {tip}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
