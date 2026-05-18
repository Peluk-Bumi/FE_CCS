import React from "react";
import { motion } from "framer-motion";
import { FiCheck, FiClock, FiTarget, FiTrendingUp } from "react-icons/fi";
import PageTitle from "@/shared/components/common/PageTitle";

export default function TimelineSection({ theme }) {
  const phases = [
    {
      step: "1",
      title: "Perencanaan Awal",
      description: "Identifikasi lokasi dan perencanaan aktivitas konservasi bersama komunitas",
      icon: FiCheck,
      progress: 85,
      status: "Sedang berjalan"
    },
    {
      step: "2",
      title: "Dokumentasi Lapangan",
      description: "Pencatatan aktivitas dan monitoring perkembangan di lokasi konservasi",
      icon: FiClock,
      progress: 60,
      status: "Sedang berjalan"
    },
    {
      step: "3",
      title: "Pembelajaran Bersama",
      description: "Evaluasi proses dan berbagi pembelajaran dengan stakeholder",
      icon: FiTarget,
      progress: 40,
      status: "Dalam pengembangan"
    },
    {
      step: "4",
      title: "Perluasan Kolaborasi",
      description: "Mengundang lebih banyak pihak untuk terlibat dalam proses konservasi",
      icon: FiTrendingUp,
      progress: 20,
      status: "Rencana"
    }
  ];

  return (
    <section className={`py-16 sm:py-20 md:py-24 relative overflow-hidden transition-colors ${
      theme === 'dark'
        ? 'bg-gradient-to-b from-green-950 via-gray-950 to-green-950'
        : 'bg-gradient-to-b from-white via-primary/10 to-white'
    }`}>
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 right-10 w-72 h-72 rounded-full blur-3xl animate-float ${
          theme === 'dark' ? 'bg-primary/10' : 'bg-primary/20'
        }`}></div>
        <div className={`absolute bottom-20 left-10 w-96 h-96 rounded-full blur-3xl animate-float ${
          theme === 'dark' ? 'bg-primary-dark/10' : 'bg-primary-dark/20'
        }`} style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageTitle
          type="section"
          theme={theme}
          badge="Proses"
          title="Perjalanan Kami"
          description="Tahapan perkembangan gerakan konservasi berbasis dokumentasi"
          align="center"
        />
        <p className={`text-lg font-medium ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>Transparansi dalam setiap tahap proses konservasi</p>

        <div className="space-y-8 mt-16">
          {phases.map((phase, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              {/* Progress bar container */}
              <div className={`p-6 rounded-2xl backdrop-blur-md border ${
                theme === 'dark'
                  ? 'bg-white/10 border-white/20'
                  : 'bg-black/10 border-black/20'
              }`}>
                <div className="flex items-center gap-4 mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    phase.status === 'Selesai' ? 'bg-green-500' : 'bg-primary'
                  }`}>
                    <phase.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-lg font-bold ${
                        theme === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}>
                        {phase.title}
                      </h3>
                      <span className={`text-sm font-medium ${
                        phase.status === 'Selesai'
                          ? 'text-green-500'
                          : phase.status === 'Sedang berjalan'
                          ? 'text-primary'
                          : 'text-gray-500'
                      }`}>
                        {phase.progress}%
                      </span>
                    </div>
                    <p className={`text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      {phase.description}
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className={`h-3 rounded-full overflow-hidden ${
                  theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <motion.div
                    className={`h-full rounded-full ${
                      phase.status === 'Selesai' ? 'bg-green-500' : 'bg-primary'
                    }`}
                    initial={{ width: 0 }}
                    whileInView={{ width: `${phase.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.2 + 0.3 }}
                    viewport={{ once: true }}
                  />
                </div>

                {/* Status badge */}
                <div className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-medium ${
                  phase.status === 'Selesai'
                    ? 'bg-green-500/20 text-green-600'
                    : phase.status === 'Sedang berjalan'
                    ? 'bg-primary/20 text-primary'
                    : 'bg-gray-500/20 text-gray-600'
                }`}>
                  {phase.status}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

