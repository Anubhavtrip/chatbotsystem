const { validateEvent, typingEventSchema } = require('../utils/eventValidator');
const { getIO } = require('../../../config/socket');
const { SOCKET_EVENTS, getBrandRoom } = require('../../../constants');
const sessionService = require('../../../services/session.service');

async function processTypingEvent(payload) {
  const event = validateEvent(typingEventSchema, payload);

  await sessionService.setTyping(
    event.brandId,
    event.conversationId,
    event.userId,
    event.isTyping
  );

  const io = getIO();
  const room = getBrandRoom(event.brandId);
  const socketEvent =
    event.sender === 'bot' ? SOCKET_EVENTS.BOT_TYPING : SOCKET_EVENTS.USER_TYPING;

  io.to(room).emit(socketEvent, {
    brandId: event.brandId,
    conversationId: event.conversationId,
    userId: event.userId,
    isTyping: event.isTyping,
  });
}

module.exports = { processTypingEvent };
