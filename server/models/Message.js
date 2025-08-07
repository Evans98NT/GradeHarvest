const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Message Content
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },
  messageType: {
    type: String,
    enum: ['text', 'file', 'system', 'notification'],
    default: 'text'
  },
  
  // Participants
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Conversation Context
  conversationType: {
    type: String,
    enum: ['client-writer', 'client-support', 'writer-support', 'admin-user'],
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  conversationId: {
    type: String,
    required: true,
    index: true
  },
  
  // Message Status
  status: {
    type: String,
    enum: ['sent', 'delivered', 'read', 'failed'],
    default: 'sent'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  readAt: Date,
  
  // File Attachments
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Content Filtering
  isFiltered: {
    type: Boolean,
    default: false
  },
  filteredContent: String,
  filterFlags: [{
    type: {
      type: String,
      enum: ['email', 'phone', 'url', 'social', 'inappropriate']
    },
    detected: String,
    flaggedAt: { type: Date, default: Date.now }
  }],
  
  // Admin/Support Visibility
  supportVisible: {
    type: Boolean,
    default: true
  },
  flaggedForReview: {
    type: Boolean,
    default: false
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  
  // System Messages
  systemData: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },
  
  // Reply/Thread
  replyTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  editedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
messageSchema.index({ conversationId: 1, createdAt: -1 });
messageSchema.index({ sender: 1, recipient: 1 });
messageSchema.index({ orderId: 1, createdAt: -1 });
messageSchema.index({ isRead: 1, recipient: 1 });
messageSchema.index({ flaggedForReview: 1 });
messageSchema.index({ createdAt: -1 });

// Virtual for conversation participants
messageSchema.virtual('participants').get(function() {
  return [this.sender, this.recipient];
});

// Pre-save middleware for content filtering
messageSchema.pre('save', function(next) {
  if (this.isModified('content') && this.messageType === 'text') {
    this.filterContent();
  }
  this.updatedAt = Date.now();
  next();
});

// Method to filter inappropriate content
messageSchema.methods.filterContent = function() {
  const originalContent = this.content;
  let filteredContent = originalContent;
  const flags = [];
  
  // Email detection
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = originalContent.match(emailRegex);
  if (emails) {
    emails.forEach(email => {
      filteredContent = filteredContent.replace(email, '[EMAIL FILTERED]');
      flags.push({
        type: 'email',
        detected: email
      });
    });
  }
  
  // Phone number detection
  const phoneRegex = /(\+?\d{1,4}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}/g;
  const phones = originalContent.match(phoneRegex);
  if (phones) {
    phones.forEach(phone => {
      filteredContent = filteredContent.replace(phone, '[PHONE FILTERED]');
      flags.push({
        type: 'phone',
        detected: phone
      });
    });
  }
  
  // URL detection
  const urlRegex = /(https?:\/\/[^\s]+)|(www\.[^\s]+)|([a-zA-Z0-9-]+\.(com|org|net|edu|gov|io|co|uk|ca|au|de|fr|jp|cn|in|br|ru|za|mx|es|it|nl|se|no|dk|fi|pl|cz|hu|gr|tr|il|ae|sa|eg|ng|ke|gh|tz|ug|zw|zm|mw|bw|sz|ls|na|ao|mz|mg|mu|sc|re|yt|km|dj|so|et|er|sd|ss|ly|td|cf|cm|gq|ga|cg|cd|st|gw|gn|sl|lr|ci|bf|ml|ne|sn|gm|cv|mr))/gi;
  const urls = originalContent.match(urlRegex);
  if (urls) {
    urls.forEach(url => {
      filteredContent = filteredContent.replace(url, '[URL FILTERED]');
      flags.push({
        type: 'url',
        detected: url
      });
    });
  }
  
  // Social media handles
  const socialRegex = /@[a-zA-Z0-9_]+|#[a-zA-Z0-9_]+/g;
  const socials = originalContent.match(socialRegex);
  if (socials) {
    socials.forEach(social => {
      filteredContent = filteredContent.replace(social, '[SOCIAL FILTERED]');
      flags.push({
        type: 'social',
        detected: social
      });
    });
  }
  
  // WhatsApp/Telegram patterns
  const whatsappRegex = /whatsapp|telegram|signal|viber|wechat|line|kakao/gi;
  if (whatsappRegex.test(originalContent)) {
    filteredContent = filteredContent.replace(whatsappRegex, '[MESSAGING APP FILTERED]');
    flags.push({
      type: 'social',
      detected: 'messaging app reference'
    });
  }
  
  // Update message if content was filtered
  if (flags.length > 0) {
    this.isFiltered = true;
    this.filteredContent = filteredContent;
    this.filterFlags = flags;
    this.flaggedForReview = true;
    this.content = filteredContent;
  }
};

// Method to mark as read
messageSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  this.status = 'read';
  return this.save();
};

// Method to generate conversation ID
messageSchema.statics.generateConversationId = function(user1Id, user2Id, orderId = null) {
  const sortedIds = [user1Id.toString(), user2Id.toString()].sort();
  const baseId = sortedIds.join('-');
  return orderId ? `${baseId}-${orderId}` : baseId;
};

// Static method to get conversation
messageSchema.statics.getConversation = function(conversationId, page = 1, limit = 50) {
  const skip = (page - 1) * limit;
  
  return this.find({ conversationId })
    .populate('sender', 'firstName lastName role profileImage')
    .populate('recipient', 'firstName lastName role profileImage')
    .populate('replyTo', 'content sender createdAt')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

// Static method to get unread count
messageSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    recipient: userId,
    isRead: false
  });
};

// Static method to get conversations list
messageSchema.statics.getConversationsList = function(userId) {
  return this.aggregate([
    {
      $match: {
        $or: [
          { sender: mongoose.Types.ObjectId(userId) },
          { recipient: mongoose.Types.ObjectId(userId) }
        ]
      }
    },
    {
      $sort: { createdAt: -1 }
    },
    {
      $group: {
        _id: '$conversationId',
        lastMessage: { $first: '$$ROOT' },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $eq: ['$recipient', mongoose.Types.ObjectId(userId)] },
                  { $eq: ['$isRead', false] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'lastMessage.sender',
        foreignField: '_id',
        as: 'senderInfo'
      }
    },
    {
      $lookup: {
        from: 'users',
        localField: 'lastMessage.recipient',
        foreignField: '_id',
        as: 'recipientInfo'
      }
    },
    {
      $lookup: {
        from: 'orders',
        localField: 'lastMessage.orderId',
        foreignField: '_id',
        as: 'orderInfo'
      }
    },
    {
      $sort: { 'lastMessage.createdAt': -1 }
    }
  ]);
};

// Static method to mark conversation as read
messageSchema.statics.markConversationAsRead = function(conversationId, userId) {
  return this.updateMany(
    {
      conversationId,
      recipient: userId,
      isRead: false
    },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
        status: 'read'
      }
    }
  );
};

// Static method to get flagged messages for review
messageSchema.statics.getFlaggedMessages = function(page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  
  return this.find({ flaggedForReview: true })
    .populate('sender', 'firstName lastName email role')
    .populate('recipient', 'firstName lastName email role')
    .populate('orderId', 'orderNumber title')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);
};

module.exports = mongoose.model('Message', messageSchema);
