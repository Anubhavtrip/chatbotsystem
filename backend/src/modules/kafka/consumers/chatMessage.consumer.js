require('dotenv').config();

const { connectDB } = require('../../../config/db');
const { connectRedis } = require('../../../config/redis');
const { connectKafka } = require('../../../config/kafka');
const { runConsumer } = require('../services/consumer.service');
const { validateEvent, chatMessageEventSchema } = require('../utils/eventValidator');
const { KAFKA_TOPICS, MESSAGE_SENDERS } = require('../../../constants');
const messageRepository = require('../../../repositories/message.repository');
const conversationRepository = require('../../../repositories/conversation.repository');
const workflowRepository = require('../../../repositories/workflow.repository');
const chatbotRepository = require('../../../repositories/chatbot.repository');
const brandRepository = require('../../../repositories/brand.repository');
const { executeWorkflow } = require('../../workflow/workflow.executor');
const { publishBotResponse } = require('../producers/bot.producer');
const { publishAnalyticsEvent } = require('../producers/chat.producer');
const logger = require('../../../utils/logger');

async function processChatMessage(payload) {
  const event = validateEvent(chatMessageEventSchema, payload);

  await messageRepository.create({
    brandId: event.brandId,
    conversationId: event.conversationId,
    sender: MESSAGE_SENDERS.USER,
    message: event.message,
    metadata: {
      ...event.metadata,
      timestamp: event.timestamp || new Date().toISOString(),
    },
  });

  await conversationRepository.updateById(event.conversationId, {
    $set: { lastMessageAt: new Date() },
    $inc: { messageCount: 1 },
  });

  const [chatbot, workflow, brand] = await Promise.all([
    chatbotRepository.findByBrandId(event.brandId),
    workflowRepository.findActiveByBrand(event.brandId),
    brandRepository.findById(event.brandId),
  ]);

  const [messages] = await messageRepository.findByConversation(event.conversationId, {
    limit: 20,
  });

  const history = messages.map((m) => ({
    sender: m.sender,
    text: m.message.text,
  }));

  let botText;

  if (workflow) {
    botText = await executeWorkflow(workflow, {
      userMessage: event.message.text,
      brandName: brand?.name,
      aiConfig: chatbot?.aiConfig,
      conversationHistory: history,
    });
  } else {
    botText =
      chatbot?.aiConfig?.fallbackMessage ||
      'Thank you for your message. Our team will assist you shortly.';
  }

  await publishBotResponse({
    brandId: event.brandId,
    conversationId: event.conversationId,
    userId: event.userId,
    socketId: event.socketId,
    message: { text: botText, type: 'text' },
    metadata: { processedBy: workflow ? 'workflow' : 'fallback' },
  });

  await publishAnalyticsEvent({
    brandId: event.brandId,
    eventType: 'message_processed',
    userId: event.userId,
    conversationId: event.conversationId,
    payload: { messageLength: event.message.text.length },
  });
}

async function startChatMessageConsumer() {
  await connectDB();
  connectRedis();
  connectKafka();

  await runConsumer({
    topics: [KAFKA_TOPICS.CHAT_MESSAGES],
    groupId: 'chat-message-processor',
    eachMessage: async ({ payload }) => {
      logger.kafka('chat_message_received', { eventId: payload.eventId });
      await processChatMessage(payload);
    },
  });
}

module.exports = { startChatMessageConsumer, processChatMessage };
