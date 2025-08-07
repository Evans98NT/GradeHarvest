const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Check if MONGODB_URI is provided
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }

    // Check if the URI still contains placeholder
    if (process.env.MONGODB_URI.includes('<db_password>')) {
      throw new Error('Please replace <db_password> in MONGODB_URI with your actual MongoDB Atlas password');
    }

    console.log('Connecting to MongoDB Atlas...');
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`✅ MongoDB Connected Successfully!`);
    console.log(`📍 Host: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('✅ MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    
    // Provide helpful error messages
    if (error.message.includes('authentication failed')) {
      console.log('💡 Tip: Check your MongoDB Atlas username and password');
    } else if (error.message.includes('network')) {
      console.log('💡 Tip: Check your internet connection and MongoDB Atlas network access settings');
    } else if (error.message.includes('<db_password>')) {
      console.log('💡 Tip: Replace <db_password> in your .env file with your actual password');
    }
    
    console.log('🔧 Please check the FIX_DATABASE_CONNECTION.md file for detailed instructions');
    console.log('⏳ Continuing without database connection for testing...');
    
    // Don't exit process to allow testing of other features
    // process.exit(1);
  }
};

module.exports = connectDB;
