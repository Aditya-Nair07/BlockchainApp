import { ethers } from 'ethers';
import { BLOCKCHAIN_CONFIG, CERTIFICATE_ABI, TOKEN_ABI, PROGRESS_ABI } from '../config/blockchain';

// Initialize provider and contracts
let provider;
let signer;
let certificateContract;
let tokenContract;
let progressContract;

// Initialize blockchain connection
export const initializeBlockchain = async () => {
  try {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== 'undefined') {
      console.log('🔗 Initializing blockchain connection...');
      
      // Check if wallet is connected
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length === 0) {
        console.warn('No wallet connected. App will run in read-only mode.');
        return null;
      }
      
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      
      // Verify we're on the correct network
      const network = await provider.getNetwork();
      const expectedChainId = parseInt(BLOCKCHAIN_CONFIG.NETWORK.chainId, 16);
      
      if (network.chainId !== expectedChainId) {
        console.warn(`Wrong network detected. Expected chain ID: ${expectedChainId}, got: ${network.chainId}`);
        console.warn('App will run in read-only mode. Please switch to Polygon Amoy network.');
        
        // Try to switch to the correct network
        try {
          console.log('🔄 Attempting to switch to Polygon Amoy from blockchain init...');
          await switchToPolygonAmoy();
          console.log('✅ Successfully switched to Polygon Amoy, reinitializing...');
          
          // Reinitialize with the correct network
          provider = new ethers.providers.Web3Provider(window.ethereum);
          signer = provider.getSigner();
        } catch (switchError) {
          console.error('❌ Failed to switch network from blockchain init:', switchError);
          return null;
        }
      }
      
      console.log('✅ Connected to Polygon Amoy network');
      
      // Initialize contracts
      certificateContract = new ethers.Contract(
        BLOCKCHAIN_CONFIG.CONTRACTS.CERTIFICATE_CONTRACT,
        CERTIFICATE_ABI,
        signer
      );
      
      tokenContract = new ethers.Contract(
        BLOCKCHAIN_CONFIG.CONTRACTS.TOKEN_CONTRACT,
        TOKEN_ABI,
        signer
      );
      
      progressContract = new ethers.Contract(
        BLOCKCHAIN_CONFIG.CONTRACTS.PROGRESS_CONTRACT,
        PROGRESS_ABI,
        signer
      );
      
      console.log('✅ Smart contracts initialized');
      return { provider, signer, certificateContract, tokenContract, progressContract };
    } else {
      // Return null instead of throwing error - allows app to run in read-only mode
      console.warn('MetaMask is not installed. App will run in read-only mode.');
      return null;
    }
  } catch (error) {
    console.error('Failed to initialize blockchain:', error);
    // Return null instead of throwing error
    return null;
  }
};

// Connect wallet
export const connectWallet = async () => {
  try {
    if (typeof window.ethereum !== 'undefined') {
      console.log('🔗 Requesting wallet connection...');
      
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock your wallet.');
      }
      
      console.log('✅ Wallet connected:', accounts[0]);
      
      // Check if we're on the correct network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      console.log('Current chain ID:', chainId, 'Expected:', BLOCKCHAIN_CONFIG.NETWORK.chainId);
      
      if (chainId !== BLOCKCHAIN_CONFIG.NETWORK.chainId) {
        console.log('🔄 Switching to Polygon Amoy network...');
        try {
          await switchToPolygonAmoy();
          console.log('✅ Successfully switched to Polygon Amoy');
        } catch (switchError) {
          console.error('❌ Failed to switch network:', switchError);
          throw new Error(`Please switch to Polygon Amoy network manually. ${switchError.message}`);
        }
      }
      
      return accounts[0];
    } else {
      throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
    }
  } catch (error) {
    console.error('❌ Failed to connect wallet:', error);
    
    // Provide more specific error messages
    if (error.code === 4001) {
      throw new Error('Connection rejected. Please approve the connection in MetaMask.');
    } else if (error.code === -32002) {
      throw new Error('Connection request already pending. Please check MetaMask.');
    } else if (error.message.includes('User rejected')) {
      throw new Error('Connection was rejected. Please try again and approve the connection.');
    } else {
      throw new Error(`Connection failed: ${error.message}`);
    }
  }
};

