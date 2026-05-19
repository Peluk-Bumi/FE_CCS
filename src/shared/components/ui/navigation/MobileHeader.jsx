import * as React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { FiArrowLeft } from "react-icons/fi"
import { useAuth } from "@/app/context/AuthContext"
import { cn } from "@/shared/utils/utils"

const MobileHeader = React.forwardRef(({ 
  className,
  ...props 
}, ref) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  
  const isAdmin = user?.role === "admin"
  const isAdminRoute = location.pathname.startsWith("/admin")
  const isDashboard =
    location.pathname === "/user/dashboard" ||
    location.pathname === "/admin/dashboard"
  const showBack = !isDashboard
  
  const handleBack = () => {
    navigate(-1) // Go back in history
  }
  
  const handleLogoClick = () => {
    navigate('/') // Go to landing page
  }
  
  const getPageTitle = () => {
    const path = location.pathname
    
    if (isAdminRoute) {
      // Admin routes
      if (path === '/admin/dashboard') return { title: 'Dashboard', subtitle: 'Admin Panel' }
      if (path === '/admin/users') return { title: 'Pengguna', subtitle: 'Kelola pengguna sistem' }
      if (path === '/admin/perencanaan') return { title: 'Perencanaan', subtitle: 'Rencana konservasi' }
      if (path === '/admin/implementasi') return { title: 'Implementasi', subtitle: 'Aksi lapangan' }
      if (path === '/admin/laporan') return { title: 'Laporan', subtitle: 'Laporan sistem' }
      if (path === '/admin/monitoring') return { title: 'Monitoring', subtitle: 'Pantau aktivitas' }
      if (path === '/admin/evaluasi') return { title: 'Evaluasi', subtitle: 'Evaluasi hasil' }
      if (path === '/admin/verifikasi') return { title: 'Verifikasi', subtitle: 'Validasi data' }
      if (path === '/admin/settings') return { title: 'Pengaturan', subtitle: 'Konfigurasi sistem' }
      if (path === '/admin/log-history') return { title: 'Log Sistem', subtitle: 'Riwayat transaksi' }
      return { title: 'Dashboard', subtitle: 'Admin Panel' }
    } else {
      // User routes
      if (path === '/user/dashboard') return { title: 'Dashboard', subtitle: 'User Panel' }
      if (path === '/user/perencanaan') return { title: 'Perencanaan', subtitle: 'Rencana konservasi' }
      if (path === '/user/implementasi') return { title: 'Implementasi', subtitle: 'Aksi lapangan' }
      if (path === '/user/monitoring') return { title: 'Monitoring', subtitle: 'Pantau aktivitas' }
      if (path === '/user/evaluasi') return { title: 'Evaluasi', subtitle: 'Evaluasi hasil' }
      if (path === '/user/verifikasi') return { title: 'Verifikasi', subtitle: 'Validasi data' }
      if (path === '/user/settings') return { title: 'Pengaturan', subtitle: 'Konfigurasi akun' }
      if (path === '/user/log-history') return { title: 'Log Aktivitas', subtitle: 'Riwayat aktivitas' }
      return { title: 'Dashboard', subtitle: 'User Panel' }
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "md:hidden sticky top-0 z-20 bg-gradient-to-r from-primary via-primary/95 to-primary-dark dark:from-gray-900 dark:via-gray-900/95 dark:to-gray-900 backdrop-blur-xl",
        "border-b border-primary-light/30 dark:border-gray-700 px-4 py-3 flex items-center justify-between shadow-sm",
        className
      )}
      {...props}
    >
      {/* Left Section - Back Button or Empty */}
      <div className="w-10 flex items-center justify-center flex-shrink-0">
        {showBack && (
          <motion.button
            onClick={handleBack}
            className="p-2 rounded-xl bg-white/10 dark:bg-primary/20 text-white dark:text-primary-light hover:bg-white/20 dark:hover:bg-primary/40 transition-all"
            aria-label="Kembali"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiArrowLeft size={20} />
          </motion.button>
        )}
      </div>

      {/* Center Section - Page Title & Subtitle */}
      <div className="flex-1 text-center min-w-0">
        <h1 className="text-base font-bold text-white truncate">
          {getPageTitle().title}
        </h1>
        <p className="text-xs text-white/80 truncate">
          {getPageTitle().subtitle}
        </p>
      </div>

      {/* Right Section - Logo (Rounded) */}
      <div className="w-10 flex items-center justify-center flex-shrink-0">
        <motion.button
          onClick={handleLogoClick}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 dark:hover:bg-gray-800 transition-all"
          aria-label="Ke halaman utama"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center">
            {/* Logo */}
            <img
              src="/logo/icon-peach.png"
              alt="Peluk Bumi Logo"
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </div>
        </motion.button>
      </div>
    </motion.div>
  )
})

MobileHeader.displayName = "MobileHeader"

export { MobileHeader }

