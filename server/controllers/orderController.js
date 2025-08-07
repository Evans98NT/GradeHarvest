const Order = require('../models/Order');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const { asyncHandler } = require('../middleware/errorHandler');
const { AppError } = require('../middleware/errorHandler');
const uploadFile = require('../utils/fileUpload');
const plagiarismCheck = require('../services/plagiarismService');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private/Client
const createOrder = asyncHandler(async (req, res, next) => {
  const {
    title,
    subject,
    academicLevel,
    paperType,
    instructions,
    wordCount,
    deadline,
    urgency,
    requirements,
    paymentStatus,
    paymentMethod
  } = req.body;

  // Calculate pricing based on urgency and academic level
  const pricing = calculatePricing(wordCount, urgency, academicLevel);

  // Create order
  const order = await Order.create({
    title,
    subject,
    academicLevel,
    paperType,
    instructions,
    wordCount,
    deadline: new Date(deadline),
    urgency,
    requirements,
    client: req.user.id,
    pricePerPage: pricing.pricePerPage,
    totalPrice: pricing.totalPrice,
    currency: 'USD',
    paymentStatus: paymentStatus || 'pending',
    paymentMethod: paymentMethod || null
  });

  // Handle file attachments if any
  if (req.files && req.files.length > 0) {
    const attachments = [];
    
    for (const file of req.files) {
      const filePath = await uploadFile(file, 'documents');
      attachments.push({
        filename: file.filename,
        originalName: file.originalname,
        path: filePath,
        size: file.size,
        mimetype: file.mimetype
      });
    }
    
    order.attachments = attachments;
    await order.save();
  }

  // Add timeline event
  await order.addTimelineEvent('order_created', 'Order created by client', req.user.id);

  // Create notification for admins
  const admins = await User.find({ 
    role: { $in: ['manager', 'support'] },
    status: 'active'
  });

  for (const admin of admins) {
    await Notification.createOrderNotification(
      'order_update',
      admin._id,
      order._id,
      {
        title: 'New Order Created',
        message: `A new order "${title}" has been created and needs assignment.`,
        actionRequired: true,
        actionUrl: `/admin/orders/${order._id}`,
        actionText: 'View Order'
      }
    );
  }

  await order.populate('client', 'firstName lastName email');

  res.status(201).json({
    success: true,
    message: 'Order created successfully',
    order
  });
});

// @desc    Create new guest order
// @route   POST /api/orders/guest
// @access  Public
const createGuestOrder = asyncHandler(async (req, res, next) => {
  const {
    title,
    subject,
    academicLevel,
    paperType,
    instructions,
    wordCount,
    deadline,
    urgency,
    requirements,
    paymentStatus,
    paymentMethod,
    guestInfo
  } = req.body;

  // Calculate pricing based on urgency and academic level
  const pricing = calculatePricing(wordCount, urgency, academicLevel);

  // Create guest order
  const order = await Order.create({
    title,
    subject,
    academicLevel,
    paperType,
    instructions,
    wordCount,
    deadline: new Date(deadline),
    urgency,
    requirements,
    client: null, // No client for guest orders
    guestInfo: {
      firstName: guestInfo?.firstName || 'Guest',
      lastName: guestInfo?.lastName || 'User',
      email: guestInfo?.email || 'guest@temp.com',
      phone: guestInfo?.phone || null,
      country: guestInfo?.country || null,
      isGuest: true
    },
    pricePerPage: pricing.pricePerPage,
    totalPrice: pricing.totalPrice,
    currency: 'USD',
    paymentStatus: paymentStatus || 'pending',
    paymentMethod: paymentMethod || null
  });

  // Add timeline event
  await order.addTimelineEvent('order_created', 'Guest order created from payment flow', null);

  // Create notification for admins
  const admins = await User.find({ 
    role: { $in: ['manager', 'support'] },
    status: 'active'
  });

  for (const admin of admins) {
    await Notification.createOrderNotification(
      'order_update',
      admin._id,
      order._id,
      {
        title: 'New Guest Order Created',
        message: `A new guest order "${title}" has been created and needs assignment.`,
        actionRequired: true,
        actionUrl: `/admin/orders/${order._id}`,
        actionText: 'View Order'
      }
    );
  }

  res.status(201).json({
    success: true,
    message: 'Guest order created successfully',
    order
  });
});

