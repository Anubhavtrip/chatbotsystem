const workflowRepository = require('../../repositories/workflow.repository');
const brandRepository = require('../../repositories/brand.repository');
const AppError = require('../../utils/AppError');
const { HTTP_STATUS } = require('../../constants');

const workflowService = {
  async create(data) {
    const brand = await brandRepository.findById(data.brandId);
    if (!brand) {
      throw new AppError('Brand not found', HTTP_STATUS.NOT_FOUND);
    }

    const entryExists = data.nodes.some((n) => n.id === data.entryNodeId);
    if (!entryExists) {
      throw new AppError('entryNodeId must match a node id', HTTP_STATUS.BAD_REQUEST);
    }

    return workflowRepository.create(data);
  },

  async update(workflowId, data) {
    const workflow = await workflowRepository.updateById(workflowId, data);
    if (!workflow) {
      throw new AppError('Workflow not found', HTTP_STATUS.NOT_FOUND);
    }
    return workflow;
  },

  async getByBrand(brandId) {
    const workflows = await workflowRepository.findByBrand(brandId);
    return workflows;
  },

  async getActive(brandId) {
    const workflow = await workflowRepository.findActiveByBrand(brandId);
    if (!workflow) {
      throw new AppError('No active workflow for brand', HTTP_STATUS.NOT_FOUND);
    }
    return workflow;
  },
};

module.exports = workflowService;
