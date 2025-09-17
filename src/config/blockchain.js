// Blockchain configuration for Polygon Amoy testnet (replaces deprecated Mumbai)
export const BLOCKCHAIN_CONFIG = {
  // Polygon Amoy testnet configuration (Mumbai was deprecated April 13, 2024)
  NETWORK: {
    chainId: '0x13882', // 80002 in hex
    chainName: 'Polygon Amoy',
    rpcUrls: [
      'https://rpc-amoy.polygon.technology/',
      'https://polygon-amoy.g.alchemy.com/v2/demo',
      'https://rpc.ankr.com/polygon_amoy'
    ],
    blockExplorerUrls: ['https://amoy.polygonscan.com/'],
    nativeCurrency: {
      name: 'POL',
      symbol: 'POL',
      decimals: 18
    }
  },
  
  // Smart contract addresses (update these with your deployed contracts)
  CONTRACTS: {
    CERTIFICATE_CONTRACT: process.env.REACT_APP_CERTIFICATE_CONTRACT || '0x1234567890123456789012345678901234567890',
    TOKEN_CONTRACT: process.env.REACT_APP_TOKEN_CONTRACT || '0x1234567890123456789012345678901234567890',
    PROGRESS_CONTRACT: process.env.REACT_APP_PROGRESS_CONTRACT || '0x1234567890123456789012345678901234567890'
  },
  
  // IPFS configuration
  IPFS: {
    GATEWAY: 'https://ipfs.io/ipfs/',
    PINATA_GATEWAY: 'https://gateway.pinata.cloud/ipfs/'
  },
  
  // Default gas settings
  GAS: {
    GAS_LIMIT: 500000,
    GAS_PRICE: 20000000000 // 20 gwei
  }
};

// Smart Contract ABIs
export const CERTIFICATE_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "uint256", "name": "certificateId", "type": "uint256"}
    ],
    "name": "getCertificate",
    "outputs": [
      {
        "components": [
          {"internalType": "string", "name": "title", "type": "string"},
          {"internalType": "string", "name": "description", "type": "string"},
          {"internalType": "string", "name": "ipfsHash", "type": "string"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
          {"internalType": "bool", "name": "isVerified", "type": "bool"}
        ],
        "internalType": "struct Certificate",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserCertificates",
    "outputs": [
      {
        "components": [
          {"internalType": "string", "name": "title", "type": "string"},
          {"internalType": "string", "name": "description", "type": "string"},
          {"internalType": "string", "name": "ipfsHash", "type": "string"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
          {"internalType": "bool", "name": "isVerified", "type": "bool"}
        ],
        "internalType": "struct Certificate[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "uint256", "name": "certificateId", "type": "uint256"}
    ],
    "name": "verifyCertificate",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
];

export const TOKEN_ABI = [
  {
    "inputs": [{"internalType": "address", "name": "account", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "uint256", "name": "limit", "type": "uint256"}
    ],
    "name": "getRecentTransactions",
    "outputs": [
      {
        "components": [
          {"internalType": "uint256", "name": "amount", "type": "uint256"},
          {"internalType": "string", "name": "reason", "type": "string"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
          {"internalType": "bool", "name": "isEarned", "type": "bool"}
        ],
        "internalType": "struct Transaction[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

export const PROGRESS_ABI = [
  {
    "inputs": [
      {"internalType": "address", "name": "user", "type": "address"},
      {"internalType": "string", "name": "milestoneHash", "type": "string"}
    ],
    "name": "verifyMilestone",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"internalType": "address", "name": "user", "type": "address"}],
    "name": "getUserMilestones",
    "outputs": [
      {
        "components": [
          {"internalType": "string", "name": "title", "type": "string"},
          {"internalType": "string", "name": "description", "type": "string"},
          {"internalType": "string", "name": "hash", "type": "string"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"}
        ],
        "internalType": "struct Milestone[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
