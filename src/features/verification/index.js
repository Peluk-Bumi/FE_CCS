// Verification Feature Index
// Exports all verification-related components, hooks, services, and utils

// Components
export { default as VerificationPage } from './components/VerificationPage';
export { default as VerificationDashboardPage } from './components/VerificationDashboardPage';
export { default as VerificationForm } from './components/VerificationForm';

// Hooks
export { default as useVerification } from './hooks/useVerification';

// Services
export { 
  fetchVerificationData,
  submitVerification,
  updateVerificationStatus
} from './services/verificationService';

// Utils
export { 
  validateVerificationData,
  formatVerificationStatus,
  generateVerificationReport
} from './utils/verificationUtils';
