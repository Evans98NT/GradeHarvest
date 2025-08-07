const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');
const { AppError } = require('../middleware/errorHandler');
const sendEmail = require('../utils/sendEmail');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d'
  });
};

// Send token response
const sendTokenResponse = (user, statusCode, res) => {
  console.log('🎫 [SERVER AUTH DEBUG] Generating tokens for user:', user._id);
  
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  };

  console.log('🍪 [SERVER AUTH DEBUG] Setting authentication cookies:', {
    tokenLength: token.length,
    refreshTokenLength: refreshToken.length,
    cookieOptions: {
      httpOnly: options.httpOnly,
      secure: options.secure,
      sameSite: options.sameSite,
      expires: options.expires
    }
  });

  // Remove password from output
  user.password = undefined;

  const responseData = {
    success: true,
    message: statusCode === 201 ? 'Registration successful' : 'Login successful',
    token,
    refreshToken,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status,
      isEmailVerified: user.isEmailVerified,
      profileImage: user.profileImage,
      createdAt: user.createdAt
    }
  };

  console.log('📤 [SERVER AUTH DEBUG] Sending response:', {
    statusCode,
    success: responseData.success,
    message: responseData.message,
    userInfo: {
      id: responseData.user.id,
      email: responseData.user.email,
      role: responseData.user.role,
      status: responseData.user.status
    }
  });

  res
    .status(statusCode)
    .cookie('token', token, options)
    .cookie('refreshToken', refreshToken, { ...options, expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) })
    .json(responseData);
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = asyncHandler(async (req, res, next) => {
  const { firstName, lastName, email, password, role, country, phone } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError('User with this email already exists', 400));
  }

  // Create user
  const user = await User.create({
    firstName,
    lastName,
    email,
    password,
    role: role || 'client',
    country,
    phone,
    status: 'pending' // Email verification required
  });

  // Generate email verification token
  const verificationToken = user.generateEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  // Send verification email
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    await sendEmail({
      email: user.email,
      subject: 'Email Verification - GradeHarvest',
      template: 'emailVerification',
      data: {
        name: user.firstName,
        verificationUrl
      }
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('Email could not be sent. Please try again.', 500));
  }
});

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // DEBUG: Enhanced login attempt logging
  console.group('🔐 [SERVER AUTH DEBUG] Login endpoint called');
  console.log('📅 Timestamp:', new Date().toISOString());
  console.log('📧 Email:', email);
  console.log('🔑 Password length:', password ? password.length : 0);
  console.log('🌐 IP Address:', req.ip);
  console.log('🖥️  User Agent:', req.get('User-Agent'));
  console.log('📍 Request Details:', {
    method: req.method,
    path: req.path,
    fullUrl: req.originalUrl,
    headers: {
      'content-type': req.get('Content-Type'),
      'authorization': req.get('Authorization') ? 'Present' : 'Missing',
      'origin': req.get('Origin'),
      'referer': req.get('Referer')
    }
  });
  console.groupEnd();

  // DEBUG: Database query attempt
  console.log('🔍 [SERVER AUTH DEBUG] Searching for user in database...');
  
  // Find user and include password
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    console.log('❌ [SERVER AUTH DEBUG] User not found:', { email, timestamp: new Date().toISOString() });
    return next(new AppError('Invalid credentials', 401));
  }

  console.log('✅ [SERVER AUTH DEBUG] User found:', {
    userId: user._id,
    email: user.email,
    role: user.role,
    status: user.status,
    isEmailVerified: user.isEmailVerified,
    lastLogin: user.lastLogin
  });

  // DEBUG: Password verification
  console.log('🔐 [SERVER AUTH DEBUG] Verifying password...');
  
  // Check password
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    console.log('❌ [SERVER AUTH DEBUG] Password verification failed:', {
      userId: user._id,
      email: user.email,
      timestamp: new Date().toISOString()
    });
    
    // Increment login attempts for admin users
    if (user.role !== 'client' && user.role !== 'writer') {
      await user.incLoginAttempts();
      console.log('⚠️ [SERVER AUTH DEBUG] Login attempts incremented for admin user');
    }
    return next(new AppError('Invalid credentials', 401));
  }

  console.log('✅ [SERVER AUTH DEBUG] Password verification successful');

  // DEBUG: Account status check
  console.log('🔍 [SERVER AUTH DEBUG] Checking account status...');
  
  // Check if account is active
  if (user.status !== 'active') {
    console.log('❌ [SERVER AUTH DEBUG] Account not active:', {
      userId: user._id,
      email: user.email,
      status: user.status,
      timestamp: new Date().toISOString()
    });
    
    let message = 'Account is not active.';
    switch (user.status) {
      case 'pending':
        message = 'Please verify your email address to activate your account.';
        break;
      case 'suspended':
        message = 'Your account has been suspended. Please contact support.';
        break;
      case 'rejected':
        message = 'Your account application was rejected. Please contact support.';
        break;
    }
    return next(new AppError(message, 401));
  }

  console.log('✅ [SERVER AUTH DEBUG] Account status is active');

  // DEBUG: Lock status check for admin users
  if (user.role !== 'client' && user.role !== 'writer') {
    console.log('🔍 [SERVER AUTH DEBUG] Checking admin user lock status...');
    
    if (user.isLocked()) {
      console.log('❌ [SERVER AUTH DEBUG] Admin account is locked:', {
        userId: user._id,
        email: user.email,
        timestamp: new Date().toISOString()
      });
      return next(new AppError('Account is temporarily locked due to multiple failed login attempts.', 423));
    }
    
    console.log('✅ [SERVER AUTH DEBUG] Admin account is not locked');
    
    // Reset login attempts for successful login
    await user.resetLoginAttempts();
    console.log('🔄 [SERVER AUTH DEBUG] Login attempts reset for admin user');
  }

  // DEBUG: Updating user login data
  console.log('🔄 [SERVER AUTH DEBUG] Updating user login data...');
  
  // Update last login
  user.lastLogin = new Date();
  
  // Add to login history
  user.loginHistory.push({
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // Keep only last 10 login records
  if (user.loginHistory.length > 10) {
    user.loginHistory = user.loginHistory.slice(-10);
  }

  await user.save({ validateBeforeSave: false });

  console.log('✅ [SERVER AUTH DEBUG] User login data updated successfully');

  // DEBUG: Token generation
  console.log('🎫 [SERVER AUTH DEBUG] Generating authentication tokens...');

  // DEBUG: Final success log
  console.group('🎉 [SERVER AUTH DEBUG] Login successful');
  console.log('📅 Timestamp:', new Date().toISOString());
  console.log('👤 User ID:', user._id);
  console.log('📧 Email:', user.email);
  console.log('👥 Role:', user.role);
  console.log('📊 Status:', user.status);
  console.log('🕐 Last Login:', user.lastLogin);
  console.log('📱 Login History Count:', user.loginHistory.length);
  console.groupEnd();

  sendTokenResponse(user, 200, res);
});

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
const logout = asyncHandler(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.cookie('refreshToken', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully'
  });
});

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    user
  });
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    bio: req.body.bio,
    timezone: req.body.timezone
  };

  // Remove undefined fields
  Object.keys(fieldsToUpdate).forEach(key => 
    fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
  );

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    user
  });
});

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Current password is incorrect', 400));
  }

  user.password = newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Forgot password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('No user found with that email address', 404));
  }

  // Generate reset token
  const resetToken = user.generatePasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password Reset - GradeHarvest',
      template: 'passwordReset',
      data: {
        name: user.firstName,
        resetUrl
      }
    });

    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('Email could not be sent', 500));
  }
});

