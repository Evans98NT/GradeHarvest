const Message = require('../models/Message');
const User = require('../models/User');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const { asyncHandler } = require('../middleware/errorHandler');
const { AppError } = require('../middleware/errorHandler');
const uploadFile = require('../utils/fileUpload');

// @desc    Send message
// @route   POST /api/messages
// @access  Private
const sendMessage = asyncHandler(async (req, res, next) => {
  const { content, recipient, conversationType, orderId } = req.body;

  // Verify recipient exists
  const recipientUser = await User.findById(recipient);
  if (!recipientUser) {
    return next(new AppError('Recipient not found', 404));
  }

  // Verify conversation type is valid for user roles
  const validConversations = getValidConversationTypes(req.user.role, recipientUser.role);
  if (!validConversations.includes(conversationType)) {
    return next(new AppError('Invalid conversation type for these user roles', 400));
  }

  // Verify order access if orderId provided
  if (orderId) {
    const order = await Order.findById(orderId);
    if (!order) {
      return next(new AppError('Order not found', 404));
    }

    // Check if users are involved in the order
    const isInvolved = 
      order.client.toString() === req.user.id ||
      order.writer?.toString() === req.user.id ||
      ['manager', 'support', 'tech'].includes(req.user.role);

    if (!isInvolved) {
      return next(new AppError('Access denied to this order conversation', 403));
    }
  }

  // Generate conversation ID
  const conversationId = Message.generateConversationId(
    req.user.id,
    recipient,
    orderId
  );

  // Create message
  const message = await Message.create({
    content,
    sender: req.user.id,
    recipient,
    conversationType,
    orderId,
    conversationId
  });

  // Handle file attachments
  if (req.files && req.files.length > 0) {
    const attachments = [];
    
    for (const file of req.files) {
      const filePath = await uploadFile(file, 'messages');
      attachments.push({
        filename: file.filename,
        originalName: file.originalname,
        path: filePath,
        size: file.size,
        mimetype: file.mimetype
      });
    }
    
    message.attachments = attachments;
    message.messageType = 'file';
    await message.save();
  }

  // Update order's last message timestamp and unread count
  if (orderId) {
    await Order.findByIdAndUpdate(orderId, {
      lastMessageAt: new Date(),
      $inc: {
        [`unreadMessages.${recipientUser.role}`]: 1
      }
    });
  }

  // Create notification for recipient
  await Notification.create({
    title: 'New Message',
    message: `You have a new message from ${req.user.firstName} ${req.user.lastName}`,
    type: 'message_received',
    recipient,
    sender: req.user.id,
    relatedMessage: message._id,
    relatedOrder: orderId,
    actionUrl: `/messages/${conversationId}`,
    actionText: 'View Message',
    channels: {
      inApp: true,
      email: recipientUser.notifications?.email?.messages !== false,
      push: recipientUser.notifications?.push?.messages !== false
    }
  });

  await message.populate([
    { path: 'sender', select: 'firstName lastName role profileImage' },
    { path: 'recipient', select: 'firstName lastName role profileImage' }
  ]);

  res.status(201).json({
    success: true,
    message: 'Message sent successfully',
    data: message
  });
});

// @desc    Get conversation messages
// @route   GET /api/messages/conversations/:conversationId
// @access  Private
const getConversation = asyncHandler(async (req, res, next) => {
  const { conversationId } = req.params;
  const { page = 1, limit = 50 } = req.query;

  const messages = await Message.getConversation(conversationId, page, limit);

  // Mark messages as read for the current user
  await Message.markConversationAsRead(conversationId, req.user.id);

  res.status(200).json({
    success: true,
    count: messages.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit)
    },
    messages: messages.reverse() // Reverse to show oldest first
  });
});

// @desc    Get user's conversations list
// @route   GET /api/messages/conversations
// @access  Private
const getConversations = asyncHandler(async (req, res, next) => {
  const conversations = await Message.getConversationsList(req.user.id);

  res.status(200).json({
    success: true,
    count: conversations.length,
    conversations
  });
});

