const Payment = require('../models/Payment');
const User = require('../models/User');
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const { asyncHandler } = require('../middleware/errorHandler');
const { AppError } = require('../middleware/errorHandler');
const stripeService = require('../services/stripeService');
const paypalService = require('../services/paypalService');
const mpesaService = require('../services/mpesaService');
const flutterwaveService = require('../services/flutterwaveService');

// @desc    Process order payment
// @route   POST /api/payments/orders/:orderId
// @access  Private/Client
const processOrderPayment = asyncHandler(async (req, res, next) => {
  const { paymentMethod, paymentDetails } = req.body;
  const { orderId } = req.params;

  // Verify order exists and belongs to user
  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.client.toString() !== req.user.id) {
    return next(new AppError('Access denied', 403));
  }

  if (order.paymentStatus === 'paid') {
    return next(new AppError('Order is already paid', 400));
  }

  // Create payment record
  const payment = await Payment.create({
    type: 'order_payment',
    amount: order.totalPrice,
    currency: order.currency,
    payer: req.user.id,
    order: orderId,
    paymentMethod: {
      type: paymentMethod.type,
      details: paymentDetails
    },
    platformFee: order.totalPrice * 0.2, // 20% platform fee
    processingFee: calculateProcessingFee(order.totalPrice, paymentMethod.type),
    metadata: {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    }
  });

  try {
    let paymentResult;

    // Process payment based on method
    switch (paymentMethod.type) {
      case 'stripe':
        paymentResult = await stripeService.processPayment({
          amount: order.totalPrice,
          currency: order.currency,
          paymentMethodId: paymentDetails.paymentMethodId,
          customerId: paymentDetails.customerId,
          description: `Payment for order ${order.orderNumber}`
        });
        break;

      case 'paypal':
        paymentResult = await paypalService.processPayment({
          amount: order.totalPrice,
          currency: order.currency,
          orderId: paymentDetails.orderId,
          description: `Payment for order ${order.orderNumber}`
        });
        break;

      case 'mpesa':
        paymentResult = await mpesaService.processPayment({
          amount: order.totalPrice,
          phoneNumber: paymentDetails.phoneNumber,
          accountReference: order.orderNumber,
          transactionDesc: `Payment for order ${order.orderNumber}`
        });
        break;

      case 'flutterwave':
        paymentResult = await flutterwaveService.processPayment({
          amount: order.totalPrice,
          currency: order.currency,
          email: req.user.email,
          phone_number: paymentDetails.phone_number,
          name: `${req.user.firstName} ${req.user.lastName}`,
          tx_ref: flutterwaveService.generatePaymentReference(),
          redirect_url: `${process.env.FRONTEND_URL}/payment/callback`,
          description: `Payment for order ${order.orderNumber}`,
          meta: {
            orderId: order._id,
            orderNumber: order.orderNumber,
            userId: req.user.id
          }
        });
        break;

      default:
        return next(new AppError('Unsupported payment method', 400));
    }

    // Update payment with result
    await payment.processPayment(paymentResult);

    if (paymentResult.success) {
      // Update order payment status
      order.paymentStatus = 'paid';
      order.paymentId = payment.paymentId;
      order.paymentMethod = paymentMethod.type;
      await order.save();

      // Add timeline event
      await order.addTimelineEvent(
        'payment_completed',
        'Payment completed successfully',
        req.user.id
      );

      // Notify admins about new paid order
      const admins = await User.find({
        role: { $in: ['manager', 'support'] },
        status: 'active'
      });

      for (const admin of admins) {
        await Notification.create({
          title: 'Order Payment Received',
          message: `Payment received for order ${order.orderNumber}. Ready for writer assignment.`,
          type: 'payment_update',
          recipient: admin._id,
          relatedOrder: orderId,
          relatedPayment: payment._id,
          actionUrl: `/admin/orders/${orderId}`,
          actionText: 'View Order'
        });
      }
    }

    res.status(200).json({
      success: paymentResult.success,
      message: paymentResult.success ? 'Payment processed successfully' : 'Payment failed',
      payment: {
        id: payment.paymentId,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency
      },
      order: paymentResult.success ? {
        id: order._id,
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus
      } : undefined
    });

  } catch (error) {
    // Update payment status to failed
    payment.status = 'failed';
    payment.gatewayResponse = {
      success: false,
      message: error.message,
      code: error.code || 'PAYMENT_ERROR'
    };
    await payment.save();

    return next(new AppError(`Payment processing failed: ${error.message}`, 400));
  }
});

