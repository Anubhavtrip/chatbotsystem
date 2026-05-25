const { verifyAccessToken } = require('../utils/jwt');
const logger = require('../utils/logger');

function socketAuth(socket, next) {
  const token =
    socket.handshake.auth?.token ||
    socket.handshake.headers?.authorization?.replace('Bearer ', '');

  if (!token) {
    socket.user = { id: socket.handshake.auth?.userId || 'anonymous', isGuest: true };
    return next();
  }

  try {
    const decoded = verifyAccessToken(token);
    socket.user = {
      id: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      isGuest: false,
    };
    next();
  } catch (err) {
    logger.socket('auth_failed', { socketId: socket.id, error: err.message });
    next(new Error('Authentication failed'));
  }
}

module.exports = { socketAuth };
