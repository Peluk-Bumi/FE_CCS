import React from 'react';
import PageTitle from '@/shared/components/common/PageTitle';
import { FAQList } from '@/shared/components/common';
import Navbar from '@/shared/components/layout/Navbar';
import Footer from '@/shared/components/layout/Footer';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.04, duration: 0.4 } },
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-6">
        <motion.div initial="hidden" animate="show" variants={container}>
          <div className="text-center">
            <PageTitle title="FAQ" subtitle="Pertanyaan Umum dan Jawaban" />
            <p className="mt-2 text-sm text-gray-600">Kumpulan jawaban cepat untuk membantu Anda menggunakan aplikasi.</p>
          </div>

          <motion.div className="mt-8 bg-white rounded-2xl shadow-md p-6 border border-gray-100" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <FAQList showSearch={true} groupByCategory={true} className="" />
          </motion.div>
        </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
