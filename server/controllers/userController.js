const User = require('../models/User');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const { asyncHandler } = require('../middleware/errorHandler');
const { AppError } = require('../middleware/errorHandler');
const uploadFile = require('../utils/fileUpload');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 20,
    role,
    status,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build query
  const query = {};
  
  if (role) query.role = role;
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }

  // Calculate pagination
  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  // Execute query
  const users = await User.find(query)
    .select('-password')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await User.countDocuments(query);

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    },
    users
  });
});

// @desc    Get single user
// @route   GET /api/users/:id
// @access  Private/Admin or Own Profile
const getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check if user can access this profile
  const isAdmin = ['manager', 'support', 'tech'].includes(req.user.role);
  const isOwnProfile = req.user.id === req.params.id;

  if (!isAdmin && !isOwnProfile) {
    return next(new AppError('Access denied', 403));
  }

  res.status(200).json({
    success: true,
    user
  });
});

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private/Admin or Own Profile
const updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check permissions
  const isAdmin = ['manager', 'support', 'tech'].includes(req.user.role);
  const isOwnProfile = req.user.id === req.params.id;

  if (!isAdmin && !isOwnProfile) {
    return next(new AppError('Access denied', 403));
  }

  // Fields that can be updated
  const allowedFields = ['firstName', 'lastName', 'phone', 'bio', 'timezone'];
  const adminOnlyFields = ['role', 'status', 'isEmailVerified'];

  const updateData = {};

  // Add allowed fields
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  // Add admin-only fields if user is admin
  if (isAdmin) {
    adminOnlyFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  ).select('-password');

  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    user: updatedUser
  });
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Soft delete - change status to inactive
  user.status = 'inactive';
  user.email = `deleted_${Date.now()}_${user.email}`;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

// @desc    Get user statistics
// @route   GET /api/users/stats
// @access  Private/Admin
const getUserStats = asyncHandler(async (req, res, next) => {
  const stats = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
        active: {
          $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
        },
        pending: {
          $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
        },
        suspended: {
          $sum: { $cond: [{ $eq: ['$status', 'suspended'] }, 1, 0] }
        }
      }
    }
  ]);

  const totalUsers = await User.countDocuments();
  const newUsersThisMonth = await User.countDocuments({
    createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) }
  });

  res.status(200).json({
    success: true,
    stats: {
      total: totalUsers,
      newThisMonth: newUsersThisMonth,
      byRole: stats
    }
  });
});

// @desc    Upload profile image
// @route   POST /api/users/:id/profile-image
// @access  Private
const uploadProfileImage = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  // Check permissions
  const isAdmin = ['manager', 'support', 'tech'].includes(req.user.role);
  const isOwnProfile = req.user.id === req.params.id;

  if (!isAdmin && !isOwnProfile) {
    return next(new AppError('Access denied', 403));
  }

  if (!req.file) {
    return next(new AppError('Please upload an image', 400));
  }

  // Upload file
  const filePath = await uploadFile(req.file, 'profiles');

  // Update user profile image
  user.profileImage = filePath;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Profile image uploaded successfully',
    profileImage: filePath
  });
});

// @desc    Get writer applications
// @route   GET /api/users/writers/applications
// @access  Private/Admin
const getWriterApplications = asyncHandler(async (req, res, next) => {
  const {
    page = 1,
    limit = 20,
    status = 'pending',
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const applications = await User.find({
    role: 'writer',
    status: status
  })
    .select('-password')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit));

  const total = await User.countDocuments({
    role: 'writer',
    status: status
  });

  res.status(200).json({
    success: true,
    count: applications.length,
    total,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      pages: Math.ceil(total / limit)
    },
    applications
  });
});

// @desc    Approve writer application
// @route   PUT /api/users/writers/:id/approve
// @access  Private/Admin
const approveWriter = asyncHandler(async (req, res, next) => {
  const writer = await User.findById(req.params.id);

  if (!writer) {
    return next(new AppError('Writer not found', 404));
  }

  if (writer.role !== 'writer') {
    return next(new AppError('User is not a writer', 400));
  }

  // Update writer status
  writer.status = 'active';
  writer.writerProfile.isVerified = true;
  writer.writerProfile.verificationDate = new Date();
  writer.writerProfile.verifiedBy = req.user.id;

  await writer.save({ validateBeforeSave: false });

  // Send approval email
  // TODO: Implement email notification

  res.status(200).json({
    success: true,
    message: 'Writer approved successfully',
    writer
  });
});

