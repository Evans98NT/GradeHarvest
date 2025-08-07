const Flutterwave = require('flutterwave-node-v3');

class FlutterwaveService {
  constructor() {
    // Initialize Flutterwave only if the secret key is provided
    if (process.env.FLUTTERWAVE_SECRET_KEY) {
      this.flw = new Flutterwave(
        process.env.FLUTTERWAVE_PUBLIC_KEY,
        process.env.FLUTTERWAVE_SECRET_KEY
      );
      this.encryptionKey = process.env.FLUTTERWAVE_ENCRYPTION_KEY;
    } else {
      console.warn('FLUTTERWAVE_SECRET_KEY not found in environment variables. Flutterwave service will be disabled.');
      this.flw = null;
    }
  }

  // Check if Flutterwave is properly configured
  _isConfigured() {
    if (!this.flw) {
      throw new Error('Flutterwave service is not configured. Please set FLUTTERWAVE_SECRET_KEY, FLUTTERWAVE_PUBLIC_KEY, and FLUTTERWAVE_ENCRYPTION_KEY in your environment variables.');
    }
    return true;
  }

  // Process a payment
  async processPayment({ 
    amount, 
    currency, 
    email, 
    phone_number, 
    name, 
    tx_ref, 
    redirect_url, 
    description,
    payment_options = "card,mobilemoney,ussd",
    customizations = {},
    meta = {}
  }) {
    try {
      this._isConfigured();

      const payload = {
        tx_ref,
        amount,
        currency: currency.toUpperCase(),
        redirect_url,
        payment_options,
        meta,
        customer: {
          email,
          phone_number,
          name
        },
        customizations: {
          title: customizations.title || "GradeHarvest Payment",
          description: description || "Payment for academic writing services",
          logo: customizations.logo || ""
        }
      };

      const response = await this.flw.Payment.initialize(payload);

      if (response.status === 'success') {
        return {
          success: true,
          payment_link: response.data.link,
          tx_ref: response.data.tx_ref,
          flw_ref: response.data.flw_ref,
          message: 'Payment link generated successfully'
        };
      } else {
        return {
          success: false,
          error: response.message,
          code: response.status
        };
      }
    } catch (error) {
      console.error('Flutterwave payment processing failed:', error);
      return {
        success: false,
        error: error.message,
        code: error.code || 'PAYMENT_ERROR'
      };
    }
  }

