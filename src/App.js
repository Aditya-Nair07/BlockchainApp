import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaGraduationCap, 
  FaCoins, 
  FaShieldAlt, 
  FaSpinner,
  FaExclamationTriangle,
  FaUsers,
  FaQuestionCircle,
  FaGamepad,
  FaWifi
} from 'react-icons/fa';
import WalletConnection from './components/WalletConnection';
import CertificatesSection from './components/CertificatesSection';
import TokenDashboard from './components/TokenDashboard';
import ProgressVerification from './components/ProgressVerification';
import TestimonialsSection from './components/TestimonialsSection';
import HelpSection from './components/HelpSection';
import InteractiveGames from './components/InteractiveGames';
import OfflineAccess from './components/OfflineAccess';
import LanguageSelector from './components/LanguageSelector';
import { initializeBlockchain } from './utils/blockchain';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const [initializationError, setInitializationError] = useState(null);
  const [activeTab, setActiveTab] = useState('certificates');
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  // Translation object
  const translations = {
    en: {
      stemLearningPlatform: 'VidyaQuest',
      blockchainVerifiedEducation: 'Educational Excellence',
      certificates: 'Certificates',
      tokenRewards: 'Token Rewards',
      progress: 'Progress',
      interactiveGames: 'Interactive Games',
      successStories: 'Success Stories',
      offlineAccess: 'Offline Access',
      helpGuide: 'Help & Guide',
      connectWallet: 'Connect Wallet',
      features: 'Features',
      technology: 'Technology',
      blockchainVerifiedCertificates: 'Blockchain-verified certificates',
      tokenRewardSystem: 'Token reward system',
      progressTracking: 'Progress tracking',
      decentralizedStorage: 'Decentralized storage',
      polygonMumbaiTestnet: 'Polygon Mumbai Testnet',
      ipfsStorage: 'IPFS Storage',
      metamaskIntegration: 'MetaMask Integration',
      reactEthersjs: 'React & Ethers.js',
      copyright: '© 2025 VidyaQuest. Built for rural education empowerment.',
      connectYourWallet: 'Connect Your Wallet',
      installMetaMask: 'Install MetaMask',
      connectWalletDescription: 'Connect your MetaMask wallet to access blockchain features and view your STEM learning achievements.',
      installMetaMaskDescription: 'Install MetaMask to connect your wallet and access blockchain features.',
      connectionFailed: 'Connection Failed',
      connectMetaMask: 'Connect MetaMask',
      connecting: 'Connecting...',
      disconnect: 'Disconnect',
      walletConnected: 'Wallet Connected',
      metamaskPolygonMumbai: 'MetaMask • Polygon Mumbai',
      wrongNetwork: 'Wrong Network',
      pleaseSwitchNetwork: 'Please switch to Polygon Mumbai network',
      switch: 'Switch',
      walletAddress: 'Wallet Address',
      copyAddress: 'Copy address',
      viewOnExplorer: 'View on explorer',
      chainId: 'Chain ID',
      explorer: 'Explorer'
    },
    hi: {
      stemLearningPlatform: 'विद्या क्वेस्ट',
      blockchainVerifiedEducation: 'शैक्षिक उत्कृष्टता',
      certificates: 'प्रमाणपत्र',
      tokenRewards: 'टोकन पुरस्कार',
      progress: 'प्रगति',
      interactiveGames: 'इंटरैक्टिव गेम्स',
      successStories: 'सफलता की कहानियां',
      offlineAccess: 'ऑफलाइन एक्सेस',
      helpGuide: 'सहायता और गाइड',
      connectWallet: 'वॉलेट कनेक्ट करें',
      features: 'विशेषताएं',
      technology: 'प्रौद्योगिकी',
      blockchainVerifiedCertificates: 'ब्लॉकचेन-सत्यापित प्रमाणपत्र',
      tokenRewardSystem: 'टोकन पुरस्कार प्रणाली',
      progressTracking: 'प्रगति ट्रैकिंग',
      decentralizedStorage: 'विकेंद्रीकृत भंडारण',
      polygonMumbaiTestnet: 'पॉलीगॉन मुंबई टेस्टनेट',
      ipfsStorage: 'IPFS भंडारण',
      metamaskIntegration: 'मेटामास्क एकीकरण',
      reactEthersjs: 'React और Ethers.js',
      copyright: '© 2025 विद्या क्वेस्ट। ग्रामीण शिक्षा सशक्तिकरण के लिए निर्मित।',
      connectYourWallet: 'अपना वॉलेट कनेक्ट करें',
      installMetaMask: 'मेटामास्क इंस्टॉल करें',
      connectWalletDescription: 'ब्लॉकचेन फीचर्स तक पहुंचने और अपनी STEM लर्निंग उपलब्धियों को देखने के लिए अपना मेटामास्क वॉलेट कनेक्ट करें।',
      installMetaMaskDescription: 'अपना वॉलेट कनेक्ट करने और ब्लॉकचेन फीचर्स तक पहुंचने के लिए मेटामास्क इंस्टॉल करें।',
      connectionFailed: 'कनेक्शन असफल',
      connectMetaMask: 'मेटामास्क कनेक्ट करें',
      connecting: 'कनेक्ट हो रहा है...',
      disconnect: 'डिस्कनेक्ट करें',
      walletConnected: 'वॉलेट कनेक्टेड',
      metamaskPolygonMumbai: 'मेटामास्क • पॉलीगॉन मुंबई',
      wrongNetwork: 'गलत नेटवर्क',
      pleaseSwitchNetwork: 'कृपया पॉलीगॉन मुंबई नेटवर्क पर स्विच करें',
      switch: 'स्विच करें',
      walletAddress: 'वॉलेट पता',
      copyAddress: 'पता कॉपी करें',
      viewOnExplorer: 'एक्सप्लोरर पर देखें',
      chainId: 'चेन ID',
      explorer: 'एक्सप्लोरर'
    },
    bn: {
      stemLearningPlatform: 'বিদ্যা কোয়েস্ট',
      blockchainVerifiedEducation: 'শিক্ষাগত উৎকর্ষ',
      certificates: 'সার্টিফিকেট',
      tokenRewards: 'টোকেন পুরস্কার',
      progress: 'অগ্রগতি',
      interactiveGames: 'ইন্টারঅ্যাক্টিভ গেমস',
      successStories: 'সফলতার গল্প',
      offlineAccess: 'অফলাইন অ্যাক্সেস',
      helpGuide: 'সাহায্য এবং গাইড',
      connectWallet: 'ওয়ালেট সংযোগ করুন',
      features: 'বৈশিষ্ট্য',
      technology: 'প্রযুক্তি',
      blockchainVerifiedCertificates: 'ব্লকচেইন-যাচাইকৃত সার্টিফিকেট',
      tokenRewardSystem: 'টোকেন পুরস্কার সিস্টেম',
      progressTracking: 'অগ্রগতি ট্র্যাকিং',
      decentralizedStorage: 'বিকেন্দ্রীকৃত স্টোরেজ',
      polygonMumbaiTestnet: 'পলিগন মুম্বাই টেস্টনেট',
      ipfsStorage: 'IPFS স্টোরেজ',
      metamaskIntegration: 'মেটামাস্ক ইন্টিগ্রেশন',
      reactEthersjs: 'React এবং Ethers.js',
      copyright: '© 2025 বিদ্যা কোয়েস্ট। গ্রামীণ শিক্ষা ক্ষমতায়নের জন্য নির্মিত।'
    },
    te: {
      stemLearningPlatform: 'విద్యా క్వెస్ట్',
      blockchainVerifiedEducation: 'విద్యాపరమైన ఉత్తమత్వం',
      certificates: 'సర్టిఫికేట్లు',
      tokenRewards: 'టోకెన్ రివార్డ్స్',
      progress: 'ప్రగతి',
      interactiveGames: 'ఇంటరాక్టివ్ గేమ్స్',
      successStories: 'విజయ కథలు',
      offlineAccess: 'ఆఫ్లైన్ యాక్సెస్',
      helpGuide: 'సహాయం మరియు గైడ్',
      connectWallet: 'వాలెట్ కనెక్ట్ చేయండి',
      features: 'లక్షణాలు',
      technology: 'సాంకేతికత',
      blockchainVerifiedCertificates: 'బ్లాక్చైన్-ధృవీకరించబడిన సర్టిఫికేట్లు',
      tokenRewardSystem: 'టోకెన్ రివార్డ్ సిస్టమ్',
      progressTracking: 'ప్రగతి ట్రాకింగ్',
      decentralizedStorage: 'వికేంద్రీకృత నిల్వ',
      polygonMumbaiTestnet: 'పాలిగాన్ ముంబై టెస్ట్నెట్',
      ipfsStorage: 'IPFS నిల్వ',
      metamaskIntegration: 'మెటామాస్క్ ఇంటిగ్రేషన్',
      reactEthersjs: 'React మరియు Ethers.js',
      copyright: '© 2025 విద్యా క్వెస్ట్। గ్రామీణ విద్యా శక్తివంతం కోసం నిర్మించబడింది।'
    },
    mr: {
      stemLearningPlatform: 'विद्या क्वेस्ट',
      blockchainVerifiedEducation: 'शैक्षिक उत्कृष्टता',
      certificates: 'प्रमाणपत्रे',
      tokenRewards: 'टोकन बक्षिसे',
      progress: 'प्रगती',
      interactiveGames: 'इंटरऍक्टिव गेम्स',
      successStories: 'यशाच्या कथा',
      offlineAccess: 'ऑफलाइन प्रवेश',
      helpGuide: 'मदत आणि मार्गदर्शन',
      connectWallet: 'वॉलेट कनेक्ट करा',
      features: 'वैशिष्ट्ये',
      technology: 'तंत्रज्ञान',
      blockchainVerifiedCertificates: 'ब्लॉकचेन-सत्यापित प्रमाणपत्रे',
      tokenRewardSystem: 'टोकन बक्षिस प्रणाली',
      progressTracking: 'प्रगती ट्रॅकिंग',
      decentralizedStorage: 'विकेंद्रीकृत स्टोरेज',
      polygonMumbaiTestnet: 'पॉलीगॉन मुंबई टेस्टनेट',
      ipfsStorage: 'IPFS स्टोरेज',
      metamaskIntegration: 'मेटामास्क एकीकरण',
      reactEthersjs: 'React आणि Ethers.js',
      copyright: '© 2025 विद्या क्वेस्ट। ग्रामीण शिक्षा सशक्तीकरणासाठी बांधले।'
    },
    or: {
      stemLearningPlatform: 'ବିଦ୍ୟା କ୍ୱେଷ୍ଟ',
      blockchainVerifiedEducation: 'ଶିକ୍ଷାଗତ ଉତ୍କୃଷ୍ଟତା',
      certificates: 'ପ୍ରମାଣପତ୍ର',
      tokenRewards: 'ଟୋକେନ୍ ପୁରସ୍କାର',
      progress: 'ଅଗ୍ରଗତି',
      interactiveGames: 'ଇଣ୍ଟରାକ୍ଟିଭ୍ ଗେମ୍',
      successStories: 'ସଫଳତାର କାହାଣୀ',
      offlineAccess: 'ଅଫଲାଇନ୍ ଆକ୍ସେସ୍',
      helpGuide: 'ସାହାଯ୍ୟ ଏବଂ ଗାଇଡ୍',
      connectWallet: 'ୱାଲେଟ୍ କନେକ୍ଟ୍ କରନ୍ତୁ',
      features: 'ବିଶେଷତା',
      technology: 'ପ୍ରଯୁକ୍ତିବିଦ୍ୟା',
      blockchainVerifiedCertificates: 'ବ୍ଲକ୍‌ଚେନ୍-ଯାଚିତ ପ୍ରମାଣପତ୍ର',
      tokenRewardSystem: 'ଟୋକେନ୍ ପୁରସ୍କାର ପ୍ରଣାଳୀ',
      progressTracking: 'ଅଗ୍ରଗତି ଟ୍ରାକିଂ',
      decentralizedStorage: 'ବିକେନ୍ଦ୍ରୀକୃତ ସ୍ଟୋରେଜ୍',
      polygonMumbaiTestnet: 'ପଲିଗନ୍ ମୁମ୍ବାଇ ଟେଷ୍ଟନେଟ୍',
      ipfsStorage: 'IPFS ସ୍ଟୋରେଜ୍',
      metamaskIntegration: 'ମେଟାମାସ୍କ୍ ଇଣ୍ଟିଗ୍ରେସନ୍',
      reactEthersjs: 'React ଏବଂ Ethers.js',
      copyright: '© 2025 ବିଦ୍ୟା କ୍ୱେଷ୍ଟ। ଗ୍ରାମୀଣ ଶିକ୍ଷା ଶକ୍ତିକରଣ ପାଇଁ ନିର୍ମିତ।',
      connectYourWallet: 'ଆପଣାର ୱାଲେଟ୍ କନେକ୍ଟ୍ କରନ୍ତୁ',
      installMetaMask: 'ମେଟାମାସ୍କ୍ ଇନଷ୍ଟଲ୍ କରନ୍ତୁ',
      connectWalletDescription: 'ବ୍ଲକ୍‌ଚେନ୍ ଫିଚର୍ ଏବଂ ଆପଣାର STEM ଶିକ୍ଷା ଅଭିଯୋଗ ଦେଖିବା ପାଇଁ ଆପଣାର ମେଟାମାସ୍କ୍ ୱାଲେଟ୍ କନେକ୍ଟ୍ କରନ୍ତୁ।',
      installMetaMaskDescription: 'ଆପଣାର ୱାଲେଟ୍ କନେକ୍ଟ୍ କରିବା ଏବଂ ବ୍ଲକ୍‌ଚେନ୍ ଫିଚର୍ ଆକ୍ସେସ୍ କରିବା ପାଇଁ ମେଟାମାସ୍କ୍ ଇନଷ୍ଟଲ୍ କରନ୍ତୁ।',
      connectionFailed: 'କନେକ୍ସନ୍ ବିଫଳ',
      connectMetaMask: 'ମେଟାମାସ୍କ୍ କନେକ୍ଟ୍ କରନ୍ତୁ',
      connecting: 'କନେକ୍ଟ୍ ହେଉଛି...',
      disconnect: 'ଡିସକନେକ୍ଟ୍',
      walletConnected: 'ୱାଲେଟ୍ କନେକ୍ଟେଡ୍',
      metamaskPolygonMumbai: 'ମେଟାମାସ୍କ୍ • ପଲିଗନ୍ ମୁମ୍ବାଇ',
      wrongNetwork: 'ଭୁଲ୍ ନେଟୱର୍କ୍',
      pleaseSwitchNetwork: 'ଦୟାକରି ପଲିଗନ୍ ମୁମ୍ବାଇ ନେଟୱର୍କ୍‌କୁ ସ୍ୱିଚ୍ କରନ୍ତୁ',
      switch: 'ସ୍ୱିଚ୍',
      walletAddress: 'ୱାଲେଟ୍ ଠିକଣା',
      copyAddress: 'ଠିକଣା କପି କରନ୍ତୁ',
      viewOnExplorer: 'ଏକ୍ସପ୍ଲୋରର୍‌ରେ ଦେଖନ୍ତୁ',
      chainId: 'ଚେନ୍ ID',
      explorer: 'ଏକ୍ସପ୍ଲୋରର୍'
    },
    ml: {
      stemLearningPlatform: 'വിദ്യാ ക്വസ്റ്റ്',
      blockchainVerifiedEducation: 'വിദ്യാഭ്യാസ മികവ്',
      certificates: 'സർട്ടിഫിക്കറ്റുകൾ',
      tokenRewards: 'ടോക്കൺ റിവാർഡുകൾ',
      progress: 'പുരോഗതി',
      interactiveGames: 'ഇന്ററാക്ടീവ് ഗെയിമുകൾ',
      successStories: 'വിജയ കഥകൾ',
      offlineAccess: 'ഓഫ്ലൈൻ ആക്സസ്',
      helpGuide: 'സഹായവും ഗൈഡും',
      connectWallet: 'വാലറ്റ് കണക്റ്റ് ചെയ്യുക',
      features: 'സവിശേഷതകൾ',
      technology: 'സാങ്കേതികവിദ്യ',
      blockchainVerifiedCertificates: 'ബ്ലോക്ക്‌ചെയിൻ-സ്ഥിരീകരിച്ച സർട്ടിഫിക്കറ്റുകൾ',
      tokenRewardSystem: 'ടോക്കൺ റിവാർഡ് സിസ്റ്റം',
      progressTracking: 'പുരോഗതി ട്രാക്കിംഗ്',
      decentralizedStorage: 'വികേന്ദ്രീകൃത സ്റ്റോറേജ്',
      polygonMumbaiTestnet: 'പോളിഗൺ മുംബൈ ടെസ്റ്റ്നെറ്റ്',
      ipfsStorage: 'IPFS സ്റ്റോറേജ്',
      metamaskIntegration: 'മെറ്റാമാസ്ക് ഇന്റഗ്രേഷൻ',
      reactEthersjs: 'React ഉം Ethers.js ഉം',
      copyright: '© 2025 വിദ്യാ ക്വസ്റ്റ്. ഗ്രാമീണ വിദ്യാഭ്യാസ ശാക്തീകരണത്തിനായി നിർമ്മിച്ചത്.',
      connectYourWallet: 'നിങ്ങളുടെ വാലറ്റ് കണക്റ്റ് ചെയ്യുക',
      installMetaMask: 'മെറ്റാമാസ്ക് ഇൻസ്റ്റാൾ ചെയ്യുക',
      connectWalletDescription: 'ബ്ലോക്ക്‌ചെയിൻ ഫീച്ചറുകളും നിങ്ങളുടെ STEM പഠന നേട്ടങ്ങളും കാണാൻ നിങ്ങളുടെ മെറ്റാമാസ്ക് വാലറ്റ് കണക്റ്റ് ചെയ്യുക.',
      installMetaMaskDescription: 'നിങ്ങളുടെ വാലറ്റ് കണക്റ്റ് ചെയ്യാനും ബ്ലോക്ക്‌ചെയിൻ ഫീച്ചറുകൾ ആക്സസ് ചെയ്യാനും മെറ്റാമാസ്ക് ഇൻസ്റ്റാൾ ചെയ്യുക.',
      connectionFailed: 'കണക്ഷൻ പരാജയപ്പെട്ടു',
      connectMetaMask: 'മെറ്റാമാസ്ക് കണക്റ്റ് ചെയ്യുക',
      connecting: 'കണക്റ്റ് ചെയ്യുന്നു...',
      disconnect: 'ഡിസ്കണക്റ്റ്',
      walletConnected: 'വാലറ്റ് കണക്റ്റ് ചെയ്തു',
      metamaskPolygonMumbai: 'മെറ്റാമാസ്ക് • പോളിഗൺ മുംബൈ',
      wrongNetwork: 'തെറ്റായ നെറ്റ്‌വർക്ക്',
      pleaseSwitchNetwork: 'ദയവായി പോളിഗൺ മുംബൈ നെറ്റ്‌വർക്കിലേക്ക് മാറുക',
      switch: 'മാറുക',
      walletAddress: 'വാലറ്റ് വിലാസം',
      copyAddress: 'വിലാസം കോപ്പി ചെയ്യുക',
      viewOnExplorer: 'എക്സ്പ്ലോററിൽ കാണുക',
      chainId: 'ചെയിൻ ID',
      explorer: 'എക്സ്പ്ലോറർ'
    }
  };

  const t = translations[selectedLanguage] || translations.en;

  // Initialize blockchain connection
  useEffect(() => {
    const init = async () => {
      try {
        const result = await initializeBlockchain();
        if (result === null) {
          // MetaMask not installed - app can still run in read-only mode
          console.log('Running in read-only mode without MetaMask');
        }
        setIsInitializing(false);
      } catch (error) {
        console.error('Failed to initialize blockchain:', error);
        setInitializationError(error.message);
        setIsInitializing(false);
      }
    };

    init();
  }, []);

  const handleWalletConnected = (address) => {
    setUserAddress(address);
    setIsConnected(true);
  };

  const handleWalletDisconnected = () => {
    console.log('🔄 App: Wallet disconnected, clearing all state...');
    setUserAddress('');
    setIsConnected(false);
    
    // Clear any other app-specific state if needed
    // You can add more state clearing here if you have other wallet-related state
    console.log('✅ App: All wallet state cleared');
  };

  const tabs = [
    {
      id: 'certificates',
      label: t.certificates,
      icon: FaGraduationCap,
      color: 'primary'
    },
    {
      id: 'tokens',
      label: t.tokenRewards,
      icon: FaCoins,
      color: 'accent'
    },
    {
      id: 'progress',
      label: t.progress,
      icon: FaShieldAlt,
      color: 'purple'
    },
    {
      id: 'games',
      label: t.interactiveGames,
      icon: FaGamepad,
      color: 'orange'
    },
    {
      id: 'testimonials',
      label: t.successStories,
      icon: FaUsers,
      color: 'green'
    },
    {
      id: 'offline',
      label: t.offlineAccess,
      icon: FaWifi,
      color: 'indigo'
    },
    {
      id: 'help',
      label: t.helpGuide,
      icon: FaQuestionCircle,
      color: 'blue'
    }
  ];



  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="text-4xl text-gradient-orange animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Initializing Blockchain Connection
          </h2>
          <p className="text-purple-200">
            Setting up your VidyaQuest platform...
          </p>
        </div>
      </div>
    );
  }

  if (initializationError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <FaExclamationTriangle className="text-4xl text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">
            Initialization Failed
          </h2>
          <p className="text-purple-200 mb-4">
            {initializationError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gradient-to-r from-gradient-orange to-gradient-pink hover:from-gradient-pink hover:to-gradient-purple text-white rounded-lg font-medium transition-all duration-300 shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-purple-500/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-gradient-orange to-gradient-pink rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg">
                <FaGraduationCap className="text-white text-lg sm:text-xl" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gradient-orange to-gradient-pink bg-clip-text text-transparent truncate">
                  {t.stemLearningPlatform}
                </h1>
                <p className="text-xs sm:text-sm text-purple-200 hidden sm:block">
                  {t.blockchainVerifiedEducation}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 flex-shrink-0">
              <LanguageSelector onLanguageChange={setSelectedLanguage} />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Wallet Connection Section */}
        <div className="mb-4">
          <WalletConnection
            onWalletConnected={handleWalletConnected}
            onWalletDisconnected={handleWalletDisconnected}
            translations={t}
          />
        </div>
        
        {/* Tab Navigation */}
        <div className="mb-6 sm:mb-8">
          <div className="border-b border-purple-500/20 overflow-hidden">
            <nav className="-mb-px flex flex-wrap justify-center sm:justify-start space-x-2 sm:space-x-4 lg:space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <motion.button
                    key={tab.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-1 sm:space-x-2 py-2 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                      isActive
                        ? 'border-gradient-orange text-gradient-orange'
                        : 'border-transparent text-purple-300 hover:text-white hover:border-purple-400'
                    }`}
                  >
                    <Icon className={`text-base sm:text-lg ${isActive ? 'text-gradient-orange' : 'text-purple-400'}`} />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                  </motion.button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'certificates' && (
            <CertificatesSection
              userAddress={userAddress}
              isConnected={isConnected}
            />
          )}
          
          {activeTab === 'tokens' && (
            <TokenDashboard
              userAddress={userAddress}
              isConnected={isConnected}
            />
          )}
          
          {activeTab === 'progress' && (
            <ProgressVerification
              userAddress={userAddress}
              isConnected={isConnected}
            />
          )}
          
          {activeTab === 'games' && (
            <InteractiveGames
              userAddress={userAddress}
              isConnected={isConnected}
            />
          )}
          
          {activeTab === 'testimonials' && (
            <TestimonialsSection />
          )}
          
          {activeTab === 'offline' && (
            <OfflineAccess
              userAddress={userAddress}
              isConnected={isConnected}
            />
          )}
          
          {activeTab === 'help' && (
            <HelpSection />
          )}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-md border-t border-purple-500/20 mt-8 sm:mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div>
              <h3 className="text-base sm:text-lg font-semibold bg-gradient-to-r from-gradient-orange to-gradient-pink bg-clip-text text-transparent mb-3 sm:mb-4">
                {t.stemLearningPlatform}
              </h3>
              <p className="text-purple-200 text-xs sm:text-sm">
                Empowering rural education through blockchain-verified STEM learning achievements.
              </p>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-white mb-3 sm:mb-4">
                {t.features}
              </h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-purple-200">
                <li>{t.blockchainVerifiedCertificates}</li>
                <li>{t.tokenRewardSystem}</li>
                <li>{t.progressTracking}</li>
                <li>{t.decentralizedStorage}</li>
              </ul>
            </div>
            
            <div className="sm:col-span-2 lg:col-span-1">
              <h4 className="text-sm font-semibold text-white mb-3 sm:mb-4">
                {t.technology}
              </h4>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-purple-200">
                <li>{t.polygonMumbaiTestnet}</li>
                <li>{t.ipfsStorage}</li>
                <li>{t.metamaskIntegration}</li>
                <li>{t.reactEthersjs}</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-purple-500/20 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-xs sm:text-sm text-purple-300">
              {t.copyright}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
