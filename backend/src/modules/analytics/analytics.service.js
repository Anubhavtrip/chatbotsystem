const analyticsRepository = require('../../repositories/analytics.repository');

const analyticsService = {
  async getEvents(brandId, filters) {
    return analyticsRepository.findByBrand(brandId, filters);
  },
};

module.exports = analyticsService;
