const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // Notification Content
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  
  // Notification Type
  type: {
    type: String,
    enum: [
      'order_update', 'payment_update', 'message_received', 'writer_application',
      'deadline_reminder', 'system_announcement', 'account_update', 'promotion',
      'warning', 'achievement', 'review_received', 'withdrawal_update'
    ],
    required: true
  },
  
  // Priority Level
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Recipients
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipientRole: {
    type: String,
    enum: ['client', 'writer', 'manager', 'support', 'accountant', 'tech', 'all']
  },
  
  // Sender (system or user)
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isSystemGenerated: {
    type: Boolean,
    default: true
  },
  
  // Status
  status: {
    type: String,
    enum: ['unread', 'read', 'archived', 'deleted'],
    default: 'unread'
  },
  
  // Related Entities
  relatedOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  relatedPayment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment',
    default: null
  },
  relatedMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  
  // Action Information
  actionRequired: {
    type: Boolean,
    default: false
  },
  actionUrl: String,
  actionText: String,
  
  // Delivery Channels
  channels: {
    inApp: {
      type: Boolean,
      default: true
    },
    email: {
      type: Boolean,
      default: false
    },
    sms: {
      type: Boolean,
      default: false
    },
    push: {
      type: Boolean,
      default: false
    }
  },
  
  // Delivery Status
  deliveryStatus: {
    inApp: {
      delivered: { type: Boolean, default: false },
      deliveredAt: Date
    },
    email: {
      delivered: { type: Boolean, default: false },
      deliveredAt: Date,
      opened: { type: Boolean, default: false },
      openedAt: Date,
      clicked: { type: Boolean, default: false },
      clickedAt: Date
    },
    sms: {
      delivered: { type: Boolean, default: false },
      deliveredAt: Date
    },
    push: {
      delivered: { type: Boolean, default: false },
      deliveredAt: Date,
      clicked: { type: Boolean, default: false },
      clickedAt: Date
    }
  },
  
  // Scheduling
  scheduledFor: {
    type: Date,
    default: null
  },
  isScheduled: {
    type: Boolean,
    default: false
  },
  
  // Expiration
  expiresAt: {
    type: Date,
    default: null
  },
  
  // Metadata
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  
  // Tracking
  readAt: Date,
  archivedAt: Date,
  deletedAt: Date,
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
notificationSchema.index({ recipient: 1, status: 1 });
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ priority: 1, status: 1 });
notificationSchema.index({ scheduledFor: 1, isScheduled: 1 });
notificationSchema.index({ expiresAt: 1 });
notificationSchema.index({ createdAt: -1 });

// Virtual for is expired
notificationSchema.virtual('isExpired').get(function() {
  return this.expiresAt && new Date() > this.expiresAt;
});

// Virtual for is due for delivery
notificationSchema.virtual('isDueForDelivery').get(function() {
  if (!this.isScheduled) return true;
  return this.scheduledFor && new Date() >= this.scheduledFor;
});

// Pre-save middleware
notificationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set delivery status for in-app notifications
  if (this.channels.inApp && !this.deliveryStatus.inApp.delivered) {
    this.deliveryStatus.inApp.delivered = true;
    this.deliveryStatus.inApp.deliveredAt = new Date();
  }
  
  next();
});

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.status = 'read';
  this.readAt = new Date();
  return this.save();
};

// Method to archive notification
notificationSchema.methods.archive = function() {
  this.status = 'archived';
  this.archivedAt = new Date();
  return this.save();
};

// Method to delete notification (soft delete)
notificationSchema.methods.softDelete = function() {
  this.status = 'deleted';
  this.deletedAt = new Date();
  return this.save();
};

