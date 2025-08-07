const mongoose = require('mongoose');

const writerApplicationSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  profilePicture: {
    filename: String,
    path: String,
    uploadDate: { type: Date, default: Date.now }
  },

  // Academic Background
  highestDegree: {
    type: String,
    required: [true, 'Highest degree is required'],
    enum: ['high-school', 'associate', 'bachelor', 'master', 'phd', 'professional', 'other']
  },
  institution: {
    type: String,
    required: [true, 'Institution is required'],
    trim: true,
    maxlength: [200, 'Institution name cannot exceed 200 characters']
  },
  graduationYear: {
    type: String,
    required: [true, 'Graduation year is required']
  },
  fieldOfStudy: {
    type: String,
    required: [true, 'Field of study is required'],
    trim: true,
    maxlength: [100, 'Field of study cannot exceed 100 characters']
  },

  // Subject Expertise
  subjects: [{
    type: String,
    required: true
  }],
  academicLevels: [{
    type: String,
    enum: ['high-school', 'undergraduate', 'masters', 'phd', 'professional'],
    required: true
  }],

  // Documents
  cv: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimeType: String,
    uploadDate: { type: Date, default: Date.now }
  },
  writingSamples: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimeType: String,
    uploadDate: { type: Date, default: Date.now }
  }],
  identityDocument: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimeType: String,
    uploadDate: { type: Date, default: Date.now },
    verified: { type: Boolean, default: false },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    verifiedAt: Date,
    verificationNotes: String
  },

  // Writing Test
  writingTest: {
    completed: { type: Boolean, default: false },
    score: Number,
    topic: String,
    essay: String,
    timeSpent: Number, // in seconds
    completedAt: Date,
    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    gradedAt: Date,
    feedback: String
  },

  // Application Status
  status: {
    type: String,
    enum: ['pending', 'under-review', 'approved', 'rejected', 'requires-revision'],
    default: 'pending'
  },
  
  // Review Process
  reviewStages: {
    documentsReviewed: {
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reviewedAt: Date,
      notes: String
    },
    identityVerified: {
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      verifiedAt: Date,
      notes: String
    },
    writingTestGraded: {
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      gradedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      gradedAt: Date,
      notes: String
    },
    finalReview: {
      status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
      reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reviewedAt: Date,
      notes: String
    }
  },

  // Communication
  notifications: [{
    type: String,
    message: String,
    sentAt: { type: Date, default: Date.now },
    method: { type: String, enum: ['email', 'sms'], default: 'email' }
  }],

  // Metadata
  applicationId: {
    type: String,
    unique: true,
    default: function() {
      return 'WA-' + Date.now().toString() + Math.random().toString(36).substr(2, 4).toUpperCase();
    }
  },
  writerId: {
    type: String,
    unique: true,
    default: function() {
      return 'WR-' + Date.now().toString() + Math.random().toString(36).substr(2, 6).toUpperCase();
    }
  },
  ipAddress: String,
  userAgent: String,
  referralSource: String,

  // Rejection tracking
  rejectionDate: Date,
  rejectionReason: String,

  // Timestamps
  submittedAt: { type: Date, default: Date.now },
  lastUpdated: { type: Date, default: Date.now },
  
  // If approved, reference to created user account
  createdUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
writerApplicationSchema.index({ email: 1 });
writerApplicationSchema.index({ status: 1 });
writerApplicationSchema.index({ applicationId: 1 });
writerApplicationSchema.index({ writerId: 1 });
writerApplicationSchema.index({ submittedAt: -1 });
writerApplicationSchema.index({ 'reviewStages.documentsReviewed.status': 1 });
writerApplicationSchema.index({ 'reviewStages.identityVerified.status': 1 });

// Virtual for full name
writerApplicationSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for overall progress
writerApplicationSchema.virtual('reviewProgress').get(function() {
  const stages = this.reviewStages;
  let completed = 0;
  let total = 4;

  if (stages.documentsReviewed.status !== 'pending') completed++;
  if (stages.identityVerified.status !== 'pending') completed++;
  if (stages.writingTestGraded.status !== 'pending') completed++;
  if (stages.finalReview.status !== 'pending') completed++;

  return {
    completed,
    total,
    percentage: Math.round((completed / total) * 100)
  };
});

// Virtual for checking if user can reapply after rejection
writerApplicationSchema.virtual('canReapply').get(function() {
  if (this.status !== 'rejected' || !this.rejectionDate) {
    return true;
  }
  
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  return this.rejectionDate <= oneYearAgo;
});

// Virtual for days remaining until can reapply
writerApplicationSchema.virtual('daysUntilReapply').get(function() {
  if (this.status !== 'rejected' || !this.rejectionDate) {
    return 0;
  }
  
  const oneYearFromRejection = new Date(this.rejectionDate);
  oneYearFromRejection.setFullYear(oneYearFromRejection.getFullYear() + 1);
  
  const now = new Date();
  const diffTime = oneYearFromRejection.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return Math.max(0, diffDays);
});

