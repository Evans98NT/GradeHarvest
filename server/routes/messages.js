const express = require('express');
const {
  sendMessage,
  getConversation,
  getConversations,
  getUnreadCount,
  markAsRead,
  markConversationAsRead,
  deleteMessage,
  getFlaggedMessages,
  reviewMessage,
  searchMessages,
  getMessageStats,
  startSupportConversation
} = require('../controllers/messageController');

const {
  authenticate,
  authorize,
  requireConversationAccess
} = require('../middleware/auth');

const {
  validateMessage,
  validateObjectId,
  validatePagination,
  validateFileUpload,
  validateSearch
} = require('../middleware/validation');

const { uploadMiddleware } = require('../utils/fileUpload');
const { messageLimiter } = require('../middleware/security');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get message statistics (Admin only)
router.get('/stats',
  authorize('manager', 'support', 'tech'),
  getMessageStats
);

// Get flagged messages (Admin only)
router.get('/flagged',
  authorize('manager', 'support', 'tech'),
  validatePagination,
  getFlaggedMessages
);

// Search messages
router.get('/search',
  validateSearch,
  validatePagination,
  searchMessages
);

// Get unread message count
router.get('/unread-count',
  getUnreadCount
);

// Get user's conversations list
router.get('/conversations',
  getConversations
);

// Start support conversation
router.post('/support',
  messageLimiter,
  startSupportConversation
);

// Send message
router.post('/',
  messageLimiter,
  uploadMiddleware.array('attachments', 3, 'messages'),
  validateFileUpload(['pdf', 'doc', 'docx', 'txt', 'jpg', 'jpeg', 'png'], 5 * 1024 * 1024), // 5MB limit
  validateMessage,
  sendMessage
);

// Get conversation messages
router.get('/conversations/:conversationId',
  requireConversationAccess,
  validatePagination,
  getConversation
);

// Mark conversation as read
router.put('/conversations/:conversationId/read',
  requireConversationAccess,
  markConversationAsRead
);

// Review flagged message (Admin only)
router.put('/:id/review',
  authorize('manager', 'support', 'tech'),
  validateObjectId('id'),
  reviewMessage
);

// Mark message as read
router.put('/:id/read',
  validateObjectId('id'),
  markAsRead
);

// Delete message
router.delete('/:id',
  validateObjectId('id'),
  deleteMessage
);

module.exports = router;