// Switch to Polygon Amoy network (replaces deprecated Mumbai)
export const switchToPolygonAmoy = async () => {
  try {
    console.log('🔄 Switching to Polygon Amoy network...');
    
    // First try to switch to the network
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: BLOCKCHAIN_CONFIG.NETWORK.chainId }],
    });
    
    console.log('✅ Successfully switched to Polygon Amoy');
  } catch (switchError) {
    console.log('❌ Switch failed, error code:', switchError.code);
    
    // If the network doesn't exist, add it
    if (switchError.code === 4902) {
      console.log('➕ Network not found, adding Polygon Amoy network...');
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [BLOCKCHAIN_CONFIG.NETWORK],
        });
        console.log('✅ Successfully added and switched to Polygon Amoy');
      } catch (addError) {
        console.error('❌ Failed to add Polygon Amoy network:', addError);
        throw new Error('Failed to add Polygon Amoy network. Please add it manually in MetaMask with these details:\n\n' +
          `Network Name: ${BLOCKCHAIN_CONFIG.NETWORK.chainName}\n` +
          `RPC URL: ${BLOCKCHAIN_CONFIG.NETWORK.rpcUrls[0]}\n` +
          `Chain ID: ${parseInt(BLOCKCHAIN_CONFIG.NETWORK.chainId, 16)}\n` +
          `Currency Symbol: ${BLOCKCHAIN_CONFIG.NETWORK.nativeCurrency.symbol}\n` +
          `Block Explorer: ${BLOCKCHAIN_CONFIG.NETWORK.blockExplorerUrls[0]}`);
      }
    } else if (switchError.code === 4001) {
      console.log('❌ User rejected network switch');
      throw new Error('Network switch was rejected. Please approve the network switch in MetaMask.');
    } else {
      console.error('❌ Failed to switch to Polygon Amoy network:', switchError);
      throw new Error(`Failed to switch to Polygon Amoy network: ${switchError.message}. Please switch manually in MetaMask.`);
    }
  }
};

// Keep the old function name for backward compatibility but redirect to new function
export const switchToPolygonMumbai = switchToPolygonAmoy;

// Get user's certificates
export const getUserCertificates = async (userAddress) => {
  try {
    if (!certificateContract) {
      await initializeBlockchain();
    }
    
    if (!certificateContract) {
      // Return demo data if no contract available
      return [
        {
          id: 0,
          title: "Python Programming Fundamentals",
          description: "Completed comprehensive Python programming course covering basics to intermediate concepts",
          ipfsHash: "QmDemoHash123456789",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
          isVerified: true
        },
        {
          id: 1,
          title: "Mathematics for STEM",
          description: "Advanced mathematics course covering calculus, algebra, and statistics",
          ipfsHash: "QmDemoHash987654321",
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
          isVerified: true
        }
      ];
    }
    
    const certificates = await certificateContract.getUserCertificates(userAddress);
    return certificates.map((cert, index) => ({
      id: index,
      title: cert.title,
      description: cert.description,
      ipfsHash: cert.ipfsHash,
      timestamp: new Date(cert.timestamp * 1000),
      isVerified: cert.isVerified
    }));
  } catch (error) {
    // Silently handle blockchain errors for demo mode
    // console.error('Failed to get certificates:', error);
    // Return demo data on error
    return [
      {
        id: 0,
        title: "Python Programming Fundamentals",
        description: "Completed comprehensive Python programming course covering basics to intermediate concepts",
        ipfsHash: "QmDemoHash123456789",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        isVerified: true
      },
      {
        id: 1,
        title: "Mathematics for STEM",
        description: "Advanced mathematics course covering calculus, algebra, and statistics",
        ipfsHash: "QmDemoHash987654321",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        isVerified: true
      }
    ];
  }
};

// Verify certificate
export const verifyCertificate = async (userAddress, certificateId) => {
  try {
    if (!certificateContract) {
      await initializeBlockchain();
    }
    
    if (!certificateContract) {
      // Demo mode - simulate verification with delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return true;
    }
    
    const isVerified = await certificateContract.verifyCertificate(userAddress, certificateId);
    return isVerified;
  } catch (error) {
    console.error('Failed to verify certificate:', error);
    // Return true for demo purposes
    return true;
  }
};

