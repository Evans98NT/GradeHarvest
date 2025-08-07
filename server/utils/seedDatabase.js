const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Order = require('../models/Order');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);
  }
};

// Sample data
const sampleUsers = [
  // Admin Users
  {
    firstName: 'John',
    lastName: 'Manager',
    email: 'manager@gradeharvest.com',
    password: 'Manager123!',
    role: 'manager',
    status: 'active',
    isEmailVerified: true,
    country: 'USA',
    adminProfile: {
      department: 'Management',
      permissions: ['manage_users', 'manage_orders', 'manage_payments', 'manage_content', 'view_analytics', 'manage_disputes', 'system_admin', 'financial_reports']
    }
  },
  {
    firstName: 'Sarah',
    lastName: 'Support',
    email: 'support@gradeharvest.com',
    password: 'Support123!',
    role: 'support',
    status: 'active',
    isEmailVerified: true,
    country: 'USA',
    adminProfile: {
      department: 'Customer Support',
      permissions: ['manage_disputes', 'view_analytics']
    }
  },
  {
    firstName: 'Mike',
    lastName: 'Accountant',
    email: 'accountant@gradeharvest.com',
    password: 'Account123!',
    role: 'accountant',
    status: 'active',
    isEmailVerified: true,
    country: 'USA',
    adminProfile: {
      department: 'Finance',
      permissions: ['manage_payments', 'financial_reports']
    }
  },
  {
    firstName: 'Tech',
    lastName: 'Admin',
    email: 'tech@gradeharvest.com',
    password: 'TechAdmin123!',
    role: 'tech',
    status: 'active',
    isEmailVerified: true,
    country: 'USA',
    adminProfile: {
      department: 'Technology',
      permissions: ['system_admin', 'manage_content', 'view_analytics']
    }
  },

  // Sample Writers
  {
    firstName: 'Emily',
    lastName: 'Johnson',
    email: 'emily.writer@example.com',
    password: 'Writer123!',
    role: 'writer',
    status: 'active',
    isEmailVerified: true,
    country: 'Kenya',
    bio: 'Experienced academic writer with expertise in business and economics.',
    writerProfile: {
      education: [{
        degree: 'Masters in Business Administration',
        institution: 'University of Nairobi',
        year: 2020,
        field: 'Business Administration'
      }],
      subjects: ['Business', 'Economics', 'Management', 'Finance'],
      academicLevels: ['undergraduate', 'masters'],
      level: 'advanced',
      isVerified: true,
      verificationDate: new Date(),
      stats: {
        totalOrders: 45,
        completedOrders: 42,
        onTimeDeliveries: 40,
        averageRating: 4.8,
        totalRevisions: 8,
        plagiarismScore: 2,
        aiContentScore: 5
      },
      isAvailable: true,
      paymentMethods: [{
        type: 'mpesa',
        details: { phoneNumber: '254712345678' },
        isDefault: true
      }]
    }
  },
  {
    firstName: 'David',
    lastName: 'Smith',
    email: 'david.writer@example.com',
    password: 'Writer123!',
    role: 'writer',
    status: 'active',
    isEmailVerified: true,
    country: 'USA',
    bio: 'PhD holder specializing in computer science and technology research.',
    writerProfile: {
      education: [{
        degree: 'PhD in Computer Science',
        institution: 'MIT',
        year: 2019,
        field: 'Computer Science'
      }],
      subjects: ['Computer Science', 'Technology', 'Programming', 'Data Science'],
      academicLevels: ['undergraduate', 'masters', 'phd'],
      level: 'premium',
      isVerified: true,
      verificationDate: new Date(),
      stats: {
        totalOrders: 78,
        completedOrders: 75,
        onTimeDeliveries: 73,
        averageRating: 4.9,
        totalRevisions: 12,
        plagiarismScore: 1,
        aiContentScore: 3
      },
      isAvailable: true,
      paymentMethods: [{
        type: 'paypal',
        details: { email: 'david.writer@paypal.com' },
        isDefault: true
      }]
    }
  },
  {
    firstName: 'Maria',
    lastName: 'Garcia',
    email: 'maria.writer@example.com',
    password: 'Writer123!',
    role: 'writer',
    status: 'active',
    isEmailVerified: true,
    country: 'Spain',
    bio: 'Literature and language expert with focus on English and Spanish writing.',
    writerProfile: {
      education: [{
        degree: 'Masters in English Literature',
        institution: 'Universidad Complutense Madrid',
        year: 2021,
        field: 'English Literature'
      }],
      subjects: ['English Literature', 'Spanish', 'Creative Writing', 'Linguistics'],
      academicLevels: ['high-school', 'undergraduate', 'masters'],
      level: 'intermediate',
      isVerified: true,
      verificationDate: new Date(),
      stats: {
        totalOrders: 23,
        completedOrders: 22,
        onTimeDeliveries: 21,
        averageRating: 4.6,
        totalRevisions: 5,
        plagiarismScore: 3,
        aiContentScore: 4
      },
      isAvailable: true,
      paymentMethods: [{
        type: 'payoneer',
        details: { email: 'maria.garcia@payoneer.com' },
        isDefault: true
      }]
    }
  },

  // Sample Clients
  {
    firstName: 'Alex',
    lastName: 'Johnson',
    email: 'alex.client@example.com',
    password: 'Client123!',
    role: 'client',
    status: 'active',
    isEmailVerified: true,
    country: 'USA',
    clientProfile: {
      institution: 'Harvard University',
      studentLevel: 'undergraduate',
      preferredSubjects: ['Business', 'Economics'],
      totalOrders: 5,
      totalSpent: 450.00
    }
  },
  {
    firstName: 'Lisa',
    lastName: 'Chen',
    email: 'lisa.client@example.com',
    password: 'Client123!',
    role: 'client',
    status: 'active',
    isEmailVerified: true,
    country: 'Canada',
    clientProfile: {
      institution: 'University of Toronto',
      studentLevel: 'masters',
      preferredSubjects: ['Computer Science', 'Data Science'],
      totalOrders: 3,
      totalSpent: 320.00
    }
  }
];

