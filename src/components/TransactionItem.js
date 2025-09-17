import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaArrowUp, 
  FaArrowDown, 
  FaGraduationCap, 
  FaTrophy, 
  FaBook, 
  FaClock,
  FaCheckCircle,
  FaExclamationCircle
} from 'react-icons/fa';
import { format } from 'date-fns';

const TransactionItem = ({ transaction, index }) => {
  const getTransactionIcon = (reason) => {
    const reasonLower = reason.toLowerCase();
    if (reasonLower.includes('course') || reasonLower.includes('lesson')) {
      return <FaBook className="text-blue-500" />;
    } else if (reasonLower.includes('achievement') || reasonLower.includes('badge')) {
      return <FaTrophy className="text-yellow-500" />;
    } else if (reasonLower.includes('certificate') || reasonLower.includes('graduation')) {
      return <FaGraduationCap className="text-green-500" />;
    } else {
      return transaction.isEarned ? 
        <FaArrowUp className="text-green-500" /> : 
        <FaArrowDown className="text-red-500" />;
    }
  };

  const getStatusIcon = () => {
    return transaction.isEarned ? 
      <FaCheckCircle className="text-green-500" /> : 
      <FaExclamationCircle className="text-orange-500" />;
  };

  const getAmountColor = () => {
    return transaction.isEarned ? 'text-green-600' : 'text-red-600';
  };

  const getAmountPrefix = () => {
    return transaction.isEarned ? '+' : '-';
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {getTransactionIcon(transaction.reason)}
          </div>
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {transaction.reason}
            </p>
            <div className="flex items-center space-x-2 text-xs text-gray-500">
              <FaClock />
              <span>{format(transaction.timestamp, 'MMM dd, yyyy HH:mm')}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className={`text-sm font-semibold ${getAmountColor()}`}>
              {getAmountPrefix()}{transaction.amount} STEM
            </p>
            <div className="flex items-center space-x-1">
              {getStatusIcon()}
              <span className="text-xs text-gray-500">
                {transaction.isEarned ? 'Earned' : 'Spent'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TransactionItem;
