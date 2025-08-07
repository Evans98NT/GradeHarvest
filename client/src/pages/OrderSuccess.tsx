import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Clock, DollarSign, FileText, ArrowRight, Home, AlertTriangle } from 'lucide-react';
import { ordersAPI } from '../services/api';

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
  orderNumber?: string;
  orderId?: string;
  paymentStatus?: string;
  databaseStored?: boolean;
  [key: string]: any; // Allow additional properties
}

const OrderSuccess: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeOrderData = async () => {
      try {
        // Check if order data is passed from payment flow
        if (location.state && location.state.orderData) {
          const passedOrderData = location.state.orderData;
          
          // If order was stored in database, try to fetch the latest data
          if (passedOrderData.databaseStored && passedOrderData.orderId) {
            try {
              const response = await ordersAPI.getOrder(passedOrderData.orderId);
              setOrderData((response.data as any).order);
              console.log('Fetched order from database:', (response.data as any).order);
            } catch (fetchError) {
              console.warn('Could not fetch order from database, using passed data:', fetchError);
              setOrderData(passedOrderData);
            }
          } else {
            setOrderData(passedOrderData);
          }
          
          // Handle order creation errors
          if (location.state.orderCreationError) {
            setError(location.state.errorMessage || 'There was an issue saving your order to our database.');
          }
        } 
        // Check localStorage for completed payment data (fallback)
        else {
          const completedPayment = localStorage.getItem('completedPayment');
          const orderCreationFailed = localStorage.getItem('orderCreationFailed');
          
          if (completedPayment) {
            const paymentData = JSON.parse(completedPayment);
            setOrderData(paymentData);
            
            if (orderCreationFailed) {
              setError('Payment was successful, but there was an issue saving your order. Please contact support.');
              localStorage.removeItem('orderCreationFailed');
            }
            
            // Clean up localStorage
            localStorage.removeItem('completedPayment');
          } else {
            // No order data available, redirect to place order page
            navigate('/place-order');
            return;
          }
        }
      } catch (err) {
        console.error('Error initializing order data:', err);
        setError('An unexpected error occurred. Please contact support if you need assistance with your order.');
      } finally {
        setLoading(false);
      }
    };

    initializeOrderData();
  }, [location.state, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-4">We couldn't find your order details.</p>
          <button
            onClick={() => navigate('/place-order')}
            className="bg-navy text-white px-6 py-2 rounded-lg hover:bg-navy-light transition-colors"
          >
            Place New Order
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto max-w-4xl px-6">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 text-lg">
            Thank you for choosing GradeHarvest. Your order has been received and is being processed.
          </p>
          
          {/* Error Alert */}
          {error && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                <p className="text-sm text-yellow-700">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Order Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Order ID</p>
                <p className="text-lg font-semibold text-navy">
                  {orderData.orderNumber || orderData.id}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">Status</p>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(orderData.status)}`}>
                  <Clock className="w-4 h-4 mr-1" />
                  {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                </span>
              </div>
              {orderData.paymentStatus && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Payment Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    orderData.paymentStatus === 'paid' ? 'text-green-600 bg-green-100' : 'text-yellow-600 bg-yellow-100'
                  }`}>
                    {orderData.paymentStatus.charAt(0).toUpperCase() + orderData.paymentStatus.slice(1)}
                  </span>
                </div>
              )}
              {orderData.databaseStored && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Database Status</p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-green-600 bg-green-100">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Saved
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                Order Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Title</p>
                  <p className="text-gray-800">{orderData.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Subject</p>
                  <p className="text-gray-800">{orderData.subject}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Academic Level</p>
                  <p className="text-gray-800">{orderData.academicLevel}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Word Count</p>
                  <p className="text-gray-800">{orderData.wordCount.toLocaleString()} words</p>
                </div>
              </div>
            </div>

            {/* Payment & Timeline */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2" />
                Payment & Timeline
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Amount</p>
                  <p className="text-2xl font-bold text-navy">${orderData.totalPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Deadline</p>
                  <p className="text-gray-800">{formatDate(orderData.deadline)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Order Placed</p>
                  <p className="text-gray-800">{formatDate(orderData.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-800 mb-4">What Happens Next?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                1
              </div>
              <div>
                <h4 className="font-semibold text-blue-800">Order Review</h4>
                <p className="text-blue-600 text-sm">Our team will review your order requirements within 30 minutes.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                2
              </div>
              <div>
                <h4 className="font-semibold text-blue-800">Writer Assignment</h4>
                <p className="text-blue-600 text-sm">A qualified writer will be assigned to your order based on expertise.</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                3
              </div>
              <div>
                <h4 className="font-semibold text-blue-800">Work Begins</h4>
                <p className="text-blue-600 text-sm">Your writer will start working on your order and keep you updated.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center justify-center px-6 py-3 bg-navy text-white rounded-lg font-semibold hover:bg-navy-light transition-colors"
          >
            <ArrowRight className="w-5 h-5 mr-2" />
            Go to Dashboard
          </button>
          <button
            onClick={() => navigate('/place-order')}
            className="inline-flex items-center justify-center px-6 py-3 border border-navy text-navy rounded-lg font-semibold hover:bg-navy hover:text-white transition-colors"
          >
            <FileText className="w-5 h-5 mr-2" />
            Place Another Order
          </button>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Back to Home
          </button>
        </div>

        {/* Support Information */}
        <div className="text-center mt-8 p-6 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            Our support team is available 24/7 to assist you with any questions about your order.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@gradeharvest.com"
              className="text-navy hover:text-navy-light font-semibold"
            >
              support@gradeharvest.com
            </a>
            <span className="hidden sm:inline text-gray-400">|</span>
            <a
              href="tel:+1-555-0123"
              className="text-navy hover:text-navy-light font-semibold"
            >
              +1 (555) 012-3456
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