// @desc    Request withdrawal (Writer)
// @route   POST /api/payments/withdrawals
// @access  Private/Writer
const requestWithdrawal = asyncHandler(async (req, res, next) => {
  const { amount, withdrawalMethod, methodDetails } = req.body;

  // Verify user is a writer
  if (req.user.role !== 'writer') {
    return next(new AppError('Only writers can request withdrawals', 403));
  }

  // Check minimum withdrawal amount
  const minimumAmount = 50; // $50 minimum
  if (amount < minimumAmount) {
    return next(new AppError(`Minimum withdrawal amount is $${minimumAmount}`, 400));
  }

  // Calculate available balance
  const earnings = await Payment.getWriterEarnings(req.user.id);
  const totalEarnings = earnings[0]?.totalEarnings || 0;

  // Get pending withdrawals
  const pendingWithdrawals = await Payment.find({
    payee: req.user.id,
    type: 'writer_withdrawal',
    status: { $in: ['pending', 'processing'] }
  });

  const pendingAmount = pendingWithdrawals.reduce((sum, w) => sum + w.amount, 0);
  const availableBalance = totalEarnings - pendingAmount;

  if (amount > availableBalance) {
    return next(new AppError(`Insufficient balance. Available: $${availableBalance}`, 400));
  }

  // Create withdrawal request
  const withdrawal = await Payment.create({
    type: 'writer_withdrawal',
    amount,
    currency: 'USD',
    payee: req.user.id,
    payer: req.user.id, // Self-initiated
    paymentMethod: {
      type: withdrawalMethod,
      details: methodDetails
    },
    withdrawal: {
      requestedAt: new Date(),
      minimumThreshold: minimumAmount,
      withdrawalMethod
    },
    metadata: {
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    }
  });

  // Notify accountants
  const accountants = await User.find({
    role: 'accountant',
    status: 'active'
  });

  for (const accountant of accountants) {
    await Notification.create({
      title: 'New Withdrawal Request',
      message: `${req.user.firstName} ${req.user.lastName} has requested a withdrawal of $${amount}`,
      type: 'withdrawal_update',
      recipient: accountant._id,
      relatedPayment: withdrawal._id,
      actionUrl: `/admin/payments/withdrawals/${withdrawal._id}`,
      actionText: 'Review Request',
      priority: 'medium'
    });
  }

  res.status(201).json({
    success: true,
    message: 'Withdrawal request submitted successfully',
    withdrawal: {
      id: withdrawal.paymentId,
      amount: withdrawal.amount,
      status: withdrawal.status,
      requestedAt: withdrawal.createdAt
    }
  });
});

// @desc    Get user payments
// @route   GET /api/payments
// @access  Private
const getUserPayments = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 20,
    type,
    status,
    startDate,
    endDate,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build query based on user role
  let query = {};

  if (req.user.role === 'writer') {
    query = {
      $or: [
        { payee: req.user.id }, // Earnings
        { payer: req.user.id, type: 'writer_withdrawal' } // Withdrawals
      ]
    };
  } else if (req.user.role === 'client') {
    query.payer = req.user.id;
  } else if (['manager', 'accountant', 'tech'].includes(req.user.role)) {
    // Admin can see all payments
  } else {
    return next(new AppError('Access denied', 403));
  }

  // Add filters
  if (type) query.type = type;
  if (status) query.status = status;
  
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  // Calculate pagination
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  // Execute query
  const payments = await Payment.find(query)
    .populate('payer', 'firstName lastName email')
    .populate('payee', 'firstName lastName email')
    .populate('order', 'orderNumber title')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Payment.countDocuments(query);

  res.status(200).json({
    success: true,
    count: payments.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    },
    payments
  });
});

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
const getPayment = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id)
    .populate('payer', 'firstName lastName email')
    .populate('payee', 'firstName lastName email')
    .populate('order', 'orderNumber title client writer');

  if (!payment) {
    return next(new AppError('Payment not found', 404));
  }

  // Check access permissions
  const hasAccess = 
    payment.payer?.toString() === req.user.id ||
    payment.payee?.toString() === req.user.id ||
    ['manager', 'accountant', 'tech'].includes(req.user.role);

  if (!hasAccess) {
    return next(new AppError('Access denied', 403));
  }

  res.status(200).json({
    success: true,
    payment
  });
});

