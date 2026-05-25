const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true, index: true },
    eventType: { type: String, required: true, index: true },
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation' },
    userId: String,
    payload: { type: mongoose.Schema.Types.Mixed, default: {} },
    sessionId: String,
    platform: { type: String, default: 'web' },
  },
  { timestamps: true }
);

analyticsSchema.index({ brandId: 1, createdAt: -1 });
analyticsSchema.index({ brandId: 1, eventType: 1, createdAt: -1 });

module.exports = mongoose.model('Analytics', analyticsSchema);
