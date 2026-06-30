import React from 'react';

const BlockchainErrorState = ({ error, onRetry, canRetry = true }) => {
  return (
    <div className="blockchain-error-state min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
        <div className="error-icon mb-4">
          <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>
        
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Blockchain Configuration Error
        </h3>
        
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
          {error || 'There was an error initializing the blockchain service. Please check your configuration.'}
        </p>
        
        <div className="error-actions space-y-3">
          {canRetry && (
            <button
              onClick={onRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
            >
              Retry Connection
            </button>
          )}
          
          <a
            href="/docs/blockchain-setup"
            className="block w-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            View Setup Guide
          </a>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <details className="text-left">
            <summary className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
              Technical Details
            </summary>
            <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-900 rounded text-xs font-mono text-gray-600 dark:text-gray-400">
              <div>Error: {error || 'Unknown error'}</div>
              <div>Time: {new Date().toISOString()}</div>
              <div>Environment: {import.meta.env.MODE || 'development'}</div>
            </div>
          </details>
        </div>
      </div>
    </div>
  );
};

export default BlockchainErrorState;
