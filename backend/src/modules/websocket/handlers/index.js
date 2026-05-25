const { SOCKET_EVENTS } = require('../../../constants');
const { handleConnection, handleDisconnect } = require('./connection.handler');
const { handleJoinBrandRoom } = require('./room.handler');
const { handleSendMessage } = require('./message.handler');
const { handleUserTyping } = require('./typing.handler');
const { handleSocketError } = require('../../../utils/socketErrorHandler');
const logger = require('../../../utils/logger');

function registerSocketHandlers(io, socket) {
  handleConnection(socket);

  socket.on(SOCKET_EVENTS.JOIN_BRAND_ROOM, (payload) =>
    wrapHandler(socket, () => handleJoinBrandRoom(socket, payload))
  );

  socket.on(SOCKET_EVENTS.SEND_MESSAGE, (payload) =>
    wrapHandler(socket, () => handleSendMessage(socket, payload))
  );

  socket.on(SOCKET_EVENTS.USER_TYPING, (payload) =>
    wrapHandler(socket, () => handleUserTyping(socket, payload))
  );

  socket.on('disconnect', (reason) => handleDisconnect(socket, reason));

  socket.on('error', (err) => handleSocketError(socket, err));

  socket.on(SOCKET_EVENTS.RECONNECT, () => {
    logger.socket('reconnect', { socketId: socket.id });
    handleConnection(socket);
  });
}

function wrapHandler(socket, fn) {
  Promise.resolve(fn()).catch((err) => handleSocketError(socket, err));
}

module.exports = { registerSocketHandlers };
