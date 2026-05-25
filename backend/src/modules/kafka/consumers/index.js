require('dotenv').config();

const { connectDB } = require('../../../config/db');
const { connectRedis } = require('../../../config/redis');
const { connectKafka } = require('../../../config/kafka');
const { runConsumer } = require('../services/consumer.service');
const { KAFKA_TOPICS } = require('../../../constants');
const { processChatMessage } = require('./chatMessage.consumer');
const { processBotResponse } = require('./botResponse.consumer');
const { processTypingEvent } = require('./typing.consumer');
const { processAnalyticsEvent } = require('./analytics.consumer');
const logger = require('../../../utils/logger');

const TOPIC_HANDLERS = {
  [KAFKA_TOPICS.CHAT_MESSAGES]: processChatMessage,
  [KAFKA_TOPICS.BOT_RESPONSES]: processBotResponse,
  [KAFKA_TOPICS.TYPING_EVENTS]: processTypingEvent,
  [KAFKA_TOPICS.ANALYTICS_EVENTS]: processAnalyticsEvent,
};

async function bootstrap() {
  await connectDB();
  connectRedis();
  connectKafka();

  const topics = Object.keys(TOPIC_HANDLERS);

  await runConsumer({
    topics,
    groupId: 'chatbot-platform-workers',
    eachMessage: async ({ topic, payload }) => {
      const handler = TOPIC_HANDLERS[topic];
      if (!handler) {
        logger.warn('No handler for topic', { topic });
        return;
      }
      await handler(payload);
    },
  });

  logger.info('All Kafka consumers running', { topics });
}

bootstrap().catch((err) => {
  logger.error('Consumer bootstrap failed', { error: err.message });
  process.exit(1);
});
