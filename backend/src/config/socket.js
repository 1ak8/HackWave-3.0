const { Server } = require('socket.io');
const logger = require('../utils/logger');

let io = null;

const initSocket = (server, clientUrl) => {
  io = new Server(server, {
    cors: {
      origin: clientUrl || '*',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    logger.info(`Socket client connected: ${socket.id}`);

    socket.on('subscribe_run', (runId) => {
      socket.join(`run:${runId}`);
      logger.info(`Client ${socket.id} subscribed to run:${runId}`);
    });

    socket.on('disconnect', () => {
      logger.info(`Socket client disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    logger.warn('Socket.io requested before initialization');
  }
  return io;
};

// Helper to broadcast telemetry to all or specific run room
const emitRunTelemetry = (runId, eventName, payload) => {
  if (io) {
    if (runId) {
      io.to(`run:${runId}`).emit(eventName, payload);
    }
    // Also emit globally for live monitoring dashboard
    io.emit(eventName, { ...payload, runId });
  }
};

module.exports = { initSocket, getIO, emitRunTelemetry };