// @desc    Link guest order to user account
// @route   PUT /api/orders/:id/link-guest
// @access  Private/Client
const linkGuestOrder = asyncHandler(async (req, res, next) => {
  const { userData } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (!order.guestInfo?.isGuest) {
    return next(new AppError('Order is not a guest order', 400));
  }

  // Link the order to the authenticated user
  order.client = req.user.id;
  
  // Update guest info with actual user data if provided
  if (userData) {
    order.guestInfo.firstName = userData.firstName || order.guestInfo.firstName;
    order.guestInfo.lastName = userData.lastName || order.guestInfo.lastName;
    order.guestInfo.email = userData.email || order.guestInfo.email;
    order.guestInfo.phone = userData.phone || order.guestInfo.phone;
    order.guestInfo.country = userData.country || order.guestInfo.country;
  }
  
  order.guestInfo.isGuest = false;

  await order.save();

  // Add timeline event
  await order.addTimelineEvent('order_linked', 'Guest order linked to user account', req.user.id);

  await order.populate('client', 'firstName lastName email');

  res.status(200).json({
    success: true,
    message: 'Guest order linked to account successfully',
    order
  });
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 20,
    status,
    subject,
    academicLevel,
    urgency,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build query based on user role
  let query = {};

  switch (req.user.role) {
    case 'client':
      query.client = req.user.id;
      break;
    case 'writer':
      if (status === 'available' || status === 'pending') {
        query = {
          status: 'pending',
          deadline: { $gt: new Date() }
        };
      } else {
        query.writer = req.user.id;
      }
      break;
    case 'manager':
    case 'support':
    case 'tech':
      // Admin can see all orders
      break;
    default:
      return next(new AppError('Access denied', 403));
  }

  // Add filters
  if (status && status !== 'available' && status !== 'pending') query.status = status;
  if (subject) query.subject = { $regex: subject, $options: 'i' };
  if (academicLevel) query.academicLevel = academicLevel;
  if (urgency) query.urgency = urgency;
  
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { orderNumber: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } }
    ];
  }

  // Calculate pagination
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  // Execute query
  const orders = await Order.find(query)
    .populate('client', 'firstName lastName email country')
    .populate('writer', 'firstName lastName writerProfile.level')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Order.countDocuments(query);

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    },
    orders
  });
});

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
const getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('client', 'firstName lastName email country profileImage')
    .populate('writer', 'firstName lastName email writerProfile.level profileImage')
    .populate('applications.writer', 'firstName lastName writerProfile.level writerProfile.stats')
    .populate('timeline.user', 'firstName lastName role');

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  res.status(200).json({
    success: true,
    order
  });
});

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private
const updateOrder = asyncHandler(async (req, res, next) => {
  let order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Check permissions
  const isClient = req.user.role === 'client' && order.client.toString() === req.user.id;
  const isAdmin = ['manager', 'support', 'tech'].includes(req.user.role);

  if (!isClient && !isAdmin) {
    return next(new AppError('Access denied', 403));
  }

  // Only allow certain fields to be updated based on order status
  const allowedFields = [];
  
  if (order.status === 'pending') {
    allowedFields.push('title', 'instructions', 'deadline', 'requirements');
  }

  if (isAdmin) {
    allowedFields.push('status', 'writer', 'pricePerPage', 'totalPrice');
  }

  const updateData = {};
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  order = await Order.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  }).populate('client writer');

  res.status(200).json({
    success: true,
    message: 'Order updated successfully',
    order
  });
});

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private/Client or Admin
const deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Check permissions
  const isClient = req.user.role === 'client' && order.client.toString() === req.user.id;
  const isAdmin = ['manager', 'support', 'tech'].includes(req.user.role);

  if (!isClient && !isAdmin) {
    return next(new AppError('Access denied', 403));
  }

  // Only allow deletion if order is pending
  if (order.status !== 'pending') {
    return next(new AppError('Cannot delete order that is already in progress', 400));
  }

  await Order.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Order deleted successfully'
  });
});

// @desc    Apply for order (Writer)
// @route   POST /api/orders/:id/apply
// @access  Private/Writer
const applyForOrder = asyncHandler(async (req, res, next) => {
  const { bidAmount, message } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.status !== 'pending') {
    return next(new AppError('Order is no longer available for applications', 400));
  }

  // Check if writer already applied
  const existingApplication = order.applications.find(
    app => app.writer.toString() === req.user.id
  );

  if (existingApplication) {
    return next(new AppError('You have already applied for this order', 400));
  }

  // Add application
  order.applications.push({
    writer: req.user.id,
    bidAmount: bidAmount || order.totalPrice,
    message
  });

  await order.save();

  // Notify client
  await Notification.createOrderNotification(
    'writer_application',
    order.client,
    order._id,
    {
      title: 'New Writer Application',
      message: `A writer has applied to work on your order "${order.title}".`,
      actionRequired: true,
      actionUrl: `/orders/${order._id}/applications`,
      actionText: 'View Applications'
    }
  );

  await order.populate('applications.writer', 'firstName lastName writerProfile.level');

  res.status(200).json({
    success: true,
    message: 'Application submitted successfully',
    order
  });
});

