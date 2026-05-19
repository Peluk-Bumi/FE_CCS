import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CTAButton } from "@/shared/components/ui/button/CTAButton";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";

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
            className="flex flex-col md:flex-row gap-4 justify-center items-center md:max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="w-full md:w-auto">
              <CTAButton
                type="primary"
                icon={<FiArrowRight />}
                onClick={() => navigate("/register")}
              >
                Mulai Berproses Bersama
              </CTAButton>
            </div>

            <div className="w-full md:w-auto">
              <CTAButton
                type="secondary"
                icon={<FiCheckCircle />}
                onClick={() => navigate("/verifikasi")}
              >
                Lihat Proses Berjalan
              </CTAButton>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
