import React from "react";
import { FiLink, FiFileText, FiGlobe, FiBarChart2, FiCheck } from "react-icons/fi";
import { motion } from "framer-motion";

export default function FeaturesSection({ theme }) {
  const features = [
    {
      title: "Blockchain Recording",
      description: "Sistem pencatatan data menggunakan teknologi blockchain untuk transparansi dan keamanan data yang tidak dapat diubah.",
      icon: FiLink,
      gradient: "from-primary to-primary-dark",
      glowColor: "rgba(81, 118, 64, 0.3)",
      benefits: ["Data immutable", "Transparansi penuh", "Audit trail lengkap"]
    },
    {
      title: "Smart Contracts",
      description: "Otomatisasi proses verifikasi dan validasi data menggunakan smart contract untuk menjamin integritas sistem.",
      icon: FiFileText,
      gradient: "from-primary to-primary-dark",
      glowColor: "rgba(34, 197, 94, 0.3)",
      benefits: ["Verifikasi otomatis", "Validasi real-time", "Kontrak digital"]
    },
    {
      title: "Distributed Ledger",
      description: "Penyimpanan data tersebar dengan sistem ledger yang memastikan keamanan dan aksesibilitas data konservasi.",
      icon: FiGlobe,
      gradient: "from-primary to-primary-dark",
      glowColor: "rgba(81, 118, 64, 0.3)",
      benefits: ["Sinkronisasi multi-node", "Backup otomatis", "High availability"]
    },
    {
      title: "Crypto Analytics",
      description: "Analisis data konservasi dengan teknologi blockchain analytics untuk insights yang lebih mendalam dan terverifikasi.",
      icon: FiBarChart2,
      gradient: "from-primary to-primary-dark",
      glowColor: "rgba(13, 148, 136, 0.3)",
      benefits: ["Data terenkripsi", "Analytics on-chain", "Reporting terverifikasi"]
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
        {/* Section Header */}
        <motion.div 
          className="text-center mb-14 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className={`text-4xl md:text-5xl font-extrabold mb-6 leading-tight transition-colors ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            Teknologi{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-primary via-primary-dark to-primary bg-clip-text text-transparent">
                Blockchain
              </span>
            </span>
            <br />untuk Konservasi
          </h2>
          
          <p className={`text-lg md:text-xl max-w-3xl mx-auto leading-relaxed transition-colors ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Sistem pencatatan data konservasi yang <span className="font-semibold">transparan</span>, <span className="font-semibold">aman</span>, dan <span className="font-semibold">tidak dapat diubah</span> menggunakan teknologi blockchain terdepan
          </p>
        </motion.div>

        {/* Features Grid - Theme adaptive */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative h-full"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className={`absolute inset-0 bg-gradient-to-br rounded-3xl transition-all duration-500 ${
                theme === 'dark'
                  ? 'from-gray-800 to-gray-700/50'
                  : 'from-white to-gray-50'
              }`}></div>
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-3xl transition-all duration-500`}></div>
              
              <div className={`relative h-full rounded-3xl p-6 md:p-7 border transition-all duration-500 shadow-lg group-hover:shadow-2xl flex flex-col ${
                theme === 'dark'
                  ? 'bg-green-950/70 backdrop-blur-xl border-green-800/50 group-hover:border-green-700/60'
                  : 'bg-white/80 backdrop-blur-xl border-gray-200/50 group-hover:border-gray-300/50'
              }`}>
                {/* Content */}
                <div className="flex items-start gap-5 mb-5">
                  <motion.div 
                    className="relative flex-shrink-0"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className={`w-20 h-20 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-xl`}>
                      <feature.icon className="w-9 h-9 text-white" />
                    </div>
                  </motion.div>
                  
                  <div className="flex-1 min-h-[120px] md:min-h-[132px]">
                    <h3 className={`text-xl md:text-2xl font-bold mb-3 transition-colors ${
                      theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                      {feature.title}
                    </h3>
                    <p className={`leading-relaxed transition-colors ${
                      theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                    }`}>
                      {feature.description}
                    </p>
                  </div>
                </div>
                
                {/* Benefits */}
                <div className="space-y-3 mt-auto pt-2">
                  {feature.benefits.map((benefit, i) => (
                    <motion.div
                      key={i}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * i }}
                      viewport={{ once: true }}
                    >
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center flex-shrink-0 shadow-md`}>
                        <FiCheck className="w-3 h-3 text-white" />
                      </div>
                      <span className={`text-sm font-medium transition-colors ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        {benefit}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
