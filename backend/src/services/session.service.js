const { getRedis } = require('../config/redis');
const { REDIS_KEYS } = require('../constants');

const SESSION_TTL = 86400;

const sessionService = {
  async saveSocketSession(socketId, data) {
    const redis = getRedis();
    await redis.setex(
      REDIS_KEYS.socketSession(socketId),
      SESSION_TTL,
      JSON.stringify({ ...data, connectedAt: new Date().toISOString() })
    );
  },

  async getSocketSession(socketId) {
    const redis = getRedis();
    const data = await redis.get(REDIS_KEYS.socketSession(socketId));
    return data ? JSON.parse(data) : null;
  },

  async removeSocketSession(socketId) {
    const redis = getRedis();
    await redis.del(REDIS_KEYS.socketSession(socketId));
  },

  async addActiveUser(brandId, userId) {
    const redis = getRedis();
    await redis.sadd(REDIS_KEYS.activeUsers(brandId), userId);
    await redis.expire(REDIS_KEYS.activeUsers(brandId), SESSION_TTL);
  },

  async removeActiveUser(brandId, userId) {
    const redis = getRedis();
    await redis.srem(REDIS_KEYS.activeUsers(brandId), userId);
  },

  async setTyping(brandId, conversationId, userId, isTyping) {
    const redis = getRedis();
    const key = REDIS_KEYS.typing(brandId, conversationId);
    if (isTyping) {
      await redis.hset(key, userId, Date.now());
      await redis.expire(key, 10);
    } else {
      await redis.hdel(key, userId);
    }
  },

  async getTypingUsers(brandId, conversationId) {
    const redis = getRedis();
    return redis.hkeys(REDIS_KEYS.typing(brandId, conversationId));
  },
};

module.exports = sessionService;
