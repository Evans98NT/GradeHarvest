const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const authenticate = async (req, res, next) => {
  try {
    let token;
    
    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    // Get token from cookies
    if (!token && req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.'
      });
    }
    
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Get user from database
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Token is not valid. User not found.'
        });
      }
      
      // Check if user is active
      if (user.status !== 'active') {
        return res.status(401).json({
          success: false,
          message: 'Account is not active. Please contact support.'
        });
      }
      
      // Check if admin user is locked
      if (user.role !== 'client' && user.isLocked && user.isLocked()) {
        return res.status(423).json({
          success: false,
          message: 'Account is temporarily locked due to multiple failed login attempts.'
        });
      }
      
      req.user = user;
      next();
      
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid.'
      });
    }
    
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

// Role-based authorization
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please authenticate first.'
      });
    }
    
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${roles.join(', ')}`
      });
    }
    
    next();
  };
};

// Permission-based authorization for admin users
const authorizePermission = (...permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Please authenticate first.'
      });
    }
    
    // Check if user has admin profile with permissions
    if (!req.user.adminProfile || !req.user.adminProfile.permissions) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin permissions required.'
      });
    }
    
    // Check if user has any of the required permissions
    const hasPermission = permissions.some(permission => 
      req.user.adminProfile.permissions.includes(permission)
    );
    
    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required permissions: ${permissions.join(', ')}`
      });
    }
    
    next();
  };
};

// Writer verification check
const requireVerifiedWriter = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please authenticate first.'
    });
  }
  
  if (req.user.role !== 'writer') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Writer role required.'
    });
  }
  
  if (!req.user.writerProfile || !req.user.writerProfile.isVerified) {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Writer verification required.'
    });
  }
  
  next();
};

// Order ownership check
const requireOrderOwnership = async (req, res, next) => {
  try {
    const Order = require('../models/Order');
    const orderId = req.params.orderId || req.params.id;
    
    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required.'
      });
    }
    
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }
    
    // Check ownership based on user role
    let hasAccess = false;
    
    switch (req.user.role) {
      case 'client':
        hasAccess = order.client.toString() === req.user._id.toString();
        break;
      case 'writer':
        hasAccess = order.writer && order.writer.toString() === req.user._id.toString();
        break;
      case 'manager':
      case 'support':
      case 'tech':
        hasAccess = true; // Admin roles have access to all orders
        break;
      default:
        hasAccess = false;
    }
    
    if (!hasAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to access this order.'
      });
    }
    
    req.order = order;
    next();
    
  } catch (error) {
    console.error('Order ownership check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authorization check'
    });
  }
};

// Message conversation access check
const requireConversationAccess = async (req, res, next) => {
  try {
    const Message = require('../models/Message');
    const conversationId = req.params.conversationId;
    
    if (!conversationId) {
      return res.status(400).json({
        success: false,
        message: 'Conversation ID is required.'
      });
    }
    
    // Get a sample message from the conversation to check participants
    const sampleMessage = await Message.findOne({ conversationId });
    
    if (!sampleMessage) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found.'
      });
    }
    
    // Check if user is a participant in the conversation
    const userId = req.user._id.toString();
    const isParticipant = 
      sampleMessage.sender.toString() === userId || 
      sampleMessage.recipient.toString() === userId;
    
    // Admin roles can access all conversations
    const isAdmin = ['manager', 'support', 'tech'].includes(req.user.role);
    
    if (!isParticipant && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not have permission to access this conversation.'
      });
    }
    
    next();
    
  } catch (error) {
    console.error('Conversation access check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during authorization check'
    });
  }
};

// Rate limiting for sensitive operations
const rateLimitSensitive = (maxAttempts = 5, windowMs = 15 * 60 * 1000) => {
  const attempts = new Map();
  
  return (req, res, next) => {
    const key = req.ip + (req.user ? req.user._id : '');
    const now = Date.now();
    
    // Clean old attempts
    for (const [k, v] of attempts.entries()) {
      if (now - v.timestamp > windowMs) {
        attempts.delete(k);
      }
    }
    
    const userAttempts = attempts.get(key) || { count: 0, timestamp: now };
    
    if (userAttempts.count >= maxAttempts) {
      return res.status(429).json({
        success: false,
        message: 'Too many attempts. Please try again later.'
      });
    }
    
    userAttempts.count++;
    userAttempts.timestamp = now;
    attempts.set(key, userAttempts);
    
    next();
  };
};

// Email verification required
const requireEmailVerification = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please authenticate first.'
    });
  }
  
  if (!req.user.isEmailVerified) {
    return res.status(403).json({
      success: false,
      message: 'Email verification required. Please verify your email address.'
    });
  }
  
  next();
};

// Optional authentication (for public endpoints that can benefit from user context)
const optionalAuth = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token && req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        
        if (user && user.status === 'active') {
          req.user = user;
        }
      } catch (error) {
        // Token is invalid, but that's okay for optional auth
        console.log('Optional auth: Invalid token');
      }
    }
    
    next();
  } catch (error) {
    console.error('Optional authentication error:', error);
    next(); // Continue even if there's an error
  }
};

// Check if user can access writer features
const canAccessWriterFeatures = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. Please authenticate first.'
    });
  }
  
  if (req.user.role !== 'writer') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Writer role required.'
    });
  }
  
  // Allow access even if not verified, but with limited functionality
  next();
};

module.exports = {
  authenticate,
  authorize,
  authorizePermission,
  requireVerifiedWriter,
  requireOrderOwnership,
  requireConversationAccess,
  rateLimitSensitive,
  requireEmailVerification,
  optionalAuth,
  canAccessWriterFeatures
};
