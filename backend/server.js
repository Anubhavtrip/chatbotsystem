require('dotenv').config();

const http = require('http');
const env = require('./src/config/env');
const { connectDB } = require('./src/config/db');
const { connectRedis } = require('./src/config/redis');
const { connectKafka } = require('./src/config/kafka');
const { createApp } = require('./src/app');
const { initSocket } = require('./src/config/socket');
const logger = require('./src/utils/logger');

async function bootstrap() {
  try {
    await connectDB();
    await connectRedis();
    await connectKafka();

    const app = createApp();
    const server = http.createServer(app);
    initSocket(server);

    server.listen(env.port, () => {
      logger.info(`Server listening on port ${env.port} [${env.nodeEnv}]`);
    });

    const shutdown = async (signal) => {
      logger.info(`${signal} received, shutting down gracefully`);
      server.close(() => process.exit(0));
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (err) {
    logger.error('Failed to start server', { error: err.message, stack: err.stack });
    process.exit(1);
  }
}

bootstrap();
