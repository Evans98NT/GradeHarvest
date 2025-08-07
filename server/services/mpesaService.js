const axios = require('axios');
const crypto = require('crypto');

class MpesaService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.shortcode = process.env.MPESA_SHORTCODE;
    this.passkey = process.env.MPESA_PASSKEY;
    this.environment = process.env.MPESA_ENVIRONMENT || 'sandbox'; // 'sandbox' or 'production'
    
    this.baseUrl = this.environment === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';
    
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  // Get access token
  async getAccessToken() {
    try {
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken;
      }

      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      
      const response = await axios.get(
        `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            'Authorization': `Basic ${auth}`
          }
        }
      );

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (parseInt(response.data.expires_in) * 1000) - 60000; // 1 minute buffer
      
      return this.accessToken;
    } catch (error) {
      console.error('M-Pesa authentication failed:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with M-Pesa');
    }
  }

  // Generate password for STK push
  generatePassword() {
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString('base64');
    return { password, timestamp };
  }

  // STK Push (Lipa Na M-Pesa Online)
  async stkPush({ amount, phoneNumber, accountReference, transactionDesc, callbackUrl }) {
    try {
      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();
      
      // Format phone number (remove + and ensure it starts with 254)
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      const stkData = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: this.shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl || `${process.env.BACKEND_URL}/api/payments/mpesa/callback`,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        stkData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = response.data;

      return {
        success: result.ResponseCode === '0',
        checkoutRequestId: result.CheckoutRequestID,
        merchantRequestId: result.MerchantRequestID,
        responseCode: result.ResponseCode,
        responseDescription: result.ResponseDescription,
        customerMessage: result.CustomerMessage
      };
    } catch (error) {
      console.error('M-Pesa STK push failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.errorMessage || error.message
      };
    }
  }

  // Process payment (alias for STK push)
  async processPayment({ amount, phoneNumber, accountReference, transactionDesc }) {
    return await this.stkPush({
      amount,
      phoneNumber,
      accountReference,
      transactionDesc: transactionDesc || `Payment for ${accountReference}`
    });
  }

  // Query STK push status
  async queryStkStatus(checkoutRequestId) {
    try {
      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();
      
      const queryData = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
        queryData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = response.data;

      return {
        success: true,
        responseCode: result.ResponseCode,
        responseDescription: result.ResponseDescription,
        merchantRequestId: result.MerchantRequestID,
        checkoutRequestId: result.CheckoutRequestID,
        resultCode: result.ResultCode,
        resultDesc: result.ResultDesc
      };
    } catch (error) {
      console.error('M-Pesa STK query failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.errorMessage || error.message
      };
    }
  }

  // B2C Payment (Business to Customer) - for withdrawals
  async processWithdrawal({ amount, phoneNumber, remarks, occasion }) {
    try {
      const accessToken = await this.getAccessToken();
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      const b2cData = {
        InitiatorName: process.env.MPESA_INITIATOR_NAME || 'testapi',
        SecurityCredential: await this.generateSecurityCredential(),
        CommandID: 'BusinessPayment',
        Amount: Math.round(amount),
        PartyA: this.shortcode,
        PartyB: formattedPhone,
        Remarks: remarks || 'Withdrawal from GradeHarvest',
        QueueTimeOutURL: `${process.env.BACKEND_URL}/api/payments/mpesa/timeout`,
        ResultURL: `${process.env.BACKEND_URL}/api/payments/mpesa/result`,
        Occasion: occasion || 'Withdrawal'
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/b2c/v1/paymentrequest`,
        b2cData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = response.data;

      return {
        success: result.ResponseCode === '0',
        conversationId: result.ConversationID,
        originatorConversationId: result.OriginatorConversationID,
        responseCode: result.ResponseCode,
        responseDescription: result.ResponseDescription
      };
    } catch (error) {
      console.error('M-Pesa B2C payment failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.errorMessage || error.message
      };
    }
  }

  // Generate security credential for B2C
  async generateSecurityCredential() {
    try {
      // In production, you would use the actual M-Pesa certificate
      // This is a simplified version for demonstration
      const initiatorPassword = process.env.MPESA_INITIATOR_PASSWORD || 'Safcom496!';
      
      // For sandbox, return the password as is
      if (this.environment === 'sandbox') {
        return 'Safaricom496!';
      }
      
      // For production, encrypt with M-Pesa public certificate
      // const publicKey = fs.readFileSync('path/to/mpesa/certificate.cer');
      // const encrypted = crypto.publicEncrypt(publicKey, Buffer.from(initiatorPassword));
      // return encrypted.toString('base64');
      
      return initiatorPassword;
    } catch (error) {
      console.error('Security credential generation failed:', error);
      throw new Error('Failed to generate security credential');
    }
  }

  // Account balance inquiry
  async getAccountBalance() {
    try {
      const accessToken = await this.getAccessToken();
      
      const balanceData = {
        Initiator: process.env.MPESA_INITIATOR_NAME || 'testapi',
        SecurityCredential: await this.generateSecurityCredential(),
        CommandID: 'AccountBalance',
        PartyA: this.shortcode,
        IdentifierType: '4',
        Remarks: 'Account balance inquiry',
        QueueTimeOutURL: `${process.env.BACKEND_URL}/api/payments/mpesa/timeout`,
        ResultURL: `${process.env.BACKEND_URL}/api/payments/mpesa/balance-result`
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/accountbalance/v1/query`,
        balanceData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = response.data;

      return {
        success: result.ResponseCode === '0',
        conversationId: result.ConversationID,
        originatorConversationId: result.OriginatorConversationID,
        responseCode: result.ResponseCode,
        responseDescription: result.ResponseDescription
      };
    } catch (error) {
      console.error('M-Pesa balance inquiry failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.errorMessage || error.message
      };
    }
  }

  // Transaction status query
  async queryTransactionStatus(transactionId) {
    try {
      const accessToken = await this.getAccessToken();
      
      const queryData = {
        Initiator: process.env.MPESA_INITIATOR_NAME || 'testapi',
        SecurityCredential: await this.generateSecurityCredential(),
        CommandID: 'TransactionStatusQuery',
        TransactionID: transactionId,
        PartyA: this.shortcode,
        IdentifierType: '4',
        ResultURL: `${process.env.BACKEND_URL}/api/payments/mpesa/transaction-result`,
        QueueTimeOutURL: `${process.env.BACKEND_URL}/api/payments/mpesa/timeout`,
        Remarks: 'Transaction status query',
        Occasion: 'Status check'
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/transactionstatus/v1/query`,
        queryData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = response.data;

      return {
        success: result.ResponseCode === '0',
        conversationId: result.ConversationID,
        originatorConversationId: result.OriginatorConversationID,
        responseCode: result.ResponseCode,
        responseDescription: result.ResponseDescription
      };
    } catch (error) {
      console.error('M-Pesa transaction status query failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.errorMessage || error.message
      };
    }
  }

  // Reverse transaction
  async reverseTransaction({ transactionId, amount, receiverParty, remarks }) {
    try {
      const accessToken = await this.getAccessToken();
      
      const reverseData = {
        Initiator: process.env.MPESA_INITIATOR_NAME || 'testapi',
        SecurityCredential: await this.generateSecurityCredential(),
        CommandID: 'TransactionReversal',
        TransactionID: transactionId,
        Amount: Math.round(amount),
        ReceiverParty: receiverParty,
        RecieverIdentifierType: '11',
        ResultURL: `${process.env.BACKEND_URL}/api/payments/mpesa/reversal-result`,
        QueueTimeOutURL: `${process.env.BACKEND_URL}/api/payments/mpesa/timeout`,
        Remarks: remarks || 'Transaction reversal',
        Occasion: 'Reversal'
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/reversal/v1/request`,
        reverseData,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const result = response.data;

      return {
        success: result.ResponseCode === '0',
        conversationId: result.ConversationID,
        originatorConversationId: result.OriginatorConversationID,
        responseCode: result.ResponseCode,
        responseDescription: result.ResponseDescription
      };
    } catch (error) {
      console.error('M-Pesa transaction reversal failed:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.errorMessage || error.message
      };
    }
  }

  // Handle STK callback
  handleStkCallback(callbackData) {
    try {
      const { Body } = callbackData;
      const { stkCallback } = Body;
      
      const result = {
        merchantRequestId: stkCallback.MerchantRequestID,
        checkoutRequestId: stkCallback.CheckoutRequestID,
        resultCode: stkCallback.ResultCode,
        resultDesc: stkCallback.ResultDesc
      };

      if (stkCallback.ResultCode === 0) {
        // Payment successful
        const callbackMetadata = stkCallback.CallbackMetadata?.Item || [];
        
        result.success = true;
        result.amount = this.getCallbackValue(callbackMetadata, 'Amount');
        result.mpesaReceiptNumber = this.getCallbackValue(callbackMetadata, 'MpesaReceiptNumber');
        result.transactionDate = this.getCallbackValue(callbackMetadata, 'TransactionDate');
        result.phoneNumber = this.getCallbackValue(callbackMetadata, 'PhoneNumber');
      } else {
        // Payment failed
        result.success = false;
        result.error = stkCallback.ResultDesc;
      }

      return result;
    } catch (error) {
      console.error('M-Pesa STK callback handling failed:', error);
      return {
        success: false,
        error: 'Failed to process callback'
      };
    }
  }

  // Handle B2C result
  handleB2CResult(resultData) {
    try {
      const { Result } = resultData;
      
      const result = {
        conversationId: Result.ConversationID,
        originatorConversationId: Result.OriginatorConversationID,
        resultCode: Result.ResultCode,
        resultDesc: Result.ResultDesc
      };

      if (Result.ResultCode === 0) {
        // Transaction successful
        const resultParameters = Result.ResultParameters?.ResultParameter || [];
        
        result.success = true;
        result.transactionId = this.getResultValue(resultParameters, 'TransactionID');
        result.transactionAmount = this.getResultValue(resultParameters, 'TransactionAmount');
        result.transactionReceipt = this.getResultValue(resultParameters, 'TransactionReceipt');
        result.b2CRecipientIsRegisteredCustomer = this.getResultValue(resultParameters, 'B2CRecipientIsRegisteredCustomer');
        result.b2CChargesPaidAccountAvailableFunds = this.getResultValue(resultParameters, 'B2CChargesPaidAccountAvailableFunds');
        result.receiverPartyPublicName = this.getResultValue(resultParameters, 'ReceiverPartyPublicName');
        result.transactionCompletedDateTime = this.getResultValue(resultParameters, 'TransactionCompletedDateTime');
        result.b2CUtilityAccountAvailableFunds = this.getResultValue(resultParameters, 'B2CUtilityAccountAvailableFunds');
        result.b2CWorkingAccountAvailableFunds = this.getResultValue(resultParameters, 'B2CWorkingAccountAvailableFunds');
      } else {
        // Transaction failed
        result.success = false;
        result.error = Result.ResultDesc;
      }

      return result;
    } catch (error) {
      console.error('M-Pesa B2C result handling failed:', error);
      return {
        success: false,
        error: 'Failed to process B2C result'
      };
    }
  }

  // Utility function to get callback value
  getCallbackValue(items, name) {
    const item = items.find(item => item.Name === name);
    return item ? item.Value : null;
  }

  // Utility function to get result value
  getResultValue(parameters, key) {
    const param = parameters.find(param => param.Key === key);
    return param ? param.Value : null;
  }

  // Format phone number for M-Pesa
  formatPhoneNumber(phoneNumber) {
    // Remove any non-digit characters
    let cleaned = phoneNumber.replace(/\D/g, '');
    
    // Handle different formats
    if (cleaned.startsWith('254')) {
      return cleaned;
    } else if (cleaned.startsWith('0')) {
      return '254' + cleaned.substring(1);
    } else if (cleaned.startsWith('7') || cleaned.startsWith('1')) {
      return '254' + cleaned;
    }
    
    return cleaned;
  }

  // Validate phone number
  isValidPhoneNumber(phoneNumber) {
    const formatted = this.formatPhoneNumber(phoneNumber);
    // Kenyan mobile numbers: 254 followed by 7XX, 1XX
    return /^254[71]\d{8}$/.test(formatted);
  }

  // Get transaction fees
  getTransactionFees(amount) {
    // M-Pesa transaction fees (simplified structure)
    const fees = [
      { min: 1, max: 49, fee: 0 },
      { min: 50, max: 100, fee: 0 },
      { min: 101, max: 500, fee: 7 },
      { min: 501, max: 1000, fee: 13 },
      { min: 1001, max: 1500, fee: 23 },
      { min: 1501, max: 2500, fee: 33 },
      { min: 2501, max: 3500, fee: 53 },
      { min: 3501, max: 5000, fee: 57 },
      { min: 5001, max: 7500, fee: 78 },
      { min: 7501, max: 10000, fee: 90 },
      { min: 10001, max: 15000, fee: 100 },
      { min: 15001, max: 20000, fee: 105 },
      { min: 20001, max: 25000, fee: 108 },
      { min: 25001, max: 30000, fee: 112 },
      { min: 30001, max: 35000, fee: 115 },
      { min: 35001, max: 40000, fee: 118 },
      { min: 40001, max: 45000, fee: 120 },
      { min: 45001, max: 50000, fee: 122 },
      { min: 50001, max: 150000, fee: 125 }
    ];

    const feeStructure = fees.find(f => amount >= f.min && amount <= f.max);
    return feeStructure ? feeStructure.fee : 125; // Default to highest fee
  }
}

// Export singleton instance
const mpesaService = new MpesaService();

module.exports = mpesaService;
