const Conversation = require('../modules/conversation/conversation.model');

const conversationRepository = {
  create(data) {
    return Conversation.create(data);
  },

  findById(id) {
    return Conversation.findById(id);
  },

  findByBrandAndUser(brandId, userId, { page = 1, limit = 20 } = {}) {
    const skip = (page - 1) * limit;
    return Promise.all([
      Conversation.find({ brandId, userId })
        .sort({ lastMessageAt: -1 })
        .skip(skip)
        .limit(limit),
      Conversation.countDocuments({ brandId, userId }),
    ]);
  },

  updateById(id, data) {
    return Conversation.findByIdAndUpdate(id, data, { new: true });
  },

  deleteById(id) {
    return Conversation.findByIdAndDelete(id);
  },
};

module.exports = conversationRepository;