// @desc    Approve withdrawal (Admin)
// @route   PUT /api/payments/withdrawals/:id/approve
// @access  Private/Admin
const approveWithdrawal = asyncHandler(async (req, res, next) => {
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return next(new AppError('Payment not found', 404));
  }

  if (payment.type !== 'writer_withdrawal') {
    return next(new AppError('This is not a withdrawal request', 400));
  }

  if (payment.status !== 'pending') {
    return next(new AppError('Withdrawal is not in pending status', 400));
  }

  // Approve withdrawal
  await payment.approveWithdrawal(req.user.id);

  // Process the actual withdrawal based on method
  try {
    let withdrawalResult;

    switch (payment.paymentMethod.type) {
      case 'paypal':
        withdrawalResult = await paypalService.processWithdrawal({
          amount: payment.amount,
          recipientEmail: payment.paymentMethod.details.email,
          note: `Withdrawal for writer ${payment.payee}`
        });
        break;

      case 'mpesa':
        withdrawalResult = await mpesaService.processWithdrawal({
          amount: payment.amount,
          phoneNumber: payment.paymentMethod.details.phoneNumber,
          remarks: 'Writer withdrawal'
        });
        break;

      case 'payoneer':
        // Payoneer integration would go here
        withdrawalResult = { success: true, message: 'Payoneer withdrawal initiated' };
        break;

      default:
        withdrawalResult = { success: true, message: 'Manual processing required' };
    }

    if (withdrawalResult.success) {
      payment.status = 'completed';
      payment.completedAt = new Date();
    } else {
      payment.status = 'failed';
      payment.gatewayResponse = withdrawalResult;
    }

    await payment.save();

    // Notify writer
    await Notification.createPaymentNotification(
      withdrawalResult.success ? 'withdrawal_approved' : 'withdrawal_failed',
      payment.payee,
      payment._id,
      {
        title: withdrawalResult.success ? 'Withdrawal Approved' : 'Withdrawal Failed',
        message: withdrawalResult.success 
          ? `Your withdrawal of $${payment.amount} has been processed.`
          : `Your withdrawal of $${payment.amount} failed: ${withdrawalResult.message}`
      }
    );

  } catch (error) {
    payment.status = 'failed';
    payment.gatewayResponse = {
      success: false,
      message: error.message
    };
    await payment.save();

    return next(new AppError(`Withdrawal processing failed: ${error.message}`, 500));
  }

  res.status(200).json({
    success: true,
    message: 'Withdrawal approved and processed',
    payment
  });
});

// @desc    Reject withdrawal (Admin)
// @route   PUT /api/payments/withdrawals/:id/reject
// @access  Private/Admin
const rejectWithdrawal = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return next(new AppError('Payment not found', 404));
  }

  if (payment.type !== 'writer_withdrawal') {
    return next(new AppError('This is not a withdrawal request', 400));
  }

  if (payment.status !== 'pending') {
    return next(new AppError('Withdrawal is not in pending status', 400));
  }

  // Reject withdrawal
  await payment.rejectWithdrawal(reason, req.user.id);

  // Notify writer
  await Notification.createPaymentNotification(
    'withdrawal_rejected',
    payment.payee,
    payment._id,
    {
      title: 'Withdrawal Rejected',
      message: `Your withdrawal request of $${payment.amount} has been rejected. Reason: ${reason}`
    }
  );

  res.status(200).json({
    success: true,
    message: 'Withdrawal rejected',
    payment
  });
});

// @desc    Get pending withdrawals (Admin)
// @route   GET /api/payments/withdrawals/pending
// @access  Private/Admin
const getPendingWithdrawals = asyncHandler(async (req, res, next) => {
  const withdrawals = await Payment.getPendingWithdrawals();

  res.status(200).json({
    success: true,
    count: withdrawals.length,
    withdrawals
  });
});

// @desc    Get payment statistics (Admin)
// @route   GET /api/payments/stats
// @access  Private/Admin
const getPaymentStats = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  const start = startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const end = endDate ? new Date(endDate) : new Date();

  const [paymentStats, platformRevenue] = await Promise.all([
    Payment.getPaymentStats(start, end),
    Payment.getPlatformRevenue(start, end)
  ]);

  res.status(200).json({
    success: true,
    stats: {
      period: { startDate: start, endDate: end },
      payments: paymentStats[0] || { stats: [], totalTransactions: 0, totalVolume: 0 },
      revenue: platformRevenue[0] || { totalRevenue: 0, totalProcessingFees: 0, totalGrossRevenue: 0, transactionCount: 0 }
    }
  });
});

