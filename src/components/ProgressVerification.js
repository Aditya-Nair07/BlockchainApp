import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FaShieldAlt, 
  FaSpinner, 
  FaExclamationTriangle, 
  FaRedo,
  FaCheckCircle,
  FaLock
} from 'react-icons/fa';
import MilestoneItem from './MilestoneItem';
import { getUserMilestones } from '../utils/blockchain';

const ProgressVerification = ({ userAddress, isConnected }) => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadMilestones = useCallback(async () => {
    if (!userAddress || !isConnected) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userMilestones = await getUserMilestones(userAddress);
      setMilestones(userMilestones);
    } catch (err) {
      console.error('Failed to load milestones:', err);
      setError('Failed to load learning milestones. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userAddress, isConnected]);

  useEffect(() => {
    loadMilestones();
  }, [loadMilestones]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <FaShieldAlt className="text-6xl text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-gray-500">
          Connect your MetaMask wallet to view your blockchain-verified learning progress.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
            <FaShieldAlt className="text-gradient-orange" />
            <span>Progress Verification</span>
          </h2>
          <p className="text-purple-200 mt-1">
            Blockchain-anchored learning milestones with cryptographic verification
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadMilestones}
          disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-gradient-orange to-gradient-pink hover:from-gradient-pink hover:to-gradient-purple text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg"
        >
          {loading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaRedo />
          )}
          <span>Refresh</span>
        </motion.button>
      </div>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4"
      >
        <div className="flex items-start space-x-3">
          <FaLock className="text-purple-500 text-xl mt-1" />
          <div>
            <h3 className="text-sm font-semibold text-purple-800 mb-1">
              Blockchain Security
            </h3>
            <p className="text-sm text-purple-700">
              Each learning milestone is cryptographically hashed and stored on the blockchain, 
              ensuring tamper-proof verification of your educational progress.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center py-12"
        >
          <div className="text-center">
            <FaSpinner className="text-4xl text-purple-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your learning milestones...</p>
          </div>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3"
        >
          <FaExclamationTriangle className="text-red-500 text-xl" />
          <div>
            <p className="text-red-800 font-medium">Error Loading Milestones</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Milestones Timeline */}
      {!loading && !error && (
        <>
          {milestones.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-lg p-8 text-center"
            >
              <FaShieldAlt className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Milestones Yet
              </h3>
              <p className="text-gray-500">
                Complete STEM learning activities to create your first blockchain-verified milestone!
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {milestones.map((milestone, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <MilestoneItem
                    milestone={milestone}
                    userAddress={userAddress}
                    index={index}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      )}

      {/* Verification Stats */}
      {!loading && !error && milestones.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {milestones.length}
              </div>
              <div className="text-sm text-gray-600">Total Milestones</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {milestones.filter(m => m.hash).length}
              </div>
              <div className="text-sm text-gray-600">Blockchain Verified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {new Set(milestones.map(m => 
                  new Date(m.timestamp).getMonth()
                )).size}
              </div>
              <div className="text-sm text-gray-600">Active Months</div>
            </div>
          </div>
        </motion.div>
      )}

      {/* How It Works */}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
            <FaCheckCircle className="text-green-500" />
            <span>How Verification Works</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FaShieldAlt className="text-blue-600 text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">1. Hash Generation</h4>
              <p className="text-sm text-gray-600">
                Each milestone is cryptographically hashed using secure algorithms
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FaLock className="text-green-600 text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">2. Blockchain Storage</h4>
              <p className="text-sm text-gray-600">
                Hashes are permanently stored on the blockchain for tamper-proof verification
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <FaCheckCircle className="text-purple-600 text-xl" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">3. Real-time Verification</h4>
              <p className="text-sm text-gray-600">
                Verify any milestone instantly by comparing on-chain and off-chain data
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProgressVerification;
