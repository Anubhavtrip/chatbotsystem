const { getKafka } = require('../../../config/kafka');
const env = require('../../../config/env');
const logger = require('../../../utils/logger');

function createConsumer(groupId = env.kafka.groupId) {
  const kafka = getKafka();
  return kafka.consumer({ groupId });
}

async function runConsumer({ topics, groupId, eachMessage, fromBeginning = false }) {
  const consumer = createConsumer(groupId);

  const shutdown = async () => {
    logger.kafka('consumer_disconnecting', { topics, groupId });
    await consumer.disconnect();
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

  try {
    await consumer.connect();
    await consumer.subscribe({ topics, fromBeginning });

    logger.kafka('consumer_started', { topics, groupId });

    await consumer.run({
      eachMessage: async ({ topic, partition, message, heartbeat }) => {
        let payload;
        try {
          payload = JSON.parse(message.value.toString());
        } catch (parseErr) {
          logger.error('Invalid Kafka message payload', {
            topic,
            partition,
            offset: message.offset,
            error: parseErr.message,
          });
          return;
        }

        try {
          await eachMessage({ topic, partition, message, payload, heartbeat });
        } catch (handlerErr) {
          logger.error('Kafka consumer handler error', {
            topic,
            partition,
            offset: message.offset,
            error: handlerErr.message,
            stack: handlerErr.stack,
          });
        }
      },
    });
  } catch (err) {
    logger.error('Kafka consumer failed', { topics, error: err.message });
    throw err;
  }

  return consumer;
}

module.exports = { createConsumer, runConsumer };
