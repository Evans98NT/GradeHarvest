const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');

// Rate limiting configurations
const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message
    },
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        success: false,
        message,
        retryAfter: Math.round(windowMs / 1000)
      });
    }
  });
};

// General rate limiting
const generalLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many requests from this IP, please try again later.'
);

// Strict rate limiting for authentication endpoints
const authLimiter = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  20, // limit each IP to 20 requests per windowMs (increased from 5)
  'Too many authentication attempts, please try again later.'
);

// Rate limiting for password reset
const passwordResetLimiter = createRateLimit(
  60 * 60 * 1000, // 1 hour
  3, // limit each IP to 3 password reset requests per hour
  'Too many password reset attempts, please try again later.'
);

// Rate limiting for file uploads
const uploadLimiter = createRateLimit(
  60 * 60 * 1000, // 1 hour
  20, // limit each IP to 20 uploads per hour
  'Too many file uploads, please try again later.'
);

// Rate limiting for messaging
const messageLimiter = createRateLimit(
  60 * 1000, // 1 minute
  30, // limit each IP to 30 messages per minute
  'Too many messages sent, please slow down.'
);

// Rate limiting for order creation
const orderLimiter = createRateLimit(
  60 * 60 * 1000, // 1 hour
  10, // limit each IP to 10 orders per hour
  'Too many orders created, please try again later.'
);

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Debug logging for CORS requests
    console.group('🌐 [CORS DEBUG] Origin check');
    console.log('📅 Timestamp:', new Date().toISOString());
    console.log('🔗 Request Origin:', origin || 'No Origin header');
    console.log('🌍 NODE_ENV:', process.env.NODE_ENV);
    console.log('🏠 FRONTEND_URL from env:', process.env.FRONTEND_URL);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('✅ [CORS DEBUG] No origin header - allowing request');
      console.groupEnd();
      return callback(null, true);
    }
    
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000', // Explicitly allow React dev server
      'http://localhost:5000', // Allow server origin for proxy requests (without trailing slash)
      'http://localhost:5000/', // Allow server origin for proxy requests (with trailing slash)
      'http://localhost:3001',
      'https://gradeharvest.com',
      'https://www.gradeharvest.com'
    ];
    
    console.log('📋 Allowed Origins:', allowedOrigins);
    console.log('🔍 Checking if origin is allowed...');
    
    // Normalize origin by removing trailing slash for comparison
    const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
    const normalizedAllowedOrigins = allowedOrigins.map(o => o.endsWith('/') ? o.slice(0, -1) : o);
    
    console.log('🔄 Normalized origin:', normalizedOrigin);
    console.log('🔄 Normalized allowed origins:', normalizedAllowedOrigins);
    
    if (allowedOrigins.indexOf(origin) !== -1 || normalizedAllowedOrigins.indexOf(normalizedOrigin) !== -1) {
      console.log('✅ [CORS DEBUG] Origin allowed - request permitted');
      console.groupEnd();
      callback(null, true);
    } else {
      console.log('❌ [CORS DEBUG] Origin NOT allowed - request blocked');
      console.log('🚫 Blocked origin:', origin);
      console.log('📝 Available origins:', allowedOrigins);
      console.groupEnd();
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma'
  ],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count']
};

// Security headers configuration
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.stripe.com"],
      frameSrc: ["'self'", "https://js.stripe.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: false,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

// Input sanitization middleware
const sanitizeInput = (req, res, next) => {
  // Remove any potential HTML/script tags from string inputs
  const sanitizeValue = (value) => {
    if (typeof value === 'string') {
      return value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<[^>]*>/g, '')
        .trim();
    }
    return value;
  };

  const sanitizeObject = (obj) => {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        } else {
          obj[key] = sanitizeValue(obj[key]);
        }
      }
    }
  };

  if (req.body) sanitizeObject(req.body);
  if (req.query) sanitizeObject(req.query);
  if (req.params) sanitizeObject(req.params);

  next();
};

// IP whitelist middleware (for admin endpoints)
const ipWhitelist = (allowedIPs = []) => {
  return (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress || req.socket.remoteAddress;
    
    // If no whitelist is provided, allow all IPs
    if (allowedIPs.length === 0) {
      return next();
    }
    
    // Check if client IP is in the whitelist
    if (allowedIPs.includes(clientIP)) {
      return next();
    }
    
    return res.status(403).json({
      success: false,
      message: 'Access denied from this IP address'
    });
  };
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Log request
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - IP: ${req.ip}`);
  
  // Log response time
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  // Remove powered by header
  res.removeHeader('X-Powered-By');
  
  // Add custom security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  next();
};

// File upload security
const fileUploadSecurity = (req, res, next) => {
  if (req.file || req.files) {
    const files = req.files || [req.file];
    
    for (const file of files) {
      // Check for executable file extensions
      const dangerousExtensions = [
        'exe', 'bat', 'cmd', 'com', 'pif', 'scr', 'vbs', 'js', 'jar',
        'php', 'asp', 'aspx', 'jsp', 'py', 'rb', 'pl', 'sh'
      ];
      
      const fileExtension = file.originalname.split('.').pop().toLowerCase();
      
      if (dangerousExtensions.includes(fileExtension)) {
        return res.status(400).json({
          success: false,
          message: 'File type not allowed for security reasons'
        });
      }
      
      // Check file size (additional check)
      const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024; // 10MB default
      if (file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: `File size exceeds maximum limit of ${maxSize / (1024 * 1024)}MB`
        });
      }
    }
  }
  
  next();
};

// API key validation middleware (for external API integrations)
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: 'API key is required'
    });
  }
  
  // In production, you would validate against a database of valid API keys
  const validApiKeys = process.env.VALID_API_KEYS ? process.env.VALID_API_KEYS.split(',') : [];
  
  if (validApiKeys.length > 0 && !validApiKeys.includes(apiKey)) {
    return res.status(401).json({
      success: false,
      message: 'Invalid API key'
    });
  }
  
  next();
};

// Compression middleware configuration
const compressionConfig = compression({
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  },
  threshold: 1024 // Only compress responses larger than 1KB
});

// User agent validation (block suspicious user agents)
const validateUserAgent = (req, res, next) => {
  const userAgent = req.headers['user-agent'];
  
  if (!userAgent) {
    return res.status(400).json({
      success: false,
      message: 'User agent is required'
    });
  }
  
  // Block known malicious user agents
  const blockedUserAgents = [
    'sqlmap',
    'nikto',
    'nmap',
    'masscan',
    'zap',
    'burp'
  ];
  
  const lowerUserAgent = userAgent.toLowerCase();
  for (const blocked of blockedUserAgents) {
    if (lowerUserAgent.includes(blocked)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
  }
  
  next();
};

// Honeypot middleware (trap for bots)
const honeypot = (req, res, next) => {
  // Check for honeypot field in forms
  if (req.body && req.body.honeypot) {
    // If honeypot field is filled, it's likely a bot
    return res.status(400).json({
      success: false,
      message: 'Invalid request'
    });
  }
  
  next();
};

module.exports = {
  generalLimiter,
  authLimiter,
  passwordResetLimiter,
  uploadLimiter,
  messageLimiter,
  orderLimiter,
  corsOptions,
  helmetConfig,
  sanitizeInput,
  ipWhitelist,
  requestLogger,
  securityHeaders,
  fileUploadSecurity,
  validateApiKey,
  compressionConfig,
  validateUserAgent,
  honeypot
};
