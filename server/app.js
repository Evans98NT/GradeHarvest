const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import middleware
const { globalErrorHandler, notFound } = require('./middleware/errorHandler');
const {
  corsOptions,
  helmetConfig,
  sanitizeInput,
  requestLogger,
  securityHeaders,
  compressionConfig,
  validateUserAgent,
  generalLimiter
} = require('./middleware/security');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const orderRoutes = require('./routes/orders');
const messageRoutes = require('./routes/messages');
const paymentRoutes = require('./routes/payments');
const notificationRoutes = require('./routes/notifications');
const writerApplicationRoutes = require('./routes/writerApplications');

// Import database connection
const connectDB = require('./config/database');

// Create Express app
const app = express();

// Trust proxy (for accurate IP addresses behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet(helmetConfig));
app.use(securityHeaders);
app.use(validateUserAgent);

// CORS
app.use(cors(corsOptions));

// Compression
app.use(compressionConfig);

// Rate limiting
app.use('/api/', generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Request logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}
app.use(requestLogger);

// Input sanitization
app.use(sanitizeInput);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GradeHarvest API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/writer-applications', writerApplicationRoutes);

// Serve static files (uploaded files)
app.use('/uploads', express.static('uploads'));

// API documentation endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GradeHarvest API v1.0.0',
    documentation: {
      auth: '/api/auth - Authentication endpoints',
      users: '/api/users - User management endpoints',
      orders: '/api/orders - Order management endpoints',
      messages: '/api/messages - Messaging endpoints',
      payments: '/api/payments - Payment processing endpoints',
      notifications: '/api/notifications - Notification endpoints',
      writerApplications: '/api/writer-applications - Writer application endpoints'
    },
    endpoints: {
      health: '/health - Health check',
      uploads: '/uploads - Static file serving'
    }
  });
});

// 404 handler for undefined routes
app.use(notFound);

// Global error handler
app.use(globalErrorHandler);

// Connect to database and start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    
    // Start server
    const server = app.listen(PORT, () => {
      console.log(`
🚀 GradeHarvest API Server Started Successfully!
📍 Environment: ${process.env.NODE_ENV || 'development'}
🌐 Server running on port ${PORT}
📊 Health check: http://localhost:${PORT}/health
📚 API docs: http://localhost:${PORT}/api
🔗 Database: Connected to MongoDB
⏰ Started at: ${new Date().toISOString()}
      `);
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Process terminated');
        mongoose.connection.close();
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received. Shutting down gracefully...');
      server.close(() => {
        console.log('Process terminated');
        mongoose.connection.close();
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer();

module.exports = app;
