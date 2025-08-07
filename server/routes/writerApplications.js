const express = require('express');
const {
  submitApplication,
  getApplications,
  getApplication,
  getApplicationStatus,
  updateReviewStage
} = require('../controllers/writerApplicationController');

const {
  authenticate,
  authorize
} = require('../middleware/auth');

const {
  authLimiter
} = require('../middleware/security');

const router = express.Router();

// Public routes
router.post('/', authLimiter, submitApplication);
router.get('/status/:identifier', getApplicationStatus);

// Protected routes (Admin only)
router.use(authenticate);
router.use(authorize('manager', 'support', 'tech'));

router.get('/', getApplications);
router.get('/:id', getApplication);
router.put('/:id/review/:stage', updateReviewStage);

module.exports = router;
