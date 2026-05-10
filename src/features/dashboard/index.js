// Dashboard Feature Index
// Exports all dashboard-related components, hooks, services, and utils

// Components
export { default as AdminDashboardPage } from '../pages/dashboard/AdminDashboardPage';
export { default as UserDashboardPage } from '../pages/dashboard/UserDashboardPage';
export { default as DashboardStats } from './components/DashboardStats';
export { default as DashboardChart } from './components/DashboardChart';

// Hooks
export { default as useDashboardData } from './hooks/useDashboardData';

// Services
export { 
  fetchDashboardStats,
  fetchDashboardCharts,
  fetchRecentActivity,
  fetchUserMetrics
} from './services/dashboardService';

// Utils
export { 
  formatDashboardData,
  calculateGrowthRate,
  generateChartConfig,
  filterDashboardData
} from './utils/dashboardUtils';
