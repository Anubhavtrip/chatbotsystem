const { typingSchema } = require('../../../validators/socket.validator');
const { publishTypingEvent } = require('../../kafka/producers/chat.producer');
const { SOCKET_EVENTS } = require('../../../constants');

async function handleUserTyping(socket, payload) {
  const { error, value } = typingSchema.validate(payload);
  if (error) {
    socket.emit(SOCKET_EVENTS.ERROR, { message: error.details[0].message });
    return;
  }

  await publishTypingEvent({
    ...value,
    sender: 'user',
  });
}

module.exports = { handleUserTyping };
