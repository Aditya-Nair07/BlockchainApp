import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaQuestionCircle, 
  FaWallet, 
  FaCertificate, 
  FaCoins, 
  FaShieldAlt,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle
} from 'react-icons/fa';

const HelpSection = () => {
  const [openSection, setOpenSection] = useState(null);

  const helpSections = [
    {
      id: 'wallet',
      title: 'Wallet Connection',
      icon: FaWallet,
      content: {
        steps: [
          {
            title: 'Install MetaMask',
            description: 'Download and install MetaMask browser extension from metamask.io',
            tip: 'MetaMask is required for blockchain interactions'
          },
          {
            title: 'Create Account',
            description: 'Create a new MetaMask wallet or import existing one',
            tip: 'Keep your seed phrase safe and never share it'
          },
          {
            title: 'Switch to Mumbai Network',
            description: 'The app will automatically prompt you to switch to Polygon Mumbai testnet',
            tip: 'Mumbai is a test network - no real money required'
          },
          {
            title: 'Connect Wallet',
            description: 'Click "Connect MetaMask" button in the top-right corner',
            tip: 'You can also use the app in demo mode without MetaMask'
          }
        ],
        troubleshooting: [
          'If connection fails, refresh the page and try again',
          'Make sure MetaMask is unlocked and on Mumbai network',
          'Check if pop-ups are blocked in your browser'
        ]
      }
    },
    {
      id: 'certificates',
      title: 'Certificate Verification',
      icon: FaCertificate,
      content: {
        steps: [
          {
            title: 'View Certificates',
            description: 'Go to Certificates tab to see your blockchain-verified certificates',
            tip: 'Each certificate has a unique cryptographic hash'
          },
          {
            title: 'Verify on Chain',
            description: 'Click "Verify on Chain" button to check certificate authenticity',
            tip: 'Verification takes 2-3 seconds and shows blockchain confirmation'
          },
          {
            title: 'Download Certificate',
            description: 'Click "Download PDF" to get your certificate file',
            tip: 'Certificate includes blockchain hash and verification status'
          },
          {
            title: 'Share Achievement',
            description: 'Use your verified certificate for job applications and portfolios',
            tip: 'Blockchain verification makes certificates tamper-proof'
          }
        ],
        troubleshooting: [
          'If verification fails, check your wallet connection',
          'Ensure you are on the correct network (Mumbai)',
          'Try refreshing the page if verification gets stuck'
        ]
      }
    },
    {
      id: 'tokens',
      title: 'Token Rewards System',
      icon: FaCoins,
      content: {
        steps: [
          {
            title: 'Earn Tokens',
            description: 'Complete courses and milestones to earn STEM tokens',
            tip: 'Tokens are automatically credited to your wallet'
          },
          {
            title: 'View Balance',
            description: 'Check your token balance in the Token Rewards tab',
            tip: 'Balance updates in real-time as you earn tokens'
          },
          {
            title: 'Track Transactions',
            description: 'View transaction history to see all token earnings',
            tip: 'Each transaction is recorded on the blockchain'
          },
          {
            title: 'Use Tokens',
            description: 'Tokens can be used for additional learning resources',
            tip: 'More features coming soon for token utility'
          }
        ],
        troubleshooting: [
          'Token balance may take a few minutes to update',
          'Check transaction history if tokens seem missing',
          'Ensure wallet is connected to see real-time balance'
        ]
      }
    },
    {
      id: 'progress',
      title: 'Progress Verification',
      icon: FaShieldAlt,
      content: {
        steps: [
          {
            title: 'View Milestones',
            description: 'Go to Progress tab to see your learning milestones',
            tip: 'Each milestone has a unique blockchain hash'
          },
          {
            title: 'Verify Progress',
            description: 'Click "Verify Progress" to check milestone authenticity',
            tip: 'Verification confirms your achievements are tamper-proof'
          },
          {
            title: 'Track Learning',
            description: 'Monitor your educational journey with blockchain records',
            tip: 'All progress is permanently stored on blockchain'
          },
          {
            title: 'Share Achievements',
            description: 'Use verified milestones for academic portfolios',
            tip: 'Blockchain verification adds credibility to your achievements'
          }
        ],
        troubleshooting: [
          'If milestones don\'t load, try refreshing the page',
          'Check wallet connection for real-time verification',
          'Contact support if verification consistently fails'
        ]
      }
    }
  ];

  const toggleSection = (sectionId) => {
    setOpenSection(openSection === sectionId ? null : sectionId);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="py-12 bg-gray-900/50"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <FaQuestionCircle className="text-4xl text-gradient-orange mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">
            How to Use This Platform
          </h2>
          <p className="text-lg text-purple-200">
            Complete guide to using blockchain-verified STEM learning platform
          </p>
        </motion.div>

        {/* Help Sections */}
        <div className="space-y-4">
          {helpSections.map((section) => {
            const Icon = section.icon;
            const isOpen = openSection === section.id;
            
            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="text-2xl text-primary-500" />
                    <h3 className="text-xl font-semibold text-gray-800">
                      {section.title}
                    </h3>
                  </div>
                  {isOpen ? (
                    <FaChevronUp className="text-gray-500" />
                  ) : (
                    <FaChevronDown className="text-gray-500" />
                  )}
                </button>

                {/* Section Content */}
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t border-gray-100 p-6"
                  >
                    {/* Steps */}
                    <div className="mb-6">
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FaCheckCircle className="text-green-500 mr-2" />
                        Step-by-Step Guide
                      </h4>
                      <div className="space-y-4">
                        {section.content.steps.map((step, index) => (
                          <div key={index} className="flex items-start space-x-3">
                            <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                              {index + 1}
                            </div>
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-800 mb-1">
                                {step.title}
                              </h5>
                              <p className="text-gray-600 mb-2">
                                {step.description}
                              </p>
                              <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                                <div className="flex items-start space-x-2">
                                  <FaInfoCircle className="text-blue-500 text-sm mt-0.5 flex-shrink-0" />
                                  <p className="text-sm text-blue-700">
                                    <strong>Tip:</strong> {step.tip}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Troubleshooting */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <FaExclamationTriangle className="text-orange-500 mr-2" />
                        Troubleshooting
                      </h4>
                      <ul className="space-y-2">
                        {section.content.troubleshooting.map((item, index) => (
                          <li key={index} className="flex items-start space-x-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-gradient-to-r from-primary-500 to-purple-600 rounded-xl p-8 text-white"
        >
          <h3 className="text-2xl font-bold mb-4">Quick Tips for Success</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-2">🔐 Security</h4>
              <p className="text-sm opacity-90">
                Never share your MetaMask seed phrase. Keep your wallet secure and always verify you're on the correct network.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">📚 Learning</h4>
              <p className="text-sm opacity-90">
                Complete courses systematically to earn maximum tokens. Each certificate adds value to your blockchain portfolio.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🌐 Network</h4>
              <p className="text-sm opacity-90">
                Always ensure you're connected to Polygon Mumbai testnet. The app will guide you through network switching.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">💡 Support</h4>
              <p className="text-sm opacity-90">
                If you encounter issues, try refreshing the page first. Most problems resolve with a simple page reload.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HelpSection;
