const express = require('express');
const {
  processOrderPayment,
  requestWithdrawal,
  getUserPayments,
  getPayment,
  approveWithdrawal,
  rejectWithdrawal,
  getPendingWithdrawals,
  getPaymentStats,
  processRefund,
  getWriterEarnings
} = require('../controllers/paymentController');

const {
  authenticate,
  authorize,
  canAccessWriterFeatures
} = require('../middleware/auth');

const {
  validatePayment,
  validateObjectId,
  validatePagination
} = require('../middleware/validation');

const stripeService = require('../services/stripeService');
const paypalService = require('../services/paypalService');
const mpesaService = require('../services/mpesaService');
const flutterwaveService = require('../services/flutterwaveService');

const router = express.Router();

// Webhook routes (no authentication required)
router.post('/webhooks/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    const verification = stripeService.verifyWebhookSignature(req.body, signature);
    
    if (!verification.success) {
      return res.status(400).json({ error: 'Invalid signature' });
    }
    
    const result = await stripeService.handleWebhookEvent(verification.event);
    res.status(200).json({ received: true, result });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    res.status(400).json({ error: error.message });
  }
});

router.post('/webhooks/paypal', express.json(), async (req, res) => {
  try {
    const verification = paypalService.verifyWebhookSignature(
      req.headers,
      req.body,
      process.env.PAYPAL_WEBHOOK_ID
    );
    
    if (!verification.success) {
      return res.status(400).json({ error: 'Invalid signature' });
    }
    
    const result = await paypalService.handleWebhookEvent(req.body);
    res.status(200).json({ received: true, result });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    res.status(400).json({ error: error.message });
  }
});

// M-Pesa callback routes
router.post('/mpesa/callback', express.json(), async (req, res) => {
  try {
    const result = mpesaService.handleStkCallback(req.body);
    console.log('M-Pesa STK callback:', result);
    
    // Update payment status in database based on result
    // This would typically involve finding the payment by checkoutRequestId
    // and updating its status
    
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error) {
    console.error('M-Pesa callback error:', error);
    res.status(200).json({ ResultCode: 1, ResultDesc: 'Failed' });
  }
});

router.post('/mpesa/result', express.json(), async (req, res) => {
  try {
    const result = mpesaService.handleB2CResult(req.body);
    console.log('M-Pesa B2C result:', result);
    
    // Update withdrawal status in database based on result
    
    res.status(200).json({ ResultCode: 0, ResultDesc: 'Success' });
  } catch (error) {
    console.error('M-Pesa result error:', error);
    res.status(200).json({ ResultCode: 1, ResultDesc: 'Failed' });
  }
});

router.post('/mpesa/timeout', express.json(), (req, res) => {
  console.log('M-Pesa timeout:', req.body);
  res.status(200).json({ ResultCode: 0, ResultDesc: 'Success' });
});

// Flutterwave webhook route
router.post('/webhooks/flutterwave', express.json(), async (req, res) => {
  try {
    const signature = req.headers['verif-hash'];
    const verification = flutterwaveService.verifyWebhookSignature(req.body, signature);
    
    if (!verification.success) {
      return res.status(400).json({ error: 'Invalid signature' });
    }
    
    const result = await flutterwaveService.handleWebhookEvent(req.body);
    res.status(200).json({ received: true, result });
  } catch (error) {
    console.error('Flutterwave webhook error:', error);
    res.status(400).json({ error: error.message });
  }
});

// All routes below require authentication
router.use(authenticate);

// Get payment statistics (Admin only)
router.get('/stats',
  authorize('manager', 'accountant', 'tech'),
  getPaymentStats
);

// Get pending withdrawals (Admin only)
router.get('/withdrawals/pending',
  authorize('manager', 'accountant'),
  getPendingWithdrawals
);

// Get writer earnings (Writer only)
router.get('/earnings',
  canAccessWriterFeatures,
  getWriterEarnings
);

// Get user payments
router.get('/',
  validatePagination,
  getUserPayments
);

// Process order payment (Client only)
router.post('/orders/:orderId',
  authorize('client'),
  validateObjectId('orderId'),
  validatePayment,
  processOrderPayment
);

// Request withdrawal (Writer only)
router.post('/withdrawals',
  canAccessWriterFeatures,
  requestWithdrawal
);

// Approve withdrawal (Admin only)
router.put('/withdrawals/:id/approve',
  authorize('manager', 'accountant'),
  validateObjectId('id'),
  approveWithdrawal
);

// Reject withdrawal (Admin only)
router.put('/withdrawals/:id/reject',
  authorize('manager', 'accountant'),
  validateObjectId('id'),
  rejectWithdrawal
);

// Process refund (Admin only)
router.post('/:id/refund',
  authorize('manager', 'accountant'),
  validateObjectId('id'),
  processRefund
);

// Get single payment
router.get('/:id',
  validateObjectId('id'),
  getPayment
);

module.exports = router;
