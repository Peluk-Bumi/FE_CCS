// Auth Feature Index
// Exports all auth-related components, hooks, services, and utils

// Components
export { default as LoginPage } from '../pages/auth/LoginPage';
export { default as RegisterPage } from '../pages/auth/RegisterPage';
export { default as ProtectedRoute } from '../app/routes/ProtectedRoute';

// Hooks
export { default as useAuth } from '../app/context/AuthContext';

// Note: Other components, services, and utils will be added as they are created
// - ForgotPasswordPage (not yet created)
// - authService (not yet created) 
// - authUtils (not yet created)
