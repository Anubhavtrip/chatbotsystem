const workflowService = require('./workflow.service');
const { success } = require('../../utils/response');
const { HTTP_STATUS } = require('../../constants');

const workflowController = {
  async create(req, res) {
    const workflow = await workflowService.create(req.body);
    return success(res, workflow, HTTP_STATUS.CREATED);
  },

  async update(req, res) {
    const workflow = await workflowService.update(req.params.workflowId, req.body);
    return success(res, workflow);
  },

  async getByBrand(req, res) {
    const workflows = await workflowService.getByBrand(req.params.brandId);
    return success(res, workflows);
  },
};

module.exports = workflowController;