// @desc    Assign writer to order
// @route   PUT /api/orders/:id/assign
// @access  Private/Client or Admin
const assignWriter = asyncHandler(async (req, res, next) => {
  const { writerId, applicationId } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  // Check permissions
  const isClient = req.user.role === 'client' && order.client.toString() === req.user.id;
  const isAdmin = ['manager', 'support', 'tech'].includes(req.user.role);
  const isWriter = req.user.role === 'writer' && req.user.id === writerId;

  if (!isClient && !isAdmin && !isWriter) {
    return next(new AppError('Access denied', 403));
  }

  if (order.status !== 'pending') {
    return next(new AppError('Order is not available for assignment', 400));
  }

  // Verify writer exists and is verified
  const writer = await User.findById(writerId);
  if (!writer || writer.role !== 'writer' || writer.status !== 'active') {
    return next(new AppError('Invalid or unverified writer', 400));
  }

  // Update application status if applicationId provided
  if (applicationId) {
    const application = order.applications.id(applicationId);
    if (application) {
      application.status = 'accepted';
      // Reject other applications
      order.applications.forEach(app => {
        if (app._id.toString() !== applicationId) {
          app.status = 'rejected';
        }
      });
    }
  }

  // Assign writer
  await order.assignWriter(writerId, req.user.id);

  // Notify writer if assigned by someone else
  if (!isWriter) {
    await Notification.createOrderNotification(
      'order_update',
      writerId,
      order._id,
      {
        title: 'Order Assigned',
        message: `You have been assigned to work on order "${order.title}".`,
        actionRequired: true,
        actionUrl: `/writer/orders/${order._id}`,
        actionText: 'View Order'
      }
    );
  }

  // Notify client if writer took the order directly
  if (isWriter && order.client) {
    await Notification.createOrderNotification(
      'order_update',
      order.client,
      order._id,
      {
        title: 'Writer Assigned',
        message: `A writer has taken your order "${order.title}".`,
        actionRequired: false,
        actionUrl: `/orders/${order._id}`,
        actionText: 'View Order'
      }
    );
  }

  await order.populate('writer', 'firstName lastName writerProfile.level');

  res.status(200).json({
    success: true,
    message: 'Writer assigned successfully',
    order
  });
});

// @desc    Submit work (Writer)
// @route   POST /api/orders/:id/submit
// @access  Private/Writer
const submitWork = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.writer.toString() !== req.user.id) {
    return next(new AppError('You are not assigned to this order', 403));
  }

  if (!['assigned', 'in-progress', 'revision-requested'].includes(order.status)) {
    return next(new AppError('Order is not in a state that allows submission', 400));
  }

  if (!req.file) {
    return next(new AppError('Please upload the completed work', 400));
  }

  // Upload file
  const filePath = await uploadFile(req.file, 'documents');

  const submissionData = {
    filename: req.file.filename,
    originalName: req.file.originalname,
    path: filePath,
    size: req.file.size,
    mimetype: req.file.mimetype
  };

  // Submit work
  await order.submitWork(submissionData, req.user.id);

  // Start plagiarism check
  try {
    const plagiarismResult = await plagiarismCheck.checkDocument(filePath);
    
    // Update latest submission with plagiarism results
    const latestSubmission = order.submissions[order.submissions.length - 1];
    latestSubmission.plagiarismCheck = plagiarismResult;
    await order.save();
  } catch (error) {
    console.error('Plagiarism check failed:', error);
    // Continue without plagiarism check - can be done manually later
  }

  // Notify client
  await Notification.createOrderNotification(
    'order_update',
    order.client,
    order._id,
    {
      title: 'Work Submitted',
      message: `The writer has submitted work for your order "${order.title}".`,
      actionRequired: true,
      actionUrl: `/orders/${order._id}`,
      actionText: 'Review Work'
    }
  );

  res.status(200).json({
    success: true,
    message: 'Work submitted successfully',
    order
  });
});

// @desc    Request revision (Client)
// @route   POST /api/orders/:id/revision
// @access  Private/Client
const requestRevision = asyncHandler(async (req, res, next) => {
  const { reason, instructions, deadline } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.client.toString() !== req.user.id) {
    return next(new AppError('Access denied', 403));
  }

  if (order.status !== 'submitted') {
    return next(new AppError('Order must be submitted before requesting revision', 400));
  }

  const revisionData = {
    reason,
    instructions,
    deadline: deadline ? new Date(deadline) : new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours default
  };

  await order.requestRevision(revisionData, req.user.id);

  // Notify writer
  await Notification.createOrderNotification(
    'order_update',
    order.writer,
    order._id,
    {
      title: 'Revision Requested',
      message: `The client has requested revisions for order "${order.title}".`,
      actionRequired: true,
      actionUrl: `/writer/orders/${order._id}`,
      actionText: 'View Revision Request'
    }
  );

  res.status(200).json({
    success: true,
    message: 'Revision requested successfully',
    order
  });
});

