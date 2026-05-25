const { v4: uuidv4 } = require('uuid');
const { sendMessage } = require('../services/producer.service');
const { KAFKA_TOPICS } = require('../../../constants');

async function publishBotResponse(payload) {
  const event = {
    eventId: uuidv4(),
    timestamp: new Date().toISOString(),
    ...payload,
  };

  return sendMessage(KAFKA_TOPICS.BOT_RESPONSES, event, payload.conversationId);
}

module.exports = { publishBotResponse };
