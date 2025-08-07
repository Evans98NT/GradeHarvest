const mongoose = require('mongoose');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

async function createUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://admin:%40Ngash6104@gradeharvest.gvcnvhi.mongodb.net/?retryWrites=true&w=majority&appName=gradeharvestDB_NAME=gradeharvest', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const email = 'annnjokiwanyoike@gmail.com';
    const password = 'Love@Ngash123';

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User with this email already exists.');
      return;
    }

    // Create user with placeholder required fields
    const user = new User({
      firstName: 'Anna',
      lastName: 'Wanyoike',
      email,
      password,
      country: 'Kenya',
      role: 'writer',
      status: 'active',
      isEmailVerified: true
    });

    await user.save();

    console.log('User created successfully:', user);
    process.exit(0);
  } catch (error) {
    console.error('Error creating user:', error);
    process.exit(1);
  }
}

createUser();
