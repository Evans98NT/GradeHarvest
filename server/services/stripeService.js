class StripeService {
  constructor() {
    // Initialize Stripe only if the secret key is provided
    if (process.env.STRIPE_SECRET_KEY) {
      this.stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    } else {
      console.warn('STRIPE_SECRET_KEY not found in environment variables. Stripe service will be disabled.');
      this.stripe = null;
    }
  }

  // Check if Stripe is properly configured
  _isConfigured() {
    if (!this.stripe) {
      throw new Error('Stripe service is not configured. Please set STRIPE_SECRET_KEY in your environment variables.');
    }
    return true;
  }

  // Process a payment
  async processPayment({ amount, currency, paymentMethodId, customerId, description, metadata = {} }) {
    try {
      this._isConfigured();
      
      // Convert amount to cents (Stripe uses smallest currency unit)
      const amountInCents = Math.round(amount * 100);

      // Create payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amountInCents,
        currency: currency.toLowerCase(),
        payment_method: paymentMethodId,
        customer: customerId,
        description,
        metadata,
        confirm: true,
        return_url: `${process.env.FRONTEND_URL}/payment/return`
      });

      return {
        success: paymentIntent.status === 'succeeded',
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
        message: paymentIntent.status === 'succeeded' ? 'Payment successful' : 'Payment requires additional action',
        clientSecret: paymentIntent.client_secret,
        nextAction: paymentIntent.next_action
      };
    } catch (error) {
      console.error('Stripe payment processing failed:', error);
      return {
        success: false,
        error: error.message,
        code: error.code,
        type: error.type
      };
    }
  }

  // Create a customer
  async createCustomer({ email, name, phone, address = {} }) {
    try {
      this._isConfigured();
      
      const customer = await this.stripe.customers.create({
        email,
        name,
        phone,
        address: {
          line1: address.line1,
          line2: address.line2,
          city: address.city,
          state: address.state,
          postal_code: address.postal_code,
          country: address.country
        }
      });

      return {
        success: true,
        customerId: customer.id,
        customer
      };
    } catch (error) {
      console.error('Stripe customer creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create a payment method
  async createPaymentMethod({ type, card, billing_details }) {
    try {
      const paymentMethod = await this.stripe.paymentMethods.create({
        type,
        card,
        billing_details
      });

      return {
        success: true,
        paymentMethodId: paymentMethod.id,
        paymentMethod
      };
    } catch (error) {
      console.error('Stripe payment method creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Attach payment method to customer
  async attachPaymentMethod(paymentMethodId, customerId) {
    try {
      const paymentMethod = await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      });

      return {
        success: true,
        paymentMethod
      };
    } catch (error) {
      console.error('Stripe payment method attachment failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get customer payment methods
  async getCustomerPaymentMethods(customerId, type = 'card') {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type
      });

      return {
        success: true,
        paymentMethods: paymentMethods.data
      };
    } catch (error) {
      console.error('Stripe payment methods retrieval failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Process refund
  async processRefund({ paymentIntentId, amount, reason = 'requested_by_customer' }) {
    try {
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: amount ? Math.round(amount * 100) : undefined, // Convert to cents
        reason
      });

      return {
        success: refund.status === 'succeeded',
        refundId: refund.id,
        status: refund.status,
        amount: refund.amount / 100, // Convert back to dollars
        message: 'Refund processed successfully'
      };
    } catch (error) {
      console.error('Stripe refund processing failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create setup intent for saving payment methods
  async createSetupIntent(customerId, paymentMethodTypes = ['card']) {
    try {
      const setupIntent = await this.stripe.setupIntents.create({
        customer: customerId,
        payment_method_types: paymentMethodTypes,
        usage: 'off_session'
      });

      return {
        success: true,
        setupIntentId: setupIntent.id,
        clientSecret: setupIntent.client_secret
      };
    } catch (error) {
      console.error('Stripe setup intent creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(payload, signature) {
    try {
      this._isConfigured();
      
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      return { success: true, event };
    } catch (error) {
      console.error('Stripe webhook verification failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Handle webhook events
  async handleWebhookEvent(event) {
    try {
      switch (event.type) {
        case 'payment_intent.succeeded':
          return await this.handlePaymentSucceeded(event.data.object);
        
        case 'payment_intent.payment_failed':
          return await this.handlePaymentFailed(event.data.object);
        
        case 'customer.subscription.created':
          return await this.handleSubscriptionCreated(event.data.object);
        
        case 'customer.subscription.updated':
          return await this.handleSubscriptionUpdated(event.data.object);
        
        case 'invoice.payment_succeeded':
          return await this.handleInvoicePaymentSucceeded(event.data.object);
        
        case 'charge.dispute.created':
          return await this.handleDisputeCreated(event.data.object);
        
        default:
          console.log(`Unhandled Stripe event type: ${event.type}`);
          return { success: true, message: 'Event received but not handled' };
      }
    } catch (error) {
      console.error('Stripe webhook event handling failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Handle successful payment
  async handlePaymentSucceeded(paymentIntent) {
    console.log('Payment succeeded:', paymentIntent.id);
    // Update payment status in database
    // Send confirmation email
    // Update order status
    return { success: true, message: 'Payment success handled' };
  }

  // Handle failed payment
  async handlePaymentFailed(paymentIntent) {
    console.log('Payment failed:', paymentIntent.id);
    // Update payment status in database
    // Send failure notification
    // Handle retry logic
    return { success: true, message: 'Payment failure handled' };
  }

  // Handle subscription created
  async handleSubscriptionCreated(subscription) {
    console.log('Subscription created:', subscription.id);
    // Handle subscription logic if needed
    return { success: true, message: 'Subscription creation handled' };
  }

  // Handle subscription updated
  async handleSubscriptionUpdated(subscription) {
    console.log('Subscription updated:', subscription.id);
    // Handle subscription update logic
    return { success: true, message: 'Subscription update handled' };
  }

  // Handle invoice payment succeeded
  async handleInvoicePaymentSucceeded(invoice) {
    console.log('Invoice payment succeeded:', invoice.id);
    // Handle recurring payment success
    return { success: true, message: 'Invoice payment success handled' };
  }

  // Handle dispute created
  async handleDisputeCreated(dispute) {
    console.log('Dispute created:', dispute.id);
    // Handle dispute logic
    // Notify admin
    // Gather evidence
    return { success: true, message: 'Dispute creation handled' };
  }

  // Get payment details
  async getPaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      return {
        success: true,
        paymentIntent
      };
    } catch (error) {
      console.error('Stripe payment intent retrieval failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create ephemeral key for mobile apps
  async createEphemeralKey(customerId, apiVersion) {
    try {
      const ephemeralKey = await this.stripe.ephemeralKeys.create(
        { customer: customerId },
        { apiVersion }
      );

      return {
        success: true,
        ephemeralKey
      };
    } catch (error) {
      console.error('Stripe ephemeral key creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Calculate application fee (for marketplace)
  calculateApplicationFee(amount, feePercentage = 2.9) {
    return Math.round(amount * (feePercentage / 100) * 100) / 100;
  }

  // Create connected account (for marketplace)
  async createConnectedAccount({ type = 'express', country, email, business_type = 'individual' }) {
    try {
      const account = await this.stripe.accounts.create({
        type,
        country,
        email,
        business_type,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true }
        }
      });

      return {
        success: true,
        accountId: account.id,
        account
      };
    } catch (error) {
      console.error('Stripe connected account creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create account link for onboarding
  async createAccountLink(accountId, refreshUrl, returnUrl) {
    try {
      const accountLink = await this.stripe.accountLinks.create({
        account: accountId,
        refresh_url: refreshUrl,
        return_url: returnUrl,
        type: 'account_onboarding'
      });

      return {
        success: true,
        url: accountLink.url
      };
    } catch (error) {
      console.error('Stripe account link creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Transfer funds to connected account
  async createTransfer(amount, destination, currency = 'usd') {
    try {
      const transfer = await this.stripe.transfers.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        destination
      });

      return {
        success: true,
        transferId: transfer.id,
        transfer
      };
    } catch (error) {
      console.error('Stripe transfer creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get account balance
  async getBalance() {
    try {
      const balance = await this.stripe.balance.retrieve();
      
      return {
        success: true,
        balance
      };
    } catch (error) {
      console.error('Stripe balance retrieval failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // List transactions
  async listTransactions(limit = 10, startingAfter = null) {
    try {
      const params = { limit };
      if (startingAfter) params.starting_after = startingAfter;
      
      const transactions = await this.stripe.balanceTransactions.list(params);
      
      return {
        success: true,
        transactions: transactions.data,
        hasMore: transactions.has_more
      };
    } catch (error) {
      console.error('Stripe transactions listing failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
const stripeService = new StripeService();

module.exports = stripeService;
