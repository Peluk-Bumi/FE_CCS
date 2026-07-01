// src/utils/devHelper.js
/**
 * Development helper - Auto-login for local testing
 * Only runs in development mode
 */

const TEST_CREDENTIALS = {
  admin: {
    email: 'admin@ccs.local',
    password: 'admin123'
  },
  user: {
    email: 'user@ccs.local',
    password: 'user123'
  }
};

// Enable auto‑login using Vite env variable. Set VITE_ENABLE_AUTO_LOGIN=true in .env.development to activate.
const ENABLE_AUTO_LOGIN = import.meta.env.VITE_ENABLE_AUTO_LOGIN === 'true';

/**
 * Auto-login with test credentials (development only)
 */
export async function autoLoginIfDev(loginFunction) {
  // Only in development, if enabled, and if not already logged in
  if (import.meta.env.DEV && ENABLE_AUTO_LOGIN && !localStorage.getItem('token')) {
    console.log('[DevHelper] Auto-logging in with admin credentials for development...');
    
    try {
      const result = await loginFunction(TEST_CREDENTIALS.admin);
      if (result.success) {
        console.log('[DevHelper] ✅ Auto-login successful! Token stored in localStorage');
        return true;
      } else {
        console.warn('[DevHelper] Auto-login failed:', result.message);
      }
    } catch (error) {
      console.error('[DevHelper] Auto-login error:', error);
    }
  }
  
  return false;
}

/**
 * Get test credentials for manual testing
 */
export function getTestCredentials(role = 'admin') {
  return TEST_CREDENTIALS[role] || TEST_CREDENTIALS.admin;
}

/**
 * Setup dev debugging tools in window scope
 */
export function setupDevTools() {
  if (import.meta.env.DEV && typeof window !== 'undefined') {
    window.__devTools = {
      getTestCreds: getTestCredentials,
      clearAuthStorage: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log('[DevTools] Auth storage cleared');
      },
      setTestToken: (token) => {
        localStorage.setItem('token', token);
        console.log('[DevTools] Test token set');
      },
      getStoredToken: () => localStorage.getItem('token'),
      // Note: These are now async since they're imported properly
      reloadPage: () => {
        window.location.reload();
      },
      logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    };
    console.log('[DevHelper] 🛠️  DevTools available at window.__devTools');
  }
}
