// Shared activity color configuration for consistent UI across the application
export const ACTIVITY_COLORS = {
  // Planting activities - Green theme
  planting: {
    primary: 'text-green-600',
    background: 'bg-green-100 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    badge: 'bg-green-500 text-white',
    icon: 'text-green-600'
  },
  planting_mangrove: {
    primary: 'text-green-600',
    background: 'bg-green-100 dark:bg-green-900/20',
    border: 'border-green-200 dark:border-green-800',
    badge: 'bg-green-500 text-white',
    icon: 'text-green-600'
  },
  
  // Monitoring activities - Blue theme
  monitoring: {
    primary: 'text-blue-600',
    background: 'bg-blue-100 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    badge: 'bg-blue-500 text-white',
    icon: 'text-blue-600'
  },
  evaluation: {
    primary: 'text-blue-600',
    background: 'bg-blue-100 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    badge: 'bg-blue-500 text-white',
    icon: 'text-blue-600'
  },
  
  // Verification activities - Emerald theme
  verification: {
    primary: 'text-emerald-600',
    background: 'bg-emerald-100 dark:bg-emerald-900/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    badge: 'bg-emerald-500 text-white',
    icon: 'text-emerald-600'
  },
  
  // Planning activities - Purple theme
  planning: {
    primary: 'text-purple-600',
    background: 'bg-purple-100 dark:bg-purple-900/20',
    border: 'border-purple-200 dark:border-purple-800',
    badge: 'bg-purple-500 text-white',
    icon: 'text-purple-600'
  },
  
  // Blockchain activities - Orange theme
  blockchain: {
    primary: 'text-orange-600',
    background: 'bg-orange-100 dark:bg-orange-900/20',
    border: 'border-orange-200 dark:border-orange-800',
    badge: 'bg-orange-500 text-white',
    icon: 'text-orange-600'
  },
  
  // Implementation activities - Indigo theme
  implementation: {
    primary: 'text-indigo-600',
    background: 'bg-indigo-100 dark:bg-indigo-900/20',
    border: 'border-indigo-200 dark:border-indigo-800',
    badge: 'bg-indigo-500 text-white',
    icon: 'text-indigo-600'
  },
  
  // Default activity - Primary theme
  default: {
    primary: 'text-primary',
    background: 'bg-primary/10',
    border: 'border-primary/20',
    badge: 'bg-primary text-white',
    icon: 'text-primary'
  }
};

// Helper function to get activity colors
export const getActivityColors = (activityType) => {
  if (!activityType) return ACTIVITY_COLORS.default;
  
  const normalizedType = activityType.toLowerCase();
  return ACTIVITY_COLORS[normalizedType] || ACTIVITY_COLORS.default;
};

// Helper function to get activity icon mapping
export const getActivityIcon = (type) => {
  const iconMap = {
    planting: 'FiGlobe',
    planting_mangrove: 'FiGlobe',
    monitoring: 'FiSearch',
    evaluation: 'FiSearch',
    verification: 'FiCheckCircle',
    planning: 'FiCalendar',
    blockchain: 'FiLink',
    implementation: 'FiActivity'
  };
  
  if (!type) return 'FiActivity';
  const normalizedType = type.toLowerCase();
  return iconMap[normalizedType] || 'FiActivity';
};

// Helper function to format hash (shorten for display)
export const formatHash = (hash, prefixLength = 8, suffixLength = 6) => {
  if (!hash) return '';
  if (hash.length <= prefixLength + suffixLength + 3) return hash;
  return `${hash.substring(0, prefixLength)}...${hash.substring(hash.length - suffixLength)}`;
};

// Helper function to get activity display name
export const getActivityDisplayName = (type) => {
  const nameMap = {
    planting: 'Planting',
    planting_mangrove: 'Planting Mangrove',
    monitoring: 'Monitoring',
    evaluation: 'Evaluation',
    verification: 'Verification',
    planning: 'Planning',
    blockchain: 'Blockchain',
    implementation: 'Implementation'
  };
  
  if (!type) return 'Aktivitas';
  const normalizedType = type.toLowerCase();
  return nameMap[normalizedType] || type;
};
