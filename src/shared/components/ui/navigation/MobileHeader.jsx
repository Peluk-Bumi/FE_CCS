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
  
  // Check roles and routes
  const isAdmin = user?.role === 'admin'
  const isAdminRoute = location.pathname.startsWith('/admin')
  const isUserRoute = location.pathname.startsWith('/user')
  const isDashboard = location.pathname === '/user/dashboard' || location.pathname === '/admin/dashboard'
  
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
      if (path === '/admin/dashboard') return 'Dashboard Admin'
      if (path === '/admin/users') return 'Kelola Pengguna'
      if (path === '/admin/perencanaan') return 'Perencanaan'
      if (path === '/admin/implementasi') return 'Implementasi'
      if (path === '/admin/laporan') return 'Laporan'
      if (path === '/admin/monitoring') return 'Monitoring'
      if (path === '/admin/evaluasi') return 'Evaluasi'
      if (path === '/admin/verifikasi') return 'Verifikasi'
      if (path === '/admin/settings') return 'Pengaturan'
      return 'Dashboard Admin'
    } else {
      // User routes
      if (path === '/user/dashboard') return 'Dashboard'
      if (path === '/user/implementasi') return 'Implementasi'
      if (path === '/user/monitoring') return 'Monitoring'
      if (path === '/user/evaluasi') return 'Evaluasi'
      if (path === '/user/verifikasi') return 'Verifikasi'
      if (path === '/user/settings') return 'Pengaturan'
      if (path.startsWith('/user/perencanaan')) return 'Perencanaan'
      return 'Dashboard'
    }
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "md:hidden sticky top-0 z-20 bg-primary/90 dark:bg-gray-900/80 backdrop-blur-xl",
        "border-b border-primary-light dark:border-gray-700 px-4 py-3 flex items-center justify-between shadow-sm",
        className
      )}
      {...props}
    >
      {/* Left Section - Back Button or Empty */}
      <div className="w-10 flex items-center justify-center">
        {(!isDashboard || (isAdminRoute && location.pathname !== '/admin/dashboard')) && (
          <motion.button
            onClick={handleBack}
            className="p-2 rounded-xl bg-white/10 dark:bg-primary/20 text-peach dark:text-primary-light hover:bg-white/20 dark:hover:bg-primary/40 transition-all"
            aria-label="Kembali"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FiArrowLeft size={20} />
          </motion.button>
        )}
      </div>

      {/* Center Section - Page Title */}
      <div className="flex-1 text-center">
        <h1 className="text-lg font-bold bg-gradient-to-r from-white to-peach bg-clip-text text-transparent">
          {getPageTitle()}
        </h1>
      </div>

      {/* Right Section - Logo */}
      <div className="w-10 flex items-center justify-center">
        <motion.button
          onClick={handleLogoClick}
          className="p-2 rounded-xl hover:bg-white/10 dark:hover:bg-gray-800 transition-all"
          aria-label="Ke halaman utama"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center">
            {/* Logo */}
            <img
              src="/logo/icon-peach.png"
              alt="Peluk Bumi Logo"
              className="relative z-10 object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-[1.06] group-hover:rotate-3"
            />
          </div>
        </motion.button>
      </div>
    </motion.div>
  )
})

MobileHeader.displayName = "MobileHeader"

export { MobileHeader }