// @desc    Reject writer application
// @route   PUT /api/users/writers/:id/reject
// @access  Private/Admin
const rejectWriter = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;
  const writer = await User.findById(req.params.id);

  if (!writer) {
    return next(new AppError('Writer not found', 404));
  }

  if (writer.role !== 'writer') {
    return next(new AppError('User is not a writer', 400));
  }

  // Update writer status
  writer.status = 'rejected';
  
  // Add rejection reason to writer test feedback
  if (writer.writerProfile && writer.writerProfile.writingTest) {
    writer.writerProfile.writingTest.feedback = reason || 'Application rejected';
  }

  await writer.save({ validateBeforeSave: false });

  // Send rejection email
  // TODO: Implement email notification

  res.status(200).json({
    success: true,
    message: 'Writer application rejected',
    writer
  });
});

// @desc    Get writer performance
// @route   GET /api/users/writers/:id/performance
// @access  Private/Admin or Own Profile
const getWriterPerformance = asyncHandler(async (req, res, next) => {
  const writer = await User.findById(req.params.id);

  if (!writer) {
    return next(new AppError('Writer not found', 404));
  }

  if (writer.role !== 'writer') {
    return next(new AppError('User is not a writer', 400));
  }

  // Check permissions
  const isAdmin = ['manager', 'support', 'tech'].includes(req.user.role);
  const isOwnProfile = req.user.id === req.params.id;

  if (!isAdmin && !isOwnProfile) {
    return next(new AppError('Access denied', 403));
  }

  // Get writer's orders
  const orders = await Order.find({ writer: req.params.id })
    .populate('client', 'firstName lastName')
    .sort({ createdAt: -1 });

  // Get writer's earnings
  const earnings = await Payment.getWriterEarnings(req.params.id);

  // Calculate additional stats
  const completedOrders = orders.filter(order => order.status === 'completed');
  const onTimeDeliveries = completedOrders.filter(order => 
    order.submittedAt && order.submittedAt <= order.deadline
  );

  const performance = {
    totalOrders: orders.length,
    completedOrders: completedOrders.length,
    onTimeDeliveries: onTimeDeliveries.length,
    onTimeRate: completedOrders.length > 0 ? (onTimeDeliveries.length / completedOrders.length) * 100 : 0,
    averageRating: writer.writerProfile?.stats?.averageRating || 0,
    totalEarnings: earnings[0]?.totalEarnings || 0,
    level: writer.writerProfile?.level || 'beginner',
    recentOrders: orders.slice(0, 10)
  };

  res.status(200).json({
    success: true,
    performance
  });
});

// @desc    Update writer level
// @route   PUT /api/users/writers/:id/level
// @access  Private/Admin
const updateWriterLevel = asyncHandler(async (req, res, next) => {
  const { level } = req.body;
  const writer = await User.findById(req.params.id);

  if (!writer) {
    return next(new AppError('Writer not found', 404));
  }

  if (writer.role !== 'writer') {
    return next(new AppError('User is not a writer', 400));
  }

  const validLevels = ['beginner', 'intermediate', 'advanced', 'senior-advanced', 'premium', 'top-premium', 'first-class'];
  
  if (!validLevels.includes(level)) {
    return next(new AppError('Invalid writer level', 400));
  }

  writer.writerProfile.level = level;
  await writer.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Writer level updated successfully',
    writer
  });
});

// @desc    Suspend user
// @route   PUT /api/users/:id/suspend
// @access  Private/Admin
const suspendUser = asyncHandler(async (req, res, next) => {
  const { reason } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  user.status = 'suspended';
  await user.save({ validateBeforeSave: false });

  // TODO: Send suspension notification email

  res.status(200).json({
    success: true,
    message: 'User suspended successfully'
  });
});

// @desc    Reactivate user
// @route   PUT /api/users/:id/reactivate
// @access  Private/Admin
const reactivateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  user.status = 'active';
  await user.save({ validateBeforeSave: false });

  // TODO: Send reactivation notification email

  res.status(200).json({
    success: true,
    message: 'User reactivated successfully'
  });
});

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getUserStats,
  uploadProfileImage,
  getWriterApplications,
  approveWriter,
  rejectWriter,
  getWriterPerformance,
  updateWriterLevel,
  suspendUser,
  reactivateUser
};
