const mongoose = require('mongoose');
const { MESSAGE_SENDERS, MESSAGE_TYPES } = require('../../constants');

const messageSchema = new mongoose.Schema(
  {
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true, index: true },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
      index: true,
    },
    sender: {
      type: String,
      enum: Object.values(MESSAGE_SENDERS),
      required: true,
    },
    message: {
      text: { type: String, required: true },
      type: {
        type: String,
        enum: Object.values(MESSAGE_TYPES),
        default: MESSAGE_TYPES.TEXT,
      },
    },
    metadata: {
      timestamp: Date,
      platform: String,
      intent: String,
      confidence: Number,
      workflowNodeId: String,
    },
  },
  { timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