// @desc    Process refund (Admin)
// @route   POST /api/payments/:id/refund
// @access  Private/Admin
const processRefund = asyncHandler(async (req, res, next) => {
  const { amount, reason } = req.body;
  const payment = await Payment.findById(req.params.id);

  if (!payment) {
    return next(new AppError('Payment not found', 404));
  }

  if (payment.type !== 'order_payment') {
    return next(new AppError('Only order payments can be refunded', 400));
  }

  if (payment.status !== 'completed') {
    return next(new AppError('Payment is not completed', 400));
  }

  const refundAmount = amount || payment.amount;

  if (refundAmount > payment.amount) {
    return next(new AppError('Refund amount cannot exceed original payment', 400));
  }

  try {
    let refundResult;

    // Process refund based on original payment method
    switch (payment.paymentMethod.type) {
      case 'stripe':
        refundResult = await stripeService.processRefund({
          paymentIntentId: payment.paymentMethod.details.stripePaymentIntentId,
          amount: refundAmount
        });
        break;

      case 'paypal':
        refundResult = await paypalService.processRefund({
          captureId: payment.paymentMethod.details.paypalPaymentId,
          amount: refundAmount
        });
        break;

      default:
        refundResult = { success: true, message: 'Manual refund required' };
    }

    if (refundResult.success) {
      await payment.refundPayment(refundAmount, reason, req.user.id);

      // Update related order
      if (payment.order) {
        const order = await Order.findById(payment.order);
        if (order) {
          order.paymentStatus = 'refunded';
          await order.save();
        }
      }

      // Notify client
      await Notification.createPaymentNotification(
        'refund_processed',
        payment.payer,
        payment._id,
        {
          title: 'Refund Processed',
          message: `A refund of $${refundAmount} has been processed for your payment.`
        }
      );
    }

    res.status(200).json({
      success: refundResult.success,
      message: refundResult.success ? 'Refund processed successfully' : 'Refund failed',
      refund: refundResult.success ? {
        amount: refundAmount,
        reason,
        processedAt: new Date()
      } : undefined
    });

  } catch (error) {
    return next(new AppError(`Refund processing failed: ${error.message}`, 500));
  }
});

// @desc    Get writer earnings summary
// @route   GET /api/payments/earnings
// @access  Private/Writer
const getWriterEarnings = asyncHandler(async (req, res, next) => {
  if (req.user.role !== 'writer') {
    return next(new AppError('Only writers can access earnings', 403));
  }

  const { startDate, endDate } = req.query;

  const earnings = await Payment.getWriterEarnings(
    req.user.id,
    startDate ? new Date(startDate) : undefined,
    endDate ? new Date(endDate) : undefined
  );

  // Get pending withdrawals
  const pendingWithdrawals = await Payment.find({
    payee: req.user.id,
    type: 'writer_withdrawal',
    status: { $in: ['pending', 'processing'] }
  });

  const totalEarnings = earnings[0]?.totalEarnings || 0;
  const pendingAmount = pendingWithdrawals.reduce((sum, w) => sum + w.amount, 0);
  const availableBalance = totalEarnings - pendingAmount;

  res.status(200).json({
    success: true,
    earnings: {
      total: totalEarnings,
      pending: pendingAmount,
      available: availableBalance,
      transactions: earnings[0]?.totalTransactions || 0,
      average: earnings[0]?.avgEarning || 0
    }
  });
});

// Helper function to calculate processing fee
const calculateProcessingFee = (amount, paymentMethod) => {
  const fees = {
    stripe: amount * 0.029 + 0.30, // 2.9% + $0.30
    paypal: amount * 0.034 + 0.30, // 3.4% + $0.30
    mpesa: amount * 0.015, // 1.5%
    flutterwave: flutterwaveService.calculateProcessingFee(amount, 'USD'), // Dynamic calculation
    apple_pay: amount * 0.029 + 0.30,
    google_pay: amount * 0.029 + 0.30
  };

  return Math.round((fees[paymentMethod] || 0) * 100) / 100;
};

module.exports = {
  processOrderPayment,
  requestWithdrawal,
  getUserPayments,
  getPayment,
  approveWithdrawal,
  rejectWithdrawal,
  getPendingWithdrawals,
  getPaymentStats,
  processRefund,
  getWriterEarnings
};
