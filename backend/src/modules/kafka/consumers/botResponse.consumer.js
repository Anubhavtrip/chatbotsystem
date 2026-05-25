const messageRepository = require('../../../repositories/message.repository');
const conversationRepository = require('../../../repositories/conversation.repository');
const { validateEvent, botResponseEventSchema } = require('../utils/eventValidator');
const { MESSAGE_SENDERS } = require('../../../constants');
const { getIO } = require('../../../config/socket');
const { SOCKET_EVENTS, getBrandRoom } = require('../../../constants');
const logger = require('../../../utils/logger');

async function processBotResponse(payload) {
  const event = validateEvent(botResponseEventSchema, payload);

  const saved = await messageRepository.create({
    brandId: event.brandId,
    conversationId: event.conversationId,
    sender: MESSAGE_SENDERS.BOT,
    message: event.message,
    metadata: event.metadata,
  });

  await conversationRepository.updateById(event.conversationId, {
    lastMessageAt: new Date(),
    $inc: { messageCount: 1 },
  });

  const responsePayload = {
    event: SOCKET_EVENTS.RECEIVE_MESSAGE,
    brandId: event.brandId,
    conversationId: event.conversationId,
    userId: event.userId,
    message: event.message,
    messageId: saved._id.toString(),
    metadata: {
      ...event.metadata,
      timestamp: new Date().toISOString(),
      sender: MESSAGE_SENDERS.BOT,
    },
  };

  try {
    const io = getIO();
    const room = getBrandRoom(event.brandId);

    if (event.socketId) {
      io.to(event.socketId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, responsePayload);
    }
    io.to(room).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, responsePayload);
    io.to(room).emit(SOCKET_EVENTS.BOT_TYPING, {
      brandId: event.brandId,
      conversationId: event.conversationId,
      isTyping: false,
    });
  } catch (err) {
    logger.socket('emit_bot_response_failed', { error: err.message });
  }
}

module.exports = { processBotResponse };
