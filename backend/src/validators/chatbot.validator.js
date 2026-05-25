const Joi = require('joi');

const createChatbotSchema = Joi.object({
  brandId: Joi.string().hex().length(24).required(),
  name: Joi.string().min(2).max(100).required(),
  welcomeMessage: Joi.string().max(500),
  aiConfig: Joi.object({
    provider: Joi.string(),
    model: Joi.string(),
    temperature: Joi.number().min(0).max(2),
    maxTokens: Joi.number().integer().min(1),
    systemPrompt: Joi.string().max(4000),
    fallbackMessage: Joi.string().max(500),
    enableMemory: Joi.boolean(),
    enableRAG: Joi.boolean(),
  }),
  widgetSettings: Joi.object({
    position: Joi.string().valid('bottom-right', 'bottom-left'),
    showAvatar: Joi.boolean(),
  }),
});

const updateChatbotSchema = createChatbotSchema.fork(['brandId', 'name'], (s) => s.optional());

module.exports = { createChatbotSchema, updateChatbotSchema };
