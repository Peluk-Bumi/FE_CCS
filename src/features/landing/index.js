// Landing Feature Index
// Exports all landing-related components, hooks, services, and utils

// Components
export { default as HeroSection } from './components/HeroSection';
export { default as PartnershipSection } from './components/PartnershipSection';
export { default as FeaturesSection } from './components/FeaturesSection';
export { default as TestimonialSection } from './components/TestimonialSection';
export { default as ContactSection } from './components/ContactSection';
export { default as StatsSection } from './components/StatsSection';
export { default as CTASection } from './components/CTASection';
export { default as NavigationSection } from './components/NavigationSection';
export { default as FooterSection } from './components/FooterSection';

// Hooks
export { default as useLandingData } from './hooks/useLandingData';

// Services
export { 
  fetchLandingData,
  fetchPartners,
  fetchTestimonials,
  submitContactForm
} from './services/landingService';

// Utils
export { 
  scrollToSection,
  validateContactForm,
  formatPartnerLogo,
  animateOnScroll
} from './utils/landingUtils';