// Static method to create order notification
notificationSchema.statics.createOrderNotification = function(type, recipient, orderId, customData = {}) {
  const notificationData = {
    recipient,
    relatedOrder: orderId,
    type,
    ...customData
  };
  
  // Set default messages based on type
  switch (type) {
    case 'order_update':
      notificationData.title = notificationData.title || 'Order Status Updated';
      notificationData.message = notificationData.message || 'Your order status has been updated.';
      break;
    case 'deadline_reminder':
      notificationData.title = 'Deadline Reminder';
      notificationData.message = 'Your order deadline is approaching.';
      notificationData.priority = 'high';
      break;
    case 'writer_application':
      notificationData.title = 'New Writer Application';
      notificationData.message = 'A writer has applied to work on your order.';
      notificationData.actionRequired = true;
      break;
  }
  
  return this.create(notificationData);
};

// Static method to create payment notification
notificationSchema.statics.createPaymentNotification = function(type, recipient, paymentId, customData = {}) {
  const notificationData = {
    recipient,
    relatedPayment: paymentId,
    type: 'payment_update',
    ...customData
  };
  
  switch (type) {
    case 'payment_received':
      notificationData.title = 'Payment Received';
      notificationData.message = 'Your payment has been successfully processed.';
      break;
    case 'withdrawal_approved':
      notificationData.title = 'Withdrawal Approved';
      notificationData.message = 'Your withdrawal request has been approved.';
      break;
    case 'withdrawal_rejected':
      notificationData.title = 'Withdrawal Rejected';
      notificationData.message = 'Your withdrawal request has been rejected.';
      notificationData.priority = 'high';
      break;
  }
  
  return this.create(notificationData);
};

// Static method to create system announcement
notificationSchema.statics.createSystemAnnouncement = function(title, message, targetRole = 'all', priority = 'medium') {
  // This would typically be called to create announcements for multiple users
  // Implementation would depend on whether you want to create individual notifications
  // or use a broadcast system
  
  return {
    title,
    message,
    type: 'system_announcement',
    recipientRole: targetRole,
    priority,
    isSystemGenerated: true,
    channels: {
      inApp: true,
      email: true
    }
  };
};

// Static method to get user notifications
notificationSchema.statics.getUserNotifications = function(userId, options = {}) {
  const {
    status = ['unread', 'read'],
    type = null,
    limit = 20,
    page = 1,
    sortBy = 'createdAt',
    sortOrder = -1
  } = options;
  
  const query = {
    recipient: userId,
    status: { $in: Array.isArray(status) ? status : [status] }
  };
  
  if (type) {
    query.type = type;
  }
  
  // Exclude expired notifications
  query.$or = [
    { expiresAt: null },
    { expiresAt: { $gt: new Date() } }
  ];
  
  const skip = (page - 1) * limit;
  
  return this.find(query)
    .populate('relatedOrder', 'orderNumber title status')
    .populate('relatedPayment', 'paymentId amount status')
    .populate('sender', 'firstName lastName')
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    recipient: userId,
    status: 'unread',
    $or: [
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ]
  });
};

// Static method to mark all as read
notificationSchema.statics.markAllAsRead = function(userId) {
  return this.updateMany(
    {
      recipient: userId,
      status: 'unread'
    },
    {
      $set: {
        status: 'read',
        readAt: new Date()
      }
    }
  );
};

// Static method to clean up expired notifications
notificationSchema.statics.cleanupExpired = function() {
  return this.deleteMany({
    expiresAt: { $lt: new Date() }
  });
};

// Static method to get scheduled notifications ready for delivery
notificationSchema.statics.getScheduledForDelivery = function() {
  return this.find({
    isScheduled: true,
    scheduledFor: { $lte: new Date() },
    status: 'unread'
  });
};

// Static method to get notification statistics
notificationSchema.statics.getNotificationStats = function(startDate, endDate) {
  const matchStage = {};
  
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = startDate;
    if (endDate) matchStage.createdAt.$lte = endDate;
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          type: '$type',
          status: '$status'
        },
        count: { $sum: 1 }
      }
    },
    {
      $group: {
        _id: '$_id.type',
        statusCounts: {
          $push: {
            status: '$_id.status',
            count: '$count'
          }
        },
        totalCount: { $sum: '$count' }
      }
    }
  ]);
};

module.exports = mongoose.model('Notification', notificationSchema);
