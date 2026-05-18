import React from "react";
import { motion } from "framer-motion";
import { FiUserPlus, FiLayout, FiFileText, FiCheckCircle, FiDatabase, FiFile } from "react-icons/fi";
import PageTitle from "@/shared/components/common/PageTitle";

export default function HowItWorksSection({ theme }) {
  const steps = [
    {
      number: "1",
      title: "Mulai Proses",
      description: "Bergabung dalam gerakan konservasi berbasis dokumentasi",
      icon: FiUserPlus
    },
    {
      number: "2",
      title: "Rencana Aksi",
      description: "Tentukan lokasi dan jenis aktivitas konservasi",
      icon: FiLayout
    },
    {
      number: "3",
      title: "Dokumentasi Lapangan",
      description: "Catat setiap aktivitas dan perkembangan di lokasi",
      icon: FiFileText
    },
    {
      number: "4",
      title: "Monitoring Berkelanjutan",
      description: "Pantau perkembangan dan evaluasi proses konservasi",
      icon: FiCheckCircle
    },
    {
      number: "5",
      title: "Validasi Terbuka",
      description: "Proses validasi data yang dapat diakses publik",
      icon: FiDatabase
    },
    {
      number: "6",
      title: "Belajar Bersama",
      description: "Bagikan pembelajaran dan pengembangan proses",
      icon: FiFile
    }
  ];

  return (
    <section className={`py-24 transition-colors ${
      theme === 'dark'
        ? 'bg-green-950'
        : 'bg-gray-50'
    }`}>
      <div className="max-w-7xl mx-auto px-6">
        <PageTitle
          type="section"
          theme={theme}
          badge="Proses"
          title="Perjalanan Konservasi"
          description="Dari perencanaan hingga pembelajaran berkelanjutan"
          subtitle="Setiap langkah terdokumentasi untuk transparansi proses"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className={`p-6 rounded-xl border transition-all ${
                theme === 'dark'
                  ? 'bg-gray-900 border-green-800 hover:border-primary'
                  : 'bg-white border-gray-200 hover:border-primary'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4">
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-primary">
                    <step.icon className={`w-7 h-7 ${theme === 'dark' ? 'text-white' : 'text-white'}`} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold bg-white text-primary border-2 border-primary">
                    {step.number}
                  </div>
                </div>
                <h3 className={`text-base font-bold mb-2 ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {step.title}
                </h3>
                <p className={`text-sm leading-relaxed ${
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

