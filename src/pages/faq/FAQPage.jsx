import React from 'react';
import PageTitle from '@/shared/components/common/PageTitle';
import { FAQList } from '@/shared/components/common';
import Navbar from '@/shared/components/layout/Navbar';
import PagePaddingContainer from '@/shared/components/layout/PagePaddingContainer';
import MainContainer from '@/shared/components/layout/MainContainer';
import Footer from '@/shared/components/layout/Footer';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { staggerChildren: 0.04, duration: 0.4 } },
};

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <PagePaddingContainer>
        <MainContainer>
          <motion.div initial="hidden" animate="show" variants={container}>
              <PageTitle 
                title="FAQ" 
                description="Kumpulan jawaban cepat untuk membantu Anda menggunakan aplikasi." 
              />

                <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                  <FAQList showSearch={true} groupByCategory={true} />
                </motion.div>
            </motion.div>
          </MainContainer>
        </PagePaddingContainer>
      <Footer />
    </>
  );
}
