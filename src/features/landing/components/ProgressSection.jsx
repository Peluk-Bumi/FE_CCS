import React from "react";
import { FiActivity, FiMapPin, FiDatabase, FiUsers, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import PageTitle from "@/shared/components/common/PageTitle";

export default function ProgressSection({ theme }) {
  const progressItems = [
    {
      label: "Kampanye sedang berjalan",
      description: "Program konservasi aktif di lapangan",
      icon: FiActivity,
      status: "Aktif"
    },
    {
      label: "Lokasi aksi awal sedang dipetakan",
      description: "Verifikasi area konservasi",
      icon: FiMapPin,
      status: "Dalam proses"
    },
    {
      label: "Sistem Peluk Bumi sedang diimplementasikan",
      description: "Monitoring berbasis data",
      icon: FiDatabase,
      status: "Dalam proses"
    },
    {
      label: "Kolaborasi awal sedang diformalkan",
      description: "Bersama stakeholder pendukung",
      icon: FiUsers,
      status: "Dalam proses"
    }
  ];

  return (
    <section className={`py-10 sm:py-12 md:py-16 transition-colors ${
      theme === 'dark'
        ? 'bg-gradient-to-b from-green-950 via-gray-950 to-green-950'
        : 'bg-gradient-to-b from-white via-primary/10 to-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageTitle
          type="section"
          theme={theme}
          badge="Progress in Motion"
          title="Perkembangan Saat Ini"
          description="Data akan berkembang seiring setiap aksi yang terekam di lapangan"
        />

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {progressItems.map((item, index) => (
            <motion.div
              key={index}
              className={`group relative rounded-2xl p-6 transition-all border overflow-hidden ${
                theme === 'dark'
                  ? 'bg-green-950/35 border-green-800/40 hover:bg-green-900/35 hover:border-green-700/50'
                  : 'bg-white/85 border-primary/20 hover:bg-primary/10 hover:border-primary/40'
              }`}
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${
                theme === 'dark'
                  ? 'from-primary/5 to-transparent'
                  : 'from-primary/5 to-transparent'
              } opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div className="relative flex items-center gap-4">
                <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all ${
                  theme === 'dark'
                    ? 'bg-primary/20 border border-primary/30 group-hover:bg-primary/30'
                    : 'bg-primary/10 border border-primary/30 group-hover:bg-primary/20'
                }`}>
                  <item.icon className={`w-7 h-7 transition-colors ${
                    theme === 'dark' ? 'text-primary-light' : 'text-primary'
                  }`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className={`text-lg font-semibold transition-colors ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {item.label}
                    </h3>
                    <span className={`text-xs text-center translate-y-1 font-medium px-2 py-1 rounded-full ${
                      theme === 'dark'
                        ? 'bg-primary/20 text-primary-light'
                        : 'bg-primary/10 text-primary'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className={`text-sm transition-colors ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </div>

              <motion.div
                className={`absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-primary to-primary-dark group-hover:w-full transition-all duration-500`}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

