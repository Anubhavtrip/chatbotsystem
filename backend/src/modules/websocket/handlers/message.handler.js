const { sendMessageSchema } = require('../../../validators/socket.validator');
const { publishChatMessage, publishAnalyticsEvent } = require('../../kafka/producers/chat.producer');
const { SOCKET_EVENTS } = require('../../../constants');
const { getIO } = require('../../../config/socket');
const { getBrandRoom } = require('../../../constants');
const logger = require('../../../utils/logger');

async function handleSendMessage(socket, payload) {
  const { error, value } = sendMessageSchema.validate(payload);
  if (error) {
    socket.emit(SOCKET_EVENTS.ERROR, { message: error.details[0].message });
    return;
  }

  const eventPayload = {
    ...value,
    socketId: socket.id,
    metadata: {
      ...value.metadata,
      timestamp: value.metadata?.timestamp || new Date().toISOString(),
      platform: value.metadata?.platform || 'web',
    },
  };

  const io = getIO();
  io.to(getBrandRoom(value.brandId)).emit(SOCKET_EVENTS.BOT_TYPING, {
    brandId: value.brandId,
    conversationId: value.conversationId,
    isTyping: true,
  });

  await publishChatMessage(eventPayload);

  await publishAnalyticsEvent({
    brandId: value.brandId,
    eventType: 'message_sent',
    userId: value.userId,
    conversationId: value.conversationId,
    payload: { messageType: value.message.type },
  });

  logger.socket('message_published', {
    socketId: socket.id,
    brandId: value.brandId,
    conversationId: value.conversationId,
  });
}

module.exports = { handleSendMessage };
