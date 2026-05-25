const { getProducer } = require('../../../config/kafka');
const logger = require('../../../utils/logger');
const AppError = require('../../../utils/AppError');
const { HTTP_STATUS } = require('../../../constants');

const MAX_RETRIES = 3;

async function sendMessage(topic, payload, key = null) {
  let attempt = 0;
  let lastError;

  while (attempt < MAX_RETRIES) {
    try {
      const producer = await getProducer();
      const message = {
        key: key ? String(key) : undefined,
        value: JSON.stringify(payload),
        headers: {
          timestamp: Date.now().toString(),
          attempt: String(attempt),
        },
      };

      await producer.send({ topic, messages: [message] });
      logger.kafka('message_sent', { topic, key, attempt });
      return true;
    } catch (err) {
      lastError = err;
      attempt += 1;
      logger.kafka('send_retry', { topic, attempt, error: err.message });
      await new Promise((r) => setTimeout(r, Math.pow(2, attempt) * 100));
    }
  }

  logger.error('Kafka producer failed after retries', {
    topic,
    error: lastError?.message,
  });
  throw new AppError('Failed to publish event', HTTP_STATUS.INTERNAL_SERVER_ERROR);
}

async function sendBatch(topic, payloads) {
  const producer = await getProducer();
  const messages = payloads.map((payload, i) => ({
    key: payload.key ? String(payload.key) : String(i),
    value: JSON.stringify(payload.data),
  }));

  await producer.send({ topic, messages });
  logger.kafka('batch_sent', { topic, count: messages.length });
}

module.exports = { sendMessage, sendBatch };
