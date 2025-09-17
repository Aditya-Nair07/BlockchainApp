import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FaWallet, 
  FaSpinner, 
  FaExclamationTriangle, 
  FaCheckCircle,
  FaCopy,
  FaExternalLinkAlt,
  FaNetworkWired,
  FaChevronUp,
  FaChevronDown
} from 'react-icons/fa';
import { connectWallet, switchToPolygonAmoy, formatAddress, disconnectWallet } from '../utils/blockchain';
import { BLOCKCHAIN_CONFIG } from '../config/blockchain';

const WalletConnection = ({ onWalletConnected, onWalletDisconnected, translations = {} }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [networkError, setNetworkError] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [manuallyDisconnected, setManuallyDisconnected] = useState(false);

  // Define disconnect handler first
  const handleDisconnect = useCallback(async () => {
    console.log('🔌 Disconnect button clicked');
    setIsDisconnecting(true);
    
    try {
      console.log('📞 Calling disconnectWallet...');
      // Call the disconnect function from blockchain utils
      await disconnectWallet();
      console.log('✅ disconnectWallet completed');
      
      // Clear local state
      console.log('🧹 Clearing local state...');
      setUserAddress('');
      setIsConnected(false);
      setConnectionError(null);
      setNetworkError(null);
      setIsCollapsed(false); // Reset to expanded state for next connection
      setManuallyDisconnected(true); // Prevent auto-reconnection
      
      // Notify parent component
      console.log('📢 Notifying parent component...');
      onWalletDisconnected?.();
      
      console.log('🎉 Wallet disconnected successfully');
      
      // Show success message
      alert('Wallet disconnected successfully!');
    } catch (error) {
      console.error('Error during disconnect:', error);
      // Still clear local state even if there's an error
      setUserAddress('');
      setIsConnected(false);
      setConnectionError(null);
      setNetworkError(null);
      setIsCollapsed(false);
      onWalletDisconnected?.();
      
      // Show error message
      alert('Disconnect completed with some issues, but wallet is now disconnected.');
    } finally {
      setIsDisconnecting(false);
      console.log('Disconnect process completed');
    }
  }, [onWalletDisconnected]);

  // Define event handlers with useCallback to prevent infinite re-renders
  const handleAccountsChanged = useCallback((accounts) => {
    if (accounts.length === 0) {
      handleDisconnect();
    } else {
      setUserAddress(accounts[0]);
      setIsConnected(true);
      onWalletConnected?.(accounts[0]);
    }
  }, [onWalletConnected, handleDisconnect]);

  const handleChainChanged = useCallback(async (chainId) => {
    console.log('🔄 Chain changed to:', chainId, 'Expected:', BLOCKCHAIN_CONFIG.NETWORK.chainId);
    
    if (chainId !== BLOCKCHAIN_CONFIG.NETWORK.chainId) {
      setNetworkError('Please switch to Polygon Amoy network');
      
      // Try to automatically switch to the correct network
      try {
        console.log('🔄 Attempting to switch to Polygon Amoy...');
        await switchToPolygonAmoy();
        console.log('✅ Successfully switched to Polygon Amoy');
        setNetworkError(null);
      } catch (switchError) {
        console.error('❌ Failed to switch network:', switchError);
        setNetworkError('Please switch to Polygon Amoy network manually');
      }
    } else {
      setNetworkError(null);
    }
  }, []);

  // Check if wallet is already connected
  useEffect(() => {
    const checkConnection = async () => {
      // Don't auto-connect if user manually disconnected
      if (manuallyDisconnected) {
        console.log('🚫 Skipping auto-connection - user manually disconnected');
        return;
      }
      
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            console.log('🔗 Auto-connecting to existing wallet...');
            
            // Check network and switch if needed
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (chainId !== BLOCKCHAIN_CONFIG.NETWORK.chainId) {
              console.log('🔄 Wrong network detected, switching to Polygon Amoy...');
              try {
                await switchToPolygonAmoy();
                console.log('✅ Successfully switched to Polygon Amoy');
              } catch (switchError) {
                console.error('❌ Failed to switch network:', switchError);
                setNetworkError('Please switch to Polygon Amoy network manually');
                // Still connect but show network error
              }
            }
            
            setUserAddress(accounts[0]);
            setIsConnected(true);
            onWalletConnected?.(accounts[0]);
          }
        } catch (error) {
          console.error('Failed to check wallet connection:', error);
        }
      }
    };

    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, [onWalletConnected, handleAccountsChanged, handleChainChanged, manuallyDisconnected]);

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionError(null);
    setNetworkError(null);

    try {
      const address = await connectWallet();
      setUserAddress(address);
      setIsConnected(true);
      setManuallyDisconnected(false); // Reset flag when user manually connects
      onWalletConnected?.(address);
    } catch (error) {
      console.error('Connection failed:', error);
      setConnectionError(error.message);
    } finally {
      setIsConnecting(false);
    }
  };


  const handleSwitchNetwork = async () => {
    try {
      await switchToPolygonAmoy();
      setNetworkError(null);
    } catch (error) {
      console.error('Failed to switch network:', error);
      setNetworkError('Failed to switch to Polygon Amoy network');
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(userAddress);
    // You could add a toast notification here
  };

  const openExplorer = () => {
    // Use the Amoy PolygonScan URL
    const explorerUrl = `https://amoy.polygonscan.com/address/${userAddress}`;
    
    try {
      window.open(explorerUrl, '_blank');
    } catch (error) {
      // Fallback: copy address to clipboard and show message
      navigator.clipboard.writeText(userAddress);
      alert(`Address copied to clipboard: ${userAddress}\n\nYou can manually search for this address on:\n- amoy.polygonscan.com`);
    }
  };

  if (!isConnected) {
    const isMetaMaskInstalled = typeof window.ethereum !== 'undefined';
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl shadow-lg border border-purple-500/20 p-4 sm:p-6"
      >
        <div className="text-center">
          <FaWallet className="text-4xl text-gradient-orange mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {isMetaMaskInstalled ? (translations.connectYourWallet || 'Connect Your Wallet') : (translations.installMetaMask || 'Install MetaMask')}
          </h3>
          <p className="text-purple-200 mb-6">
            {isMetaMaskInstalled 
              ? (translations.connectWalletDescription || 'Connect your MetaMask wallet to access blockchain features and view your STEM learning achievements.')
              : (translations.installMetaMaskDescription || 'Install MetaMask to connect your wallet and access blockchain features.')
            }
          </p>

          {connectionError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center space-x-3"
            >
              <FaExclamationTriangle className="text-red-500 text-xl" />
              <div>
                <p className="text-red-800 font-medium">{translations.connectionFailed || 'Connection Failed'}</p>
                <p className="text-red-600 text-sm">{connectionError}</p>
              </div>
            </motion.div>
          )}

          {isMetaMaskInstalled ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleConnect}
              disabled={isConnecting}
              className="px-6 py-3 bg-gradient-to-r from-gradient-orange to-gradient-pink hover:from-gradient-pink hover:to-gradient-purple text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto shadow-lg"
            >
              {isConnecting ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaWallet />
              )}
              <span>{isConnecting ? (translations.connecting || 'Connecting...') : (translations.connectMetaMask || 'Connect MetaMask')}</span>
            </motion.button>
          ) : (
            <motion.a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
            >
              <FaWallet />
              <span>Install MetaMask</span>
            </motion.a>
          )}

          <div className="mt-4 text-sm text-gray-500">
            {isMetaMaskInstalled ? (
              <p>Make sure you are on the Polygon Amoy testnet.</p>
            ) : (
              <p>MetaMask is required to interact with blockchain features.</p>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // console.log('WalletConnection render - isConnected:', isConnected, 'isDisconnecting:', isDisconnecting, 'isCollapsed:', isCollapsed);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow-md border border-gray-100 max-w-md mx-auto"
    >
      <div className="p-2 sm:p-3">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FaCheckCircle className="text-green-600 text-xs" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-semibold text-gray-800 truncate">Wallet Connected</h3>
              <p className="text-xs text-gray-600 truncate">MetaMask • Polygon Amoy</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                console.log('Collapse button clicked, current state:', isCollapsed);
                setIsCollapsed(!isCollapsed);
                console.log('New state will be:', !isCollapsed);
              }}
              className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              title={isCollapsed ? "Expand" : "Collapse"}
            >
              {isCollapsed ? <FaChevronDown className="text-sm" /> : <FaChevronUp className="text-sm" />}
            </motion.button>
          </div>
        </div>

        {/* Disconnect Button Row */}
        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: isDisconnecting ? 1 : 1.05 }}
            whileTap={{ scale: isDisconnecting ? 1 : 0.95 }}
            onClick={(e) => {
              console.log('Disconnect button clicked!', e);
              e.preventDefault();
              e.stopPropagation();
              handleDisconnect();
            }}
            disabled={isDisconnecting}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 flex items-center space-x-1 border shadow-sm ${
              isDisconnecting 
                ? 'text-red-400 cursor-not-allowed border-red-200 bg-red-50' 
                : 'text-white bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 hover:shadow-md'
            }`}
            style={{ minWidth: '90px' }}
            title="Click to disconnect your wallet"
          >
            {isDisconnecting ? (
              <>
                <FaSpinner className="animate-spin text-xs" />
                <span>Disconnecting...</span>
              </>
            ) : (
              <>
                <span>Disconnect</span>
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="border-t border-gray-100 px-2 sm:px-3 pb-2 sm:pb-3"
        >
          {/* Network Error */}
          {networkError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-orange-50 border border-orange-200 rounded-md p-2 mb-2 mt-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FaExclamationTriangle className="text-orange-500 text-sm" />
                  <div>
                    <p className="text-orange-800 font-medium text-xs">Wrong Network</p>
                    <p className="text-orange-600 text-xs">{networkError}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSwitchNetwork}
                  className="px-2 py-1 bg-orange-500 hover:bg-orange-600 text-white text-xs rounded transition-colors flex items-center space-x-1"
                >
                  <FaNetworkWired className="text-xs" />
                  <span>Switch</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Wallet Address */}
          <div className="p-2 bg-gray-50 rounded-md">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs text-gray-600 mb-1">Wallet Address</p>
                <p className="font-mono text-xs text-gray-800 truncate">
                  {formatAddress(userAddress)}
                </p>
              </div>
              <div className="flex space-x-1 ml-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={copyAddress}
                  className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                  title="Copy address"
                >
                  <FaCopy className="text-xs" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={openExplorer}
                  className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors"
                  title="View on explorer"
                >
                  <FaExternalLinkAlt className="text-xs" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Network Info */}
          <div className="p-2 bg-blue-50 rounded-md">
            <div className="flex items-center space-x-2 text-blue-700">
              <FaNetworkWired className="text-xs" />
              <span className="text-xs font-medium">Polygon Amoy Testnet</span>
            </div>
            <p className="text-xs text-blue-600 mt-1">
              Chain ID: {parseInt(BLOCKCHAIN_CONFIG.NETWORK.chainId, 16)}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Explorer: <a href={`https://amoy.polygonscan.com/address/${userAddress}`} target="_blank" rel="noopener noreferrer" className="underline hover:text-blue-800">amoy.polygonscan.com</a>
            </p>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default WalletConnection;
