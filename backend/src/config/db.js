const mongoose = require('mongoose');
const logger = require('../utils/logger');

let isConnected = false;
let useMemoryStore = false;

const connectDB = async () => {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hackwave_tests';
  
  try {
    // Attempt Mongoose connection with 3-second timeout
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
    });
    isConnected = true;
    useMemoryStore = false;
    logger.success(`MongoDB Connected Successfully: ${mongoose.connection.host}`);
  } catch (err) {
    logger.warn(`Local/Remote MongoDB not reachable (${err.message}).`);
    logger.info(`Activating High-Performance In-Memory Persistence Layer for zero-setup demo.`);
    isConnected = false;
    useMemoryStore = true;
  }
};

const getDBStatus = () => ({
  connected: isConnected,
  type: useMemoryStore ? 'In-Memory Fallback Store (Zero-Setup)' : 'MongoDB Atlas / Local',
  host: isConnected ? mongoose.connection.host : 'MemoryStore'
});

module.exports = { 
  connectDB, 
  getDBStatus, 
  isUsingMemory: () => !isConnected || useMemoryStore || mongoose.connection.readyState !== 1 
};
