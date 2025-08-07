# MongoDB Setup Guide for GradeHarvest

## Option 1: Install MongoDB Locally (Recommended for Development)

### Windows Installation:
1. **Download MongoDB Community Server:**
   - Go to https://www.mongodb.com/try/download/community
   - Select Windows, Version 7.0+, Package: msi
   - Download and run the installer

2. **Install MongoDB:**
   - Run the downloaded .msi file
   - Choose "Complete" installation
   - Install MongoDB as a Service (recommended)
   - Install MongoDB Compass (GUI tool)

3. **Start MongoDB Service:**
   ```cmd
   # Start MongoDB service
   net start MongoDB
   
   # Or start manually
   mongod --dbpath "C:\data\db"
   ```

4. **Verify Installation:**
   ```cmd
   # Open MongoDB shell
   mongosh
   
   # Test connection
   show dbs
   ```

### Alternative: MongoDB with Docker
```bash
# Pull MongoDB image
docker pull mongo:latest

# Run MongoDB container
docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME=admin -e MONGO_INITDB_ROOT_PASSWORD=password mongo:latest

# Connect to MongoDB
docker exec -it mongodb mongosh
```

## Option 2: Use MongoDB Atlas (Cloud Database)

### Setup MongoDB Atlas:
1. **Create Account:**
   - Go to https://www.mongodb.com/atlas
   - Sign up for free account

2. **Create Cluster:**
   - Choose "Build a Database"
   - Select "M0 Sandbox" (Free tier)
   - Choose cloud provider and region
   - Create cluster

3. **Setup Database Access:**
   - Go to "Database Access"
   - Add new database user
   - Choose username/password authentication
   - Grant "Read and write to any database" privileges

4. **Setup Network Access:**
   - Go to "Network Access"
   - Add IP Address
   - Choose "Allow access from anywhere" (0.0.0.0/0) for development

5. **Get Connection String:**
   - Go to "Databases"
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

6. **Update .env file:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gradeharvest?retryWrites=true&w=majority
   ```

## Option 3: Use MongoDB Memory Server (For Testing)

### Install MongoDB Memory Server:
```bash
npm install --save-dev mongodb-memory-server
```

### Update database config for testing:
```javascript
// server/config/database.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;
    
    // Use in-memory database for testing if no URI provided
    if (!mongoUri || process.env.NODE_ENV === 'test') {
      mongoServer = await MongoMemoryServer.create();
      mongoUri = mongoServer.getUri();
      console.log('Using MongoDB Memory Server for testing');
    }

    const conn = await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      if (mongoServer) {
        await mongoServer.stop();
      }
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.log('Continuing without database connection for testing...');
  }
};

module.exports = connectDB;
```

## Quick Fix: Update .env File

### Current .env Configuration:
Check your `.env` file and ensure it has:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/gradeharvest

# Or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/gradeharvest?retryWrites=true&w=majority

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d

# Email Configuration (Optional for now)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_NAME=GradeHarvest
FROM_EMAIL=noreply@gradeharvest.com
```

## Recommended Next Steps:

1. **For Quick Testing:** Use Option 3 (MongoDB Memory Server)
2. **For Development:** Use Option 1 (Local MongoDB installation)
3. **For Production:** Use Option 2 (MongoDB Atlas)

Choose the option that best fits your needs and follow the setup instructions above.
