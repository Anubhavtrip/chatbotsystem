const { Router } = require('express');
const workflowController = require('../modules/workflow/workflow.controller');
const validate = require('../middleware/validate');
const asyncHandler = require('../utils/asyncHandler');
const { authenticate } = require('../middleware/auth');
const { createWorkflowSchema, updateWorkflowSchema } = require('../validators/workflow.validator');

const router = Router();

router.use(authenticate);

router.post('/', validate(createWorkflowSchema), asyncHandler(workflowController.create));
router.patch('/:workflowId', validate(updateWorkflowSchema), asyncHandler(workflowController.update));
router.get('/brand/:brandId', asyncHandler(workflowController.getByBrand));

module.exports = router;
