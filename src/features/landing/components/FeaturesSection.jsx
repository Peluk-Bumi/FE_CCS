import React from "react";
import { FiLink, FiFileText, FiGlobe, FiBarChart2, FiCheck, FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import PageTitle from "@/shared/components/common/PageTitle";

export default function FeaturesSection({ theme }) {
  const features = [
    {
      title: "Dokumentasi Aktivitas",
      description: "Sistem pencatatan terbuka berbasis blockchain untuk setiap aktivitas konservasi. Membantu proses monitoring dan evaluasi berkelanjutan dengan teknologi distributed ledger.",
      icon: FiFileText,
      benefits: ["Proses terdokumentasi", "Data dapat dilacak", "Evaluasi berkelanjutan"]
    },
    {
      title: "Monitoring Lokasi",
      description: "Pemetaan dan monitoring lokasi aktivitas konservasi dengan teknologi GPS dan GIS. Memudahkan tracking perkembangan program di lapangan secara real-time.",
      icon: FiGlobe,
      benefits: ["Pemetaan terbuka", "Tracking real-time", "Visualisasi progres"]
    },
    {
      title: "Validasi Data",
      description: "Sistem validasi data untuk membantu integritas aktivitas. Menggunakan teknologi blockchain dan smart contracts untuk transparansi dan keabsahan data.",
      icon: FiBarChart2,
      benefits: ["Integritas terjaga", "Proses validasi", "Transparansi data"]
    },
    {
      title: "Transparansi Proses",
      description: "Infrastruktur monitoring berbasis web3 dan blockchain untuk membantu transparansi aktivitas lingkungan. Sedang dikembangkan bersama proses lapangan dengan teknologi terdesentralisasi.",
      icon: FiLink,
      benefits: ["Akses terbuka", "Proses jelas", "Pertanggungjawaban"]
    }
  ];

  return (
    <section id="features" className={`py-16 sm:py-24 md:py-28 relative overflow-hidden transition-colors ${
      theme === 'dark'
        ? 'bg-gradient-to-b from-green-950 via-gray-950 to-green-950'
        : 'bg-gradient-to-b from-white via-primary/10 to-white'
    }`}>
      {/* Background blobs - theme adaptive */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-float ${
          theme === 'dark'
            ? 'bg-primary/10'
            : 'bg-primary/20'
        }`}></div>
        <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-float ${
          theme === 'dark'
            ? 'bg-primary-dark/10'
            : 'bg-primary-dark/20'
        }`} style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageTitle
          type="section"
          theme={theme}
          badge="Pendekatan"
          title="Sistem Monitoring"
          description="Infrastruktur pendukung untuk dokumentasi dan transparansi aktivitas lingkungan"
        />

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`relative rounded-2xl p-6 md:p-8 border transition-all duration-500 overflow-hidden ${
                theme === 'dark'
                  ? 'bg-green-950/35 backdrop-blur-xl border-green-800/40 hover:bg-green-900/35 hover:border-green-700/50'
                  : 'bg-white/85 backdrop-blur-xl border-primary/20 hover:bg-primary/10 hover:border-primary/40'
              }`}>
                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Content */}
                <div className="relative">
                  {/* Icon */}
                  <motion.div
                    className={`w-16 h-16 rounded-xl flex items-center justify-center mb-5 transition-all bg-primary`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                  </motion.div>

                  {/* Title */}
                  <h3 className={`text-xl md:text-2xl font-bold mb-3 transition-colors ${
                    theme === 'dark' ? 'text-white' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>

                  {/* Description */}
                  <p className={`text-sm md:text-base leading-relaxed mb-5 transition-colors ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {feature.description}
                  </p>

                  {/* Benefits */}
                  <div className="space-y-2">
                    {feature.benefits.map((benefit, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3"
                      >
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                          theme === 'dark'
                            ? 'bg-primary/20'
                            : 'bg-primary/10'
                        }`}>
                          <FiCheck className={`w-3 h-3 ${
                            theme === 'dark' ? 'text-primary-light' : 'text-primary'
                          }`} />
                        </div>
                        <span className={`text-sm transition-colors ${
                          theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom accent line */}
                <motion.div
                  className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary-dark group-hover:w-full transition-all duration-500`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

