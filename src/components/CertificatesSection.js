import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCertificate, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import CertificateCard from './CertificateCard';
import { getUserCertificates } from '../utils/blockchain';

const CertificatesSection = ({ userAddress, isConnected }) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadCertificates = async () => {
    if (!userAddress || !isConnected) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const userCerts = await getUserCertificates(userAddress);
      setCertificates(userCerts);
    } catch (err) {
      console.error('Failed to load certificates:', err);
      setError('Failed to load certificates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCertificates();
  }, [userAddress, isConnected]);

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
        <FaCertificate className="text-6xl text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-gray-500">
          Connect your MetaMask wallet to view your blockchain-verified certificates and badges.
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
            <FaCertificate className="text-gradient-orange" />
            <span>Certificates & Badges</span>
          </h2>
          <p className="text-purple-200 mt-1">
            Your blockchain-verified achievements and learning milestones
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadCertificates}
          disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-gradient-orange to-gradient-pink hover:from-gradient-pink hover:to-gradient-purple text-white rounded-lg font-medium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg"
        >
          {loading ? (
            <FaSpinner className="animate-spin" />
          ) : (
            <FaCertificate />
          )}
          <span>Refresh</span>
        </motion.button>
      </div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center py-12"
        >
          <div className="text-center">
            <FaSpinner className="text-4xl text-primary-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your certificates...</p>
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
            <p className="text-red-800 font-medium">Error Loading Certificates</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Certificates Grid */}
      {!loading && !error && (
        <>
          {certificates.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-xl shadow-lg p-8 text-center"
            >
              <FaCertificate className="text-6xl text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Certificates Yet
              </h3>
              <p className="text-gray-500">
                Complete STEM learning modules to earn your first blockchain-verified certificate!
              </p>
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {certificates.map((certificate) => (
                <motion.div key={certificate.id} variants={itemVariants}>
                  <CertificateCard
                    certificate={certificate}
                    userAddress={userAddress}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </>
      )}

      {/* Stats Summary */}
      {!loading && !error && certificates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {certificates.length}
              </div>
              <div className="text-sm text-gray-600">Total Certificates</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {certificates.filter(cert => cert.isVerified).length}
              </div>
              <div className="text-sm text-gray-600">Verified</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent-600">
                {new Set(certificates.map(cert => 
                  new Date(cert.timestamp).getFullYear()
                )).size}
              </div>
              <div className="text-sm text-gray-600">Years Active</div>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default CertificatesSection;
