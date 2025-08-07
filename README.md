# GradeHarvest - Academic Writing Marketplace Backend

A comprehensive backend API for an academic writing marketplace that connects vetted academic writers with clients seeking assignment help.

## 🚀 Features

### User Management
- **Multi-role Authentication**: Clients, Writers, Managers, Support, Accountants, Tech Team
- **Email Verification**: Secure account activation
- **Password Reset**: Secure password recovery
- **Role-based Access Control**: Granular permissions system
- **Writer Verification**: Multi-step application process with testing

### Order Management
- **Order Creation**: Comprehensive order placement system
- **Writer Applications**: Bidding system for available orders
- **Assignment Management**: Automatic and manual writer assignment
- **Progress Tracking**: Real-time order status updates
- **Revision System**: Client-requested revisions workflow

### Messaging System
- **Internal Messaging**: Secure communication between users
- **Content Filtering**: Automatic detection and blocking of contact information
- **Support Integration**: Direct support chat functionality
- **Message Monitoring**: Admin oversight of all communications

### Payment Processing
- **Multiple Gateways**: Stripe, PayPal, M-Pesa integration
- **Regional Support**: Different payment methods by region
- **Writer Withdrawals**: Multiple withdrawal options (PayPal, M-Pesa, Payoneer)
- **Automated Payments**: Automatic writer payments on order completion

### Plagiarism Detection
- **Multiple Services**: Copyleaks, Turnitin, GPTZero integration
- **AI Content Detection**: Automatic AI-generated content detection
- **Comprehensive Reports**: Detailed plagiarism and AI detection reports

### Notification System
- **Real-time Notifications**: In-app notification system
- **Email Notifications**: Automated email alerts
- **System Announcements**: Admin broadcast messaging

## 🛠 Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with refresh tokens
- **File Upload**: Multer with secure file handling
- **Email**: Nodemailer with template support
- **Security**: Helmet, CORS, Rate limiting, Input sanitization
- **Payment**: Stripe, PayPal, M-Pesa APIs
- **Plagiarism**: Copyleaks, Turnitin, GPTZero APIs

## 📁 Project Structure

```
GradeHarvest/
├── server/
│   ├── config/
│   │   └── database.js          # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Authentication logic
│   │   ├── userController.js    # User management
│   │   ├── orderController.js   # Order management
│   │   ├── messageController.js # Messaging system
│   │   ├── paymentController.js # Payment processing
│   │   └── notificationController.js # Notifications
│   ├── middleware/
│   │   ├── auth.js             # Authentication middleware
│   │   ├── validation.js       # Input validation
│   │   ├── security.js         # Security middleware
│   │   └── errorHandler.js     # Error handling
│   ├── models/
│   │   ├── User.js             # User model
│   │   ├── Order.js            # Order model
│   │   ├── Message.js          # Message model
│   │   ├── Payment.js          # Payment model
│   │   └── Notification.js     # Notification model
│   ├── routes/
│   │   ├── auth.js             # Auth routes
│   │   ├── users.js            # User routes
│   │   ├── orders.js           # Order routes
│   │   ├── messages.js         # Message routes
│   │   ├── payments.js         # Payment routes
│   │   └── notifications.js    # Notification routes
│   ├── services/
│   │   ├── stripeService.js    # Stripe integration
│   │   ├── paypalService.js    # PayPal integration
│   │   ├── mpesaService.js     # M-Pesa integration
│   │   └── plagiarismService.js # Plagiarism detection
│   ├── utils/
│   │   ├── fileUpload.js       # File handling utilities
│   │   └── sendEmail.js        # Email service
│   ├── uploads/                # File storage
│   ├── node_modules/           # Server dependencies
│   ├── package.json            # Server package configuration
│   ├── package-lock.json       # Server dependency lock file
│   └── app.js                  # Main application file
├── .env
├── .env.example
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GradeHarvest
   ```

2. **Navigate to server directory and install dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Environment Setup**
   ```bash
   # From the root directory
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/gradeharvest
   
   # JWT Secrets
   JWT_SECRET=your_jwt_secret_key_here
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
   
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your_email@gmail.com
   SMTP_PASS=your_app_password
   
   # Payment Gateway Keys
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   PAYPAL_CLIENT_ID=your_paypal_client_id
   PAYPAL_CLIENT_SECRET=your_paypal_client_secret
   MPESA_CONSUMER_KEY=your_mpesa_consumer_key
   MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
   
   # Plagiarism Detection APIs
   COPYLEAKS_API_KEY=your_copyleaks_api_key
   COPYLEAKS_EMAIL=your_copyleaks_email
   GPTZERO_API_KEY=your_gptzero_api_key
   ```

