const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  // Payment Identification
  paymentId: {
    type: String,
    unique: true,
    required: true
  },
  transactionId: {
    type: String,
    unique: true,
    sparse: true
  },
  
  // Payment Type
  type: {
    type: String,
    enum: ['order_payment', 'writer_withdrawal', 'refund', 'bonus', 'penalty'],
    required: true
  },
  
  // Amount and Currency
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive']
  },
  currency: {
    type: String,
    required: true,
    enum: ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'CNY'],
    default: 'USD'
  },
  
  // Exchange Rate (if applicable)
  exchangeRate: {
    type: Number,
    default: 1
  },
  amountInUSD: {
    type: Number,
    required: true
  },
  
  // Payment Status
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'disputed'],
    default: 'pending'
  },
  
  // Users Involved
  payer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  payee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  
  // Order Reference (for order payments)
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    default: null
  },
  
  // Payment Method Details
  paymentMethod: {
    type: {
      type: String,
      enum: ['stripe', 'paypal', 'mpesa', 'payoneer', 'bank_transfer', 'apple_pay', 'google_pay', 'alipay', 'wechat_pay', 'afterpay', 'interac', 'flutterwave'],
      required: true
    },
    details: {
      // Stripe
      stripePaymentIntentId: String,
      stripeChargeId: String,
      stripeCustomerId: String,
      
      // PayPal
      paypalOrderId: String,
      paypalPaymentId: String,
      paypalPayerId: String,
      
      // M-Pesa
      mpesaTransactionId: String,
      mpesaReceiptNumber: String,
      mpesaPhoneNumber: String,
      
      // Payoneer
      payoneerPaymentId: String,
      payoneerEmail: String,
      
      // Flutterwave
      flutterwaveTransactionId: String,
      flutterwaveTxRef: String,
      flutterwaveFlwRef: String,
      flutterwavePaymentType: String,
      
      // Bank Transfer
      bankName: String,
      accountNumber: String,
      routingNumber: String,
      swiftCode: String,
      
      // Digital Wallets
      walletTransactionId: String,
      walletType: String,
      
      // Card Details (last 4 digits only)
      cardLast4: String,
      cardBrand: String,
      cardExpMonth: Number,
      cardExpYear: Number
    }
  },
  
  // Fees and Charges
  platformFee: {
    type: Number,
    default: 0
  },
  processingFee: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number,
    required: true
  },
  
  // Geographic Information
  country: String,
  region: String,
  
  // Payment Gateway Response
  gatewayResponse: {
    success: Boolean,
    message: String,
    code: String,
    rawResponse: mongoose.Schema.Types.Mixed
  },
  
  // Webhook Data
  webhookReceived: {
    type: Boolean,
    default: false
  },
  webhookData: mongoose.Schema.Types.Mixed,
  webhookVerified: {
    type: Boolean,
    default: false
  },
  
  // Refund Information
  refund: {
    refundId: String,
    refundAmount: Number,
    refundReason: String,
    refundedAt: Date,
    refundedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  
  // Dispute Information
  dispute: {
    disputeId: String,
    disputeReason: String,
    disputeAmount: Number,
    disputeStatus: {
      type: String,
      enum: ['open', 'under_review', 'won', 'lost', 'closed']
    },
    disputedAt: Date,
    resolvedAt: Date
  },
  
  // Invoice Information
  invoice: {
    invoiceNumber: String,
    invoiceUrl: String,
    dueDate: Date,
    paidDate: Date
  },
  
  // Withdrawal Specific (for writer payments)
  withdrawal: {
    requestedAt: Date,
    approvedAt: Date,
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rejectedAt: Date,
    rejectedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rejectionReason: String,
    minimumThreshold: Number,
    withdrawalMethod: String
  },
  
  // Tax Information
  tax: {
    taxAmount: Number,
    taxRate: Number,
    taxRegion: String,
    taxId: String
  },
  
  // Metadata
  metadata: {
    ipAddress: String,
    userAgent: String,
    sessionId: String,
    source: String,
    notes: String
  },
  
  // Admin Actions
  adminActions: [{
    action: {
      type: String,
      enum: ['approved', 'rejected', 'refunded', 'disputed', 'noted']
    },
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    performedAt: { type: Date, default: Date.now },
    reason: String,
    notes: String
  }],
  
  // Timestamps
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  processedAt: Date,
  completedAt: Date,
  failedAt: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
paymentSchema.index({ paymentId: 1 });
paymentSchema.index({ transactionId: 1 });
paymentSchema.index({ payer: 1, status: 1 });
paymentSchema.index({ payee: 1, status: 1 });
paymentSchema.index({ order: 1 });
paymentSchema.index({ type: 1, status: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ 'paymentMethod.type': 1 });
paymentSchema.index({ status: 1, createdAt: -1 });

// Virtual for formatted amount
paymentSchema.virtual('formattedAmount').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency
  }).format(this.amount);
});

// Virtual for is successful
paymentSchema.virtual('isSuccessful').get(function() {
  return this.status === 'completed';
});

// Virtual for is pending
paymentSchema.virtual('isPending').get(function() {
  return ['pending', 'processing'].includes(this.status);
});

// Virtual for is failed
paymentSchema.virtual('isFailed').get(function() {
  return ['failed', 'cancelled'].includes(this.status);
});

