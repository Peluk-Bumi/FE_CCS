// Production-Ready Blockchain Configuration
// Centralized blockchain configuration with validation and security

class BlockchainConfig {
  constructor() {
    this.validateEnvironment();
    this.config = this.loadConfig();
    this.checkLegacyVariables();
  }

  validateEnvironment() {
    const required = [
      'VITE_BLOCKCHAIN_CHAIN_ID',
      'VITE_BLOCKCHAIN_RPC_URL', 
      'VITE_BLOCKCHAIN_CONTRACT_ADDRESS'
    ];

    const missing = required.filter(key => !import.meta.env[key]);
    
    if (missing.length > 0) {
      throw new Error(
        `❌ Missing required blockchain environment variables: ${missing.join(', ')}\n` +
        `Please check your .env file and ensure all required variables are set.\n` +
        `Required variables:\n` +
        missing.map(key => `  - ${key}`).join('\n')
      );
    }
  }

  loadConfig() {
    return {
      // Core blockchain settings
      chainId: BigInt(import.meta.env.VITE_BLOCKCHAIN_CHAIN_ID),
      rpcUrl: import.meta.env.VITE_BLOCKCHAIN_RPC_URL,
      contractAddress: import.meta.env.VITE_BLOCKCHAIN_CONTRACT_ADDRESS,
      explorerUrl: import.meta.env.VITE_BLOCKCHAIN_EXPLORER_URL || BlockchainConfig.getExplorerUrl(import.meta.env.VITE_BLOCKCHAIN_CHAIN_ID),
      networkLabel: import.meta.env.VITE_BLOCKCHAIN_NETWORK_LABEL || 'Unknown Network',
      
      // RPC configuration
      fallbackRpcUrls: this.getFallbackRpcUrls(),
      
      // Gas configuration
      gasLimit: parseInt(import.meta.env.VITE_BLOCKCHAIN_GAS_LIMIT || '300000'),
      maxGasPrice: BigInt(import.meta.env.VITE_BLOCKCHAIN_MAX_GAS_PRICE || '50000000000'),
      
      // Rate limiting
      minRequestInterval: parseInt(import.meta.env.VITE_MIN_REQUEST_INTERVAL || '1000'),
      maxConcurrentRequests: parseInt(import.meta.env.VITE_MAX_CONCURRENT_REQUESTS || '3')
    };
  }

  getFallbackRpcUrls() {
    const fallbacks = import.meta.env.VITE_BLOCKCHAIN_FALLBACK_RPC_URLS;
    if (!fallbacks) return [];
    
    const urls = fallbacks.split(',').map(url => url.trim());
    
    // Validate each fallback RPC URL
    const invalidUrls = urls.filter(url => !this.validateRpcUrl(url));
    if (invalidUrls.length > 0) {
      throw new Error(
        `❌ Invalid fallback RPC URLs: ${invalidUrls.join(', ')}\n` +
        `All RPC URLs must be valid HTTP/HTTPS endpoints.`
      );
    }
    
    return urls;
  }

  validateRpcUrl(url) {
    if (!url) return false;
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  static getExplorerUrl(chainId) {
    const explorers = {
      '11155111': 'https://sepolia.etherscan.io',
      '80002': 'https://amoy.polygonscan.com', 
      '137': 'https://polygonscan.com',
      '1': 'https://etherscan.io',
      '5': 'https://goerli.etherscan.io'
    };
    return explorers[chainId.toString()] || 'https://etherscan.io';
  }

  checkLegacyVariables() {
    const legacyMappings = {
      'VITE_POLYGON_CHAIN_ID': 'VITE_BLOCKCHAIN_CHAIN_ID',
      'VITE_POLYGON_RPC_URL': 'VITE_BLOCKCHAIN_RPC_URL',
      'VITE_CONTRACT_ADDRESS': 'VITE_BLOCKCHAIN_CONTRACT_ADDRESS',
      'VITE_BLOCKCHAIN_EXPLORER_BASE_URL': 'VITE_BLOCKCHAIN_EXPLORER_URL',
      'VITE_WALLET_PRIVATE_KEY': 'REMOVE (security risk - backend only)'
    };
    
    const usedLegacy = Object.keys(legacyMappings).filter(key => import.meta.env[key]);
    
    if (usedLegacy.length > 0) {
      console.group('🚨 DEPRECATION WARNING - Blockchain Environment Variables');
      console.warn('The following environment variables are deprecated and will be removed in v2.0:');
      usedLegacy.forEach(key => {
        console.warn(`  ❌ ${key} → ✅ ${legacyMappings[key]}`);
      });
      console.warn('Please update your .env file to use the new VITE_BLOCKCHAIN_* naming.');
      console.warn('Migration guide: https://docs.project.com/blockchain-migration');
      console.groupEnd();
      
      // Return true for temporary compatibility
      return true;
    }
    
    return false;
  }

  // Backward compatibility (temporary)
  getLegacyConfig() {
    console.warn('⚠️ DEPRECATED: Using legacy environment variables. Please migrate to VITE_BLOCKCHAIN_* naming.');
    
    return {
      chainId: BigInt(import.meta.env.VITE_POLYGON_CHAIN_ID || import.meta.env.VITE_BLOCKCHAIN_CHAIN_ID),
      rpcUrl: import.meta.env.VITE_POLYGON_RPC_URL || import.meta.env.VITE_BLOCKCHAIN_RPC_URL,
      contractAddress: import.meta.env.VITE_CONTRACT_ADDRESS || import.meta.env.VITE_BLOCKCHAIN_CONTRACT_ADDRESS,
      explorerUrl: import.meta.env.VITE_BLOCKCHAIN_EXPLORER_BASE_URL || import.meta.env.VITE_BLOCKCHAIN_EXPLORER_URL
    };
  }
}

// Singleton instance
export const blockchainConfig = new BlockchainConfig();
export default blockchainConfig.config;
