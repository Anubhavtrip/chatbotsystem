const analyticsService = require('./analytics.service');
const { success } = require('../../utils/response');

const analyticsController = {
  async list(req, res) {
    const events = await analyticsService.getEvents(req.params.brandId, {
      eventType: req.query.eventType,
      from: req.query.from ? new Date(req.query.from) : undefined,
      to: req.query.to ? new Date(req.query.to) : undefined,
      limit: parseInt(req.query.limit, 10) || 100,
    });
    return success(res, events);
  },
};

module.exports = analyticsController;
