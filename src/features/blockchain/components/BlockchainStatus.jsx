import { useBlockchain } from '../contexts/BlockchainContext';
import { motion } from 'framer-motion';
import { FiCheck, FiLoader, FiCopy, FiExternalLink, FiWifi, FiWifiOff, FiLink } from 'react-icons/fi';
import { toast } from 'react-toastify';

const EXPLORER_BASE_URL = import.meta.env.VITE_BLOCKCHAIN_EXPLORER_URL || 'https://sepolia.etherscan.io';
const NETWORK_LABEL = import.meta.env.VITE_BLOCKCHAIN_NETWORK_LABEL || 'Sepolia Testnet';
const CHAIN_ID = import.meta.env.VITE_BLOCKCHAIN_CHAIN_ID || '11155111';
const TOKEN_SYMBOL = CHAIN_ID === '11155111' ? 'ETH' : 'MATIC';

export default function BlockchainStatus() {
  const { 
    isReady,
    loading, 
    walletAddress, 
    walletStatus, 
    error
  } = useBlockchain();

  if (loading) {
    return (
      <motion.div
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ translateY: -2 }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        >
          <FiLoader className="w-4 h-4 text-blue-600 dark:text-blue-300" />
        </motion.div>
        <span className="text-xs font-medium text-blue-600 dark:text-blue-300">Initializing blockchain...</span>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ translateY: -2 }}
      >
        <FiWifiOff className="w-4 h-4 text-rose-600 dark:text-rose-300" />
        <span className="text-xs font-medium text-rose-600 dark:text-rose-300">Blockchain offline</span>
      </motion.div>
    );
  }

  if (!isReady) {
    return (
      <motion.div
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ translateY: -2 }}
      >
        <FiWifiOff className="w-4 h-4 text-amber-600 dark:text-amber-300" />
        <span className="text-xs font-medium text-amber-600 dark:text-amber-300">Not ready</span>
      </motion.div>
    );
  }

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(walletAddress);
      toast.success('Address copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy address');
    }
  };

  const viewOnExplorer = () => {
    if (walletAddress) {
      window.open(`${EXPLORER_BASE_URL}/address/${walletAddress}`, '_blank');
    }
  };

  return (
    <motion.div
      className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-700"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      whileHover={{ translateY: -2 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="flex-1">
        <div className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
          <FiLink className="w-3 h-3" />
          <span>Blockchain: Connected</span>
        </div>
        {walletAddress && (
          <div className="flex items-center gap-1">
            <code className="text-xs font-mono text-gray-900 dark:text-gray-100 truncate bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </code>
          </div>
        )}
      </div>

      {/* Balance */}
      {walletStatus?.balance && (
        <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 whitespace-nowrap bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
          {parseFloat(walletStatus.balance).toFixed(4)} {TOKEN_SYMBOL}
        </div>
      )}

      {/* Network Info */}
      {walletStatus?.network && (
        <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-600">
          {NETWORK_LABEL}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-1">
        {/* Copy Button */}
        <motion.button
          onClick={copyAddress}
          className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="Copy wallet address"
        >
          <FiCopy className="w-3.5 h-3.5" />
        </motion.button>

        {/* View on Explorer */}
        <motion.button
          onClick={viewOnExplorer}
          className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500 transition-all"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          title="View on Explorer"
        >
          <FiExternalLink className="w-3.5 h-3.5" />
        </motion.button>
      </div>
    </motion.div>
  );
}
