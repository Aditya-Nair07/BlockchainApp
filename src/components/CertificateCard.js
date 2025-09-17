import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCertificate, 
  FaDownload, 
  FaCheckCircle, 
  FaTimesCircle, 
  FaSpinner,
  FaExternalLinkAlt,
  FaCalendarAlt
} from 'react-icons/fa';
import { verifyCertificate, generateCertificatePDF, fetchIPFSMetadata } from '../utils/blockchain';
import { format } from 'date-fns';

const CertificateCard = ({ certificate, userAddress }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(certificate.isVerified);
  const [metadata, setMetadata] = useState(null);
  const [metadataLoading, setMetadataLoading] = useState(true);

  useEffect(() => {
    const loadMetadata = async () => {
      if (certificate.ipfsHash) {
        try {
          const ipfsMetadata = await fetchIPFSMetadata(certificate.ipfsHash);
          setMetadata(ipfsMetadata);
        } catch (error) {
          console.error('Failed to load metadata:', error);
        } finally {
          setMetadataLoading(false);
        }
      } else {
        setMetadataLoading(false);
      }
    };

    loadMetadata();
  }, [certificate.ipfsHash]);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const isVerified = await verifyCertificate(userAddress, certificate.id);
      setVerificationStatus(isVerified);
      
      // Show success message
      if (isVerified) {
        alert('✅ Certificate verified successfully on the blockchain!\n\nThis certificate has been cryptographically verified and is tamper-proof.');
      } else {
        alert('❌ Certificate verification failed. Please try again or contact support.');
      }
    } catch (error) {
      console.error('Verification failed:', error);
      alert('❌ Verification failed. Please check your wallet connection and try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await generateCertificatePDF(certificate);
    } catch (error) {
      console.error('Download failed:', error);
      // Show error message to user
    } finally {
      setIsDownloading(false);
    }
  };

  const getStatusIcon = () => {
    if (isVerifying) {
      return <FaSpinner className="animate-spin text-blue-500" />;
    }
    return verificationStatus ? 
      <FaCheckCircle className="text-green-500" /> : 
      <FaTimesCircle className="text-red-500" />;
  };

  const getStatusText = () => {
    if (isVerifying) return 'Verifying...';
    return verificationStatus ? 'Verified' : 'Unverified';
  };

  const getStatusColor = () => {
    if (isVerifying) return 'text-blue-500';
    return verificationStatus ? 'text-green-500' : 'text-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-purple-500/20"
      style={{ animation: 'none' }}
    >
      {/* Certificate Header */}
      <div className="bg-gradient-to-r from-gradient-orange to-gradient-pink p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FaCertificate className="text-2xl" />
            <div>
              <h3 className="text-lg font-semibold">{certificate.title}</h3>
              <p className="text-white/80 text-sm">{certificate.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon()}
            <span className={`text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>
        </div>
      </div>

      {/* Certificate Content */}
      <div className="p-6">
        {/* Certificate Image */}
        <div className="mb-4">
          <div className="flex justify-center items-center h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg relative overflow-hidden border border-purple-500/30">
            <FaCertificate className="text-6xl text-gradient-orange" />
            <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent"></div>
          </div>
        </div>

        {/* Certificate Details */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-2 text-purple-200">
            <FaCalendarAlt className="text-sm" />
            <span className="text-sm">
              Issued: {format(certificate.timestamp, 'MMM dd, yyyy')}
            </span>
          </div>
          
          {certificate.ipfsHash && (
            <div className="flex items-center space-x-2 text-purple-200">
              <FaExternalLinkAlt className="text-sm" />
              <span className="text-sm font-mono bg-black/30 px-2 py-1 rounded border border-purple-500/30">
                {certificate.ipfsHash.slice(0, 20)}...
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleVerify}
            disabled={isVerifying}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              isVerifying
                ? 'bg-black/30 text-purple-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-gradient-orange to-gradient-pink hover:from-gradient-pink hover:to-gradient-purple text-white shadow-lg'
            }`}
          >
            {isVerifying ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaCheckCircle />
            )}
            <span>{isVerifying ? 'Verifying...' : 'Verify on Chain'}</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleDownload}
            disabled={isDownloading}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
              isDownloading
                ? 'bg-black/30 text-purple-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-gradient-purple to-gradient-blue hover:from-gradient-blue hover:to-gradient-orange text-white shadow-lg'
            }`}
          >
            {isDownloading ? (
              <FaSpinner className="animate-spin" />
            ) : (
              <FaDownload />
            )}
            <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default CertificateCard;
