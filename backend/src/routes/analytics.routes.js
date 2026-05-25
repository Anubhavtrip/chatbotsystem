const { Router } = require('express');
const analyticsController = require('../modules/analytics/analytics.controller');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate, authorize } = require('../middleware/auth');

const router = Router();

router.use(authenticate);
router.use(authorize('admin', 'brand_owner'));

router.get('/brand/:brandId', asyncHandler(analyticsController.list));

module.exports = router;
