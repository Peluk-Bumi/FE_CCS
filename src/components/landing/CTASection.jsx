import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function CTASection({ theme }) {
  const navigate = useNavigate();

  return (
    <section className="py-14 sm:py-18 md:py-24 relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          className={`mx-auto max-w-5xl rounded-3xl backdrop-blur-2xl backdrop-saturate-150 px-6 sm:px-10 lg:px-12 py-10 sm:py-12 ${
            theme === 'dark'
              ? 'border border-white/25 bg-white/10 shadow-[0_30px_80px_-28px_rgba(0,0,0,0.65)]'
              : 'border border-primary/50 bg-primary/75 shadow-[0_24px_55px_-28px_rgba(81,118,64,0.30)]'
          }`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 tracking-tight ${
            theme === 'dark' ? 'text-white' : 'text-primary'
          }`}>
            Siap Memulai Revolusi Konservasi?
          </h2>
          <p className={`text-base sm:text-lg md:text-xl mb-7 sm:mb-9 max-w-3xl mx-auto leading-relaxed ${
            theme === 'dark' ? 'text-primary-light/90' : 'text-primary/80'
          }`}>
            Bergabunglah dengan ribuan organisasi yang telah mempercayakan proyek konservasi mereka pada platform kami
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-8">
            <motion.button
              onClick={() => navigate("/register")}
              className="px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-2xl shadow-[0_16px_30px_-18px_rgba(81,118,64,0.45)] hover:shadow-[0_22px_38px_-18px_rgba(81,118,64,0.55)] transition-all text-sm sm:text-base border border-primary/60"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Mulai Sekarang
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
