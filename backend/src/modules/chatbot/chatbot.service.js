const chatbotRepository = require('../../repositories/chatbot.repository');
const brandRepository = require('../../repositories/brand.repository');
const cacheService = require('../../services/cache.service');
const AppError = require('../../utils/AppError');
const { HTTP_STATUS } = require('../../constants');

const chatbotService = {
  async create(data) {
    const brand = await brandRepository.findById(data.brandId);
    if (!brand) {
      throw new AppError('Brand not found', HTTP_STATUS.NOT_FOUND);
    }

    const existing = await chatbotRepository.findByBrandId(data.brandId);
    if (existing) {
      throw new AppError('Chatbot already exists for this brand', HTTP_STATUS.CONFLICT);
    }

    const chatbot = await chatbotRepository.create(data);
    await cacheService.setChatbot(data.brandId, chatbot);
    return chatbot;
  },

  async update(brandId, data) {
    const chatbot = await chatbotRepository.updateByBrandId(brandId, data);
    if (!chatbot) {
      throw new AppError('Chatbot not found', HTTP_STATUS.NOT_FOUND);
    }
    await cacheService.invalidateBrand(brandId);
    await cacheService.setChatbot(brandId, chatbot);
    return chatbot;
  },

  async getByBrand(brandId) {
    const cached = await cacheService.getChatbot(brandId);
    if (cached) return cached;

    const chatbot = await chatbotRepository.findByBrandId(brandId);
    if (!chatbot) {
      throw new AppError('Chatbot not found', HTTP_STATUS.NOT_FOUND);
    }

    await cacheService.setChatbot(brandId, chatbot);
    return chatbot;
  },

  async updateAiConfig(brandId, aiConfig) {
    return this.update(brandId, { aiConfig });
  },
};

module.exports = chatbotService;
