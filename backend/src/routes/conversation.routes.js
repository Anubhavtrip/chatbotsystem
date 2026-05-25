const { Router } = require('express');
const conversationController = require('../modules/conversation/conversation.controller');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate } = require('../middleware/auth');

const router = Router();

router.use(authenticate);

router.get('/brand/:brandId', asyncHandler(conversationController.list));
router.get('/:conversationId/messages', asyncHandler(conversationController.getMessages));
router.delete('/:conversationId', asyncHandler(conversationController.delete));

module.exports = router;