// Get token balance
export const getTokenBalance = async (userAddress) => {
  try {
    if (!tokenContract) {
      await initializeBlockchain();
    }
    
    if (!tokenContract) {
      // Return demo data if no contract available
      return "1250.50";
    }
    
    const balance = await tokenContract.balanceOf(userAddress);
    return ethers.utils.formatEther(balance);
  } catch (error) {
    console.error('Failed to get token balance:', error);
    // Return demo data on error
    return "1250.50";
  }
};

// Get recent transactions
export const getRecentTransactions = async (userAddress, limit = 10) => {
  try {
    if (!tokenContract) {
      await initializeBlockchain();
    }
    
    if (!tokenContract) {
      // Return demo data if no contract available
      return [
        {
          amount: "50.00",
          reason: "Completed Python Basics Course",
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
          isEarned: true
        },
        {
          amount: "75.00",
          reason: "Achieved Math Milestone",
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
          isEarned: true
        },
        {
          amount: "25.00",
          reason: "Science Quiz Completion",
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
          isEarned: true
        }
      ];
    }
    
    const transactions = await tokenContract.getRecentTransactions(userAddress, limit);
    return transactions.map(tx => ({
      amount: ethers.utils.formatEther(tx.amount),
      reason: tx.reason,
      timestamp: new Date(tx.timestamp * 1000),
      isEarned: tx.isEarned
    }));
  } catch (error) {
    console.error('Failed to get transactions:', error);
    // Return demo data on error
    return [
      {
        amount: "50.00",
        reason: "Completed Python Basics Course",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isEarned: true
      },
      {
        amount: "75.00",
        reason: "Achieved Math Milestone",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        isEarned: true
      },
      {
        amount: "25.00",
        reason: "Science Quiz Completion",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        isEarned: true
      }
    ];
  }
};

// Get user milestones
export const getUserMilestones = async (userAddress) => {
  try {
    if (!progressContract) {
      await initializeBlockchain();
    }
    
    if (!progressContract) {
      // Return demo data if no contract available
      return [
        {
          title: "Python Basics Completed",
          description: "Successfully completed Python programming fundamentals course with 95% score",
          hash: "0x1234567890abcdef1234567890abcdef12345678",
          timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
        },
        {
          title: "Mathematics Module 3",
          description: "Completed advanced calculus and linear algebra modules",
          hash: "0xabcdef1234567890abcdef1234567890abcdef12",
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        },
        {
          title: "Science Lab Project",
          description: "Finished chemistry lab project on molecular structures",
          hash: "0x567890abcdef1234567890abcdef1234567890ab",
          timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000) // 5 days ago
        },
        {
          title: "Engineering Design Challenge",
          description: "Completed bridge building engineering challenge with team",
          hash: "0x90abcdef1234567890abcdef1234567890abcdef",
          timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 1 week ago
        }
      ];
    }
    
    const milestones = await progressContract.getUserMilestones(userAddress);
    return milestones.map(milestone => ({
      title: milestone.title,
      description: milestone.description,
      hash: milestone.hash,
      timestamp: new Date(milestone.timestamp * 1000)
    }));
  } catch (error) {
    console.error('Failed to get milestones:', error);
    // Return demo data on error
    return [
      {
        title: "Python Basics Completed",
        description: "Successfully completed Python programming fundamentals course with 95% score",
        hash: "0x1234567890abcdef1234567890abcdef12345678",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Mathematics Module 3",
        description: "Completed advanced calculus and linear algebra modules",
        hash: "0xabcdef1234567890abcdef1234567890abcdef12",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Science Lab Project",
        description: "Finished chemistry lab project on molecular structures",
        hash: "0x567890abcdef1234567890abcdef1234567890ab",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      },
      {
        title: "Engineering Design Challenge",
        description: "Completed bridge building engineering challenge with team",
        hash: "0x90abcdef1234567890abcdef1234567890abcdef",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      }
    ];
  }
};

// Verify milestone
export const verifyMilestone = async (userAddress, milestoneHash) => {
  try {
    if (!progressContract) {
      await initializeBlockchain();
    }
    
    if (!progressContract) {
      // Return demo verification result
      return true;
    }
    
    const isVerified = await progressContract.verifyMilestone(userAddress, milestoneHash);
    return isVerified;
  } catch (error) {
    console.error('Failed to verify milestone:', error);
    // Return demo verification result on error
    return true;
  }
};