// @desc    Reset password
// @route   PUT /api/auth/reset-password/:resettoken
// @access  Public
const resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: resetPasswordToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Invalid or expired reset token', 400));
  }

  // Set new password
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const emailVerificationToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    emailVerificationToken,
    emailVerificationExpires: { $gt: Date.now() }
  });

  if (!user) {
    return next(new AppError('Invalid or expired verification token', 400));
  }

  // Verify email
  user.isEmailVerified = true;
  user.status = 'active';
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Email verified successfully'
  });
});

// @desc    Resend email verification
// @route   POST /api/auth/resend-verification
// @access  Public
const resendVerification = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('No user found with that email address', 404));
  }

  if (user.isEmailVerified) {
    return next(new AppError('Email is already verified', 400));
  }

  // Generate new verification token
  const verificationToken = user.generateEmailVerificationToken();
  await user.save({ validateBeforeSave: false });

  // Send verification email
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
    
    await sendEmail({
      email: user.email,
      subject: 'Email Verification - GradeHarvest',
      template: 'emailVerification',
      data: {
        name: user.firstName,
        verificationUrl
      }
    });

    res.status(200).json({
      success: true,
      message: 'Verification email sent'
    });
  } catch (error) {
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError('Email could not be sent', 500));
  }
});

// @desc    Refresh token
// @route   POST /api/auth/refresh-token
// @access  Public
const refreshToken = asyncHandler(async (req, res, next) => {
  let refreshToken;

  // Get refresh token from cookies or body
  if (req.cookies.refreshToken) {
    refreshToken = req.cookies.refreshToken;
  } else if (req.body.refreshToken) {
    refreshToken = req.body.refreshToken;
  }

  if (!refreshToken) {
    return next(new AppError('Refresh token not provided', 401));
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    // Get user
    const user = await User.findById(decoded.id);
    
    if (!user || user.status !== 'active') {
      return next(new AppError('Invalid refresh token', 401));
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    return next(new AppError('Invalid refresh token', 401));
  }
});

// @desc    Delete account
// @route   DELETE /api/auth/account
// @access  Private
const deleteAccount = asyncHandler(async (req, res, next) => {
  const { password } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  // Verify password
  if (!(await user.comparePassword(password))) {
    return next(new AppError('Password is incorrect', 400));
  }

  // Soft delete - change status to inactive
  user.status = 'inactive';
  user.email = `deleted_${Date.now()}_${user.email}`;
  await user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
    message: 'Account deleted successfully'
  });
});

module.exports = {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  refreshToken,
  deleteAccount
};
