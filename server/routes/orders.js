const express = require('express');
const {
  createOrder,
  createGuestOrder,
  linkGuestOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  applyForOrder,
  assignWriter,
  submitWork,
  requestRevision,
  completeOrder,
  getOrderStats
} = require('../controllers/orderController');

const {
  authenticate,
  authorize,
  requireOrderOwnership,
  requireVerifiedWriter,
  canAccessWriterFeatures
} = require('../middleware/auth');

const {
  validateOrderCreation,
  validateObjectId,
  validatePagination,
  validateFileUpload,
  validateRating
} = require('../middleware/validation');

const { uploadMiddleware } = require('../utils/fileUpload');
const { orderLimiter } = require('../middleware/security');

const router = express.Router();

// Guest order creation (Public route - no authentication required)
router.post('/guest',
  orderLimiter,
  validateOrderCreation,
  createGuestOrder
);

// All other routes require authentication
router.use(authenticate);

// Get order statistics (Admin only)
router.get('/stats',
  authorize('manager', 'support', 'tech'),
  getOrderStats
);

// Create new order (Client only)
router.post('/',
  authorize('client'),
  orderLimiter,
  uploadMiddleware.array('attachments', 5, 'documents'),
  validateFileUpload(['pdf', 'doc', 'docx', 'txt', 'rtf'], 10 * 1024 * 1024), // 10MB limit
  validateOrderCreation,
  createOrder
);

// Get all orders (filtered by user role)
router.get('/',
  validatePagination,
  getOrders
);

// Apply for order (Writer only)
router.post('/:id/apply',
  canAccessWriterFeatures,
  requireVerifiedWriter,
  validateObjectId('id'),
  applyForOrder
);

// Assign writer to order (Client or Admin)
router.put('/:id/assign',
  validateObjectId('id'),
  requireOrderOwnership,
  assignWriter
);

// Submit work (Writer only)
router.post('/:id/submit',
  canAccessWriterFeatures,
  validateObjectId('id'),
  requireOrderOwnership,
  uploadMiddleware.single('submission', 'documents'),
  validateFileUpload(['pdf', 'doc', 'docx'], 10 * 1024 * 1024), // 10MB limit
  submitWork
);

// Request revision (Client only)
router.post('/:id/revision',
  authorize('client'),
  validateObjectId('id'),
  requireOrderOwnership,
  requestRevision
);

// Complete order (Client only)
router.post('/:id/complete',
  authorize('client'),
  validateObjectId('id'),
  requireOrderOwnership,
  validateRating,
  completeOrder
);

// Get single order
router.get('/:id',
  validateObjectId('id'),
  requireOrderOwnership,
  getOrder
);

// Update order
router.put('/:id',
  validateObjectId('id'),
  requireOrderOwnership,
  updateOrder
);

// Link guest order to user account (Client only)
router.put('/:id/link-guest',
  authorize('client'),
  validateObjectId('id'),
  linkGuestOrder
);

// Delete order (Client or Admin only)
router.delete('/:id',
  validateObjectId('id'),
  requireOrderOwnership,
  deleteOrder
);

module.exports = router;
