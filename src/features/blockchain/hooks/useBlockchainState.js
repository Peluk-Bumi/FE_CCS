import { useState, useEffect, useCallback } from 'react';
import blockchainService from '../services/blockchainService';

class BlockchainStateManager {
  constructor() {
    this.state = 'loading';
    this.error = null;
    this.retryCount = 0;
    this.maxRetries = 3;
  }
  
  setLoading() {
    this.state = 'loading';
    this.error = null;
  }
  
  setReady() {
    this.state = 'ready';
    this.error = null;
    this.retryCount = 0;
  }
  
  setError(error, canRetry = true) {
    this.state = 'error';
    this.error = error;
    this.canRetry = canRetry && this.retryCount < this.maxRetries;
  }
  
  async retry(initializeFunction) {
    if (!this.canRetry) {
      throw new Error('Max retries exceeded');
    }
    
    this.retryCount++;
    this.setLoading();
    
    try {
      await initializeFunction();
      this.setReady();
    } catch (error) {
      this.setError(error);
      throw error;
    }
  }
}

export const useBlockchainState = () => {
  const [stateManager] = useState(() => new BlockchainStateManager());
  const [blockchainServiceInstance, setBlockchainServiceInstance] = useState(null);
  const [status, setStatus] = useState(null);
  
  const initializeBlockchain = useCallback(async () => {
    try {
      stateManager.setLoading();
      setStatus({ loading: true, error: null });
      
      // Initialize blockchain service
      await blockchainService.initialize();
      setBlockchainServiceInstance(blockchainService);
      
      // Get service status
      const serviceStatus = blockchainService.getStatus();
      setStatus({ ...serviceStatus, loading: false });
      
      stateManager.setReady();
      return blockchainService;
    } catch (error) {
      const errorMessage = error.message || 'Failed to initialize blockchain service';
      stateManager.setError(errorMessage);
      setStatus({ loading: false, error: errorMessage });
      throw error;
    }
  }, [stateManager]);
  
  const retry = useCallback(() => {
    return stateManager.retry(initializeBlockchain);
  }, [stateManager, initializeBlockchain]);
  
  const connectWallet = useCallback(async () => {
    if (!blockchainServiceInstance) {
      throw new Error('Blockchain service not initialized');
    }
    
    try {
      const walletAddress = await blockchainServiceInstance.connectWallet();
      
      // Update status with wallet info
      setStatus(prev => ({
        ...prev,
        walletAddress,
        mode: 'READ_WRITE'
      }));
      
      return walletAddress;
    } catch (error) {
      const errorMessage = error.message || 'Failed to connect wallet';
      setStatus(prev => ({
        ...prev,
        error: errorMessage
      }));
      throw error;
    }
  }, [blockchainServiceInstance]);
  
  const disconnectWallet = useCallback(() => {
    if (blockchainServiceInstance) {
      blockchainServiceInstance.signer = null;
      blockchainServiceInstance.walletAddress = null;
      
      setStatus(prev => ({
        ...prev,
        walletAddress: 'READ_ONLY',
        mode: 'READ_ONLY'
      }));
    }
  }, [blockchainServiceInstance]);
  
  const refreshStatus = useCallback(async () => {
    if (!blockchainServiceInstance) {
      return;
    }
    
    try {
      const serviceStatus = blockchainServiceInstance.getStatus();
      setStatus(serviceStatus);
    } catch (error) {
      setStatus(prev => ({
        ...prev,
        error: error.message
      }));
    }
  }, [blockchainServiceInstance]);
  
  // Auto-initialize on mount
  useEffect(() => {
    initializeBlockchain().catch(console.error);
  }, [initializeBlockchain]);
  
  return {
    // State
    state: stateManager.state,
    status,
    error: stateManager.error,
    canRetry: stateManager.canRetry,
    
    // Service instance
    blockchainService: blockchainServiceInstance,
    
    // Actions
    initializeBlockchain,
    retry,
    connectWallet,
    disconnectWallet,
    refreshStatus
  };
};
