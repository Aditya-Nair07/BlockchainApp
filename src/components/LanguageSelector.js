import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaGlobe, 
  FaChevronDown, 
  FaChevronUp,
  FaCheck,
  FaLanguage
} from 'react-icons/fa';

const LanguageSelector = ({ onLanguageChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const languages = [
    {
      code: 'en',
      name: 'English',
      nativeName: 'English',
      flag: '🇺🇸',
      direction: 'ltr'
    },
    {
      code: 'hi',
      name: 'Hindi',
      nativeName: 'हिन्दी',
      flag: '🇮🇳',
      direction: 'ltr'
    },
    {
      code: 'bn',
      name: 'Bengali',
      nativeName: 'বাংলা',
      flag: '🇧🇩',
      direction: 'ltr'
    },
    {
      code: 'te',
      name: 'Telugu',
      nativeName: 'తెలుగు',
      flag: '🇮🇳',
      direction: 'ltr'
    },
    {
      code: 'mr',
      name: 'Marathi',
      nativeName: 'मराठी',
      flag: '🇮🇳',
      direction: 'ltr'
    },
    {
      code: 'ta',
      name: 'Tamil',
      nativeName: 'தமிழ்',
      flag: '🇮🇳',
      direction: 'ltr'
    },
    {
      code: 'gu',
      name: 'Gujarati',
      nativeName: 'ગુજરાતી',
      flag: '🇮🇳',
      direction: 'ltr'
    },
    {
      code: 'kn',
      name: 'Kannada',
      nativeName: 'ಕನ್ನಡ',
      flag: '🇮🇳',
      direction: 'ltr'
    },
    {
      code: 'ml',
      name: 'Malayalam',
      nativeName: 'മലയാളം',
      flag: '🇮🇳',
      direction: 'ltr'
    },
    {
      code: 'pa',
      name: 'Punjabi',
      nativeName: 'ਪੰਜਾਬੀ',
      flag: '🇮🇳',
      direction: 'ltr'
    },
    {
      code: 'or',
      name: 'Odia',
      nativeName: 'ଓଡ଼ିଆ',
      flag: '🇮🇳',
      direction: 'ltr'
    }
  ];

  const translations = {
    en: {
      selectLanguage: 'Select Language',
      language: 'Language',
      connectWallet: 'Connect Wallet',
      certificates: 'Certificates',
      tokenRewards: 'Token Rewards',
      progress: 'Progress',
      successStories: 'Success Stories',
      helpGuide: 'Help & Guide',
      interactiveGames: 'Interactive Games',
      offlineMode: 'Offline Mode',
      stemLearningPlatform: 'STEM Learning Platform',
      blockchainVerifiedEducation: 'Blockchain-Verified Education'
    },
    hi: {
      selectLanguage: 'भाषा चुनें',
      language: 'भाषा',
      connectWallet: 'वॉलेट कनेक्ट करें',
      certificates: 'प्रमाणपत्र',
      tokenRewards: 'टोकन पुरस्कार',
      progress: 'प्रगति',
      successStories: 'सफलता की कहानियां',
      helpGuide: 'सहायता और गाइड',
      interactiveGames: 'इंटरैक्टिव गेम्स',
      offlineMode: 'ऑफलाइन मोड',
      stemLearningPlatform: 'STEM लर्निंग प्लेटफॉर्म',
      blockchainVerifiedEducation: 'ब्लॉकचेन-सत्यापित शिक्षा'
    },
    bn: {
      selectLanguage: 'ভাষা নির্বাচন করুন',
      language: 'ভাষা',
      connectWallet: 'ওয়ালেট সংযোগ করুন',
      certificates: 'সার্টিফিকেট',
      tokenRewards: 'টোকেন পুরস্কার',
      progress: 'অগ্রগতি',
      successStories: 'সফলতার গল্প',
      helpGuide: 'সাহায্য এবং গাইড',
      interactiveGames: 'ইন্টারঅ্যাক্টিভ গেমস',
      offlineMode: 'অফলাইন মোড',
      stemLearningPlatform: 'STEM লার্নিং প্ল্যাটফর্ম',
      blockchainVerifiedEducation: 'ব্লকচেইন-যাচাইকৃত শিক্ষা'
    },
    te: {
      selectLanguage: 'భాషను ఎంచుకోండి',
      language: 'భాష',
      connectWallet: 'వాలెట్ కనెక్ట్ చేయండి',
      certificates: 'సర్టిఫికేట్లు',
      tokenRewards: 'టోకెన్ రివార్డ్స్',
      progress: 'ప్రగతి',
      successStories: 'విజయ కథలు',
      helpGuide: 'సహాయం మరియు గైడ్',
      interactiveGames: 'ఇంటరాక్టివ్ గేమ్స్',
      offlineMode: 'ఆఫ్లైన్ మోడ్',
      stemLearningPlatform: 'STEM లెర్నింగ్ ప్లాట్ఫార్మ్',
      blockchainVerifiedEducation: 'బ్లాక్చైన్-ధృవీకరించబడిన విద్య'
    },
    mr: {
      selectLanguage: 'भाषा निवडा',
      language: 'भाषा',
      connectWallet: 'वॉलेट कनेक्ट करा',
      certificates: 'प्रमाणपत्रे',
      tokenRewards: 'टोकन बक्षिसे',
      progress: 'प्रगती',
      successStories: 'यशाच्या कथा',
      helpGuide: 'मदत आणि मार्गदर्शन',
      interactiveGames: 'इंटरऍक्टिव गेम्स',
      offlineMode: 'ऑफलाइन मोड',
      stemLearningPlatform: 'STEM लर्निंग प्लॅटफॉर्म',
      blockchainVerifiedEducation: 'ब्लॉकचेन-सत्यापित शिक्षा'
    }
  };

  useEffect(() => {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'en';
    setSelectedLanguage(savedLanguage);
    onLanguageChange(savedLanguage);
  }, [onLanguageChange]);

  const handleLanguageSelect = (languageCode) => {
    setSelectedLanguage(languageCode);
    setIsOpen(false);
    localStorage.setItem('selectedLanguage', languageCode);
    onLanguageChange(languageCode);
  };

  const currentLanguage = languages.find(lang => lang.code === selectedLanguage);
  const currentTranslations = translations[selectedLanguage] || translations.en;

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-gray-800 border border-purple-500/20 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <FaGlobe className="text-gradient-orange" />
        <span className="text-sm font-medium text-white">
          {currentLanguage?.flag} {currentLanguage?.name}
        </span>
        {isOpen ? (
          <FaChevronUp className="text-purple-300 text-xs" />
        ) : (
          <FaChevronDown className="text-purple-300 text-xs" />
        )}
      </motion.button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-2 w-64 bg-gray-900 border border-purple-500/20 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
        >
          <div className="p-2">
            <div className="px-3 py-2 text-xs font-semibold text-purple-300 uppercase tracking-wide border-b border-purple-500/20 mb-2">
              {currentTranslations.selectLanguage}
            </div>
            
            {languages.map((language) => (
              <button
                key={language.code}
                onClick={() => handleLanguageSelect(language.code)}
                className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-purple-500/20 transition-colors ${
                  selectedLanguage === language.code ? 'bg-gradient-orange/20 text-gradient-orange' : 'text-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{language.flag}</span>
                  <div className="text-left">
                    <div className="font-medium">{language.name}</div>
                    <div className="text-xs text-purple-300">{language.nativeName}</div>
                  </div>
                </div>
                {selectedLanguage === language.code && (
                  <FaCheck className="text-gradient-orange text-xs" />
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default LanguageSelector;
