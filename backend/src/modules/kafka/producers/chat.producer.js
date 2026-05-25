const { v4: uuidv4 } = require('uuid');
const { sendMessage } = require('../services/producer.service');
const { KAFKA_TOPICS } = require('../../../constants');

async function publishChatMessage(payload) {
  const event = {
    eventId: uuidv4(),
    timestamp: new Date().toISOString(),
    ...payload,
  };

  return sendMessage(KAFKA_TOPICS.CHAT_MESSAGES, event, payload.conversationId);
}

async function publishTypingEvent(payload) {
  return sendMessage(KAFKA_TOPICS.TYPING_EVENTS, {
    ...payload,
    timestamp: new Date().toISOString(),
  });
}

async function publishAnalyticsEvent(payload) {
  return sendMessage(KAFKA_TOPICS.ANALYTICS_EVENTS, {
    eventId: uuidv4(),
    timestamp: new Date().toISOString(),
    ...payload,
  });
}

async function publishWorkflowEvent(payload) {
  return sendMessage(KAFKA_TOPICS.WORKFLOW_EVENTS, {
    eventId: uuidv4(),
    timestamp: new Date().toISOString(),
    ...payload,
  });
}

module.exports = {
  publishChatMessage,
  publishTypingEvent,
  publishAnalyticsEvent,
  publishWorkflowEvent,
};
