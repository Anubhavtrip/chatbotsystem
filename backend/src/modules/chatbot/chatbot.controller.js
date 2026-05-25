const chatbotService = require('./chatbot.service');
const { success } = require('../../utils/response');
const { HTTP_STATUS } = require('../../constants');

const chatbotController = {
  async create(req, res) {
    const chatbot = await chatbotService.create(req.body);
    return success(res, chatbot, HTTP_STATUS.CREATED);
  },

  async update(req, res) {
    const chatbot = await chatbotService.update(req.params.brandId, req.body);
    return success(res, chatbot);
  },

  async getByBrand(req, res) {
    const chatbot = await chatbotService.getByBrand(req.params.brandId);
    return success(res, chatbot);
  },

  async updateAiConfig(req, res) {
    const chatbot = await chatbotService.updateAiConfig(req.params.brandId, req.body);
    return success(res, chatbot);
  },
};

module.exports = chatbotController;
