const Analytics = require('../modules/analytics/analytics.model');

const analyticsRepository = {
  create(data) {
    return Analytics.create(data);
  },

  findByBrand(brandId, { eventType, from, to, limit = 100 } = {}) {
    const filter = { brandId };
    if (eventType) filter.eventType = eventType;
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = from;
      if (to) filter.createdAt.$lte = to;
    }
    return Analytics.find(filter).sort({ createdAt: -1 }).limit(limit);
  },
};

module.exports = analyticsRepository;
