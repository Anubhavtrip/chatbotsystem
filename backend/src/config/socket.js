const { Server } = require('socket.io');
const env = require('./env');
const { socketAuth } = require('../middleware/socketAuth');
const { registerSocketHandlers } = require('../modules/websocket/handlers');
const logger = require('../utils/logger');

let io = null;

function initSocket(httpServer) {
  io = new Server(httpServer, {
    cors: {
      origin: env.corsOrigin,
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 60000,
    pingInterval: 25000,
    transports: ['websocket', 'polling'],
  });

  io.use(socketAuth);

  io.on('connection', (socket) => {
    registerSocketHandlers(io, socket);
  });

  io.on('error', (err) => {
    logger.error('Socket.io server error', { error: err.message });
  });

  logger.info('Socket.io initialized');
  return io;
}

function getIO() {
  if (!io) {
    throw new Error('Socket.io not initialized. Call initSocket() first.');
  }
  return io;
}

module.exports = { initSocket, getIO };