// Virtual for approval countdown (assuming 3 business days review period)
writerApplicationSchema.virtual('approvalCountdown').get(function() {
  if (this.status !== 'pending' && this.status !== 'under-review') {
    return null;
  }
  
  // Calculate 3 business days from submission
  const submissionDate = new Date(this.submittedAt);
  let businessDays = 0;
  let currentDate = new Date(submissionDate);
  
  while (businessDays < 3) {
    currentDate.setDate(currentDate.getDate() + 1);
    // Skip weekends (Saturday = 6, Sunday = 0)
    if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
      businessDays++;
    }
  }
  
  const now = new Date();
  const diffTime = currentDate.getTime() - now.getTime();
  
  if (diffTime <= 0) {
    return {
      expired: true,
      message: 'Review period has passed. Please contact support.'
    };
  }
  
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
  
  return {
    expired: false,
    days: diffDays,
    hours: diffHours,
    minutes: diffMinutes,
    totalHours: Math.floor(diffTime / (1000 * 60 * 60)),
    expectedDate: currentDate
  };
});

// Pre-save middleware to update lastUpdated
writerApplicationSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Method to update review stage
writerApplicationSchema.methods.updateReviewStage = function(stage, status, reviewerId, notes) {
  if (!this.reviewStages[stage]) {
    throw new Error(`Invalid review stage: ${stage}`);
  }

  this.reviewStages[stage] = {
    status,
    reviewedBy: reviewerId,
    reviewedAt: new Date(),
    notes: notes || ''
  };

  // Update overall status based on review stages
  this.updateOverallStatus();
  
  // If rejected, set rejection date
  if (this.status === 'rejected') {
    this.rejectionDate = new Date();
    this.rejectionReason = notes;
  }
  
  return this.save();
};

// Method to update overall application status
writerApplicationSchema.methods.updateOverallStatus = function() {
  const stages = this.reviewStages;
  
  // Check if any stage is rejected
  if (Object.values(stages).some(stage => stage.status === 'rejected')) {
    this.status = 'rejected';
    return;
  }
  
  // Check if all stages are approved
  if (Object.values(stages).every(stage => stage.status === 'approved')) {
    this.status = 'approved';
    return;
  }
  
  // Check if any stage is under review
  if (Object.values(stages).some(stage => stage.status === 'pending')) {
    this.status = 'under-review';
    return;
  }
  
  // Default to pending
  this.status = 'pending';
};

// Method to add notification
writerApplicationSchema.methods.addNotification = function(type, message, method = 'email') {
  this.notifications.push({
    type,
    message,
    method,
    sentAt: new Date()
  });
  
  return this.save();
};

// Static method to get applications by status
writerApplicationSchema.statics.getByStatus = function(status) {
  return this.find({ status })
    .populate('reviewStages.documentsReviewed.reviewedBy', 'firstName lastName')
    .populate('reviewStages.identityVerified.verifiedBy', 'firstName lastName')
    .populate('reviewStages.writingTestGraded.gradedBy', 'firstName lastName')
    .populate('reviewStages.finalReview.reviewedBy', 'firstName lastName')
    .sort({ submittedAt: -1 });
};

// Static method to get applications requiring review
writerApplicationSchema.statics.getRequiringReview = function() {
  return this.find({
    status: { $in: ['pending', 'under-review'] }
  }).sort({ submittedAt: 1 });
};

// Static method to find application by email or writerId
writerApplicationSchema.statics.findByEmailOrWriterId = function(identifier) {
  return this.findOne({
    $or: [
      { email: identifier.toLowerCase() },
      { writerId: identifier }
    ]
  });
};

// Static method to check if user can apply (not rejected within last year)
writerApplicationSchema.statics.canUserApply = async function(email) {
  const existingApplication = await this.findOne({ 
    email: email.toLowerCase(),
    status: 'rejected'
  }).sort({ rejectionDate: -1 });
  
  if (!existingApplication || !existingApplication.rejectionDate) {
    return { canApply: true };
  }
  
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  if (existingApplication.rejectionDate <= oneYearAgo) {
    return { canApply: true };
  }
  
  const oneYearFromRejection = new Date(existingApplication.rejectionDate);
  oneYearFromRejection.setFullYear(oneYearFromRejection.getFullYear() + 1);
  
  return {
    canApply: false,
    rejectionDate: existingApplication.rejectionDate,
    canReapplyDate: oneYearFromRejection,
    daysRemaining: Math.ceil((oneYearFromRejection.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
  };
};

module.exports = mongoose.model('WriterApplication', writerApplicationSchema);