const sampleOrders = [
  {
    title: 'Business Strategy Analysis for Tech Startup',
    subject: 'Business',
    academicLevel: 'masters',
    paperType: 'case-study',
    instructions: 'Analyze the business strategy of a tech startup and provide recommendations for growth. Include market analysis, competitive landscape, and financial projections.',
    wordCount: 2000,
    pages: 8,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    urgency: '7-days',
    pricePerPage: 15.00,
    totalPrice: 120.00,
    currency: 'USD',
    status: 'pending',
    paymentStatus: 'pending',
    requirements: {
      sources: 10,
      citationStyle: 'APA',
      spacing: 'double'
    }
  },
  {
    title: 'Machine Learning Algorithms Comparison',
    subject: 'Computer Science',
    academicLevel: 'phd',
    paperType: 'research-paper',
    instructions: 'Compare different machine learning algorithms for image recognition tasks. Include implementation details, performance metrics, and analysis.',
    wordCount: 3500,
    pages: 14,
    deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    urgency: '14-days',
    pricePerPage: 25.00,
    totalPrice: 350.00,
    currency: 'USD',
    status: 'assigned',
    paymentStatus: 'paid',
    requirements: {
      sources: 20,
      citationStyle: 'IEEE',
      spacing: 'double'
    }
  },
  {
    title: 'Shakespeare\'s Influence on Modern Literature',
    subject: 'English Literature',
    academicLevel: 'undergraduate',
    paperType: 'essay',
    instructions: 'Discuss how Shakespeare\'s works continue to influence modern literature. Provide specific examples and analysis.',
    wordCount: 1500,
    pages: 6,
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    urgency: '7-days',
    pricePerPage: 12.00,
    totalPrice: 72.00,
    currency: 'USD',
    status: 'in-progress',
    paymentStatus: 'paid',
    requirements: {
      sources: 8,
      citationStyle: 'MLA',
      spacing: 'double'
    }
  },
  {
    title: 'Professional Resume Writing and Career Development Guide',
    subject: 'Career Development',
    academicLevel: 'undergraduate',
    paperType: 'report',
    instructions: 'Create a comprehensive guide on professional resume writing and career development. The guide should include different resume formats, tips for various career stages, and best practices for job applications. Please use the attached resume samples document as a reference and expand on the concepts presented. Include sections on modern resume trends, digital portfolios, and interview preparation strategies.',
    wordCount: 2500,
    pages: 10,
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    urgency: '14-days',
    pricePerPage: 18.00,
    totalPrice: 180.00,
    currency: 'USD',
    status: 'assigned',
    paymentStatus: 'paid',
    requirements: {
      sources: 15,
      citationStyle: 'APA',
      spacing: 'double'
    },
    attachments: [{
      filename: 'cv-1754052652328-934199226.pdf',
      originalName: 'Resume_Samples_Bellevue_University.pdf',
      path: 'server/uploads/documents/cv-1754052652328-934199226.pdf',
      size: 245760, // Approximate size in bytes
      mimetype: 'application/pdf',
      uploadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
    }],
    timeline: [
      {
        event: 'order_created',
        description: 'Order created by client',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        event: 'payment_completed',
        description: 'Payment successfully processed',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000) // 3 days ago + 30 minutes
      },
      {
        event: 'writer_assigned',
        description: 'Writer assigned to order',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    ]
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Order.deleteMany({});
    await Payment.deleteMany({});
    await Notification.deleteMany({});
    console.log('✅ Cleared existing data');

    // Create users
    const createdUsers = [];
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
    }
    console.log(`✅ Created ${createdUsers.length} users`);

    // Assign clients and writers to orders
    const clients = createdUsers.filter(user => user.role === 'client');
    const writers = createdUsers.filter(user => user.role === 'writer');

    // Create orders
    const createdOrders = [];
    for (let i = 0; i < sampleOrders.length; i++) {
      const orderData = {
        ...sampleOrders[i],
        client: clients[i % clients.length]._id,
        orderNumber: `GH${String(i + 1).padStart(6, '0')}` // Explicitly set order number
      };

      // Assign writer to some orders
      if (orderData.status !== 'pending') {
        orderData.writer = writers[i % writers.length]._id;
        orderData.assignedAt = new Date();
      }

      if (orderData.status === 'in-progress') {
        orderData.startedAt = new Date();
      }

      const order = new Order(orderData);
      await order.save();
      createdOrders.push(order);
    }
    console.log(`✅ Created ${createdOrders.length} orders`);

    // Create sample payments
    const paidOrders = createdOrders.filter(order => order.paymentStatus === 'paid');
    for (let i = 0; i < paidOrders.length; i++) {
      const order = paidOrders[i];
      const payment = new Payment({
        paymentId: `PAY${String(i + 1).padStart(8, '0')}`, // Explicitly set payment ID
        type: 'order_payment',
        amount: order.totalPrice,
        currency: order.currency,
        amountInUSD: order.totalPrice, // Required field
        payer: order.client,
        order: order._id,
        status: 'completed',
        paymentMethod: {
          type: 'stripe',
          details: {
            stripePaymentIntentId: `pi_test_${Date.now()}_${i}`,
            cardLast4: '4242'
          }
        },
        platformFee: order.totalPrice * 0.2,
        processingFee: order.totalPrice * 0.029,
        netAmount: order.totalPrice * 0.771,
        completedAt: new Date()
      });
      await payment.save();
    }
    console.log(`✅ Created ${paidOrders.length} payments`);

    // Create sample notifications
    const notifications = [];
    for (const user of createdUsers) {
      if (user.role === 'client') {
        notifications.push({
          title: 'Welcome to GradeHarvest!',
          message: 'Thank you for joining GradeHarvest. You can now place orders and get help with your academic work.',
          type: 'system_announcement',
          recipient: user._id,
          priority: 'medium'
        });
      } else if (user.role === 'writer') {
        notifications.push({
          title: 'Writer Account Approved',
          message: 'Congratulations! Your writer account has been approved. You can now start accepting orders.',
          type: 'account_update',
          recipient: user._id,
          priority: 'high'
        });
      }
    }

    await Notification.insertMany(notifications);
    console.log(`✅ Created ${notifications.length} notifications`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`👥 Users: ${createdUsers.length}`);
    console.log(`📝 Orders: ${createdOrders.length}`);
    console.log(`💳 Payments: ${paidOrders.length}`);
    console.log(`🔔 Notifications: ${notifications.length}`);
    console.log(`📎 Orders with attachments: ${createdOrders.filter(order => order.attachments && order.attachments.length > 0).length}`);

    console.log('\n🔑 Test Accounts:');
    console.log('Manager: manager@gradeharvest.com / Manager123!');
    console.log('Support: support@gradeharvest.com / Support123!');
    console.log('Accountant: accountant@gradeharvest.com / Account123!');
    console.log('Tech Admin: tech@gradeharvest.com / TechAdmin123!');
    console.log('Writer: emily.writer@example.com / Writer123!');
    console.log('Client: alex.client@example.com / Client123!');

    console.log('\n📋 Sample Orders:');
    console.log('- Business Strategy Analysis (pending)');
    console.log('- Machine Learning Algorithms (assigned, paid)');
    console.log('- Shakespeare\'s Influence (in-progress, paid)');
    console.log('- Resume Writing Guide (assigned, paid, with PDF attachment)');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
};

// Run seeding
const runSeed = async () => {
  await connectDB();
  await seedDatabase();
};

// Check if script is run directly
if (require.main === module) {
  runSeed();
}

module.exports = { seedDatabase, sampleUsers, sampleOrders };
