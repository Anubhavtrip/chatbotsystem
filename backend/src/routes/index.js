const { Router } = require('express');
const authRoutes = require('./auth.routes');
const brandRoutes = require('./brand.routes');
const chatbotRoutes = require('./chatbot.routes');
const conversationRoutes = require('./conversation.routes');
const workflowRoutes = require('./workflow.routes');
const analyticsRoutes = require('./analytics.routes');

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
});

router.use('/auth', authRoutes);
router.use('/brands', brandRoutes);
router.use('/chatbots', chatbotRoutes);
router.use('/conversations', conversationRoutes);
router.use('/workflows', workflowRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
