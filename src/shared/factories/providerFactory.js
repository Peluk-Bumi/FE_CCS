// Provider Factory - Abstraction layer for provider initialization and RPC scaling
// Handles provider creation, validation, and failover logic

import { ethers } from 'ethers';

class ProviderFactory {
  static createPrimaryProvider(rpcUrl, chainId) {
    if (!rpcUrl) {
      throw new Error('Primary RPC URL is required for provider creation');
    }
    
    const provider = new ethers.JsonRpcProvider(rpcUrl, {
      chainId: Number(chainId),
      name: 'configured-network'
    });
    
    return provider;
  }
  
  static createFallbackProviders(rpcUrls, chainId) {
    if (!rpcUrls || rpcUrls.length === 0) {
      return [];
    }
    
    return rpcUrls.map(url => 
      new ethers.JsonRpcProvider(url, {
        chainId: Number(chainId),
        name: 'fallback-network'
      })
    );
  }
  
  static async findWorkingProvider(primaryProvider, fallbackProviders = []) {
    const allProviders = [primaryProvider, ...fallbackProviders];
    
    for (let i = 0; i < allProviders.length; i++) {
      try {
        await allProviders[i].getNetwork();
        console.log(`RPC Provider ${i + 1} working: ${allProviders[i]._getConnection().url}`);
        return allProviders[i];
      } catch (error) {
        console.warn(`RPC Provider ${i + 1} failed:`, error.message);
        continue;
      }
    }
    
    throw new Error('All RPC providers failed. Check your network configuration.');
  }
  
  static async validateProvider(provider, expectedChainId) {
    try {
      const network = await provider.getNetwork();
      const expectedBigInt = BigInt(expectedChainId);
      
      if (network.chainId !== expectedBigInt) {
        throw new Error(
          `Chain mismatch. Expected: ${expectedBigInt}, Got: ${network.chainId} (${network.name})`
        );
      }
      return true;
    } catch (error) {
      throw new Error(`Provider validation failed: ${error.message}`);
    }
  }
  
  static createBrowserProvider(windowEthereum) {
    if (!windowEthereum) {
      throw new Error('MetaMask or compatible wallet not installed');
    }
    
    return new ethers.BrowserProvider(windowEthereum);
  }
  
  static async switchNetwork(provider, targetChainId, networkConfig) {
    try {
      await provider.send('wallet_switchEthereumChain', [
        { chainId: `0x${targetChainId.toString(16)}` }
      ]);
    } catch (switchError) {
      if (switchError.code === 4902) {
        await provider.send('wallet_addEthereumChain', [
          {
            chainId: `0x${targetChainId.toString(16)}`,
            chainName: networkConfig.name,
            rpcUrls: [networkConfig.rpcUrl],
            blockExplorerUrls: [networkConfig.explorerUrl]
          }
        ]);
      } else {
        throw switchError;
      }
    }
  }
}

export default ProviderFactory;
