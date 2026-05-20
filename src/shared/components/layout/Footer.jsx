import { useTheme } from "@/app/context/ThemeContext";
import { FiMail, FiPhone, FiMapPin, FiInstagram } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const footerLinks = [
    { name: "Beranda", href: "/" },
    { name: "Tentang", href: "/about" },
    { name: "Verifikasi", href: "/verifikasi" },
    { name: "FAQ", href: "/faqs" },
    { name: "Login", href: "/login" },
  ];

  return (
    <footer className={`py-12 px-4 sm:px-6 ${
      isDark ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`w-full rounded-3xl border border-white/15 dark:border-primary/10 bg-white/10 dark:bg-green-950/25 backdrop-blur-xl shadow-[0_24px_60px_-32px_rgba(81,118,64,0.45)] p-6 lg:p-8 overflow-hidden`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-6 mb-6">
            {/* Brand Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="col-span-1 md:col-span-1 lg:col-span-5"
            >
              <motion.div 
                className="flex items-center gap-3 mb-4"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <motion.img
                  src="/logo/Logotype.png"
                  alt="Peluk Bumi Logo"
                  className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 object-contain"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                />
                <div>
                  <h3 className={`text-xl font-bold ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    PELUK BUMI
                  </h3>
                  <p className={`text-xs ${
                    isDark ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    Environmental Monitoring System
                  </p>
                </div>
              </motion.div>
              <p className={`text-sm leading-relaxed mb-4 text-balance ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Gerakan lingkungan yang sedang bertumbuh melalui aksi nyata dan transparansi proses dokumentasi.
              </p>
              <motion.div 
                className="flex gap-3"
                whileHover={{ gap: 4 }}
                transition={{ duration: 0.2 }}
              >
                <motion.a 
                  href="https://instagram.com/pelukbumi" 
                  className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                    isDark ? 'bg-white/10' : 'bg-gray-200/50'
                  } animate-pulse transition-transform hover:scale-110`}
                  whileHover={{ scale: 1.15 }}
                  transition={{ duration: 0.2 }}
                >
                  <FiInstagram className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                </motion.a>
              </motion.div>
            </motion.div>

            {/* Navigation Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="col-span-1 lg:col-span-2"
            >
              <h4 className={`font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Navigasi
              </h4>
                <ul className="space-y-3 md:space-y-2">
                {footerLinks.map((link, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <motion.a 
                      href={link.href} 
                      className={`text-sm transition-colors hover:text-primary inline-block relative ${
                        isDark ? 'text-gray-400' : 'text-gray-600'
                      }`}
                      whileHover={{ x: 5, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <motion.span
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary origin-left"
                        initial={{ scaleX: 0 }}
                        whileHover={{ scaleX: 1 }}
                        transition={{ duration: 0.2 }}
                      />
                      <motion.span
                        className="block"
                        whileHover={{ fontWeight: 500 }}
                        transition={{ duration: 0.2 }}
                      >
                        {link.name}
                      </motion.span>
                    </motion.a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Contact Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
                className="col-span-2 md:col-span-1 lg:col-span-5"
            >
              <h4 className={`font-semibold mb-4 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                Hubungi Kami
              </h4>
              <div className="space-y-1.5">
                <motion.a 
                  href="mailto:pelukbumi.community@gmail.com" 
                  className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors hover:bg-primary/10 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                  whileHover={{ scale: 1.05, x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-gray-300/50'} animate-pulse`}
                    whileHover={{ rotate: 15 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FiMail className={`w-4 h-4 shrink-0 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                  </motion.div>
                  <span className="text-sm">info@pelukbumi.id</span>
                </motion.a>
                <motion.a 
                  href="https://wa.me/628210241565?text=Halo%20Peluk%20Bumi,%20saya%20ingin%20bertanya%20terkait%20program%20dan%20kolaborasi."
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors hover:bg-primary/10 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                  whileHover={{ scale: 1.05, x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-gray-300/50'} animate-pulse`}
                    whileHover={{ rotate: -15 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FiPhone className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                  </motion.div>
                  <span className="text-sm">+62 821 024 1565</span>
                </motion.a>
                <motion.a 
                  href="https://maps.app.goo.gl/Tqh5drnH91jDVf4E7" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors hover:bg-primary/10 ${
                    isDark ? 'text-gray-400' : 'text-gray-600'
                  }`}
                  whileHover={{ scale: 1.05, x: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className={`w-8 h-8 shrink-0 rounded-lg flex items-center justify-center ${isDark ? 'bg-white/10' : 'bg-gray-300/50'} animate-pulse`}
                    whileHover={{ rotate: -15 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <FiMapPin className={`w-4 h-4 ${isDark ? 'text-white' : 'text-gray-900'}`} />
                  </motion.div>
                  <span className="text-sm text-balance">Komplek Guruminda, Jl. Purba Kencana No.28 Blok A, Cisaranten Kulon, Kec. Arcamanik, Kota Bandung, Jawa Barat 40273</span>
                </motion.a>
              </div>
            </motion.div>
          </div>

          {/* Bottom Section */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className={`pt-6 border-t ${
              isDark ? 'border-gray-700' : 'border-gray-200'
            }`}
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
              <p className={`text-sm font-bold ${
                isDark ? 'text-gray-500' : 'text-gray-500'
              }`}>
                © {currentYear} <span className="text-primary font-extrabold">Peluk Bumi</span>. Gerakan konservasi berbasis dokumentasi terbuka.
              </p>
              <motion.div 
                className="flex gap-4 text-sm flex-wrap justify-center md:justify-end"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                {['kebijakan-privasi', 'syarat-ketentuan', 'lisensi'].map((link, index) => (
                  <motion.a
                    key={link}
                    href={`/${link}`}
                    className={`transition-colors hover:text-primary px-2 ${
                      isDark ? 'text-gray-400' : 'text-gray-600'
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -2 }}
                    whileHoverTransition={{ type: "spring", stiffness: 300 }}
                  >
                    {link.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
}
