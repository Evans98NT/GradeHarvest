const express = require('express');
const {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  archiveNotification,
  deleteNotification,
  createAnnouncement,
  getNotificationStats,
  cleanupExpired
} = require('../controllers/notificationController');

const {
  authenticate,
  authorize
} = require('../middleware/auth');

const {
  validateObjectId,
  validatePagination
} = require('../middleware/validation');

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get notification statistics (Admin only)
router.get('/stats',
  authorize('manager', 'support', 'tech'),
  getNotificationStats
);

// Clean up expired notifications (Admin only)
router.delete('/cleanup',
  authorize('manager', 'tech'),
  cleanupExpired
);

// Create system announcement (Admin only)
router.post('/announcements',
  authorize('manager', 'support'),
  createAnnouncement
);

// Get unread notification count
router.get('/unread-count',
  getUnreadCount
);

// Mark all notifications as read
router.put('/mark-all-read',
  markAllAsRead
);

// Get user notifications
router.get('/',
  validatePagination,
  getNotifications
);

// Mark notification as read
router.put('/:id/read',
  validateObjectId('id'),
  markAsRead
);

// Archive notification
router.put('/:id/archive',
  validateObjectId('id'),
  archiveNotification
);

// Delete notification
router.delete('/:id',
  validateObjectId('id'),
  deleteNotification
);

module.exports = router;
