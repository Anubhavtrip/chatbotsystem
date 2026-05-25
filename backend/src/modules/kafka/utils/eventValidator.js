const Joi = require('joi');

const chatMessageEventSchema = Joi.object({
  eventId: Joi.string().required(),
  brandId: Joi.string().required(),
  conversationId: Joi.string().required(),
  userId: Joi.string().required(),
  message: Joi.object({
    text: Joi.string().required(),
    type: Joi.string(),
  }).required(),
  metadata: Joi.object().default({}),
  socketId: Joi.string(),
  timestamp: Joi.string().isoDate(),
});

const botResponseEventSchema = Joi.object({
  eventId: Joi.string().required(),
  brandId: Joi.string().required(),
  conversationId: Joi.string().required(),
  userId: Joi.string().required(),
  message: Joi.object({
    text: Joi.string().required(),
    type: Joi.string(),
  }).required(),
  metadata: Joi.object().default({}),
  socketId: Joi.string(),
});

const typingEventSchema = Joi.object({
  brandId: Joi.string().required(),
  conversationId: Joi.string().required(),
  userId: Joi.string().required(),
  isTyping: Joi.boolean().required(),
  sender: Joi.string().valid('user', 'bot'),
});

const analyticsEventSchema = Joi.object({
  brandId: Joi.string().required(),
  eventType: Joi.string().required(),
  userId: Joi.string(),
  conversationId: Joi.string(),
  payload: Joi.object().default({}),
});

function validateEvent(schema, payload) {
  const { error, value } = schema.validate(payload, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join('; ');
    throw new Error(`Event validation failed: ${messages}`);
  }
  return value;
}

module.exports = {
  chatMessageEventSchema,
  botResponseEventSchema,
  typingEventSchema,
  analyticsEventSchema,
  validateEvent,
};