// @desc    Get unread message count
// @route   GET /api/messages/unread-count
// @access  Private
const getUnreadCount = asyncHandler(async (req, res, next) => {
  const count = await Message.getUnreadCount(req.user.id);

  res.status(200).json({
    success: true,
    unreadCount: count
  });
});

// @desc    Mark message as read
// @route   PUT /api/messages/:id/read
// @access  Private
const markAsRead = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    return next(new AppError('Message not found', 404));
  }

  // Check if user is the recipient
  if (message.recipient.toString() !== req.user.id) {
    return next(new AppError('Access denied', 403));
  }

  await message.markAsRead();

  res.status(200).json({
    success: true,
    message: 'Message marked as read'
  });
});

// @desc    Mark conversation as read
// @route   PUT /api/messages/conversations/:conversationId/read
// @access  Private
const markConversationAsRead = asyncHandler(async (req, res, next) => {
  const { conversationId } = req.params;

  await Message.markConversationAsRead(conversationId, req.user.id);

  res.status(200).json({
    success: true,
    message: 'Conversation marked as read'
  });
});

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
const deleteMessage = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id);

  if (!message) {
    return next(new AppError('Message not found', 404));
  }

  // Check if user is the sender or admin
  const isSender = message.sender.toString() === req.user.id;
  const isAdmin = ['manager', 'support', 'tech'].includes(req.user.role);

  if (!isSender && !isAdmin) {
    return next(new AppError('Access denied', 403));
  }

  // Soft delete - just mark as deleted
  message.content = '[Message deleted]';
  message.status = 'failed';
  await message.save();

  res.status(200).json({
    success: true,
    message: 'Message deleted successfully'
  });
});

// @desc    Get flagged messages (Admin only)
// @route   GET /api/messages/flagged
// @access  Private/Admin
const getFlaggedMessages = asyncHandler(async (req, res, next) => {
  const { page = 1, limit = 20 } = req.query;

  const messages = await Message.getFlaggedMessages(page, limit);
  const total = await Message.countDocuments({ flaggedForReview: true });

  res.status(200).json({
    success: true,
    count: messages.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    },
    messages
  });
});

// @desc    Review flagged message (Admin only)
// @route   PUT /api/messages/:id/review
// @access  Private/Admin
const reviewMessage = asyncHandler(async (req, res, next) => {
  const { action, notes } = req.body; // action: 'approve', 'warn', 'suspend'
  const message = await Message.findById(req.params.id);

  if (!message) {
    return next(new AppError('Message not found', 404));
  }

  message.flaggedForReview = false;
  message.reviewedBy = req.user.id;
  message.reviewedAt = new Date();

  await message.save();

  // Take action based on review
  if (action === 'warn' || action === 'suspend') {
    const sender = await User.findById(message.sender);
    
    if (action === 'suspend' && sender) {
      sender.status = 'suspended';
      await sender.save();
      
      // Notify user about suspension
      await Notification.create({
        title: 'Account Suspended',
        message: 'Your account has been suspended due to inappropriate messaging.',
        type: 'warning',
        recipient: sender._id,
        priority: 'high'
      });
    }
  }

  res.status(200).json({
    success: true,
    message: `Message reviewed and ${action} action taken`,
    data: message
  });
});

// @desc    Search messages
// @route   GET /api/messages/search
// @access  Private
const searchMessages = asyncHandler(async (req, res, next) => {
  const { q, conversationId, dateFrom, dateTo, page = 1, limit = 20 } = req.query;

  if (!q || q.length < 2) {
    return next(new AppError('Search query must be at least 2 characters', 400));
  }

  const query = {
    $or: [
      { sender: req.user.id },
      { recipient: req.user.id }
    ],
    content: { $regex: q, $options: 'i' }
  };

  if (conversationId) {
    query.conversationId = conversationId;
  }

  if (dateFrom || dateTo) {
    query.createdAt = {};
    if (dateFrom) query.createdAt.$gte = new Date(dateFrom);
    if (dateTo) query.createdAt.$lte = new Date(dateTo);
  }

  const skip = (page - 1) * limit;

  const messages = await Message.find(query)
    .populate('sender', 'firstName lastName role')
    .populate('recipient', 'firstName lastName role')
    .populate('orderId', 'orderNumber title')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Message.countDocuments(query);

  res.status(200).json({
    success: true,
    count: messages.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    },
    messages
  });
});

