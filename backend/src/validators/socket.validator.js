const Joi = require('joi');
const { MESSAGE_TYPES } = require('../constants');

const sendMessageSchema = Joi.object({
  event: Joi.string().valid('SEND_MESSAGE').required(),
  brandId: Joi.string().required(),
  conversationId: Joi.string().required(),
  userId: Joi.string().required(),
  message: Joi.object({
    text: Joi.string().min(1).max(10000).required(),
    type: Joi.string()
      .valid(...Object.values(MESSAGE_TYPES))
      .default('text'),
  }).required(),
  metadata: Joi.object({
    timestamp: Joi.string().isoDate(),
    platform: Joi.string().default('web'),
  }).default({}),
});

const joinBrandRoomSchema = Joi.object({
  brandId: Joi.string().required(),
  userId: Joi.string().required(),
});

const typingSchema = Joi.object({
  brandId: Joi.string().required(),
  conversationId: Joi.string().required(),
  userId: Joi.string().required(),
  isTyping: Joi.boolean().required(),
});

module.exports = { sendMessageSchema, joinBrandRoomSchema, typingSchema };
