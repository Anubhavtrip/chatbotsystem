const brandService = require('./brand.service');
const { success } = require('../../utils/response');
const { HTTP_STATUS } = require('../../constants');

const brandController = {
  async create(req, res) {
    const brand = await brandService.create(req.body, req.user.id);
    return success(res, brand, HTTP_STATUS.CREATED);
  },

  async update(req, res) {
    const brand = await brandService.update(req.params.brandId, req.body, req.user.id);
    return success(res, brand);
  },

  async getConfig(req, res) {
    const config = await brandService.getConfig(req.params.brandId);
    return success(res, config);
  },
};

module.exports = brandController;
