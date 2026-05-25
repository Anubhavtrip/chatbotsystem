const { Router } = require('express');
const authController = require('../modules/auth/auth.controller');
const validate = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');
const { authLimiter } = require('../middleware/rateLimiter');
const { signupSchema, loginSchema, refreshSchema } = require('../validators/auth.validator');

const router = Router();

router.post('/signup', authLimiter, validate(signupSchema), asyncHandler(authController.signup));
router.post('/login', authLimiter, validate(loginSchema), asyncHandler(authController.login));
router.post('/refresh', validate(refreshSchema), asyncHandler(authController.refresh));

module.exports = router;
