const Notification = require('../models/Notification');
const { asyncHandler } = require('../middleware/errorHandler');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 20,
    status = ['unread', 'read'],
    type,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const notifications = await Notification.getUserNotifications(req.user.id, {
    status,
    type,
    limit: parseInt(limit),
    page: parseInt(page),
    sortBy,
    sortOrder
  });

  const total = await Notification.countDocuments({
    recipient: req.user.id,
    status: { $in: Array.isArray(status) ? status : [status] },
    ...(type && { type }),
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ]
  });

  res.status(200).json({
    success: true,
    count: notifications.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / parseInt(limit))
    },
    notifications
  });
});

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = asyncHandler(async (req, res, next) => {
  const count = await Notification.getUnreadCount(req.user.id);

  res.status(200).json({
    success: true,
    unreadCount: count
  });
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  if (notification.recipient.toString() !== req.user.id) {
    return next(new AppError('Access denied', 403));
  }

  await notification.markAsRead();

  res.status(200).json({
    success: true,
    message: 'Notification marked as read'
  });
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/mark-all-read
// @access  Private
const markAllAsRead = asyncHandler(async (req, res, next) => {
  const result = await Notification.markAllAsRead(req.user.id);

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
    modifiedCount: result.modifiedCount
  });
});

// @desc    Archive notification
// @route   PUT /api/notifications/:id/archive
// @access  Private
const archiveNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  if (notification.recipient.toString() !== req.user.id) {
    return next(new AppError('Access denied', 403));
  }

  await notification.archive();

  res.status(200).json({
    success: true,
    message: 'Notification archived'
  });
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = asyncHandler(async (req, res, next) => {
  const notification = await Notification.findById(req.params.id);

  if (!notification) {
    return next(new AppError('Notification not found', 404));
  }

  if (notification.recipient.toString() !== req.user.id) {
    return next(new AppError('Access denied', 403));
  }

  await notification.softDelete();

  res.status(200).json({
    success: true,
    message: 'Notification deleted'
  });
});

// @desc    Create system announcement (Admin only)
// @route   POST /api/notifications/announcements
// @access  Private/Admin
const createAnnouncement = asyncHandler(async (req, res, next) => {
  const { title, message, targetRole = 'all', priority = 'medium', expiresAt } = req.body;

  // Get target users
  let targetUsers = [];
  
  if (targetRole === 'all') {
    const User = require('../models/User');
    targetUsers = await User.find({ status: 'active' }).select('_id');
  } else {
    const User = require('../models/User');
    targetUsers = await User.find({ 
      role: targetRole, 
      status: 'active' 
    }).select('_id');
  }

  // Create notifications for all target users
  const notifications = targetUsers.map(user => ({
    title,
    message,
    type: 'system_announcement',
    recipient: user._id,
    sender: req.user.id,
    priority,
    isSystemGenerated: false,
    expiresAt: expiresAt ? new Date(expiresAt) : null,
    channels: {
      inApp: true,
      email: true
    }
  }));

  await Notification.insertMany(notifications);

  res.status(201).json({
    success: true,
    message: 'Announcement created successfully',
    recipientCount: targetUsers.length
  });
});

// @desc    Get notification statistics (Admin only)
// @route   GET /api/notifications/stats
// @access  Private/Admin
const getNotificationStats = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();

  const stats = await Notification.getNotificationStats(start, end);

  const totalNotifications = await Notification.countDocuments({
    createdAt: { $gte: start, $lte: end }
  });

  const unreadNotifications = await Notification.countDocuments({
    createdAt: { $gte: start, $lte: end },
    status: 'unread'
  });

  res.status(200).json({
    success: true,
    stats: {
      period: { startDate: start, endDate: end },
      total: totalNotifications,
      unread: unreadNotifications,
      readRate: totalNotifications > 0 ? ((totalNotifications - unreadNotifications) / totalNotifications * 100).toFixed(2) : 0,
      byType: stats
    }
  });
});

// @desc    Clean up expired notifications (Admin only)
// @route   DELETE /api/notifications/cleanup
// @access  Private/Admin
const cleanupExpired = asyncHandler(async (req, res, next) => {
  const result = await Notification.cleanupExpired();

  res.status(200).json({
    success: true,
    message: 'Expired notifications cleaned up',
    deletedCount: result.deletedCount
  });
});

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  archiveNotification,
  deleteNotification,
  createAnnouncement,
  getNotificationStats,
  cleanupExpired
};
