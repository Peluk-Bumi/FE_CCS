import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import blockchainConfig from '@/config/blockchainConfig';
import SecurityGuard from '@/shared/guards/securityGuard';
import ProviderFactory from '@/shared/factories/providerFactory';
import { validateContractAddress, validateDocumentHash, validateDocumentType, validateMetadata } from '@/shared/utils/validation';

// Smart Contract ABI
const CONTRACT_ABI = [
  "function getDocumentCount() public view returns (uint256)",
  "function getDocument(uint256 _docId) public view returns (string memory docType, string memory docHash, string memory metadata, address uploader, uint256 timestamp)",
  "function storeDocument(string memory _docType, string memory _docHash, string memory _metadata) public returns (uint256)",
  "event DocumentStored(uint256 indexed docId, string docType, string docHash, address indexed uploader, uint256 timestamp)"
];

// Rate limiting controls
let lastRequestTime = 0;
const requestQueue = [];
let processingQueue = false;

class BlockchainService {
  constructor() {
    this.config = blockchainConfig;
    this.provider = null;
    this.contract = null;
    this.signer = null;
    this.walletAddress = import.meta.env.VITE_BLOCKCHAIN_WALLET_ADDRESS || null;
    this.lastError = null;
    this.isInitialized = false;
  }

  async initialize() {
    try {
      // Security validation
      SecurityGuard.validateEnvironment();
      SecurityGuard.validateBlockchainConfig(this.config);
      
      // Initialize providers using factory
      this.primaryProvider = ProviderFactory.createPrimaryProvider(
        this.config.rpcUrl, 
        this.config.chainId
      );
      
      this.fallbackProviders = ProviderFactory.createFallbackProviders(
        this.config.fallbackRpcUrls, 
        this.config.chainId
      );
      
      // Find working provider
      this.provider = await ProviderFactory.findWorkingProvider(
        this.primaryProvider, 
        this.fallbackProviders
      );
      
      // Validate provider matches expected chain
      await ProviderFactory.validateProvider(this.provider, this.config.chainId);
      
      // Check balance of hardcoded address
      if (this.walletAddress) {
        const balance = await this.provider.getBalance(this.walletAddress);
        console.log(`Balance of ${this.walletAddress}: ${ethers.formatEther(balance)} ETH`);
      }
      
      // Initialize contract
      await this.initializeContract();
      
      this.isInitialized = true;
      console.log('Blockchain service initialized successfully');
      return true;
    } catch (error) {
      this.lastError = error.message;
      console.error('Blockchain service initialization failed:', error);
      throw error;
    }
  }

  async initializeContract() {
    // Verify contract exists on network
    const code = await this.provider.getCode(this.config.contractAddress);
    if (code === '0x') {
      throw new Error(`No contract deployed at ${this.config.contractAddress}`);
    }

    // Create contract instance
    this.contract = new ethers.Contract(
      this.config.contractAddress,
      CONTRACT_ABI,
      this.signer || this.provider
    );
  }

  async connectWallet() {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    try {
      // Create browser provider
      const browserProvider = ProviderFactory.createBrowserProvider(window.ethereum);
      
      // Switch to correct network if needed
      await ProviderFactory.switchNetwork(browserProvider, this.config.chainId, {
        name: this.config.networkLabel,
        rpcUrl: this.config.rpcUrl,
        explorerUrl: this.config.explorerUrl
      });
      
      // Get signer
      this.signer = await browserProvider.getSigner();
      this.walletAddress = await this.signer.getAddress();
      
      // Reinitialize contract with signer
      await this.initializeContract();
      
      return this.walletAddress;
    } catch (error) {
      throw new Error(`Wallet connection failed: ${error.message}`);
    }
  }

  async getDocumentCount() {
    if (!this.isInitialized) throw new Error('Blockchain service not initialized');
    if (!this.contract) throw new Error('Contract not initialized');
    
    try {
      const count = await this.contract.getDocumentCount();
      return Number(count);
    } catch (error) {
      throw new Error(`Failed to get document count: ${error.message}`);
    }
  }

  async getDocument(docId) {
    if (!this.isInitialized) throw new Error('Blockchain service not initialized');
    if (!this.contract) throw new Error('Contract not initialized');
    
    try {
      const [docType, docHash, metadata, uploader, timestamp] = await this.contract.getDocument(docId);
      
      return {
        docId: Number(docId),
        docType,
        docHash,
        metadata: metadata ? JSON.parse(metadata) : {},
        uploader,
        timestamp: Number(timestamp),
        timestampISO: new Date(Number(timestamp) * 1000).toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to get document ${docId}: ${error.message}`);
    }
  }

  async storeDocument(documentType, docHash, metadata) {
    if (!this.isInitialized) throw new Error('Blockchain service not initialized');
    if (!this.contract) throw new Error('Contract not initialized');
    if (!this.signer) throw new Error('Wallet not connected');
    
    // Validate inputs
    if (!validateDocumentType(documentType)) {
      throw new Error('Invalid document type');
    }
    
    if (!validateDocumentHash(docHash)) {
      throw new Error('Invalid document hash');
    }
    
    if (!validateMetadata(metadata)) {
      throw new Error('Invalid metadata format');
    }
    
    try {
      const metadataPayload = typeof metadata === 'string' ? metadata : JSON.stringify(metadata);
      
      const tx = await this.contract.storeDocument(documentType, docHash, metadataPayload);
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        contractAddress: this.config.contractAddress,
        explorerUrl: `${this.config.explorerUrl}/tx/${receipt.hash}`,
        walletAddress: this.walletAddress,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to store document: ${error.message}`);
    }
  }

