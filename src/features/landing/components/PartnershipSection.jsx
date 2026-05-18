import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageTitle from "@/shared/components/common/PageTitle";
import PartnerCard from "./PartnerCard";
import { loadPartnersData, getDefaultPartnersData } from "@/shared/utils/partnersLoader";

export default function PartnershipSection({ theme }) {
  // Start with default data (sync) then replace with JSON (async)
  const [partners, setPartners] = useState(getDefaultPartnersData());

  useEffect(() => {
    loadPartnersData().then(setPartners);
  }, []);

  const sectionClass = theme === "dark"
    ? "bg-gradient-to-b from-green-950 via-gray-950 to-green-950"
    : "bg-gradient-to-b from-white via-primary/5 to-white";

  const headingClass = theme === "dark" ? "text-primary-light" : "text-primary";

  const renderGroup = (list) =>
    list.map((partner, i) => (
      <PartnerCard
        key={i}
        partner={partner}
        index={i}
        className="p-4"
      />
    ));

  return (
    <section className={`py-16 sm:py-20 md:py-24 transition-colors ${sectionClass}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageTitle
          type="section"
          theme={theme}
          badge="Kolaborasi Penelitian"
          title="Institusi Pendukung"
          description="Berkolaborasi dengan institusi terkemuka untuk pengembangan berkelanjutan"
        />

        <div className="space-y-12">
          {/* Government & Academic — top row */}
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <h3 className={`text-lg font-semibold mb-4 transition-colors ${headingClass}`}>
                Institusi Pemerintah
              </h3>
              <div className="flex flex-wrap justify-center gap-6">
                {renderGroup(partners.government)}
              </div>
            </div>

            <div className="text-center">
              <h3 className={`text-lg font-semibold mb-4 transition-colors ${headingClass}`}>
                Institusi Akademik
              </h3>
              <div className="flex flex-wrap justify-center gap-6">
                {renderGroup(partners.academic)}
              </div>
            </div>
          </div>

          {/* Partners & Supported — bottom row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="text-center">
              <h3 className={`text-lg font-semibold mb-4 transition-colors ${headingClass}`}>
                Mitra Kerjasama
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {renderGroup(partners.partners)}
              </div>
            </div>

            <div className="text-center">
              <h3 className={`text-lg font-semibold mb-4 transition-colors ${headingClass}`}>
                Didukung Oleh
              </h3>
              <div className="flex flex-wrap justify-center gap-4">
                {renderGroup(partners.supported)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


