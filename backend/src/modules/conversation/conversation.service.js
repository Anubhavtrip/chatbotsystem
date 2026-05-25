const conversationRepository = require('../../repositories/conversation.repository');
const messageRepository = require('../../repositories/message.repository');
const AppError = require('../../utils/AppError');
const { HTTP_STATUS } = require('../../constants');

const conversationService = {
  async getConversations(brandId, userId, pagination) {
    const [conversations, total] = await conversationRepository.findByBrandAndUser(
      brandId,
      userId,
      pagination
    );

    return {
      conversations,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit),
      },
    };
  },

  async getMessages(conversationId, pagination) {
    const conversation = await conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new AppError('Conversation not found', HTTP_STATUS.NOT_FOUND);
    }

    const [messages, total] = await messageRepository.findByConversation(
      conversationId,
      pagination
    );

    return {
      messages,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit),
      },
    };
  },

  async deleteConversation(conversationId) {
    const conversation = await conversationRepository.findById(conversationId);
    if (!conversation) {
      throw new AppError('Conversation not found', HTTP_STATUS.NOT_FOUND);
    }
    await conversationRepository.deleteById(conversationId);
    return { deleted: true };
  },

  async findOrCreate(brandId, userId, metadata = {}) {
    const [conversations] = await conversationRepository.findByBrandAndUser(brandId, userId, {
      page: 1,
      limit: 1,
    });

    const active = conversations.find((c) => c.status === 'active');
    if (active) return active;

    return conversationRepository.create({
      brandId,
      userId,
      metadata,
    });
  },
};

module.exports = conversationService;
