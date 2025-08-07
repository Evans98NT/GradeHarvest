const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  // Basic Order Information
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: [true, 'Order title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  academicLevel: {
    type: String,
    required: [true, 'Academic level is required'],
    enum: ['high-school', 'undergraduate', 'masters', 'phd', 'professional']
  },
  paperType: {
    type: String,
    required: [true, 'Paper type is required'],
    enum: [
      'essay', 'research-paper', 'thesis', 'dissertation', 'case-study',
      'book-review', 'lab-report', 'presentation', 'coursework', 'assignment',
      'term-paper', 'article', 'report', 'other'
    ]
  },
  
  // Order Details
  instructions: {
    type: String,
    required: [true, 'Instructions are required'],
    maxlength: [5000, 'Instructions cannot exceed 5000 characters']
  },
  wordCount: {
    type: Number,
    required: [true, 'Word count is required'],
    min: [250, 'Minimum word count is 250'],
    max: [50000, 'Maximum word count is 50000']
  },
  pages: {
    type: Number,
    required: true
  },
  
  // Deadline and Urgency
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  urgency: {
    type: String,
    required: true,
    enum: ['24-hours', '3-days', '7-days', '14-days', '30-days', 'custom']
  },
  
  // Pricing
  pricePerPage: {
    type: Number,
    required: true,
    min: 0
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'CNY']
  },
  
  // User References
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false // Allow null for guest orders
  },
  
  // Guest Information (for non-authenticated orders)
  guestInfo: {
    firstName: {
      type: String,
      required: function() { return !this.client; }
    },
    lastName: {
      type: String,
      required: function() { return !this.client; }
    },
    email: {
      type: String,
      required: function() { return !this.client; }
    },
    phone: String,
    country: String,
    isGuest: {
      type: Boolean,
      default: function() { return !this.client; }
    }
  },
  writer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  assignedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  // Order Status
  status: {
    type: String,
    enum: [
      'pending', 'assigned', 'in-progress', 'submitted', 
      'revision-requested', 'completed', 'cancelled', 'disputed'
    ],
    default: 'pending'
  },
  
  // Payment Status
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded', 'disputed'],
    default: 'pending'
  },
  paymentId: String,
  paymentMethod: String,
  
  // Files
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String,
    uploadedAt: { type: Date, default: Date.now }
  }],
  
  // Submissions
  submissions: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String,
    submittedAt: { type: Date, default: Date.now },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    version: { type: Number, default: 1 },
    isLatest: { type: Boolean, default: true },
    
    // Plagiarism Check Results
    plagiarismCheck: {
      copyleaksResult: {
        score: Number,
        reportUrl: String,
        checkedAt: Date,
        status: { type: String, enum: ['pending', 'completed', 'failed'] }
      },
      turnitinResult: {
        score: Number,
        reportUrl: String,
        checkedAt: Date,
        status: { type: String, enum: ['pending', 'completed', 'failed'] }
      },
      aiContentCheck: {
        score: Number,
        reportUrl: String,
        checkedAt: Date,
        detector: String,
        status: { type: String, enum: ['pending', 'completed', 'failed'] }
      },
      overallStatus: {
        type: String,
        enum: ['green', 'orange', 'red'],
        default: 'orange'
      }
    }
  }],
  
  // Revisions
  revisions: [{
    requestedAt: { type: Date, default: Date.now },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String,
    instructions: String,
    deadline: Date,
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'completed'],
      default: 'pending'
    }
  }],
  
  // Rating and Review
  rating: {
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    review: String,
    ratedAt: Date,
    ratedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Writer Application (for pending orders)
  applications: [{
    writer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: { type: Date, default: Date.now },
    bidAmount: Number,
    message: String,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    }
  }],
  
  // Communication
  lastMessageAt: Date,
  unreadMessages: {
    client: { type: Number, default: 0 },
    writer: { type: Number, default: 0 },
    support: { type: Number, default: 0 }
  },
  
  // Tracking
  timeline: [{
    event: String,
    description: String,
    timestamp: { type: Date, default: Date.now },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Special Requirements
  requirements: {
    sources: {
      type: Number,
      default: 0
    },
    citationStyle: {
      type: String,
      enum: ['APA', 'MLA', 'Chicago', 'Harvard', 'IEEE', 'Vancouver', 'Other']
    },
    spacing: {
      type: String,
      enum: ['single', 'double', '1.5'],
      default: 'double'
    },
    language: {
      type: String,
      default: 'English'
    }
  },
  
  // Admin Notes
  adminNotes: [{
    note: String,
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    addedAt: { type: Date, default: Date.now }
  }],
  
  // Flags and Alerts
  flags: [{
    type: {
      type: String,
      enum: ['urgent', 'disputed', 'plagiarism', 'late', 'quality-issue']
    },
    description: String,
    flaggedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    flaggedAt: { type: Date, default: Date.now },
    resolved: { type: Boolean, default: false },
    resolvedAt: Date,
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  assignedAt: Date,
  startedAt: Date,
  submittedAt: Date,
  completedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ client: 1, status: 1 });
orderSchema.index({ writer: 1, status: 1 });
orderSchema.index({ status: 1, deadline: 1 });
orderSchema.index({ subject: 1, academicLevel: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ deadline: 1 });

// Virtual for time remaining
orderSchema.virtual('timeRemaining').get(function() {
  if (this.deadline) {
    const now = new Date();
    const deadline = new Date(this.deadline);
    const diff = deadline - now;
    return diff > 0 ? diff : 0;
  }
  return 0;
});

// Virtual for is overdue
orderSchema.virtual('isOverdue').get(function() {
  return new Date() > new Date(this.deadline);
});

// Virtual for latest submission
orderSchema.virtual('latestSubmission').get(function() {
  return this.submissions.find(sub => sub.isLatest) || null;
});

// Virtual for progress percentage
orderSchema.virtual('progressPercentage').get(function() {
  const statusProgress = {
    'pending': 0,
    'assigned': 20,
    'in-progress': 50,
    'submitted': 80,
    'revision-requested': 60,
    'completed': 100,
    'cancelled': 0,
    'disputed': 40
  };
  return statusProgress[this.status] || 0;
});

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (this.isNew && !this.orderNumber) {
    const count = await this.constructor.countDocuments();
    this.orderNumber = `GH${String(count + 1).padStart(6, '0')}`;
  }
  
  // Calculate pages from word count
  if (this.isModified('wordCount')) {
    this.pages = Math.ceil(this.wordCount / 250);
  }
  
  // Update timestamp
  this.updatedAt = Date.now();
  
  next();
});

