// ✅ Security Guard - Environment Validation and Security Checks
// Protects against security violations and ensures proper environment setup

class SecurityGuard {
  static validateEnvironment() {
    // ❌ SECURITY: Check for private keys in frontend
    if (import.meta.env.VITE_WALLET_PRIVATE_KEY) {
      console.error('🚨 SECURITY WARNING: VITE_WALLET_PRIVATE_KEY detected in frontend!');
      console.error('Private keys should ONLY be in backend environment variables.');
      console.error('Frontend exposure of private keys is a critical security vulnerability.');
      throw new Error(
        'Security violation: Private key detected in frontend environment. ' +
        'Remove VITE_WALLET_PRIVATE_KEY from frontend .env file immediately. ' +
        'Private keys should only be stored in backend environment variables.'
      );
    }
    
    // ✅ Check for other potential security issues
    const nodeEnv = import.meta.env.MODE || 'development';
    
    // Warn about development patterns in production
    if (nodeEnv === 'production') {
      this.checkProductionSecurity();
    }
    
    // Check for exposed sensitive patterns
    this.checkSensitivePatterns();
  }
  
  static checkProductionSecurity() {
    // Check for development-only variables in production
    const devOnlyVars = [
      'VITE_DEV_PRIVATE_KEY',
      'VITE_TEST_PRIVATE_KEY',
      'VITE_DEBUG_PRIVATE_KEY'
    ];
    
    const foundDevVars = devOnlyVars.filter(varName => import.meta.env[varName]);
    if (foundDevVars.length > 0) {
      console.error('🚨 PRODUCTION SECURITY WARNING: Development variables detected:');
      foundDevVars.forEach(varName => {
        console.error(`  ❌ ${varName} should not be used in production`);
      });
      throw new Error(
        'Production security violation: Development-only variables detected in production environment.'
      );
    }
  }
  
  static checkSensitivePatterns() {
    // Check for potential API keys or secrets in frontend
    const sensitivePatterns = [
      /VITE_.*_SECRET/i,
      /VITE_.*_API_KEY/i,
      /VITE_.*_TOKEN/i,
      /VITE_.*_PASSWORD/i
    ];
    
    Object.keys(import.meta.env).forEach(key => {
      if (sensitivePatterns.some(pattern => pattern.test(key))) {
        console.warn(`⚠️ SECURITY WARNING: Potentially sensitive variable detected: ${key}`);
        console.warn('Ensure this is not a secret or private key that should be in backend only.');
      }
    });
  }
  
  static validateBlockchainConfig(config) {
    // Validate contract address format
    if (!config.contractAddress || !/^0x[a-fA-F0-9]{40}$/.test(config.contractAddress)) {
      throw new Error(
        `Invalid contract address format: ${config.contractAddress}\n` +
        'Contract address must be a valid Ethereum address (0x + 40 hex characters)'
      );
    }
    
    // Validate RPC URL (Optional in v2 if using BC_CCS)
    if (config.rpcUrl && config.rpcUrl.trim() !== '' && !this.isValidRpcUrl(config.rpcUrl)) {
      throw new Error(
        `Invalid RPC URL format: "${config.rpcUrl}"\n` +
        'RPC URL must be a valid HTTP/HTTPS endpoint'
      );
    }
    
    // Validate chain ID
    if (!config.chainId || config.chainId <= 0) {
      throw new Error(
        `Invalid chain ID: ${config.chainId}\n` +
        'Chain ID must be a positive integer'
      );
    }
    
    // Validate fallback RPC URLs
    if (config.fallbackRpcUrls && config.fallbackRpcUrls.length > 0) {
      const invalidFallbacks = config.fallbackRpcUrls.filter(url => !this.isValidRpcUrl(url));
      if (invalidFallbacks.length > 0) {
        throw new Error(
          `Invalid fallback RPC URLs: ${invalidFallbacks.join(', ')}\n` +
          'All fallback RPC URLs must be valid HTTP/HTTPS endpoints'
        );
      }
    }
  }
  
  static isValidRpcUrl(url) {
    if (!url) return false;
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }
  
  static sanitizeConfig(config) {
    // Return sanitized config for logging (remove sensitive data)
    return {
      ...config,
      rpcUrl: config.rpcUrl ? config.rpcUrl.replace(/\/\/.*@/, '//***@') : config.rpcUrl,
      fallbackRpcUrls: config.fallbackRpcUrls?.map(url => 
        url.replace(/\/\/.*@/, '//***@')
      )
    };
  }
}

export default SecurityGuard;
