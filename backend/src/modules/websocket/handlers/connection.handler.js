const sessionService = require('../../../services/session.service');
const logger = require('../../../utils/logger');
const { SOCKET_EVENTS } = require('../../../constants');

function handleConnection(socket) {
  logger.socket('connected', {
    socketId: socket.id,
    userId: socket.user?.id,
  });

  socket.emit(SOCKET_EVENTS.CONNECTED, {
    socketId: socket.id,
    userId: socket.user?.id,
    timestamp: new Date().toISOString(),
  });
}

async function handleDisconnect(socket, reason) {
  const session = await sessionService.getSocketSession(socket.id);

  if (session?.brandId && session?.userId) {
    await sessionService.removeActiveUser(session.brandId, session.userId);
  }

  await sessionService.removeSocketSession(socket.id);

  logger.socket('disconnected', {
    socketId: socket.id,
    reason,
    userId: socket.user?.id,
  });
}

module.exports = { handleConnection, handleDisconnect };
