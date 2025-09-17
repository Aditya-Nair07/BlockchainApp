import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ 
  value, 
  max = 100, 
  color = 'primary', 
  height = 'h-2',
  showLabel = true,
  label = '',
  className = ''
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const getColorClasses = (color) => {
    const colors = {
      primary: 'from-primary-500 to-primary-600',
      secondary: 'from-secondary-500 to-secondary-600',
      accent: 'from-accent-500 to-accent-600',
      green: 'from-green-500 to-green-600',
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600'
    };
    return colors[color] || colors.primary;
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">
            {label || `${value}/${max}`}
          </span>
          <span className="text-sm text-gray-500">
            {percentage.toFixed(1)}%
          </span>
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${height}`}>
        <motion.div
          className={`h-full bg-gradient-to-r ${getColorClasses(color)} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: 1.5, 
            ease: "easeOut",
            delay: 0.2
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