4. **Start the server**
   ```bash
   # From the server directory
   cd server
   
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user
- `PUT /auth/profile` - Update profile
- `PUT /auth/password` - Change password
- `POST /auth/forgot-password` - Request password reset
- `PUT /auth/reset-password/:token` - Reset password
- `GET /auth/verify-email/:token` - Verify email

### User Management
- `GET /users` - Get all users (Admin)
- `GET /users/:id` - Get user by ID
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user (Admin)
- `GET /users/stats` - User statistics (Admin)
- `GET /users/writers/applications` - Writer applications (Admin)
- `PUT /users/writers/:id/approve` - Approve writer (Admin)
- `PUT /users/writers/:id/reject` - Reject writer (Admin)

### Order Management
- `POST /orders` - Create new order
- `GET /orders` - Get orders (filtered by role)
- `GET /orders/:id` - Get order details
- `PUT /orders/:id` - Update order
- `DELETE /orders/:id` - Delete order
- `POST /orders/:id/apply` - Apply for order (Writer)
- `PUT /orders/:id/assign` - Assign writer
- `POST /orders/:id/submit` - Submit work (Writer)
- `POST /orders/:id/revision` - Request revision
- `POST /orders/:id/complete` - Complete order

### Messaging
- `POST /messages` - Send message
- `GET /messages/conversations` - Get conversations
- `GET /messages/conversations/:id` - Get conversation messages
- `PUT /messages/conversations/:id/read` - Mark conversation as read
- `GET /messages/unread-count` - Get unread count
- `POST /messages/support` - Start support conversation

### Payments
- `POST /payments/orders/:orderId` - Process order payment
- `POST /payments/withdrawals` - Request withdrawal (Writer)
- `GET /payments` - Get user payments
- `GET /payments/:id` - Get payment details
- `PUT /payments/withdrawals/:id/approve` - Approve withdrawal (Admin)
- `PUT /payments/withdrawals/:id/reject` - Reject withdrawal (Admin)

### Notifications
- `GET /notifications` - Get user notifications
- `GET /notifications/unread-count` - Get unread count
- `PUT /notifications/:id/read` - Mark as read
- `PUT /notifications/mark-all-read` - Mark all as read
- `POST /notifications/announcements` - Create announcement (Admin)

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Role-based Access Control** (RBAC)
- **Rate Limiting** to prevent abuse
- **Input Sanitization** to prevent XSS
- **CORS Protection** with configurable origins
- **Helmet Security Headers**
- **File Upload Validation** with type and size limits
- **Message Content Filtering** to block contact information
- **Password Hashing** with bcrypt
- **Email Verification** for account activation

## 💳 Payment Integration

### Supported Payment Methods

**For Clients:**
- **USA**: Stripe, PayPal, Apple Pay
- **UK**: PayPal, Visa, Mastercard
- **Australia**: PayID, AfterPay
- **Canada**: Interac, PayPal
- **China**: Alipay, WeChat Pay

**For Writers (Withdrawals):**
- **M-Pesa** (Kenya)
- **PayPal** (Global)
- **Payoneer** (Global)

## 🔍 Plagiarism Detection

The system integrates with multiple plagiarism detection services:

- **Copyleaks**: Professional plagiarism detection
- **Turnitin**: Academic integrity checking (requires institutional license)
- **GPTZero**: AI-generated content detection

Each submission is automatically checked and flagged with:
- 🟢 **Green**: Original content
- 🟡 **Orange**: Needs review
- 🔴 **Red**: High plagiarism/AI content detected

## 📧 Email Templates

The system includes professional email templates for:
- Account verification
- Password reset
- Order notifications
- Payment confirmations
- Writer approval/rejection
- System announcements

## 🚀 Deployment

### Environment Variables
Ensure all required environment variables are set in production:

```bash
NODE_ENV=production
MONGODB_URI=your_production_mongodb_uri
JWT_SECRET=your_strong_jwt_secret
# ... other production configurations
```

### Recommended Deployment Platforms
- **Heroku**: Easy deployment with MongoDB Atlas
- **DigitalOcean**: VPS with Docker
- **AWS**: EC2 with RDS/DocumentDB
- **Vercel**: Serverless deployment

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run in development mode
npm run dev
```

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the API documentation at `/api`

## 🔄 Version History

- **v1.0.0** - Initial release with core functionality
  - User authentication and management
  - Order management system
  - Messaging with content filtering
  - Payment processing (Stripe, PayPal, M-Pesa)
  - Plagiarism detection integration
  - Notification system
  - Admin panel functionality

---

**Built with ❤️ by the GradeHarvest Team**