// @desc    Get message statistics (Admin only)
// @route   GET /api/messages/stats
// @access  Private/Admin
const getMessageStats = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  const matchStage = {};
  if (startDate || endDate) {
    matchStage.createdAt = {};
    if (startDate) matchStage.createdAt.$gte = new Date(startDate);
    if (endDate) matchStage.createdAt.$lte = new Date(endDate);
  }

  const stats = await Message.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          type: '$conversationType',
          date: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }
        },
        count: { $sum: 1 },
        flagged: { $sum: { $cond: ['$isFiltered', 1, 0] } }
      }
    },
    {
      $group: {
        _id: '$_id.type',
        totalMessages: { $sum: '$count' },
        totalFlagged: { $sum: '$flagged' },
        dailyStats: {
          $push: {
            date: '$_id.date',
            count: '$count',
            flagged: '$flagged'
          }
        }
      }
    }
  ]);

  const totalMessages = await Message.countDocuments(matchStage);
  const flaggedMessages = await Message.countDocuments({
    ...matchStage,
    flaggedForReview: true
  });

  res.status(200).json({
    success: true,
    stats: {
      total: totalMessages,
      flagged: flaggedMessages,
      byType: stats
    }
  });
});

// @desc    Start conversation with support
// @route   POST /api/messages/support
// @access  Private
const startSupportConversation = asyncHandler(async (req, res, next) => {
  const { subject, message, orderId } = req.body;

  // Find available support agent
  const supportAgent = await User.findOne({
    role: 'support',
    status: 'active'
  }).sort({ 'adminProfile.lastLogin': 1 }); // Get least recently active

  if (!supportAgent) {
    return next(new AppError('No support agents available at the moment', 503));
  }

  // Create initial message
  const conversationId = Message.generateConversationId(
    req.user.id,
    supportAgent._id,
    orderId
  );

  const supportMessage = await Message.create({
    content: `Subject: ${subject}\n\n${message}`,
    sender: req.user.id,
    recipient: supportAgent._id,
    conversationType: req.user.role === 'writer' ? 'writer-support' : 'client-support',
    orderId,
    conversationId
  });

  // Notify support agent
  await Notification.create({
    title: 'New Support Request',
    message: `New support request from ${req.user.firstName} ${req.user.lastName}: ${subject}`,
    type: 'message_received',
    recipient: supportAgent._id,
    sender: req.user.id,
    relatedMessage: supportMessage._id,
    relatedOrder: orderId,
    actionUrl: `/admin/support/${conversationId}`,
    actionText: 'View Request',
    priority: 'high'
  });

  res.status(201).json({
    success: true,
    message: 'Support conversation started successfully',
    conversationId,
    supportAgent: {
      id: supportAgent._id,
      name: `${supportAgent.firstName} ${supportAgent.lastName}`
    }
  });
});

// Helper function to get valid conversation types
const getValidConversationTypes = (senderRole, recipientRole) => {
  const validTypes = [];

  if (senderRole === 'client' && recipientRole === 'writer') {
    validTypes.push('client-writer');
  }
  if (senderRole === 'writer' && recipientRole === 'client') {
    validTypes.push('client-writer');
  }
  if (senderRole === 'client' && recipientRole === 'support') {
    validTypes.push('client-support');
  }
  if (senderRole === 'support' && recipientRole === 'client') {
    validTypes.push('client-support');
  }
  if (senderRole === 'writer' && recipientRole === 'support') {
    validTypes.push('writer-support');
  }
  if (senderRole === 'support' && recipientRole === 'writer') {
    validTypes.push('writer-support');
  }
  if (['manager', 'support', 'tech'].includes(senderRole)) {
    validTypes.push('admin-user');
  }
  if (['manager', 'support', 'tech'].includes(recipientRole)) {
    validTypes.push('admin-user');
  }

  return validTypes;
};

module.exports = {
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
};