  async getTransactionDetails(txHash) {
    if (!this.isInitialized) throw new Error('Blockchain service not initialized');
    
    try {
      const tx = await this.provider.getTransaction(txHash);
      const receipt = await this.provider.getTransactionReceipt(txHash);
      
      return {
        success: true,
        txHash,
        transaction: tx,
        receipt,
        explorerUrl: `${this.config.explorerUrl}/tx/${txHash}`
      };
    } catch (error) {
      throw new Error(`Failed to get transaction details: ${error.message}`);
    }
  }

  async searchDocumentByHash(docHash) {
    if (!this.isInitialized) throw new Error('Blockchain service not initialized');
    
    try {
      const totalDocs = await this.getDocumentCount();
      
      for (let i = 1; i <= totalDocs; i++) {
        try {
          const doc = await this.getDocument(i);
          if (doc.docHash.toLowerCase() === docHash.toLowerCase()) {
            return {
              success: true,
              ...doc,
              explorerUrl: `${this.config.explorerUrl}/tx/${doc.txHash}`
            };
          }
        } catch (error) {
          continue; // Skip invalid documents
        }
      }
      
      throw new Error(`Document with hash ${docHash} not found`);
    } catch (error) {
      throw new Error(`Failed to search document: ${error.message}`);
    }
  }

  getStatus() {
    if (!this.isInitialized) {
      return {
        status: 'not_initialized',
        error: this.lastError
      };
    }
    
    return {
      status: 'ready',
      network: this.config.networkLabel,
      chainId: this.config.chainId.toString(),
      contractAddress: this.config.contractAddress,
      walletAddress: this.walletAddress || 'READ_ONLY',
      explorerUrl: this.config.explorerUrl
    };
  }

  async getWalletStatus() {
    console.log('Debug - getWalletStatus called');
    console.log('Debug - isInitialized:', this.isInitialized);
    console.log('Debug - walletAddress:', this.walletAddress);
    console.log('Debug - lastError:', this.lastError);
    
    if (!this.isInitialized) {
      return {
        status: 'not_initialized',
        address: null,
        connected: false,
        balance: 0,
        error: this.lastError
      };
    }
    
    let balance = 0;
    if (this.walletAddress && this.provider) {
      try {
        const balanceWei = await this.provider.getBalance(this.walletAddress);
        balance = parseFloat(ethers.formatEther(balanceWei));
      } catch (error) {
        console.warn('Failed to get balance:', error);
      }
    }
    
    return {
      status: this.walletAddress ? 'connected' : 'disconnected',
      address: this.walletAddress,
      connected: Boolean(this.walletAddress),
      balance: balance
    };
  }

  async getBalance() {
    if (!this.isInitialized || !this.walletAddress || !this.provider) {
      return 0;
    }
    
    try {
      const balanceWei = await this.provider.getBalance(this.walletAddress);
      return parseFloat(ethers.formatEther(balanceWei));
    } catch (error) {
      console.error('Failed to get balance:', error);
      return 0;
    }
  }

  getWalletAddress() {
    return this.walletAddress;
  }

  calculateDocumentHash(data) {
    // Simple hash calculation for demonstration
    // In production, use proper hashing like SHA-256
    const stringData = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < stringData.length; i++) {
      const char = stringData.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
  }
}

// Rate limiting helper
async function queueRequest(fn) {
  return new Promise((resolve, reject) => {
    requestQueue.push({ resolve, reject, fn });
    processRequestQueue();
  });
}

async function processRequestQueue() {
  if (processingQueue || requestQueue.length === 0) return;
  
  processingQueue = true;
  
  while (requestQueue.length > 0) {
    const { resolve, reject, fn } = requestQueue.shift();
    
    try {
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime;
      
      if (timeSinceLastRequest < blockchainConfig.minRequestInterval) {
        const delay = blockchainConfig.minRequestInterval - timeSinceLastRequest;
        await new Promise(r => setTimeout(r, delay));
      }
      
      lastRequestTime = Date.now();
      const result = await fn();
      resolve(result);
    } catch (error) {
      reject(error);
    }
  }
  
  processingQueue = false;
}

// Export singleton instance
const blockchainService = new BlockchainService();
export default blockchainService;
