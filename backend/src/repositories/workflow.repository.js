const Workflow = require('../modules/workflow/workflow.model');

const workflowRepository = {
  create(data) {
    return Workflow.create(data);
  },

  findById(id) {
    return Workflow.findById(id);
  },

  findActiveByBrand(brandId) {
    return Workflow.findOne({ brandId, isActive: true }).sort({ version: -1 });
  },

  findByBrand(brandId) {
    return Workflow.find({ brandId }).sort({ version: -1 });
  },

  updateById(id, data) {
    return Workflow.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  },
};

module.exports = workflowRepository;
