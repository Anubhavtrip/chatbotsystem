const { Router } = require('express');
const chatbotController = require('../modules/chatbot/chatbot.controller');
const validate = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate } = require('../middleware/auth');
const { createChatbotSchema, updateChatbotSchema } = require('../validators/chatbot.validator');

const router = Router();

router.use(authenticate);

router.post('/', validate(createChatbotSchema), asyncHandler(chatbotController.create));
router.patch('/:brandId', validate(updateChatbotSchema), asyncHandler(chatbotController.update));
router.get('/:brandId', asyncHandler(chatbotController.getByBrand));
router.patch('/:brandId/ai-config', asyncHandler(chatbotController.updateAiConfig));

module.exports = router;
