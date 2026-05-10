import React from "react";
import { motion } from "framer-motion";
import PageTitle from "@/shared/components/PageTitle";
import PartnerCard from "./PartnerCard";


export default function PartnershipSection({ theme }) {
  const partners = {
    academic: [
      { name: "IWU", logo: "/partnership/Logo_Universitas_Wanita_Internasional.svg", alt: "IWU Campus Logo", imageSize: "h-[5.5rem]" },
    ],
    government: [
      { name: "Kemendistekdikti", logo: "/partnership/diktisaintek-berdampak.png", alt: "Kemendiktisaintek Logo", imageSize: "h-[4.5rem]" },
    ],
    partners: [
      { name: "Yayasan Sadaya Inspirasi Negeri", logo: "/partnership/Yayasan Sadaya Logo_Horizontal-comp.png", alt: "Sadaya Logo" },
      { name: "Pemuda Nusantara Digital Kreatif", logo: "/partnership/PDK_logo.png", alt: "PNDK Logo" },
      { name: "Seputar Legal", logo: "/partnership/seputar-legal.png", alt: "Seputar Legal Logo" },
    ],
    supported: [
      { name: "Next Cube Digital", logo: "/partnership/nexcube-digital.png", alt: "Next Cube Logo" },
      { name: "Elevate Studios", logo: "/partnership/Logo elevate studios.png", alt: "Elevate Logo", imageSize: "h-10" },
      { name: "Wylkpy Creative Collective", logo: "/partnership/Wylpky 2.0 logo.png", alt: "Wylkpy Logo", imageSize: "h-9" },
      { name: "Maulia and Partners", logo: "/partnership/maulia-logo.png", alt: "Maulia Logo" },
      { name: "Gen Wirausaha Milenial", logo: "/partnership/Logo GenW.png", alt: "Gen Wirausaha Logo" },
    ]
  };

  return (
    <section className={`py-16 sm:py-20 md:py-24 transition-colors ${
      theme === 'dark'
        ? 'bg-gradient-to-b from-green-950 via-gray-950 to-green-950'
        : 'bg-gradient-to-b from-white via-primary/5 to-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageTitle
          type="section"
          theme={theme}
          badge="Kolaborasi Penelitian"
          title="Institusi Pendukung"
          description="Berkolaborasi dengan institusi terkemuka untuk pengembangan berkelanjutan"
        />

        <div className="space-y-12 ">
          {/* Academic & Government - Top Row */}
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <h3 className={`text-lg font-semibold mb-4 transition-colors ${
                theme === 'dark' ? 'text-primary-light' : 'text-primary'
              }`}>
                Institusi Pemerintah
              </h3>
              <div className="flex flex-wrap justify-center gap-6">
                {partners.government.map((partner, index) => (
                  <PartnerCard 
                    key={index}
                    partner={partner} 
                    index={index}
                    className="p-4"
                  />
                ))}
              </div>
            </div>
            
            <div className="text-center">
              <h3 className={`text-lg font-semibold mb-4 transition-colors ${
                theme === 'dark' ? 'text-primary-light' : 'text-primary'
              }`}>
                Institusi Akademik
              </h3>
              <div className="flex flex-wrap justify-center gap-6">
                {partners.academic.map((partner, index) => (
                  <PartnerCard 
                    key={index}
                    partner={partner} 
                    index={index}
                    className="p-4"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Partners & Supported - Bottom Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <h3 className={`text-lg font-semibold mb-4 transition-colors ${
                theme === 'dark' ? 'text-primary-light' : 'text-primary'
              }`}>
                Mitra Kerjasama
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {partners.partners.map((partner, index) => (
                  <PartnerCard 
                    key={index}
                    partner={partner} 
                    index={index}
                  />
                ))}
              </div>
            </div>

            <div className="text-center">
              <h3 className={`text-lg font-semibold mb-4 transition-colors ${
                theme === 'dark' ? 'text-primary-light' : 'text-primary'
              }`}>
                Didukung Oleh
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {partners.supported.map((partner, index) => (
                  <PartnerCard 
                    key={index}
                    partner={partner} 
                    index={index}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
