const conversationService = require('./conversation.service');
const { success, paginated } = require('../../utils/response');

const conversationController = {
  async list(req, res) {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const result = await conversationService.getConversations(
      req.params.brandId,
      req.query.userId || req.user.id,
      { page, limit }
    );
    return paginated(res, result.conversations, result.pagination);
  },

  async getMessages(req, res) {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const result = await conversationService.getMessages(req.params.conversationId, {
      page,
      limit,
    });
    return paginated(res, result.messages, result.pagination);
  },

  async delete(req, res) {
    const result = await conversationService.deleteConversation(req.params.conversationId);
    return success(res, result);
  },
};

module.exports = conversationController;