  // Verify payment
  async verifyPayment(transactionId) {
    try {
      this._isConfigured();

      const response = await this.flw.Transaction.verify({ id: transactionId });

      if (response.status === 'success' && response.data.status === 'successful') {
        return {
          success: true,
          transaction: response.data,
          amount: response.data.amount,
          currency: response.data.currency,
          tx_ref: response.data.tx_ref,
          flw_ref: response.data.flw_ref,
          customer: response.data.customer,
          payment_type: response.data.payment_type,
          message: 'Payment verified successfully'
        };
      } else {
        return {
          success: false,
          error: response.message || 'Payment verification failed',
          status: response.data?.status || 'unknown'
        };
      }
    } catch (error) {
      console.error('Flutterwave payment verification failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Process refund
  async processRefund({ flw_ref, amount, comments = 'Refund requested' }) {
    try {
      this._isConfigured();

      const payload = {
        flw_ref,
        amount,
        comments
      };

      const response = await this.flw.Transaction.refund(payload);

      if (response.status === 'success') {
        return {
          success: true,
          refund_id: response.data.id,
          flw_ref: response.data.flw_ref,
          amount: response.data.amount,
          status: response.data.status,
          message: 'Refund processed successfully'
        };
      } else {
        return {
          success: false,
          error: response.message,
          code: response.status
        };
      }
    } catch (error) {
      console.error('Flutterwave refund processing failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get transaction details
  async getTransaction(transactionId) {
    try {
      this._isConfigured();

      const response = await this.flw.Transaction.fetch({ id: transactionId });

      if (response.status === 'success') {
        return {
          success: true,
          transaction: response.data
        };
      } else {
        return {
          success: false,
          error: response.message
        };
      }
    } catch (error) {
      console.error('Flutterwave transaction fetch failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // List transactions
  async listTransactions({ from, to, page = 1, limit = 20 }) {
    try {
      this._isConfigured();

      const payload = {
        page,
        limit
      };

      if (from) payload.from = from;
      if (to) payload.to = to;

      const response = await this.flw.Transaction.list(payload);

      if (response.status === 'success') {
        return {
          success: true,
          transactions: response.data,
          meta: response.meta
        };
      } else {
        return {
          success: false,
          error: response.message
        };
      }
    } catch (error) {
      console.error('Flutterwave transactions listing failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Create transfer (for withdrawals)
  async createTransfer({
    account_bank,
    account_number,
    amount,
    narration,
    currency = 'NGN',
    reference,
    callback_url,
    debit_currency = 'NGN'
  }) {
    try {
      this._isConfigured();

      const payload = {
        account_bank,
        account_number,
        amount,
        narration,
        currency,
        reference,
        callback_url,
        debit_currency
      };

      const response = await this.flw.Transfer.initiate(payload);

      if (response.status === 'success') {
        return {
          success: true,
          transfer_id: response.data.id,
          reference: response.data.reference,
          status: response.data.status,
          message: 'Transfer initiated successfully'
        };
      } else {
        return {
          success: false,
          error: response.message,
          code: response.status
        };
      }
    } catch (error) {
      console.error('Flutterwave transfer creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify bank account
  async verifyBankAccount({ account_number, account_bank }) {
    try {
      this._isConfigured();

      const response = await this.flw.Misc.verify_Account({
        account_number,
        account_bank
      });

      if (response.status === 'success') {
        return {
          success: true,
          account_name: response.data.account_name,
          account_number: response.data.account_number
        };
      } else {
        return {
          success: false,
          error: response.message
        };
      }
    } catch (error) {
      console.error('Flutterwave bank account verification failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Get banks list
  async getBanks(country = 'NG') {
    try {
      this._isConfigured();

      const response = await this.flw.Bank.country({ country });

      if (response.status === 'success') {
        return {
          success: true,
          banks: response.data
        };
      } else {
        return {
          success: false,
          error: response.message
        };
      }
    } catch (error) {
      console.error('Flutterwave banks listing failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(payload, signature) {
    try {
      const crypto = require('crypto');
      const hash = crypto
        .createHmac('sha256', process.env.FLUTTERWAVE_SECRET_HASH || '')
        .update(JSON.stringify(payload))
        .digest('hex');

      if (hash === signature) {
        return { success: true, payload };
      } else {
        return { success: false, error: 'Invalid signature' };
      }
    } catch (error) {
      console.error('Flutterwave webhook verification failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Handle webhook events
  async handleWebhookEvent(payload) {
    try {
      const { event, data } = payload;

      switch (event) {
        case 'charge.completed':
          return await this.handleChargeCompleted(data);
        
        case 'transfer.completed':
          return await this.handleTransferCompleted(data);
        
        case 'charge.failed':
          return await this.handleChargeFailed(data);
        
        default:
          console.log(`Unhandled Flutterwave event type: ${event}`);
          return { success: true, message: 'Event received but not handled' };
      }
    } catch (error) {
      console.error('Flutterwave webhook event handling failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Handle successful charge
  async handleChargeCompleted(data) {
    console.log('Flutterwave charge completed:', data.id);
    // Update payment status in database
    // Send confirmation email
    // Update order status
    return { success: true, message: 'Charge completion handled' };
  }

  // Handle successful transfer
  async handleTransferCompleted(data) {
    console.log('Flutterwave transfer completed:', data.id);
    // Update withdrawal status in database
    // Send confirmation notification
    return { success: true, message: 'Transfer completion handled' };
  }

  // Handle failed charge
  async handleChargeFailed(data) {
    console.log('Flutterwave charge failed:', data.id);
    // Update payment status in database
    // Send failure notification
    return { success: true, message: 'Charge failure handled' };
  }

  // Generate payment reference
  generatePaymentReference(prefix = 'GH') {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `${prefix}_${timestamp}_${random}`;
  }

  // Calculate processing fee
  calculateProcessingFee(amount, currency = 'USD') {
    // Flutterwave fees vary by payment method and region
    // This is a simplified calculation - adjust based on actual fee structure
    const fees = {
      USD: amount * 0.039 + 0.50, // 3.9% + $0.50
      NGN: amount * 0.014, // 1.4%
      GHS: amount * 0.029, // 2.9%
      KES: amount * 0.035, // 3.5%
      UGX: amount * 0.035, // 3.5%
      ZAR: amount * 0.029, // 2.9%
    };

    return Math.round((fees[currency] || fees.USD) * 100) / 100;
  }

  // Get supported currencies
  getSupportedCurrencies() {
    return [
      'USD', 'EUR', 'GBP', 'NGN', 'GHS', 'KES', 'UGX', 'TZS', 
      'ZAR', 'XAF', 'XOF', 'EGP', 'MAD', 'ZMW', 'RWF'
    ];
  }

  // Get supported countries
  getSupportedCountries() {
    return [
      'NG', 'GH', 'KE', 'UG', 'ZA', 'TZ', 'RW', 'ZM', 
      'CM', 'BF', 'CI', 'SN', 'EG', 'MA', 'US', 'GB'
    ];
  }

  // Validate payment data
  validatePaymentData({ amount, currency, email, tx_ref }) {
    const errors = [];

    if (!amount || amount <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!currency || !this.getSupportedCurrencies().includes(currency.toUpperCase())) {
      errors.push('Invalid or unsupported currency');
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Valid email is required');
    }

    if (!tx_ref || tx_ref.length < 3) {
      errors.push('Transaction reference is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
const flutterwaveService = new FlutterwaveService();

module.exports = flutterwaveService;
