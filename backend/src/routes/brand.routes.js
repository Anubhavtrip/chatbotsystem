const { Router } = require('express');
const brandController = require('../modules/brand/brand.controller');
const validate = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate } = require('../middleware/auth');
const { createBrandSchema, updateBrandSchema } = require('../validators/brand.validator');

const router = Router();

router.use(authenticate);

router.post('/', validate(createBrandSchema), asyncHandler(brandController.create));
router.patch('/:brandId', validate(updateBrandSchema), asyncHandler(brandController.update));
router.get('/:brandId/config', asyncHandler(brandController.getConfig));

module.exports = router;
