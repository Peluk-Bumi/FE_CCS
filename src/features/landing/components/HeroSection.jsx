import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowRight, FiPlay, FiFeather, FiZap, FiShield, FiHeart, FiUsers, FiGlobe } from "react-icons/fi";
import { motion } from "framer-motion";
import { CTAButton } from "@/shared/components/ui/button/CTAButton";

export default function HeroSection({ theme, scrollToSection }) {
  const navigate = useNavigate();

  const heroBackgroundClass = theme === "dark"
    ? "absolute inset-0 bg-[linear-gradient(rgba(4,120,87,0.45),rgba(2,6,23,0.52)),linear-gradient(rgba(6,95,70,0.30),rgba(6,95,70,0.30)),url('/images/login-bg.jpg')] bg-cover bg-center bg-no-repeat bg-blend-overlay opacity-60"
    : "absolute inset-0 bg-[linear-gradient(rgba(236,253,245,0.78),rgba(255,255,255,0.58)),linear-gradient(rgba(16,185,129,0.10),rgba(16,185,129,0.10)),url('/images/login-bg.jpg')] bg-cover bg-center bg-no-repeat bg-blend-screen opacity-40";

  return (
    <section id="home" className="relative pt-20 sm:pt-24 md:pt-28 pb-8 sm:pb-10 min-h-[70vh] flex items-start overflow-hidden">
      {/* Background - Responsive to theme */}
      <div className="absolute inset-0">
        <div className={heroBackgroundClass} />
        
        {/* Floating Elements - Color changes with theme */}
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className={`absolute w-2 h-2 rounded-full ${
              theme === 'dark' 
                ? 'bg-primary' 
                : 'bg-primary/20'
            }`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        <div className="w-full rounded-3xl border border-white/15 dark:border-primary/10 bg-white/10 dark:bg-green-950/25 backdrop-blur-xl shadow-[0_24px_60px_-32px_rgba(81,118,64,0.45)] p-5 sm:p-6 lg:p-7 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 lg:gap-8 items-center w-full">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge - Theme adaptive */}
            <motion.div
              className={`inline-flex items-center rounded-full px-4 py-2 text-sm mb-6 border ring-1 transition-all duration-300 ${
                theme === 'dark'
                  ? 'bg-primary/35 backdrop-blur-2xl backdrop-saturate-150 border-primary/20 ring-primary/10 shadow-[0_12px_40px_-18px_rgba(81,118,64,0.65)]'
                  : 'bg-white/42 backdrop-blur-2xl backdrop-saturate-150 border-white/55 ring-primary/70 shadow-[0_10px_30px_-18px_rgba(81,118,64,0.40)]'
              }`}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05, y: -1 }}
            >
              <FiFeather className="mr-2 text-primary" />
              <span className={`font-medium ${
                theme === 'dark'
                  ? 'text-primary-light'
                  : 'text-primary'
              }`}>
                Gerakan Lingkungan yang Sedang Bertumbuh
              </span>
              <div className="ml-2 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className={`text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-5 transition-colors ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <span>Sistem Monitoring Konservasi</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              className={`text-base sm:text-lg mb-4 leading-relaxed transition-colors ${
                theme === 'dark'
                  ? 'text-gray-300'
                  : 'text-gray-600'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              Gerakan lingkungan yang sedang bertumbuh melalui aksi nyata dan transparansi data
            </motion.p>

            {/* Tagline */}
            <motion.p
              className={`text-sm sm:text-base mb-4 font-semibold transition-colors ${
                theme === 'dark'
                  ? 'text-primary-light'
                  : 'text-primary'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.8 }}
            >
              Tanam • Rawat • Pantau
            </motion.p>

            {/* Context Info */}
            <motion.p
              className={`text-sm mb-7 leading-relaxed transition-colors ${
                theme === 'dark'
                  ? 'text-gray-400'
                  : 'text-gray-500'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Didukung sistem monitoring berbasis data. Sedang menjalankan campaign kami.
            </motion.p>

            {/* Key Points - Theme adaptive */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55, duration: 0.8 }}
            >
              {[
                { icon: FiZap, text: "Transparansi data" },
                { icon: FiShield, text: "Aksi terukur" },
                { icon: FiHeart, text: "Dapat dipantau" },
                { icon: FiUsers, text: "Kolaborasi terbuka" }
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-3"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      theme === 'dark'
                        ? 'bg-green-950/40 text-primary-light'
                        : 'bg-primary/20 text-primary'
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className={`font-medium transition-colors ${
                      theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                    }`}>
                      {item.text}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <CTAButton
                icon={<FiArrowRight />}
                onClick={() => navigate("/register")}
              >
                Mulai Gratis Sekarang
              </CTAButton>
              
              <motion.button
                onClick={() => scrollToSection("#features")}
                className={`px-8 py-4 font-medium rounded-xl shadow-lg hover:shadow-xl transition-all border flex items-center justify-center group ${
                  theme === 'dark'
                    ? 'bg-green-950/35 hover:bg-green-900/45 text-gray-100 border-white/10 backdrop-blur-xl'
                    : 'bg-white/80 hover:bg-white text-gray-700 border-primary/20 backdrop-blur-xl'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiPlay className="mr-2 group-hover:scale-110 transition-transform" />
                Selengkapnya
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.p
              className={`text-sm mt-6 transition-colors ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
            </motion.p>
          </motion.div>

          {/* Right Content - Dashboard Preview */}
          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="relative">
              {/* Main Dashboard Card */}
              <motion.div
                className={`rounded-2xl shadow-2xl overflow-hidden border transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                }`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className={`flex items-center justify-between p-4 border-b transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-700/50 border-gray-600'
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <h3 className={`font-semibold transition-colors ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    Sistem Monitoring EMS
                  </h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  </div>
                </div>
                
                {/* Image Dashboard */}
                <div className="relative h-72 sm:h-80 lg:h-96 overflow-hidden">
                  <motion.img
                    src="/images/login-bg.jpg"
                    alt="Dashboard Preview"
                    className={`w-full h-full object-cover transition-opacity ${
                      theme === 'dark' ? 'opacity-70' : 'opacity-100'
                    }`}
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                  />
                  {/* Overlay gradient */}
                  <div className={`absolute inset-0 ${
                    theme === 'dark'
                      ? 'bg-gradient-to-t from-gray-900/50 via-transparent to-transparent'
                      : 'bg-gradient-to-t from-primary/30 via-transparent to-transparent'
                  }`}></div>

                  {/* Stats overlay - reflecting early-stage development */}
                  <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6`}>
                    <div className="text-center">
                      <motion.div
                        className="text-white"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <div className="text-lg md:text-xl font-bold">Sedang Berkembang</div>
                        <div className="text-xs text-primary-light">Sistem monitoring aktivitas lapangan</div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Cards - Theme adaptive */}
              <motion.div
                className={`absolute -top-4 -right-4 rounded-lg shadow-lg p-3 border backdrop-blur-sm transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                }`}
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className={`text-xs transition-colors ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Aktivitas Terbaru
                </div>
                <div className={`text-sm font-semibold transition-colors ${
                  theme === 'dark' ? 'text-primary-light' : 'text-primary'
                }`}>
                  +5 Dokumentasi
                </div>
              </motion.div>

              <motion.div
                className={`absolute -bottom-4 -left-4 rounded-lg shadow-lg p-3 border backdrop-blur-sm transition-colors ${
                  theme === 'dark'
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                }`}
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
              >
                <div className={`text-xs transition-colors ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  Terverifikasi
                </div>
                <div className={`text-sm font-semibold transition-colors ${
                  theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  Integritas Data
                </div>
              </motion.div>
            </div>
          </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
