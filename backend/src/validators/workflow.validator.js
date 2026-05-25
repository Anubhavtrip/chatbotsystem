const Joi = require('joi');
const { WORKFLOW_NODE_TYPES } = require('../constants');

const nodeSchema = Joi.object({
  id: Joi.string().required(),
  type: Joi.string()
    .valid(...Object.values(WORKFLOW_NODE_TYPES))
    .required(),
  label: Joi.string(),
  config: Joi.object(),
  next: Joi.array().items(Joi.string()),
  position: Joi.object({ x: Joi.number(), y: Joi.number() }),
});

const createWorkflowSchema = Joi.object({
  brandId: Joi.string().hex().length(24).required(),
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(500),
  entryNodeId: Joi.string().required(),
  nodes: Joi.array().items(nodeSchema).min(1).required(),
  settings: Joi.object({
    timeoutMs: Joi.number().integer().min(1000),
    maxRetries: Joi.number().integer().min(0),
  }),
});

const updateWorkflowSchema = createWorkflowSchema.fork(['brandId', 'name', 'entryNodeId', 'nodes'], (s) =>
  s.optional()
);

module.exports = { createWorkflowSchema, updateWorkflowSchema };