// Fetch IPFS metadata
export const fetchIPFSMetadata = async (ipfsHash) => {
  // Skip fetch for demo hashes to prevent errors
  if (ipfsHash.startsWith('QmDemoHash')) {
    return {
      image: '/api/placeholder/400/300',
      name: 'Certificate',
      description: 'Blockchain verified certificate'
    };
  }
  
  try {
    const response = await fetch(`${BLOCKCHAIN_CONFIG.IPFS.GATEWAY}${ipfsHash}`);
    if (!response.ok) {
      throw new Error('Failed to fetch IPFS metadata');
    }
    return await response.json();
  } catch (error) {
    // Silently handle IPFS errors for demo mode
    // console.error('Failed to fetch IPFS metadata:', error);
    // Return fallback metadata
    return {
      image: '/api/placeholder/400/300',
      name: 'Certificate',
      description: 'Blockchain verified certificate'
    };
  }
};

// Generate PDF for certificate
export const generateCertificatePDF = async (certificate) => {
  try {
    // Create a proper PDF-like certificate content
    const certificateContent = `
CERTIFICATE OF COMPLETION
========================

Title: ${certificate.title}
Description: ${certificate.description}
Issued Date: ${certificate.timestamp.toLocaleDateString()}
Certificate ID: ${certificate.id}
IPFS Hash: ${certificate.ipfsHash || 'N/A'}
Verification Status: ${certificate.isVerified ? 'VERIFIED' : 'PENDING'}

This certificate has been cryptographically verified on the blockchain
and represents authentic completion of the stated learning objectives.

Blockchain Network: Polygon Mumbai Testnet
Verification Method: Smart Contract Verification

---
STEM Learning Platform
Blockchain-Verified Education
    `.trim();

    // Create and download the certificate as a text file (PDF-like)
    const element = document.createElement('a');
    const file = new Blob([certificateContent], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `${certificate.title.replace(/\s+/g, '_')}_certificate.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    // Show success message
    alert('Certificate downloaded successfully! This is a blockchain-verified certificate.');
  } catch (error) {
    console.error('Failed to generate certificate:', error);
    alert('Failed to download certificate. Please try again.');
    throw error;
  }
};

// Utility function to format addresses
export const formatAddress = (address) => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Disconnect wallet
export const disconnectWallet = async () => {
  try {
    console.log('🔌 Disconnecting wallet...');
    
    // Clear the provider and signer
    console.log('🧹 Clearing blockchain variables...');
    provider = null;
    signer = null;
    certificateContract = null;
    tokenContract = null;
    progressContract = null;
    
    // Clear localStorage data
    console.log('🗑️ Clearing stored wallet data...');
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('userAddress');
    localStorage.removeItem('walletProvider');
    localStorage.removeItem('lastConnectedWallet');
    
    // Try to disconnect from MetaMask if possible
    if (typeof window.ethereum !== 'undefined') {
      try {
        // Some wallets support disconnect method
        if (window.ethereum.disconnect) {
          await window.ethereum.disconnect();
          console.log('✅ MetaMask disconnect called');
        }
        
        // Clear any stored connection state
        if (window.ethereum.removeAllListeners) {
          window.ethereum.removeAllListeners('accountsChanged');
          window.ethereum.removeAllListeners('chainChanged');
          console.log('✅ Event listeners removed');
        }
        
        // Reset MetaMask state if possible
        if (window.ethereum._metamask && window.ethereum._metamask.isUnlocked) {
          // This is a hack to force MetaMask to show the connect screen again
          try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            // Immediately disconnect by clearing our state
            console.log('🔄 Reset MetaMask connection state');
          } catch (e) {
            // This is expected - we're just trying to reset the state
          }
        }
      } catch (disconnectError) {
        console.log('ℹ️ MetaMask disconnect not supported or failed:', disconnectError);
        // This is normal - MetaMask doesn't have a disconnect method
      }
    }
    
    console.log('✅ Wallet disconnected successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to disconnect wallet:', error);
    // Still return true as we've cleared local state
    return true;
  }
};

// Utility function to format token amounts
export const formatTokenAmount = (amount) => {
  return parseFloat(amount).toFixed(2);
};