// Pre-save middleware to generate payment ID
paymentSchema.pre('save', async function(next) {
  if (this.isNew && !this.paymentId) {
    const count = await this.constructor.countDocuments();
    this.paymentId = `PAY${String(count + 1).padStart(8, '0')}`;
  }
  
  // Calculate net amount
  if (this.isModified('amount') || this.isModified('platformFee') || this.isModified('processingFee')) {
    this.netAmount = this.amount - (this.platformFee || 0) - (this.processingFee || 0);
  }
  
  // Calculate USD amount if different currency
  if (this.isModified('amount') || this.isModified('exchangeRate')) {
    this.amountInUSD = this.amount * (this.exchangeRate || 1);
  }
  
  this.updatedAt = Date.now();
  next();
});

// Pre-save middleware to update timestamps based on status
paymentSchema.pre('save', function(next) {
  if (this.isModified('status')) {
    const now = new Date();
    
    switch (this.status) {
      case 'processing':
        if (!this.processedAt) this.processedAt = now;
        break;
      case 'completed':
        if (!this.completedAt) this.completedAt = now;
        break;
      case 'failed':
      case 'cancelled':
        if (!this.failedAt) this.failedAt = now;
        break;
    }
  }
  next();
});

// Method to process payment
paymentSchema.methods.processPayment = async function(gatewayResponse) {
  this.status = 'processing';
  this.processedAt = new Date();
  this.gatewayResponse = gatewayResponse;
  
  if (gatewayResponse.success) {
    this.status = 'completed';
    this.completedAt = new Date();
  } else {
    this.status = 'failed';
    this.failedAt = new Date();
  }
  
  return await this.save();
};

// Method to refund payment
paymentSchema.methods.refundPayment = async function(refundAmount, reason, refundedBy) {
  this.refund = {
    refundAmount: refundAmount || this.amount,
    refundReason: reason,
    refundedAt: new Date(),
    refundedBy
  };
  
  this.status = 'refunded';
  
  this.adminActions.push({
    action: 'refunded',
    performedBy: refundedBy,
    reason,
    performedAt: new Date()
  });
  
  return await this.save();
};

// Method to approve withdrawal
paymentSchema.methods.approveWithdrawal = async function(approvedBy) {
  if (this.type !== 'writer_withdrawal') {
    throw new Error('This is not a withdrawal payment');
  }
  
  this.withdrawal.approvedAt = new Date();
  this.withdrawal.approvedBy = approvedBy;
  this.status = 'processing';
  
  this.adminActions.push({
    action: 'approved',
    performedBy: approvedBy,
    performedAt: new Date()
  });
  
  return await this.save();
};

// Method to reject withdrawal
paymentSchema.methods.rejectWithdrawal = async function(reason, rejectedBy) {
  if (this.type !== 'writer_withdrawal') {
    throw new Error('This is not a withdrawal payment');
  }
  
  this.withdrawal.rejectedAt = new Date();
  this.withdrawal.rejectedBy = rejectedBy;
  this.withdrawal.rejectionReason = reason;
  this.status = 'cancelled';
  
  this.adminActions.push({
    action: 'rejected',
    performedBy: rejectedBy,
    reason,
    performedAt: new Date()
  });
  
  return await this.save();
};

// Static method to get payment statistics
paymentSchema.statics.getPaymentStats = async function(startDate, endDate) {
  const matchStage = {
    createdAt: {
      $gte: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      $lte: endDate || new Date()
    }
  };
  
  return await this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amountInUSD' },
        avgAmount: { $avg: '$amountInUSD' }
      }
    },
    {
      $group: {
        _id: null,
        stats: {
          $push: {
            status: '$_id',
            count: '$count',
            totalAmount: '$totalAmount',
            avgAmount: '$avgAmount'
          }
        },
        totalTransactions: { $sum: '$count' },
        totalVolume: { $sum: '$totalAmount' }
      }
    }
  ]);
};

// Static method to get writer earnings
paymentSchema.statics.getWriterEarnings = function(writerId, startDate, endDate) {
  const matchStage = {
    payee: mongoose.Types.ObjectId(writerId),
    type: { $in: ['order_payment', 'bonus'] },
    status: 'completed'
  };
  
  if (startDate || endDate) {
    matchStage.completedAt = {};
    if (startDate) matchStage.completedAt.$gte = startDate;
    if (endDate) matchStage.completedAt.$lte = endDate;
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalEarnings: { $sum: '$netAmount' },
        totalTransactions: { $sum: 1 },
        avgEarning: { $avg: '$netAmount' }
      }
    }
  ]);
};

// Static method to get pending withdrawals
paymentSchema.statics.getPendingWithdrawals = function() {
  return this.find({
    type: 'writer_withdrawal',
    status: 'pending'
  }).populate('payer', 'firstName lastName email country')
    .sort({ createdAt: 1 });
};

// Static method to calculate platform revenue
paymentSchema.statics.getPlatformRevenue = function(startDate, endDate) {
  const matchStage = {
    type: 'order_payment',
    status: 'completed'
  };
  
  if (startDate || endDate) {
    matchStage.completedAt = {};
    if (startDate) matchStage.completedAt.$gte = startDate;
    if (endDate) matchStage.completedAt.$lte = endDate;
  }
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$platformFee' },
        totalProcessingFees: { $sum: '$processingFee' },
        totalGrossRevenue: { $sum: '$amount' },
        transactionCount: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('Payment', paymentSchema);
