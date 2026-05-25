const { Kafka, logLevel } = require('kafkajs');
const env = require('./env');
const logger = require('../utils/logger');

let kafka = null;
let producer = null;
let admin = null;

function connectKafka() {
  if (kafka) return kafka;

  kafka = new Kafka({
    clientId: env.kafka.clientId,
    brokers: env.kafka.brokers,
    logLevel: logLevel.ERROR,
    retry: {
      initialRetryTime: 300,
      retries: 8,
      maxRetryTime: 30000,
    },
  });

  producer = kafka.producer({ allowAutoTopicCreation: true });
  admin = kafka.admin();

  logger.info('Kafka client initialized', { brokers: env.kafka.brokers });
  return kafka;
}

async function getProducer() {
  if (!producer) connectKafka();
  await producer.connect();
  return producer;
}

function getKafka() {
  if (!kafka) connectKafka();
  return kafka;
}

function getAdmin() {
  if (!admin) connectKafka();
  return admin;
}

async function disconnectKafka() {
  if (producer) {
    await producer.disconnect();
    producer = null;
  }
  if (admin) {
    await admin.disconnect();
    admin = null;
  }
}

module.exports = {
  connectKafka,
  getKafka,
  getProducer,
  getAdmin,
  disconnectKafka,
};
