const axios = require('axios');

class PayPalService {
  constructor() {
    this.clientId = process.env.PAYPAL_CLIENT_ID;
    this.clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    this.mode = process.env.PAYPAL_MODE || 'sandbox'; // 'sandbox' or 'live'
    this.baseUrl = this.mode === 'live' 
      ? 'https://api.paypal.com' 
      : 'https://api.sandbox.paypal.com';
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // Get access token
  async getAccessToken() {
    try {
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }

      const auth = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
      
      const response = await axios.post(
        `${this.baseUrl}/v1/oauth2/token`,
        'grant_type=client_credentials',
        {
          headers: {
            'Authorization': `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000) - 60000; // 1 minute buffer
      
      return this.accessToken;
    } catch (error) {
      console.error('PayPal authentication failed:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with PayPal');
    }
  }

  // Create order
  async createOrder({ amount, currency, description, orderId, returnUrl, cancelUrl }) {
    try {
      const accessToken = await this.getAccessToken();
      
      const orderData = {
        intent: 'CAPTURE',
        purchase_units: [{
          reference_id: orderId,
          description,
          amount: {
            currency_code: currency.toUpperCase(),
            value: amount.toFixed(2)
          }
        }],
        application_context: {
          return_url: returnUrl || `${process.env.FRONTEND_URL}/payment/success`,
          cancel_url: cancelUrl || `${process.env.FRONTEND_URL}/payment/cancel`,
          brand_name: 'GradeHarvest',
          landing_page: 'BILLING',
          user_action: 'PAY_NOW'
        }
      };

      const response = await axios.post(
        `${this.baseUrl}/v2/checkout/orders`,
        orderData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'PayPal-Request-Id': `${orderId}-${Date.now()}`
          }
        }
      );

      const order = response.data;
      const approvalUrl = order.links.find(link => link.rel === 'approve')?.href;

      return {
        success: true,
        orderId: order.id,
        status: order.status,
        approvalUrl,
        order
      };
    } catch (error) {
      console.error('PayPal order creation failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Capture order
  async captureOrder(orderId) {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await axios.post(
        `${this.baseUrl}/v2/checkout/orders/${orderId}/capture`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const captureResult = response.data;
      const capture = captureResult.purchase_units[0]?.payments?.captures[0];

      return {
        success: capture?.status === 'COMPLETED',
        orderId: captureResult.id,
        captureId: capture?.id,
        status: capture?.status,
        amount: capture?.amount?.value,
        currency: capture?.amount?.currency_code,
        message: capture?.status === 'COMPLETED' ? 'Payment captured successfully' : 'Payment capture failed'
      };
    } catch (error) {
      console.error('PayPal order capture failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Process payment (create and capture in one step)
  async processPayment({ amount, currency, description, orderId }) {
    try {
      // First create the order
      const createResult = await this.createOrder({
        amount,
        currency,
        description,
        orderId
      });

      if (!createResult.success) {
        return createResult;
      }

      // For direct processing, we would need the payer to approve first
      // This is typically handled on the frontend
      return {
        success: true,
        orderId: createResult.orderId,
        approvalUrl: createResult.approvalUrl,
        message: 'Order created successfully. Redirect user to approval URL.'
      };
    } catch (error) {
      console.error('PayPal payment processing failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get order details
  async getOrder(orderId) {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await axios.get(
        `${this.baseUrl}/v2/checkout/orders/${orderId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        order: response.data
      };
    } catch (error) {
      console.error('PayPal order retrieval failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Process refund
  async processRefund({ captureId, amount, currency, note }) {
    try {
      const accessToken = await this.getAccessToken();
      
      const refundData = {
        amount: {
          value: amount.toFixed(2),
          currency_code: currency.toUpperCase()
        },
        note_to_payer: note || 'Refund processed by GradeHarvest'
      };

      const response = await axios.post(
        `${this.baseUrl}/v2/payments/captures/${captureId}/refund`,
        refundData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
            'PayPal-Request-Id': `refund-${captureId}-${Date.now()}`
          }
        }
      );

      const refund = response.data;

      return {
        success: refund.status === 'COMPLETED',
        refundId: refund.id,
        status: refund.status,
        amount: refund.amount.value,
        currency: refund.amount.currency_code,
        message: 'Refund processed successfully'
      };
    } catch (error) {
      console.error('PayPal refund processing failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Process withdrawal (payout)
  async processWithdrawal({ amount, recipientEmail, note, currency = 'USD' }) {
    try {
      const accessToken = await this.getAccessToken();
      
      const payoutData = {
        sender_batch_header: {
          sender_batch_id: `batch-${Date.now()}`,
          email_subject: 'You have a payout from GradeHarvest',
          email_message: note || 'You have received a payout from GradeHarvest'
        },
        items: [{
          recipient_type: 'EMAIL',
          amount: {
            value: amount.toFixed(2),
            currency: currency.toUpperCase()
          },
          receiver: recipientEmail,
          note: note || 'Payout from GradeHarvest',
          sender_item_id: `payout-${Date.now()}`
        }]
      };

      const response = await axios.post(
        `${this.baseUrl}/v1/payments/payouts`,
        payoutData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const payout = response.data;

      return {
        success: true,
        batchId: payout.batch_header.payout_batch_id,
        status: payout.batch_header.batch_status,
        message: 'Payout initiated successfully'
      };
    } catch (error) {
      console.error('PayPal payout processing failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Get payout details
  async getPayoutDetails(batchId) {
    try {
      const accessToken = await this.getAccessToken();
      
      const response = await axios.get(
        `${this.baseUrl}/v1/payments/payouts/${batchId}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        payout: response.data
      };
    } catch (error) {
      console.error('PayPal payout details retrieval failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(headers, body, webhookId) {
    try {
      // PayPal webhook verification is more complex and requires additional setup
      // This is a simplified version
      const authAlgo = headers['paypal-auth-algo'];
      const transmission = headers['paypal-transmission-id'];
      const certId = headers['paypal-cert-id'];
      const signature = headers['paypal-transmission-sig'];
      const timestamp = headers['paypal-transmission-time'];

      // In production, you would verify the signature using PayPal's SDK
      // For now, we'll do basic validation
      if (!authAlgo || !transmission || !certId || !signature || !timestamp) {
        return { success: false, error: 'Missing required webhook headers' };
      }

      return { success: true, verified: true };
    } catch (error) {
      console.error('PayPal webhook verification failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Handle webhook events
  async handleWebhookEvent(event) {
    try {
      const eventType = event.event_type;
      const resource = event.resource;

      switch (eventType) {
        case 'CHECKOUT.ORDER.APPROVED':
          return await this.handleOrderApproved(resource);
        
        case 'PAYMENT.CAPTURE.COMPLETED':
          return await this.handlePaymentCaptured(resource);
        
        case 'PAYMENT.CAPTURE.DENIED':
          return await this.handlePaymentDenied(resource);
        
        case 'PAYMENT.CAPTURE.REFUNDED':
          return await this.handlePaymentRefunded(resource);
        
        case 'CHECKOUT.ORDER.COMPLETED':
          return await this.handleOrderCompleted(resource);
        
        default:
          console.log(`Unhandled PayPal event type: ${eventType}`);
          return { success: true, message: 'Event received but not handled' };
      }
    } catch (error) {
      console.error('PayPal webhook event handling failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Handle order approved
  async handleOrderApproved(order) {
    console.log('PayPal order approved:', order.id);
    // Update order status in database
    // Prepare for capture
    return { success: true, message: 'Order approval handled' };
  }

  // Handle payment captured
  async handlePaymentCaptured(capture) {
    console.log('PayPal payment captured:', capture.id);
    // Update payment status in database
    // Send confirmation email
    // Update order status
    return { success: true, message: 'Payment capture handled' };
  }

  // Handle payment denied
  async handlePaymentDenied(capture) {
    console.log('PayPal payment denied:', capture.id);
    // Update payment status in database
    // Send failure notification
    // Handle retry logic
    return { success: true, message: 'Payment denial handled' };
  }

  // Handle payment refunded
  async handlePaymentRefunded(refund) {
    console.log('PayPal payment refunded:', refund.id);
    // Update refund status in database
    // Send refund confirmation
    return { success: true, message: 'Payment refund handled' };
  }

  // Handle order completed
  async handleOrderCompleted(order) {
    console.log('PayPal order completed:', order.id);
    // Final order completion logic
    return { success: true, message: 'Order completion handled' };
  }

  // Create subscription plan
  async createSubscriptionPlan({ name, description, amount, currency, interval }) {
    try {
      const accessToken = await this.getAccessToken();
      
      const planData = {
        product_id: `product-${Date.now()}`,
        name,
        description,
        billing_cycles: [{
          frequency: {
            interval_unit: interval.toUpperCase(), // MONTH, YEAR, etc.
            interval_count: 1
          },
          tenure_type: 'REGULAR',
          sequence: 1,
          total_cycles: 0, // Infinite
          pricing_scheme: {
            fixed_price: {
              value: amount.toFixed(2),
              currency_code: currency.toUpperCase()
            }
          }
        }],
        payment_preferences: {
          auto_bill_outstanding: true,
          setup_fee_failure_action: 'CONTINUE',
          payment_failure_threshold: 3
        }
      };

      const response = await axios.post(
        `${this.baseUrl}/v1/billing/plans`,
        planData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        planId: response.data.id,
        plan: response.data
      };
    } catch (error) {
      console.error('PayPal subscription plan creation failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }

  // Get transaction history
  async getTransactionHistory(startDate, endDate, transactionType = 'T0001') {
    try {
      const accessToken = await this.getAccessToken();
      
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        transaction_type: transactionType,
        fields: 'all'
      });

      const response = await axios.get(
        `${this.baseUrl}/v1/reporting/transactions?${params}`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return {
        success: true,
        transactions: response.data.transaction_details
      };
    } catch (error) {
      console.error('PayPal transaction history retrieval failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message
      };
    }
  }
}

// Export singleton instance
const paypalService = new PayPalService();

module.exports = paypalService;
