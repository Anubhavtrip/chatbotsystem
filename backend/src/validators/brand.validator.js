const Joi = require('joi');

const createBrandSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  slug: Joi.string().lowercase().pattern(/^[a-z0-9-]+$/).required(),
  description: Joi.string().max(500),
  theme: Joi.object({
    primaryColor: Joi.string(),
    secondaryColor: Joi.string(),
    logoUrl: Joi.string().uri(),
    fontFamily: Joi.string(),
    borderRadius: Joi.string(),
  }),
  settings: Joi.object({
    timezone: Joi.string(),
    language: Joi.string(),
    maxConversationsPerUser: Joi.number().integer().min(1),
  }),
});

const updateBrandSchema = createBrandSchema.fork(['name', 'slug'], (s) => s.optional());

module.exports = { createBrandSchema, updateBrandSchema };
