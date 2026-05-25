const logger = require('./logger');

function handleKafkaError(topic, err, meta = {}) {
  logger.error('Kafka error', {
    topic,
    error: err.message,
    stack: err.stack,
    ...meta,
  });
}

module.exports = { handleKafkaError };
