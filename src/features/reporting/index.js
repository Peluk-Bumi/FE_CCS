// Reporting Feature Index
// Exports all reporting-related components, hooks, services, and utils

// Components
export { default as ReportsPage } from '../pages/reporting/ReportsPage';
export { default as ReportTable } from './components/ReportTable';
export { default as ReportFilters } from './components/ReportFilters';
export { default as ReportExport } from './components/ReportExport';

// Hooks
export { default as useReportingData } from './hooks/useReportingData';

// Services
export { 
  fetchReports,
  generateReport,
  exportReport,
  filterReports
} from './services/reportingService';

// Utils
export { 
  formatReportData,
  calculateReportTotals,
  generateReportFilename,
  validateReportFilters
} from './utils/reportingUtils';
