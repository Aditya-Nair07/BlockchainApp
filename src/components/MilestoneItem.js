import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaSpinner, 
  FaShieldAlt,
  FaCalendarAlt,
  FaCode,
  FaGraduationCap,
  FaTrophy
} from 'react-icons/fa';
import { format } from 'date-fns';
import { verifyMilestone } from '../utils/blockchain';

const MilestoneItem = ({ milestone, userAddress, index }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerify = async () => {
    setIsVerifying(true);
    setVerificationResult(null);
    
    try {
      const isVerified = await verifyMilestone(userAddress, milestone.hash);
      setVerificationResult(isVerified);
      
      // Show success message
      if (isVerified) {
        alert('✅ Milestone verified successfully!\n\nThis learning achievement has been cryptographically verified on the blockchain and is tamper-proof.');
      } else {
        alert('❌ Milestone verification failed. Please try again or contact support.');
      }
    } catch (error) {
      console.error('Verification failed:', error);
      setVerificationResult(false);
      alert('❌ Verification failed. Please check your wallet connection and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const getMilestoneIcon = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('code') || titleLower.includes('programming')) {
      return <FaCode className="text-blue-500" />;
    } else if (titleLower.includes('course') || titleLower.includes('lesson')) {
      return <FaGraduationCap className="text-green-500" />;
    } else if (titleLower.includes('achievement') || titleLower.includes('milestone')) {
      return <FaTrophy className="text-yellow-500" />;
    } else {
      return <FaShieldAlt className="text-purple-500" />;
    }
  };

  const getVerificationStatus = () => {
    if (isVerifying) {
      return (
        <div className="flex items-center space-x-2 text-blue-500">
          <FaSpinner className="animate-spin" />
          <span className="text-sm">Verifying...</span>
        </div>
      );
    }
    
    if (verificationResult === true) {
      return (
        <div className="flex items-center space-x-2 text-green-500">
          <FaCheckCircle />
          <span className="text-sm">Verified</span>
        </div>
      );
    }
    
    if (verificationResult === false) {
      return (
        <div className="flex items-center space-x-2 text-red-500">
          <FaTimesCircle />
          <span className="text-sm">Verification Failed</span>
        </div>
      );
    }
    
    return null;
  };

  const getHashDisplay = () => {
    return `${milestone.hash.slice(0, 8)}...${milestone.hash.slice(-8)}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="flex-shrink-0 mt-1">
            {getMilestoneIcon(milestone.title)}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {milestone.title}
            </h3>
            <p className="text-gray-600 mb-3">
              {milestone.description}
            </p>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FaCalendarAlt />
                <span>
                  Completed: {format(milestone.timestamp, 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <FaShieldAlt />
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {getHashDisplay()}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end space-y-3">
          {getVerificationStatus()}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVerify}
            disabled={isVerifying}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
              isVerifying
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : verificationResult === true
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : verificationResult === false
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isVerifying ? (
              <FaSpinner className="animate-spin" />
            ) : verificationResult === true ? (
              <FaCheckCircle />
            ) : verificationResult === false ? (
              <FaTimesCircle />
            ) : (
              <FaShieldAlt />
            )}
            <span>
              {isVerifying
                ? 'Verifying...'
                : verificationResult === true
                ? 'Verified'
                : verificationResult === false
                ? 'Failed'
                : 'Verify Progress'}
            </span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MilestoneItem;
