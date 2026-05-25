const Chatbot = require('../modules/chatbot/chatbot.model');

const chatbotRepository = {
  create(data) {
    return Chatbot.create(data);
  },

  findByBrandId(brandId) {
    return Chatbot.findOne({ brandId });
  },

  updateByBrandId(brandId, data) {
    return Chatbot.findOneAndUpdate({ brandId }, data, { new: true, runValidators: true });
  },
};

module.exports = chatbotRepository;