// @desc    Accept work and complete order (Client)
// @route   POST /api/orders/:id/complete
// @access  Private/Client
const completeOrder = asyncHandler(async (req, res, next) => {
  const { rating } = req.body;
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.client.toString() !== req.user.id) {
    return next(new AppError('Access denied', 403));
  }

  if (order.status !== 'submitted') {
    return next(new AppError('Order must be submitted before completion', 400));
  }

  const ratingData = rating ? {
    score: rating.score,
    review: rating.review,
    ratedAt: new Date(),
    ratedBy: req.user.id
  } : null;

  await order.completeOrder(ratingData);

  // Update writer stats
  if (order.writer) {
    const writer = await User.findById(order.writer);
    if (writer && writer.writerProfile) {
      writer.writerProfile.stats.completedOrders += 1;
      writer.writerProfile.stats.totalOrders += 1;
      
      if (order.submittedAt <= order.deadline) {
        writer.writerProfile.stats.onTimeDeliveries += 1;
      }
      
      if (rating) {
        const currentRating = writer.writerProfile.stats.averageRating || 0;
        const totalRatings = writer.writerProfile.stats.completedOrders;
        writer.writerProfile.stats.averageRating = 
          ((currentRating * (totalRatings - 1)) + rating.score) / totalRatings;
      }
      
      await writer.save();
    }
  }

  // Create payment for writer
  if (order.writer) {
    const writerPayment = await Payment.create({
      type: 'order_payment',
      amount: order.totalPrice * 0.8, // 80% to writer, 20% platform fee
      currency: order.currency,
      payer: order.client,
      payee: order.writer,
      order: order._id,
      status: 'completed',
      paymentMethod: {
        type: 'internal_transfer'
      },
      platformFee: order.totalPrice * 0.2,
      netAmount: order.totalPrice * 0.8
    });

    // Notify writer about payment
    await Notification.createPaymentNotification(
      'payment_received',
      order.writer,
      writerPayment._id,
      {
        title: 'Payment Received',
        message: `You have received payment for order "${order.title}".`
      }
    );
  }

  res.status(200).json({
    success: true,
    message: 'Order completed successfully',
    order
  });
});

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
const getOrderStats = asyncHandler(async (req, res, next) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalValue: { $sum: '$totalPrice' },
        avgValue: { $avg: '$totalPrice' }
      }
    }
  ]);

  const totalOrders = await Order.countDocuments();
  const ordersThisMonth = await Order.countDocuments({
    createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
  });

  const revenueThisMonth = await Order.aggregate([
    {
      $match: {
        status: 'completed',
        completedAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    stats: {
      total: totalOrders,
      thisMonth: ordersThisMonth,
      revenueThisMonth: revenueThisMonth[0]?.totalRevenue || 0,
      byStatus: stats
    }
  });
});

// Helper function to calculate pricing
const calculatePricing = (wordCount, urgency, academicLevel) => {
  const pages = Math.ceil(wordCount / 250);
  
  // Base price per page
  let basePrice = 12;
  
  // Academic level multiplier
  const levelMultipliers = {
    'high-school': 1.0,
    'undergraduate': 1.2,
    'masters': 1.5,
    'phd': 2.0,
    'professional': 2.5
  };
  
  // Urgency multiplier
  const urgencyMultipliers = {
    '24-hours': 2.0,
    '3-days': 1.5,
    '7-days': 1.2,
    '14-days': 1.0,
    '30-days': 0.9,
    'custom': 1.0
  };
  
  const levelMultiplier = levelMultipliers[academicLevel] || 1.0;
  const urgencyMultiplier = urgencyMultipliers[urgency] || 1.0;
  
  const pricePerPage = basePrice * levelMultiplier * urgencyMultiplier;
  const totalPrice = pricePerPage * pages;
  
  return {
    pricePerPage: Math.round(pricePerPage * 100) / 100,
    totalPrice: Math.round(totalPrice * 100) / 100
  };
};

module.exports = {
  createOrder,
  createGuestOrder,
  linkGuestOrder,
  getOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  applyForOrder,
  assignWriter,
  submitWork,
  requestRevision,
  completeOrder,
  getOrderStats
};
