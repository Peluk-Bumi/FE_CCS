import React from 'react';
import BlockchainErrorState from './BlockchainErrorState';

class BlockchainErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      retryCount: 0,
      maxRetries: 3
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true,
      error: error.message || 'Unknown blockchain error'
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Blockchain Error Boundary:', error, errorInfo);
    
    this.setState({
      error: error.message,
      errorInfo
    });

    // Log error to monitoring service in production
    if (import.meta.env.PROD) {
      this.logErrorToService(error, errorInfo);
    }
  }

  logErrorToService(error, errorInfo) {
    // In production, send error to monitoring service
    try {
      fetch('/api/errors/blockchain', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          error: error.message,
          stack: error.stack,
          componentStack: errorInfo.componentStack,
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href
        })
      }).catch(console.warn);
    } catch (loggingError) {
      console.warn('Failed to log error to service:', loggingError);
    }
  }

  handleRetry = () => {
    const { retryCount, maxRetries } = this.state;
    
    if (retryCount < maxRetries) {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: prevState.retryCount + 1
      }));
      
      // Trigger re-render of children
      this.forceUpdate();
    }
  };

  canRetry() {
    return this.state.retryCount < this.state.maxRetries;
  }

  render() {
    if (this.state.hasError) {
      const error = this.state.error || 'Unknown blockchain error occurred';
      const canRetry = this.canRetry();
      
      return (
        <BlockchainErrorState 
          error={error}
          onRetry={this.handleRetry}
          canRetry={canRetry}
        />
      );
    }

    return this.props.children;
  }
}

export default BlockchainErrorBoundary;
