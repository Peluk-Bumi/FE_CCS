import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function CTASection({ theme }) {
  const navigate = useNavigate();

  return (
    <section className={`py-24 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
    }`}>
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Bersama Membangun Proses Terbuka
          </h2>
          <p className={`text-lg mb-12 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Kami mengundang Anda untuk terlibat dalam proses konservasi yang dapat dipantau, dipelajari, dan dikembangkan bersama
          </p>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-3 bg-primary text-white font-semibold rounded-2xl hover:bg-primary-dark transition-colors"
            >
              Mulai Berproses Bersama
            </button>

            <button
              onClick={() => navigate("/verifikasi")}
              className={`px-8 py-3 font-semibold rounded-2xl border-2 transition-colors ${
                theme === 'dark'
                  ? 'border-white text-white hover:bg-white hover:text-gray-900'
                  : 'border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white'
              }`}
            >
              Lihat Proses Berjalan
            </button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
