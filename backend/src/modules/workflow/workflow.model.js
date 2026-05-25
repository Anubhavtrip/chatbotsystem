const mongoose = require('mongoose');
const { WORKFLOW_NODE_TYPES } = require('../../constants');

const workflowNodeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: Object.values(WORKFLOW_NODE_TYPES),
      required: true,
    },
    label: String,
    config: { type: mongoose.Schema.Types.Mixed, default: {} },
    next: [{ type: String }],
    position: { x: Number, y: Number },
  },
  { _id: false }
);

const workflowSchema = new mongoose.Schema(
  {
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: String,
    version: { type: Number, default: 1 },
    isActive: { type: Boolean, default: true },
    entryNodeId: { type: String, required: true },
    nodes: [workflowNodeSchema],
    settings: {
      timeoutMs: { type: Number, default: 30000 },
      maxRetries: { type: Number, default: 2 },
    },
  },
  { timestamps: true }
);

workflowSchema.index({ brandId: 1, isActive: 1 });

module.exports = mongoose.model('Workflow', workflowSchema);
