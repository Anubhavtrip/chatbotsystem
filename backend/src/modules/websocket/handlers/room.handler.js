const { joinBrandRoomSchema } = require('../../../validators/socket.validator');
const sessionService = require('../../../services/session.service');
const { getBrandRoom, SOCKET_EVENTS } = require('../../../constants');
const logger = require('../../../utils/logger');

async function handleJoinBrandRoom(socket, payload) {
  const { error, value } = joinBrandRoomSchema.validate(payload);
  if (error) {
    socket.emit(SOCKET_EVENTS.ERROR, { message: error.details[0].message });
    return;
  }

  const { brandId, userId } = value;
  const room = getBrandRoom(brandId);

  await socket.join(room);

  await sessionService.saveSocketSession(socket.id, {
    brandId,
    userId: userId || socket.user?.id,
    room,
  });

  await sessionService.addActiveUser(brandId, userId || socket.user?.id);

  logger.socket('joined_room', { socketId: socket.id, brandId, room });

  socket.emit(SOCKET_EVENTS.JOIN_BRAND_ROOM, {
    success: true,
    brandId,
    room,
    timestamp: new Date().toISOString(),
  });
}

module.exports = { handleJoinBrandRoom };
