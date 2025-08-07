const { body, param, query, validationResult } = require('express-validator');
const mongoose = require('mongoose');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.path || error.param,
      message: error.msg,
      value: error.value
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages
    });
  }
  
  next();
};

// User registration validation
const validateUserRegistration = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
    
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
    
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
    
  body('country')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Country is required'),
    
  body('role')
    .optional()
    .isIn(['client', 'writer'])
    .withMessage('Role must be either client or writer'),
    
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
    
  handleValidationErrors
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
    
  handleValidationErrors
];

// Order creation validation
const validateOrderCreation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
    
  body('subject')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Subject is required'),
    
  body('academicLevel')
    .isIn(['high-school', 'undergraduate', 'masters', 'phd', 'professional'])
    .withMessage('Invalid academic level'),
    
  body('paperType')
    .isIn([
      'essay', 'research-paper', 'thesis', 'dissertation', 'case-study',
      'book-review', 'lab-report', 'presentation', 'coursework', 'assignment',
      'term-paper', 'article', 'report', 'other'
    ])
    .withMessage('Invalid paper type'),
    
  body('instructions')
    .trim()
    .isLength({ min: 10, max: 5000 })
    .withMessage('Instructions must be between 10 and 5000 characters'),
    
  body('wordCount')
    .isInt({ min: 250, max: 50000 })
    .withMessage('Word count must be between 250 and 50,000'),
    
  body('deadline')
    .isISO8601()
    .toDate()
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Deadline must be in the future');
      }
      return true;
    }),
    
  body('urgency')
    .isIn(['24-hours', '3-days', '7-days', '14-days', '30-days', 'custom'])
    .withMessage('Invalid urgency level'),
    
  body('requirements.sources')
    .optional()
    .isInt({ min: 0, max: 100 })
    .withMessage('Number of sources must be between 0 and 100'),
    
  body('requirements.citationStyle')
    .optional()
    .isIn(['APA', 'MLA', 'Chicago', 'Harvard', 'IEEE', 'Vancouver', 'Other'])
    .withMessage('Invalid citation style'),
    
  body('requirements.spacing')
    .optional()
    .isIn(['single', 'double', '1.5'])
    .withMessage('Invalid spacing option'),
    
  handleValidationErrors
];

// Message validation
const validateMessage = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message content must be between 1 and 2000 characters'),
    
  body('recipient')
    .isMongoId()
    .withMessage('Invalid recipient ID'),
    
  body('conversationType')
    .isIn(['client-writer', 'client-support', 'writer-support', 'admin-user'])
    .withMessage('Invalid conversation type'),
    
  body('orderId')
    .optional()
    .isMongoId()
    .withMessage('Invalid order ID'),
    
  handleValidationErrors
];

// Payment validation
const validatePayment = [
  body('amount')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
    
  body('currency')
    .isIn(['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'CNY'])
    .withMessage('Invalid currency'),
    
  body('paymentMethod.type')
    .isIn(['stripe', 'paypal', 'mpesa', 'payoneer', 'bank_transfer', 'apple_pay', 'google_pay', 'alipay', 'wechat_pay', 'afterpay', 'interac'])
    .withMessage('Invalid payment method'),
    
  body('orderId')
    .optional()
    .isMongoId()
    .withMessage('Invalid order ID'),
    
  handleValidationErrors
];

// Writer profile validation
const validateWriterProfile = [
  body('education')
    .optional()
    .isArray()
    .withMessage('Education must be an array'),
    
  body('education.*.degree')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Degree name must be between 2 and 100 characters'),
    
  body('education.*.institution')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Institution name must be between 2 and 200 characters'),
    
  body('education.*.year')
    .optional()
    .isInt({ min: 1950, max: new Date().getFullYear() + 10 })
    .withMessage('Invalid graduation year'),
    
  body('subjects')
    .optional()
    .isArray({ min: 1, max: 20 })
    .withMessage('Please select 1-20 subjects'),
    
  body('subjects.*')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Subject name must be between 2 and 100 characters'),
    
  body('academicLevels')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Please select at least one academic level'),
    
  body('academicLevels.*')
    .optional()
    .isIn(['high-school', 'undergraduate', 'masters', 'phd', 'professional'])
    .withMessage('Invalid academic level'),
    
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
    
  handleValidationErrors
];

// Password reset validation
const validatePasswordReset = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  handleValidationErrors
];

// New password validation
const validateNewPassword = [
  body('token')
    .notEmpty()
    .withMessage('Reset token is required'),
    
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
    
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    }),
    
  handleValidationErrors
];

// MongoDB ObjectId validation
const validateObjectId = (paramName) => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName}`),
    
  handleValidationErrors
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    
  query('sortBy')
    .optional()
    .isAlpha()
    .withMessage('Sort field must contain only letters'),
    
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc', '1', '-1'])
    .withMessage('Sort order must be asc, desc, 1, or -1'),
    
  handleValidationErrors
];

// File upload validation
const validateFileUpload = (allowedTypes = [], maxSize = 10 * 1024 * 1024) => {
  return (req, res, next) => {
    if (!req.file && !req.files) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }
    
    const files = req.files || [req.file];
    
    for (const file of files) {
      // Check file size
      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: `File size exceeds maximum limit of ${maxSize / (1024 * 1024)}MB`
        });
      }
      
      // Check file type
      if (allowedTypes.length > 0) {
        const fileExtension = file.originalname.split('.').pop().toLowerCase();
        if (!allowedTypes.includes(fileExtension)) {
          return res.status(400).json({
            success: false,
            message: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`
          });
        }
      }
    }
    
    next();
  };
};

// Rating validation
const validateRating = [
  body('score')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating score must be between 1 and 5'),
    
  body('review')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Review cannot exceed 1000 characters'),
    
  handleValidationErrors
];

// Search validation
const validateSearch = [
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),
    
  query('subject')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Subject filter must be between 1 and 100 characters'),
    
  query('academicLevel')
    .optional()
    .isIn(['high-school', 'undergraduate', 'masters', 'phd', 'professional'])
    .withMessage('Invalid academic level filter'),
    
  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),
    
  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),
    
  handleValidationErrors
];

// Admin user creation validation
const validateAdminUserCreation = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
    
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
    
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
    
  body('role')
    .isIn(['manager', 'support', 'accountant', 'tech'])
    .withMessage('Invalid admin role'),
    
  body('permissions')
    .isArray({ min: 1 })
    .withMessage('At least one permission must be assigned'),
    
  body('permissions.*')
    .isIn([
      'manage_users', 'manage_orders', 'manage_payments', 'manage_content',
      'view_analytics', 'manage_disputes', 'system_admin', 'financial_reports'
    ])
    .withMessage('Invalid permission'),
    
  body('department')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Department must be between 2 and 100 characters'),
    
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateUserRegistration,
  validateUserLogin,
  validateOrderCreation,
  validateMessage,
  validatePayment,
  validateWriterProfile,
  validatePasswordReset,
  validateNewPassword,
  validateObjectId,
  validatePagination,
  validateFileUpload,
  validateRating,
  validateSearch,
  validateAdminUserCreation
};
