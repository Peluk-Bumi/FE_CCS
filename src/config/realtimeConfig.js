/**
 * ✅ Real-time Configuration
 * Centralized settings for real-time data updates across the application
 */

export const REALTIME_CONFIG = {
  // Default polling interval for dashboard (milliseconds)
  DASHBOARD_POLLING_INTERVAL: 5000, // 5 seconds
  
  // Polling intervals for different data types
  INTERVALS: {
    DASHBOARD: 5000,      // Fast updates for dashboard
    ACTIVITIES: 10000,    // Moderate updates for activities
    STATISTICS: 15000,    // Slower updates for stats
    BLOCKCHAIN: 30000,    // Blockchain data (less frequent)
  },

  // API timeout
  API_TIMEOUT: 30000, // 30 seconds

  // Debounce time between requests (prevents too rapid requests)
  DEBOUNCE_TIME: 1000, // 1 second

  // Cache settings
  CACHE: {
    ENABLED: true,
    STORAGE_KEY: 'dashboard_stats_cache',
    TTL: 60000, // 1 minute
  },

  // Error handling
  ERROR_HANDLING: {
    MAX_RETRIES: 3,
    RETRY_DELAY: 5000,
    CONTINUE_ON_ERROR: true, // Keep polling even on error
  },

  // Performance optimization
  OPTIMIZATION: {
    BATCH_REQUESTS: true,
    DEBOUNCE_UPDATES: false,
    SKIP_UNCHANGED_DATA: true,
  },

  // Logging
  LOGGING: {
    ENABLED: true,
    PREFIX: '[Realtime]',
    DEBUG: false,
  },
};

/**
 * Get polling interval by data type
 * @param {string} dataType - Type of data (e.g., 'DASHBOARD', 'ACTIVITIES')
 * @returns {number} Polling interval in milliseconds
 */
export const getPollingInterval = (dataType = 'DASHBOARD') => {
  return REALTIME_CONFIG.INTERVALS[dataType] || REALTIME_CONFIG.DASHBOARD_POLLING_INTERVAL;
};

/**
 * Disable/enable real-time polling globally
 * Useful for development or testing
 */
export const setRealtimeEnabled = (enabled) => {
  REALTIME_CONFIG.ENABLED = enabled;
  console.log(`[Realtime] Global polling ${enabled ? 'enabled' : 'disabled'}`);
};

export default REALTIME_CONFIG;
