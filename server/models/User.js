const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
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
    minlength: [8, 'Password must be at least 8 characters'],
    select: false
  },
  phone: {
    type: String,
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  
  // Role and Status
  role: {
    type: String,
    enum: ['client', 'writer', 'manager', 'support', 'accountant', 'tech'],
    default: 'client'
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'rejected', 'inactive'],
    default: 'pending'
  },
  
  // Email Verification
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  
  // Password Reset
  passwordResetToken: String,
  passwordResetExpires: Date,
  
  // Profile Information
  profileImage: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters']
  },
  timezone: {
    type: String,
    default: 'UTC'
  },
  
  // Writer-specific fields
  writerProfile: {
    // Academic Background
    education: [{
      degree: String,
      institution: String,
      year: Number,
      field: String
    }],
    
    // Expertise
    subjects: [{
      type: String,
      trim: true
    }],
    academicLevels: [{
      type: String,
      enum: ['high-school', 'undergraduate', 'masters', 'phd', 'professional']
    }],
    
    // Documents
    cv: {
      filename: String,
      path: String,
      uploadDate: Date
    },
    samples: [{
      title: String,
      filename: String,
      path: String,
      subject: String,
      uploadDate: Date
    }],
    
    // Test Results
    writingTest: {
      score: Number,
      completedAt: Date,
      testType: String,
      feedback: String
    },
    
    // Writer Level and Stats
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'senior-advanced', 'premium', 'top-premium', 'first-class'],
      default: 'beginner'
    },
    
    stats: {
      totalOrders: { type: Number, default: 0 },
      completedOrders: { type: Number, default: 0 },
      onTimeDeliveries: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
      totalRevisions: { type: Number, default: 0 },
      plagiarismScore: { type: Number, default: 0 },
      aiContentScore: { type: Number, default: 0 },
      lastStatsUpdate: { type: Date, default: Date.now }
    },
    
    // Availability
    isAvailable: { type: Boolean, default: true },
    maxActiveOrders: { type: Number, default: 5 },
    
    // Payment Information
    paymentMethods: [{
      type: {
        type: String,
        enum: ['mpesa', 'paypal', 'payoneer']
      },
      details: {
        type: mongoose.Schema.Types.Mixed
      },
      isDefault: { type: Boolean, default: false }
    }],
    
    // Verification
    isVerified: { type: Boolean, default: false },
    verificationDate: Date,
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Client-specific fields
  clientProfile: {
    institution: String,
    studentLevel: {
      type: String,
      enum: ['high-school', 'undergraduate', 'masters', 'phd', 'professional']
    },
    preferredSubjects: [String],
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 }
  },
  
  // Admin-specific fields
  adminProfile: {
    department: String,
    permissions: [{
      type: String,
      enum: [
        'manage_users', 'manage_orders', 'manage_payments', 'manage_content',
        'view_analytics', 'manage_disputes', 'system_admin', 'financial_reports'
      ]
    }],
    lastLogin: Date,
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date
  },
  
  // Notification Preferences
  notifications: {
    email: {
      orderUpdates: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      payments: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false }
    },
    push: {
      orderUpdates: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      payments: { type: Boolean, default: true }
    }
  },
  
  // Security
  twoFactorEnabled: { type: Boolean, default: false },
  twoFactorSecret: String,
  lastLogin: Date,
  loginHistory: [{
    ip: String,
    userAgent: String,
    timestamp: { type: Date, default: Date.now }
  }],
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1, status: 1 });
userSchema.index({ 'writerProfile.level': 1 });
userSchema.index({ 'writerProfile.subjects': 1 });
userSchema.index({ createdAt: -1 });

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for writer rating
userSchema.virtual('writerProfile.rating').get(function() {
  if (this.role === 'writer' && this.writerProfile) {
    return this.writerProfile.stats.averageRating || 0;
  }
  return 0;
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update timestamps
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  this.emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');
  this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  
  return token;
};

// Method to generate password reset token
userSchema.methods.generatePasswordResetToken = function() {
  const crypto = require('crypto');
  const token = crypto.randomBytes(32).toString('hex');
  
  this.passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  
  return token;
};

// Method to check if user is locked
userSchema.methods.isLocked = function() {
  return !!(this.adminProfile?.lockUntil && this.adminProfile.lockUntil > Date.now());
};

// Method to increment login attempts
userSchema.methods.incLoginAttempts = function() {
  if (this.adminProfile) {
    if (this.adminProfile.lockUntil && this.adminProfile.lockUntil < Date.now()) {
      return this.updateOne({
        $unset: { 'adminProfile.lockUntil': 1 },
        $set: { 'adminProfile.loginAttempts': 1 }
      });
    }
    
    const updates = { $inc: { 'adminProfile.loginAttempts': 1 } };
    
    if (this.adminProfile.loginAttempts + 1 >= 5 && !this.adminProfile.lockUntil) {
      updates.$set = { 'adminProfile.lockUntil': Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
    }
    
    return this.updateOne(updates);
  }
};

// Method to reset login attempts
userSchema.methods.resetLoginAttempts = function() {
  if (this.adminProfile) {
    return this.updateOne({
      $unset: {
        'adminProfile.loginAttempts': 1,
        'adminProfile.lockUntil': 1
      }
    });
  }
};

// Static method to find writers by criteria
userSchema.statics.findWriters = function(criteria = {}) {
  return this.find({
    role: 'writer',
    status: 'active',
    'writerProfile.isVerified': true,
    ...criteria
  }).select('-password');
};

// Static method to update writer stats
userSchema.statics.updateWriterStats = async function(writerId, statsUpdate) {
  return await this.findByIdAndUpdate(
    writerId,
    {
      $set: {
        'writerProfile.stats': statsUpdate,
        'writerProfile.stats.lastStatsUpdate': new Date()
      }
    },
    { new: true }
  );
};

module.exports = mongoose.model('User', userSchema);
