// Blockchain Feature Index
// Exports all blockchain-related components, hooks, services, and utils

// Components
export { default as WalletIndicator } from './components/WalletIndicator';
export { default as BlockchainDebug } from './components/BlockchainDebug';
export { default as TransactionHistory } from './components/TransactionHistory';

// Hooks
export { default as useBlockchain } from '../app/context/BlockchainContext';

// Services
export { 
  connectWallet,
  disconnectWallet,
  getAccountBalance,
  sendTransaction,
  getTransactionHistory
} from './services/blockchainService';

// Utils
export { 
  formatAddress,
  formatBalance,
  validateTransaction,
  calculateGasFee
} from './utils/blockchainUtils';
