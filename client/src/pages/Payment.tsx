import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../services/api';
import { useFlutterwave, closePaymentModal } from 'flutterwave-react-v3';

interface OrderData {
  id: string;
  title: string;
  subject: string;
  academicLevel: string;
  wordCount: number;
  deadline: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'paypal' | 'crypto' | 'flutterwave';
  icon: string;
}

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData as OrderData;

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('flutterwave');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    city: '',
    zipCode: '',
    country: ''
  });

  const paymentMethods: PaymentMethod[] = [
    { id: 'flutterwave', name: 'Flutterwave', type: 'flutterwave', icon: '🌊' },
    { id: 'card', name: 'Credit/Debit Card', type: 'card', icon: '💳' },
    { id: 'paypal', name: 'PayPal', type: 'paypal', icon: '🅿️' },
    { id: 'crypto', name: 'Cryptocurrency', type: 'crypto', icon: '₿' }
  ];

  // For testing purposes, use sample data if no order data is provided
  const testOrderData = {
    id: 'test-order-123',
    title: 'Sample Research Paper',
    subject: 'Psychology',
    academicLevel: 'undergraduate',
    wordCount: 1000,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    totalPrice: 60.00,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  const currentOrderData = orderData || testOrderData;

  const handleInputChange = (field: string, value: string) => {
    setPaymentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const { isAuthenticated, user } = useAuth();

  // Flutterwave configuration
  const flutterwaveConfig = {
    public_key: process.env.REACT_APP_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-SANDBOXDEMOKEY-X',
    tx_ref: `GH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    amount: currentOrderData.totalPrice,
    currency: 'USD',
    payment_options: 'card,mobilemoney,ussd',
    customer: {
      email: user?.email || 'guest@gradeharvest.com',
      phone_number: '',
      name: user ? `${user.firstName} ${user.lastName}` : 'Guest User',
    },
    customizations: {
      title: 'GradeHarvest Payment',
      description: `Payment for ${currentOrderData.title}`,
      logo: 'https://your-logo-url.com/logo.png',
    },
  };

  const handleFlutterwavePayment = useFlutterwave(flutterwaveConfig);

  const handlePaymentSuccess = async (flutterwaveResponse?: any) => {
    setIsProcessing(true);
    
    try {
      // Store payment completion data
      const paymentCompletedData = {
        ...currentOrderData,
        status: 'pending', // Orders start as pending, not paid
        paymentStatus: 'paid',
        paymentMethod: selectedPaymentMethod,
        paidAt: new Date().toISOString(),
        requiresOrderCreation: location.state?.requiresOrderCreation || false,
        flutterwaveResponse: flutterwaveResponse || null
      };

      // Create order in database immediately after successful payment
      let createdOrder = null;
      
      try {
        // Get original order data from localStorage to access file attachments
        const storedOrderData = localStorage.getItem('pendingOrder');
        let originalOrderData = null;
        
        if (storedOrderData) {
          try {
            originalOrderData = JSON.parse(storedOrderData);
          } catch (e) {
            console.warn('Failed to parse stored order data:', e);
          }
        }

        // Get stored files from a separate storage mechanism
        const storedFiles = (window as any).pendingOrderFiles || [];

        // Prepare order data with proper requirements from original form
        const orderDataForAPI = {
          title: paymentCompletedData.title,
          subject: paymentCompletedData.subject,
          academicLevel: paymentCompletedData.academicLevel,
          paperType: originalOrderData?.paperType || 'essay',
          instructions: originalOrderData?.instructions || `Order created from payment flow for "${paymentCompletedData.title}". This order was automatically generated after successful payment processing. The client has paid for this work and it is ready for writer assignment.`,
          wordCount: paymentCompletedData.wordCount,
          deadline: new Date(paymentCompletedData.deadline).toISOString(),
          urgency: originalOrderData?.urgency || '7-days',
          requirements: originalOrderData?.requirements || {
            sources: 0,
            citationStyle: 'APA',
            spacing: 'double',
            language: 'English'
          },
          paymentStatus: 'paid',
          paymentMethod: selectedPaymentMethod,
          attachments: storedFiles // Include the actual file objects
        };

        if (isAuthenticated) {
          // Create order for authenticated user
          const orderResponse = await ordersAPI.createOrder(orderDataForAPI);
          createdOrder = (orderResponse.data as any).order;
          console.log('Order created successfully for authenticated user:', createdOrder);
          
        } else {
          // Create guest order
          const guestOrderData = {
            ...orderDataForAPI,
            // Guest information - will be collected during registration
            guestInfo: {
              firstName: 'Guest',
              lastName: 'User',
              email: 'guest@temp.com', // Temporary email, will be updated during registration
              isGuest: true
            }
          };
          
          const orderResponse = await ordersAPI.createGuestOrder(guestOrderData);
          createdOrder = (orderResponse.data as any).order;
          console.log('Guest order created successfully:', createdOrder);
        }
        
        // Store the created order data
        const finalOrderData = {
          ...paymentCompletedData,
          id: createdOrder.orderNumber || createdOrder._id,
          orderId: createdOrder._id,
          orderNumber: createdOrder.orderNumber,
          createdAt: createdOrder.createdAt,
          databaseStored: true
        };
        
        // Clean up localStorage since order is now in database
        localStorage.removeItem('completedPayment');
        
        // Navigate based on authentication status
        if (isAuthenticated) {
          // User is already logged in, proceed to order success
          navigate('/order-success', {
            state: {
              orderData: finalOrderData,
              fromDatabase: true
            }
          });
        } else {
          // Store order ID for linking after registration
          localStorage.setItem('pendingGuestOrderId', createdOrder._id);
          
          // User needs to register/login, redirect to register with payment completion context
          navigate('/register', {
            state: {
              fromPayment: true,
              orderData: finalOrderData,
              guestOrderId: createdOrder._id,
              message: 'Payment successful! Please create an account to complete your order.'
            }
          });
        }
        
      } catch (orderError) {
        console.error('Failed to create order in database:', orderError);
        
        // Fallback: Store in localStorage and show warning
        localStorage.setItem('completedPayment', JSON.stringify(paymentCompletedData));
        localStorage.setItem('orderCreationFailed', 'true');
        
        // Still navigate but with error context
        if (isAuthenticated) {
          navigate('/order-success', {
            state: {
              orderData: paymentCompletedData,
              orderCreationError: true,
              errorMessage: 'Payment successful, but there was an issue saving your order. Please contact support.'
            }
          });
        } else {
          navigate('/register', {
            state: {
              fromPayment: true,
              orderData: paymentCompletedData,
              orderCreationError: true,
              message: 'Payment successful! Please create an account. Note: There was an issue saving your order - our support team will assist you.'
            }
          });
        }
      }
      
    } catch (error) {
      console.error('Payment error:', error);
      // Handle payment error - show user-friendly message
      alert('Payment processing failed. Please try again or contact support.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePayment = async () => {
    if (selectedPaymentMethod === 'flutterwave') {
      handleFlutterwavePayment({
        callback: (response) => {
          console.log('Flutterwave response:', response);
          if (response.status === 'successful') {
            // Handle successful payment
            handlePaymentSuccess(response);
          } else {
            // Handle failed payment
            console.error('Payment failed:', response);
            alert('Payment failed. Please try again.');
          }
          closePaymentModal();
        },
        onClose: () => {
          console.log('Payment modal closed');
        },
      });
      return;
    }

    // Handle other payment methods (simulation for now)
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      await handlePaymentSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again or contact support.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/place-order')}
            className="inline-flex items-center text-navy hover:text-navy-light mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Order
          </button>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Complete Your Payment
          </h1>
          <p className="text-gray-600">
            Secure payment processing for your order
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-green-600" />
                Secure Payment
              </h2>

              {/* Payment Methods */}
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-4">Payment Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                      className={`p-4 border-2 rounded-lg text-center transition-colors ${
                        selectedPaymentMethod === method.id
                          ? 'border-navy bg-navy-light text-white'
                          : 'border-gray-200 hover:border-navy'
                      }`}
                    >
                      <div className="text-2xl mb-2">{method.icon}</div>
                      <div className="font-medium">{method.name}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Flutterwave */}
              {selectedPaymentMethod === 'flutterwave' && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🌊</div>
                  <p className="text-gray-600 mb-4">
                    Pay securely with Flutterwave. Supports cards, mobile money, and bank transfers.
                  </p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                    <p className="text-sm text-blue-700">
                      <strong>Supported payment methods:</strong> Visa, Mastercard, Mobile Money (MTN, Airtel), Bank Transfer, USSD
                    </p>
                  </div>
                </div>
              )}

              {/* Card Payment Form */}
              {selectedPaymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Card Number *
                    </label>
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Expiry Date *
                      </label>
                      <input
                        type="text"
                        value={paymentData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        CVV *
                      </label>
                      <input
                        type="text"
                        value={paymentData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        placeholder="123"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cardholder Name *
                    </label>
                    <input
                      type="text"
                      value={paymentData.cardholderName}
                      onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                      placeholder="John Doe"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Billing Address *
                      </label>
                      <input
                        type="text"
                        value={paymentData.billingAddress}
                        onChange={(e) => handleInputChange('billingAddress', e.target.value)}
                        placeholder="123 Main St"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={paymentData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="New York"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={paymentData.zipCode}
                        onChange={(e) => handleInputChange('zipCode', e.target.value)}
                        placeholder="10001"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Country *
                      </label>
                      <select
                        value={paymentData.country}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy focus:border-transparent"
                        required
                      >
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="UK">United Kingdom</option>
                        <option value="AU">Australia</option>
                        <option value="DE">Germany</option>
                        <option value="FR">France</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* PayPal */}
              {selectedPaymentMethod === 'paypal' && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🅿️</div>
                  <p className="text-gray-600 mb-4">
                    You will be redirected to PayPal to complete your payment securely.
                  </p>
                </div>
              )}

              {/* Cryptocurrency */}
              {selectedPaymentMethod === 'crypto' && (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">₿</div>
                  <p className="text-gray-600 mb-4">
                    Pay with Bitcoin, Ethereum, or other supported cryptocurrencies.
                  </p>
                </div>
              )}

              {/* Payment Button */}
              <div className="mt-8">
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing Payment...
                    </>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" />
                      Pay ${currentOrderData.totalPrice.toFixed(2)}
                    </>
                  )}
                </button>
              </div>

              {/* Security Notice */}
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <p className="text-sm text-green-700">
                    Your payment information is encrypted and secure. We never store your card details.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Paper Title:</span>
                  <span className="font-medium text-right">{currentOrderData.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Subject:</span>
                  <span className="font-medium">{currentOrderData.subject}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Academic Level:</span>
                  <span className="font-medium">{currentOrderData.academicLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Word Count:</span>
                  <span className="font-medium">{currentOrderData.wordCount} words</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pages:</span>
                  <span className="font-medium">{Math.ceil(currentOrderData.wordCount / 250)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deadline:</span>
                  <span className="font-medium">
                    {new Date(currentOrderData.deadline).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-bold">
                  <span>Total:</span>
                  <span className="text-navy">${currentOrderData.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">What happens next?</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Payment will be processed securely</li>
                  <li>• You'll receive an order confirmation</li>
                  <li>• A qualified writer will be assigned</li>
                  <li>• You can track progress in your dashboard</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
