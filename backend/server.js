const path = require('path');
// Load single root .env
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const http = require('http');
const cors = require('cors');
const { connectDB, getDBStatus } = require('./src/config/db');
const { initSocket } = require('./src/config/socket');
const logger = require('./src/utils/logger');

// Initialize Express App & HTTP Server
const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Middleware
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));
app.use(express.json());

// Initialize Socket.io
initSocket(server, CLIENT_URL);

// Health & System Info Route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    db: getDBStatus(),
    aiProvider: process.env.AI_PROVIDER || 'local_heuristic',
    headless: process.env.HEADLESS_BROWSER !== 'false'
  });
});

// Import API Routes
const testRoutes = require('./src/routes/testRoutes');
const runRoutes = require('./src/routes/runRoutes');
const reportRoutes = require('./src/routes/reportRoutes');

app.use('/api/tests', testRoutes);
app.use('/api/runs', runRoutes);
app.use('/api/reports', reportRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled Request Error: ${err.message}`, err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: err.message
  });
});

// Start Server & Connect Database
const startServer = async () => {
  await connectDB();

  server.listen(PORT, () => {
    logger.success(`🚀 AutoHeal Backend Server active on port ${PORT}`);
    logger.info(`Live Socket telemetry ready for ${CLIENT_URL}`);
  });
};

startServer();

module.exports = { app, server };
