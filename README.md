# STEM Blockchain Learning Platform

A complete React webpage implementing blockchain features for a gamified STEM learning platform focused on rural education. This platform provides blockchain-verified certificates, token rewards, and progress tracking for STEM learners.

## Features

### 🔐 Blockchain-Verified Certificates and Badges
- Display user's earned blockchain-backed certificates and badges as visually appealing cards
- Fetch certificate metadata from smart contracts deployed on Polygon Mumbai testnet
- Verify each certificate on-chain with cryptographic proof
- Download certificates as PDF files
- IPFS integration for decentralized metadata storage

### 🪙 Token Reward Dashboard
- Real-time token balance display with animated counters
- Recent transaction history with timestamps and status indicators
- Progress bars showing learning achievements
- Smooth animations and responsive design

### 📊 Progress Logging & Verification
- Timeline of logged learning milestones anchored on blockchain
- Cryptographic hash verification for tamper-proof progress tracking
- Real-time verification of on-chain vs off-chain data
- Visual progress indicators and achievement tracking

### 🔗 Wallet Integration
- MetaMask wallet connection
- Automatic network switching to Polygon Mumbai testnet
- Read-only mode for users without wallets
- Comprehensive error handling and user feedback

## Technology Stack

- **Frontend**: React 18 with functional components and hooks
- **Styling**: TailwindCSS with custom animations and responsive design
- **Blockchain**: Ethers.js for Web3 integration
- **Network**: Polygon Mumbai testnet
- **Storage**: IPFS for decentralized metadata storage
- **Animations**: Framer Motion for smooth UI transitions
- **Icons**: React Icons for consistent iconography

## Prerequisites

Before running this application, ensure you have:

1. **Node.js** (v16 or higher)
2. **MetaMask** browser extension installed
3. **Polygon Mumbai testnet** configured in MetaMask
4. **Smart contracts** deployed on Polygon Mumbai (see Smart Contract Setup)

## Installation

1. **Clone or download the project files**

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your actual values:
   - Smart contract addresses
   - Infura/Alchemy API keys
   - IPFS gateway URLs

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## Smart Contract Setup

### Required Smart Contracts

You need to deploy three smart contracts on Polygon Mumbai testnet:

1. **Certificate Contract** - Manages blockchain-verified certificates
2. **Token Contract** - Handles STEM learning tokens and rewards
3. **Progress Contract** - Tracks learning milestones and verification

### Contract Addresses

Update the following in your `.env` file:

```env
REACT_APP_CERTIFICATE_CONTRACT=0xYourCertificateContractAddress
REACT_APP_TOKEN_CONTRACT=0xYourTokenContractAddress
REACT_APP_PROGRESS_CONTRACT=0xYourProgressContractAddress
```

### Sample Contract ABIs

The application includes sample ABIs in `src/config/blockchain.js`. Update these with your actual contract ABIs.

## Configuration

### Blockchain Network

The application is configured for **Polygon Mumbai testnet**:

- **Chain ID**: 80001 (0x13881)
- **RPC URLs**: Infura/Alchemy endpoints
- **Block Explorer**: https://mumbai.polygonscan.com/

### IPFS Integration

Configure IPFS gateways in your environment:

```env
REACT_APP_IPFS_GATEWAY=https://ipfs.io/ipfs/
REACT_APP_PINATA_GATEWAY=https://gateway.pinata.cloud/ipfs/
```

## Usage

### For End Users

1. **Connect Wallet**: Click "Connect MetaMask" to link your wallet
2. **View Certificates**: Browse your blockchain-verified certificates and badges
3. **Check Rewards**: Monitor your token balance and transaction history
4. **Verify Progress**: Verify your learning milestones on the blockchain

### For Developers

1. **Integration**: Import components into your existing React application
2. **Customization**: Modify styling and behavior in component files
3. **Extension**: Add new features using the existing blockchain utilities

## Project Structure

```
src/
├── components/           # React components
│   ├── CertificateCard.js
│   ├── CertificatesSection.js
│   ├── TokenDashboard.js
│   ├── ProgressVerification.js
│   ├── WalletConnection.js
│   ├── AnimatedCounter.js
│   ├── ProgressBar.js
│   ├── TransactionItem.js
│   └── MilestoneItem.js
├── config/              # Configuration files
│   └── blockchain.js    # Smart contract ABIs and network config
├── utils/               # Utility functions
│   └── blockchain.js    # Blockchain interaction functions
├── App.js              # Main application component
├── index.js            # Application entry point
└── index.css           # Global styles and TailwindCSS
```

## Integration Guide

### Adding to Existing React App

1. **Copy Components**: Copy the `src/components/` directory to your project
2. **Copy Utils**: Copy `src/utils/blockchain.js` and `src/config/blockchain.js`
3. **Install Dependencies**: Add required packages to your `package.json`
4. **Configure Environment**: Set up your `.env` variables
5. **Import Components**: Use components in your application:

```jsx
import CertificatesSection from './components/CertificatesSection';
import TokenDashboard from './components/TokenDashboard';
import ProgressVerification from './components/ProgressVerification';

function MyApp() {
  return (
    <div>
      <CertificatesSection userAddress={userAddress} isConnected={isConnected} />
      <TokenDashboard userAddress={userAddress} isConnected={isConnected} />
      <ProgressVerification userAddress={userAddress} isConnected={isConnected} />
    </div>
  );
}
```

### Customization

- **Styling**: Modify TailwindCSS classes or add custom CSS
- **Colors**: Update color scheme in `tailwind.config.js`
- **Animations**: Customize Framer Motion animations
- **Layout**: Adjust component layouts and responsive breakpoints

## Troubleshooting

### Common Issues

1. **"MetaMask is not installed"**
   - Install MetaMask browser extension
   - Ensure it's enabled and unlocked

2. **"Wrong Network"**
   - Switch to Polygon Mumbai testnet in MetaMask
   - Add network if not present (Chain ID: 80001)

3. **"Contract not found"**
   - Verify contract addresses in `.env` file
   - Ensure contracts are deployed on Polygon Mumbai

4. **"Failed to load data"**
   - Check RPC endpoint configuration
   - Verify Infura/Alchemy API keys

### Development Tips

- Use browser developer tools to debug blockchain interactions
- Check MetaMask console for transaction details
- Monitor network requests for API calls
- Use Polygon Mumbai faucet for test MATIC tokens

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the troubleshooting section
- Review smart contract documentation
- Open an issue in the repository

## Roadmap

- [ ] Multi-wallet support (WalletConnect, Coinbase Wallet)
- [ ] Mobile app integration
- [ ] Advanced analytics dashboard
- [ ] NFT certificate support
- [ ] Cross-chain compatibility
- [ ] Offline mode support

---

**Built for rural education empowerment through blockchain technology.**
