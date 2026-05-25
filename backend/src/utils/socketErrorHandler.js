const { SOCKET_EVENTS } = require('../constants');
const logger = require('./logger');

function handleSocketError(socket, err) {
  logger.error('Socket handler error', {
    socketId: socket.id,
    error: err.message,
    stack: err.stack,
  });

  socket.emit(SOCKET_EVENTS.ERROR, {
    message: err.message || 'An error occurred',
    timestamp: new Date().toISOString(),
  });
}

module.exports = { handleSocketError };
