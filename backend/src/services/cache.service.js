const { getRedis } = require('../config/redis');
const { REDIS_KEYS } = require('../constants');

const DEFAULT_TTL = 3600;

const cacheService = {
  async get(key) {
    const redis = getRedis();
    const data = await redis.get(key);
    return data ? JSON.parse(data) : null;
  },

  async set(key, value, ttlSeconds = DEFAULT_TTL) {
    const redis = getRedis();
    await redis.setex(key, ttlSeconds, JSON.stringify(value));
  },

  async del(key) {
    const redis = getRedis();
    await redis.del(key);
  },

  async getBrand(brandId) {
    return this.get(REDIS_KEYS.brandCache(brandId));
  },

  async setBrand(brandId, brand) {
    return this.set(REDIS_KEYS.brandCache(brandId), brand, 1800);
  },

  async getChatbot(brandId) {
    return this.get(REDIS_KEYS.chatbotCache(brandId));
  },

  async setChatbot(brandId, chatbot) {
    return this.set(REDIS_KEYS.chatbotCache(brandId), chatbot, 1800);
  },

  async invalidateBrand(brandId) {
    await this.del(REDIS_KEYS.brandCache(brandId));
    await this.del(REDIS_KEYS.chatbotCache(brandId));
  },
};

module.exports = cacheService;
