// Admin Feature Index
// Exports all admin-related components, hooks, services, and utils

// Components
export { default as AdminPage } from '../pages/admin/AdminPage';
export { default as UserPage } from '../pages/admin/UserPage';
export { default as AdminStats } from './components/AdminStats';
export { default as AdminTable } from './components/AdminTable';

// Hooks
export { default as useAdminData } from './hooks/useAdminData';

// Services
export { 
  fetchAdminData,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  manageUserPermissions
} from './services/adminService';

// Utils
export { 
  validateAdminForm,
  formatUserData,
  calculateAdminStats,
  generateAdminReport
} from './utils/adminUtils';
