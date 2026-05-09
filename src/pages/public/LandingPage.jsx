import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../../components/common/Footer";
import { useAuth } from "../../contexts/AuthContext";
import { useTheme } from "../../contexts/ThemeContext";

// Import modular components
import HeroSection from "../../components/landing/HeroSection";
import StatsSection from "../../components/landing/StatsSection";
import FeaturesSection from "../../components/landing/FeaturesSection";
import TestimonialsSection from "../../components/landing/TestimonialsSection";
import CTASection from "../../components/landing/CTASection";

const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { theme } = useTheme();
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Section visibility controls
  const showHero = true;
  const showStats = false;
  const showFeatures = true;
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
      {showFeatures && <FeaturesSection theme={theme} />}
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