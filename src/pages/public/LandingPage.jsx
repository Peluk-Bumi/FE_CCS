import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "@/layouts/partials/Navbar";
import Footer from "@/layouts/partials/Footer";
import { useAuth } from "@/app/context/AuthContext";
import { useTheme } from "@/app/context/ThemeContext";

// Import modular components
import HeroSection from "@/features/landing/components/HeroSection";
import StatsSection from "@/features/landing/components/StatsSection";
import FeaturesSection from "@/features/landing/components/FeaturesSection";
import TestimonialsSection from "@/features/landing/components/TestimonialsSection";
import CTASection from "@/features/landing/components/CTASection";
import PartnershipSection from "@/features/landing/components/PartnershipSection";
import TimelineSection from "@/features/landing/components/TimelineSection";
import HowItWorksSection from "@/features/landing/components/HowItWorksSection";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { theme } = useTheme();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Section visibility controls
  const showHero = true;
  const showStats = true;
  const showFeatures = true;
  const showHowItWorks = true;
  const showTimeline = false;
  const showPartnership = true;
  const showTestimonials = false;
  const showCTA = true;

  const scrollToSection = (sectionId) => {
    const element = document.querySelector(sectionId);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ Smart navigation ke verifikasi berdasarkan status autentikasi
  const handleVerifikasiClick = () => {
    if (isAuthenticated) {
      if (user?.role === "admin") {
        navigate("/admin/verifikasi");
      } else if (user?.role === "user") {
        navigate("/user/verifikasi");
      }
    } else {
      navigate("/verifikasi");
    }
  };

  return (
    <div className={`min-h-screen text-gray-900 dark:text-gray-100 overflow-x-hidden transition-colors duration-300 ${
      theme === 'dark' 
        ? 'bg-gradient-to-br from-green-950 via-gray-950 to-green-950' 
        : 'bg-gradient-to-br from-primary/10 via-white to-primary/10'
    }`}>
      {/* Render sections based on boolean switches */}
      {showHero && <HeroSection theme={theme} scrollToSection={scrollToSection} />}
      {showStats && <StatsSection theme={theme} />}
      {showHowItWorks && <HowItWorksSection theme={theme} />}
      {showFeatures && <FeaturesSection theme={theme} />}
      {showTimeline && <TimelineSection theme={theme} />}
      {showPartnership && <PartnershipSection theme={theme} />}
      {showTestimonials && (
        <TestimonialsSection 
          theme={theme} 
          activeTestimonial={activeTestimonial} 
          setActiveTestimonial={setActiveTestimonial} 
        />
      )}
      {showCTA && <CTASection theme={theme} />}
      
      {/* Footer Component */}
      <Footer />
    </div>
  );
};

export default LandingPage;