// Pre-save middleware to update timeline
orderSchema.pre('save', function(next) {
  if (this.isModified('status') && !this.isNew) {
    this.timeline.push({
      event: 'status_change',
      description: `Order status changed to ${this.status}`,
      timestamp: new Date()
    });
  }
  next();
});

// Method to add timeline event
orderSchema.methods.addTimelineEvent = function(event, description, user) {
  this.timeline.push({
    event,
    description,
    user,
    timestamp: new Date()
  });
  return this.save();
};

// Method to assign writer
orderSchema.methods.assignWriter = function(writerId, assignedBy) {
  this.writer = writerId;
  this.assignedBy = assignedBy;
  this.status = 'assigned';
  this.assignedAt = new Date();
  
  this.timeline.push({
    event: 'writer_assigned',
    description: 'Writer assigned to order',
    user: assignedBy,
    timestamp: new Date()
  });
  
  return this.save();
};

// Method to submit work
orderSchema.methods.submitWork = function(submissionData, writerId) {
  // Mark previous submissions as not latest
  this.submissions.forEach(sub => {
    sub.isLatest = false;
  });
  
  // Add new submission
  this.submissions.push({
    ...submissionData,
    submittedBy: writerId,
    isLatest: true,
    version: this.submissions.length + 1
  });
  
  this.status = 'submitted';
  this.submittedAt = new Date();
  
  this.timeline.push({
    event: 'work_submitted',
    description: 'Work submitted by writer',
    user: writerId,
    timestamp: new Date()
  });
  
  return this.save();
};

// Method to request revision
orderSchema.methods.requestRevision = function(revisionData, clientId) {
  this.revisions.push({
    ...revisionData,
    requestedBy: clientId
  });
  
  this.status = 'revision-requested';
  
  this.timeline.push({
    event: 'revision_requested',
    description: 'Revision requested by client',
    user: clientId,
    timestamp: new Date()
  });
  
  return this.save();
};

// Method to complete order
orderSchema.methods.completeOrder = function(rating = null) {
  this.status = 'completed';
  this.completedAt = new Date();
  
  if (rating) {
    this.rating = rating;
  }
  
  this.timeline.push({
    event: 'order_completed',
    description: 'Order marked as completed',
    timestamp: new Date()
  });
  
  return this.save();
};

// Static method to find available orders for writers
orderSchema.statics.findAvailableOrders = function(criteria = {}) {
  return this.find({
    status: 'pending',
    deadline: { $gt: new Date() },
    ...criteria
  }).populate('client', 'firstName lastName country')
    .sort({ createdAt: -1 });
};

// Static method to find orders by writer
orderSchema.statics.findByWriter = function(writerId, status = null) {
  const query = { writer: writerId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('client', 'firstName lastName email')
    .sort({ updatedAt: -1 });
};

// Static method to find orders by client
orderSchema.statics.findByClient = function(clientId, status = null) {
  const query = { client: clientId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('writer', 'firstName lastName writerProfile.level')
    .sort({ updatedAt: -1 });
};

module.exports = mongoose.model('Order', orderSchema);
