const mongoose = require('mongoose');

const aiConfigSchema = new mongoose.Schema(
  {
    provider: { type: String, default: 'openai' },
    model: { type: String, default: 'gpt-4o-mini' },
    temperature: { type: Number, default: 0.7, min: 0, max: 2 },
    maxTokens: { type: Number, default: 1024 },
    systemPrompt: { type: String, default: 'You are a helpful brand assistant.' },
    fallbackMessage: {
      type: String,
      default: 'I am unable to help with that right now. Please try again.',
    },
    enableMemory: { type: Boolean, default: true },
    enableRAG: { type: Boolean, default: false },
  },
  { _id: false }
);

const chatbotSchema = new mongoose.Schema(
  {
    brandId: { type: mongoose.Schema.Types.ObjectId, ref: 'Brand', required: true, unique: true },
    name: { type: String, required: true, trim: true },
    welcomeMessage: { type: String, default: 'Hello! How can I help you today?' },
    aiConfig: { type: aiConfigSchema, default: () => ({}) },
    workflowId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workflow' },
    isActive: { type: Boolean, default: true },
    widgetSettings: {
      position: { type: String, enum: ['bottom-right', 'bottom-left'], default: 'bottom-right' },
      showAvatar: { type: Boolean, default: true },
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

chatbotSchema.index({ brandId: 1 });

module.exports = mongoose.model('Chatbot', chatbotSchema);
