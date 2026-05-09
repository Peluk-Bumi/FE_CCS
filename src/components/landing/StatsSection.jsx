import React from "react";
import { FiUsers, FiTrendingUp, FiStar, FiShield } from "react-icons/fi";
import { motion } from "framer-motion";

export default function StatsSection({ theme }) {
  const stats = [
    { label: "Pengguna Aktif", value: "10K+", icon: FiUsers },
    { label: "Proyek Selesai", value: "500+", icon: FiTrendingUp },
    { label: "Rating Kepuasan", value: "4.9/5", icon: FiStar },
    { label: "Tahun Pengalaman", value: "5+", icon: FiShield }
  ];

  return (
    <section className={`py-10 sm:py-12 md:py-16 transition-colors ${
      theme === 'dark'
        ? 'bg-green-950/40'
        : 'bg-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className={`text-center group rounded-2xl p-5 transition-all border ${
                theme === 'dark'
                  ? 'bg-green-950/35 border-green-800/40 hover:bg-green-900/35'
                  : 'bg-white/85 border-primary/20 hover:bg-primary/10'
              }`}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-shadow">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
              <div className={`text-3xl font-bold mb-2 transition-colors ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {stat.value}
              </div>
              <div className={`transition-colors ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
