import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FaWifi, 
  FaBan, 
  FaDownload, 
  FaSync, 
  FaCheckCircle,
  FaInfoCircle,
  FaDatabase,
  FaCloud,
  FaMobile,
  FaClock,
  FaShieldAlt
} from 'react-icons/fa';

const OfflineAccess = ({ userAddress, isConnected }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState(null);
  const [syncStatus, setSyncStatus] = useState('idle'); // idle, syncing, synced, error
  const [lastSync, setLastSync] = useState(null);
  const [offlineContent, setOfflineContent] = useState([]);

  // Essential offline content
  const essentialContent = [
    {
      id: 'certificates',
      title: 'My Certificates',
      description: 'View your blockchain-verified certificates',
      size: '2.5 MB',
      priority: 'high',
      icon: FaShieldAlt
    },
    {
      id: 'progress',
      title: 'Learning Progress',
      description: 'Track your educational milestones',
      size: '1.8 MB',
      priority: 'high',
      icon: FaCheckCircle
    },
    {
      id: 'games',
      title: 'Interactive Games',
      description: 'STEM games and puzzles for offline play',
      size: '15.2 MB',
      priority: 'medium',
      icon: FaMobile
    },
    {
      id: 'help',
      title: 'Help Guide',
      description: 'Complete user manual and tutorials',
      size: '3.1 MB',
      priority: 'medium',
      icon: FaInfoCircle
    },
    {
      id: 'testimonials',
      title: 'Success Stories',
      description: 'Inspirational student testimonials',
      size: '1.2 MB',
      priority: 'low',
      icon: FaCloud
    }
  ];

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load offline data from localStorage
    loadOfflineData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadOfflineData = () => {
    const savedData = localStorage.getItem('offlineData');
    const savedSync = localStorage.getItem('lastSync');
    
    if (savedData) {
      setOfflineData(JSON.parse(savedData));
    }
    
    if (savedSync) {
      setLastSync(new Date(savedSync));
    }
  };

  const downloadOfflineContent = async (contentId) => {
    try {
      // Simulate downloading content
      const content = essentialContent.find(c => c.id === contentId);
      if (!content) return;

      // Create mock offline data
      const mockData = {
        certificates: [
          {
            id: 0,
            title: "Python Programming Fundamentals",
            description: "Completed comprehensive Python programming course",
            timestamp: new Date(),
            isVerified: true
          }
        ],
        progress: [
          {
            title: "Python Basics Completed",
            description: "Successfully completed Python programming fundamentals",
            hash: "0x1234567890abcdef",
            timestamp: new Date()
          }
        ],
        games: [
          {
            id: 'math-puzzle',
            title: 'Math Puzzle Challenge',
            description: 'Solve mathematical puzzles offline',
            type: 'puzzle'
          }
        ],
        help: {
          sections: ['wallet', 'certificates', 'tokens', 'progress'],
          lastUpdated: new Date()
        },
        testimonials: [
          {
            name: "Priya Sharma",
            location: "Rural Maharashtra",
            achievement: "Got hired as Junior Developer"
          }
        ]
      };

      // Save to localStorage
      const currentData = JSON.parse(localStorage.getItem('offlineData') || '{}');
      currentData[contentId] = mockData[contentId] || mockData.help;
      localStorage.setItem('offlineData', JSON.stringify(currentData));
      
      setOfflineData(currentData);
      
      // Update offline content status
      setOfflineContent(prev => [...prev.filter(c => c.id !== contentId), {
        id: contentId,
        title: content.title,
        downloaded: true,
        downloadedAt: new Date()
      }]);

      alert(`✅ ${content.title} downloaded successfully for offline access!`);
    } catch (error) {
      console.error('Failed to download content:', error);
      alert('❌ Failed to download content. Please try again.');
    }
  };

  const syncData = async () => {
    if (!isOnline) {
      alert('❌ You need to be online to sync data.');
      return;
    }

    setSyncStatus('syncing');
    
    try {
      // Simulate sync process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update sync timestamp
      const now = new Date();
      setLastSync(now);
      localStorage.setItem('lastSync', now.toISOString());
      
      setSyncStatus('synced');
      
      setTimeout(() => {
        setSyncStatus('idle');
      }, 3000);
      
      alert('✅ Data synced successfully! All offline content is up to date.');
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('error');
      alert('❌ Sync failed. Please check your connection and try again.');
    }
  };

  const clearOfflineData = () => {
    const userConfirmed = window.confirm('Are you sure you want to clear all offline data? This will free up storage space but you won\'t be able to access content offline.');
    if (userConfirmed) {
      localStorage.removeItem('offlineData');
      localStorage.removeItem('lastSync');
      setOfflineData(null);
      setLastSync(null);
      setOfflineContent([]);
      alert('🗑️ Offline data cleared successfully.');
    }
  };

  const getStorageUsage = () => {
    const data = localStorage.getItem('offlineData');
    if (!data) return { used: 0, total: 50 };
    
    const sizeInBytes = new Blob([data]).size;
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
    return { used: parseFloat(sizeInMB), total: 50 };
  };

  const storageUsage = getStorageUsage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white flex items-center space-x-3">
            {isOnline ? (
              <FaWifi className="text-green-400" />
            ) : (
              <FaBan className="text-red-400" />
            )}
            <span>Offline Access</span>
          </h2>
          <p className="text-purple-200 mt-1">
            Download essential content for offline learning. Perfect for areas with limited internet access.
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isOnline 
              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
              : 'bg-red-500/20 text-red-400 border border-red-500/30'
          }`}>
            {isOnline ? 'Online' : 'Offline'}
          </div>
          
          {isOnline && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={syncData}
              disabled={syncStatus === 'syncing'}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                syncStatus === 'syncing'
                  ? 'bg-black/30 text-purple-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-gradient-orange to-gradient-pink hover:from-gradient-pink hover:to-gradient-purple text-white shadow-lg'
              }`}
            >
              {syncStatus === 'syncing' ? (
                <FaSync className="animate-spin" />
              ) : (
                <FaSync />
              )}
              <span>
                {syncStatus === 'syncing' ? 'Syncing...' : 'Sync Data'}
              </span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Connection Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center space-x-3 mb-4">
            {isOnline ? (
              <FaWifi className="text-2xl text-green-500" />
            ) : (
              <FaBan className="text-2xl text-red-500" />
            )}
            <h3 className="text-lg font-semibold text-gray-800">Connection Status</h3>
          </div>
          <p className={`text-sm ${
            isOnline ? 'text-green-600' : 'text-red-600'
          }`}>
            {isOnline 
              ? 'You are connected to the internet. All features are available.'
              : 'You are offline. Only downloaded content is available.'
            }
          </p>
        </motion.div>

        {/* Storage Usage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center space-x-3 mb-4">
            <FaDatabase className="text-2xl text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800">Storage Usage</h3>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Used:</span>
              <span className="font-medium">{storageUsage.used} MB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(storageUsage.used / storageUsage.total) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-500">
              {storageUsage.total - storageUsage.used} MB available
            </div>
          </div>
        </motion.div>

        {/* Last Sync */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center space-x-3 mb-4">
            <FaClock className="text-2xl text-purple-500" />
            <h3 className="text-lg font-semibold text-gray-800">Last Sync</h3>
          </div>
          <p className="text-sm text-gray-600">
            {lastSync 
              ? `Last synced: ${lastSync.toLocaleString()}`
              : 'Never synced'
            }
          </p>
        </motion.div>
      </div>

      {/* Offline Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-100"
      >
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FaDownload className="text-blue-500 mr-2" />
            Available Offline Content
          </h3>
          
          <div className="space-y-4">
            {essentialContent.map((content) => {
              const Icon = content.icon;
              const isDownloaded = offlineContent.some(c => c.id === content.id);
              
              return (
                <div
                  key={content.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`text-xl ${
                      isDownloaded ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    <div>
                      <h4 className="font-medium text-gray-800">{content.title}</h4>
                      <p className="text-sm text-gray-600">{content.description}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">Size: {content.size}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          content.priority === 'high' 
                            ? 'bg-red-100 text-red-600'
                            : content.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-600'
                            : 'bg-green-100 text-green-600'
                        }`}>
                          {content.priority} priority
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {isDownloaded && (
                      <div className="flex items-center space-x-1 text-green-600 text-sm">
                        <FaCheckCircle />
                        <span>Downloaded</span>
                      </div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => downloadOfflineContent(content.id)}
                      disabled={isDownloaded}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        isDownloaded
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {isDownloaded ? 'Downloaded' : 'Download'}
                    </motion.button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Offline Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-xl p-6 border border-purple-500/20"
      >
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <FaMobile className="text-gradient-orange mr-2" />
          Offline Features
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-white mb-2">What Works Offline:</h4>
            <ul className="space-y-1 text-sm text-purple-200">
              <li>• View downloaded certificates</li>
              <li>• Check learning progress</li>
              <li>• Play interactive games</li>
              <li>• Read help guides</li>
              <li>• Browse success stories</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-medium text-white mb-2">What Requires Internet:</h4>
            <ul className="space-y-1 text-sm text-purple-200">
              <li>• Blockchain verification</li>
              <li>• Token transactions</li>
              <li>• Data synchronization</li>
              <li>• New content download</li>
              <li>• Real-time updates</li>
            </ul>
          </div>
        </div>
      </motion.div>

      {/* Management Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-center space-x-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearOfflineData}
          className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
        >
          Clear Offline Data
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            essentialContent.forEach(content => {
              if (!offlineContent.some(c => c.id === content.id)) {
                downloadOfflineContent(content.id);
              }
            });
          }}
          className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
        >
          Download All Content
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default OfflineAccess;
