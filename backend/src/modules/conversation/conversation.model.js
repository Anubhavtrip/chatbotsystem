const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema(
  {
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true, index: true },
    userId: { type: String, required: true, index: true },
    title: { type: String, default: 'New Conversation' },
    status: {
      type: String,
      enum: ['active', 'closed', 'archived'],
      default: 'active',
    },
    lastMessageAt: { type: Date, default: Date.now },
    metadata: {
      platform: { type: String, default: 'web' },
      userAgent: String,
      ip: String,
    },
    messageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

conversationSchema.index({ brandId: 1, userId: 1 });
conversationSchema.index({ brandId: 1, lastMessageAt: -1 });

module.exports = mongoose.model('Conversation', conversationSchema);
