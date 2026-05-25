const Message = require('../modules/message/message.model');

const messageRepository = {
  create(data) {
    return Message.create(data);
  },

  findByConversation(conversationId, { page = 1, limit = 50 } = {}) {
    const skip = (page - 1) * limit;
    return Promise.all([
      Message.find({ conversationId }).sort({ createdAt: 1 }).skip(skip).limit(limit),
      Message.countDocuments({ conversationId }),
    ]);
  },
};

module.exports = messageRepository;
