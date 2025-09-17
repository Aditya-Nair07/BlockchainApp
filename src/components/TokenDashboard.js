import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  FaCoins, 
  FaSpinner, 
  FaExclamationTriangle, 
  FaRedo,
  FaArrowUp,
  FaHistory
} from 'react-icons/fa';
import AnimatedCounter from './AnimatedCounter';
import ProgressBar from './ProgressBar';
import TransactionItem from './TransactionItem';
import { getTokenBalance, getRecentTransactions } from '../utils/blockchain';

const TokenDashboard = ({ userAddress, isConnected }) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalEarned: 0,
    totalSpent: 0,
    weeklyEarned: 0
  });

  const loadTokenData = useCallback(async () => {
    if (!userAddress || !isConnected) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [tokenBalance, recentTxs] = await Promise.all([
        getTokenBalance(userAddress),
        getRecentTransactions(userAddress, 10)
      ]);
      
      setBalance(parseFloat(tokenBalance));
      setTransactions(recentTxs);
      
      // Calculate stats
      const totalEarned = recentTxs
        .filter(tx => tx.isEarned)
        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
      
      const totalSpent = recentTxs
        .filter(tx => !tx.isEarned)
        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
      
      // Calculate weekly earned (last 7 days)
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      
      const weeklyEarned = recentTxs
        .filter(tx => tx.isEarned && new Date(tx.timestamp) > weekAgo)
        .reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
      
      setStats({
        totalEarned,
        totalSpent,
        weeklyEarned
      });
      
    } catch (err) {
      console.error('Failed to load token data:', err);
      setError('Failed to load token data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [userAddress, isConnected]);

  useEffect(() => {
    loadTokenData();
  }, [loadTokenData]);

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-xl shadow-lg p-8 text-center"
      >
        <FaCoins className="text-6xl text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Connect Your Wallet
        </h3>
        <p className="text-gray-500">
          Connect your MetaMask wallet to view your token rewards and transaction history.
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
            <FaCoins className="text-gradient-orange" />
            <span>Token Rewards</span>
          </h2>
          <p className="text-purple-200 mt-1">
            Your STEM learning achievements and token balance
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={loadTokenData}
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

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center py-12"
        >
          <div className="text-center">
            <FaSpinner className="text-4xl text-accent-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading token data...</p>
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
            <p className="text-red-800 font-medium">Error Loading Token Data</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Token Balance Card */}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Current Balance</h3>
              <p className="text-accent-100">Your STEM learning tokens</p>
            </div>
            <FaCoins className="text-3xl text-accent-200" />
          </div>
          
          <div className="text-4xl font-bold mb-2">
            <AnimatedCounter 
              value={balance} 
              decimals={2}
              suffix=" STEM"
              className="text-white"
            />
          </div>
          
          <div className="flex items-center space-x-2 text-accent-100">
            <FaArrowUp className="text-sm" />
            <span className="text-sm">
              +{stats.weeklyEarned.toFixed(2)} this week
            </span>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Earned</p>
                <p className="text-2xl font-bold text-green-600">
                  <AnimatedCounter value={stats.totalEarned} decimals={2} suffix=" STEM" />
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FaArrowUp className="text-green-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-red-600">
                  <AnimatedCounter value={stats.totalSpent} decimals={2} suffix=" STEM" />
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <FaCoins className="text-red-600 text-xl" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Weekly Progress</p>
                <p className="text-2xl font-bold text-blue-600">
                  <AnimatedCounter value={stats.weeklyEarned} decimals={2} suffix=" STEM" />
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaHistory className="text-blue-600 text-xl" />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Progress Bar */}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-lg p-6 shadow-sm border border-gray-100"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Learning Progress
          </h3>
          <ProgressBar
            value={stats.totalEarned}
            max={1000} // Example target
            color="accent"
            label="Tokens Earned"
            showLabel={true}
          />
          <p className="text-sm text-gray-600 mt-2">
            Keep learning to unlock more rewards and achievements!
          </p>
        </motion.div>
      )}

      {/* Recent Transactions */}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-lg shadow-sm border border-gray-100"
        >
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <FaHistory />
              <span>Recent Transactions</span>
            </h3>
          </div>
          
          <div className="p-6">
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <FaCoins className="text-4xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No transactions yet</p>
                <p className="text-sm text-gray-400">
                  Complete learning activities to start earning tokens!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.map((transaction, index) => (
                  <TransactionItem
                    key={index}
                    transaction={transaction}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default TokenDashboard;
