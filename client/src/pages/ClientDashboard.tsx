import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  MessageCircle, 
  Download,
  Star,
  Plus
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../services/api';

interface Order {
  _id: string;
  orderNumber: string;
  title: string;
  subject: string;
  status: string;
  deadline: string;
  totalPrice: number;
  writer?: {
    firstName: string;
    lastName: string;
    writerProfile: {
      level: string;
      stats: {
        averageRating: number;
      };
    };
  };
  createdAt: string;
  progressPercentage: number;
  unreadMessages: {
    client: number;
  };
}

const ClientDashboard: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ordersAPI.getOrders();
      
      // Safely extract orders data with proper validation
      const responseData = response.data as any;
      let ordersData: Order[] = [];
      
      if (responseData && typeof responseData === 'object') {
        if (Array.isArray(responseData.data)) {
          ordersData = responseData.data;
        } else if (Array.isArray(responseData)) {
          ordersData = responseData;
        } else if (responseData.orders && Array.isArray(responseData.orders)) {
          ordersData = responseData.orders;
        }
      }
      
      setOrders(ordersData);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again.');
      setOrders([]); // Ensure orders is always an array
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'in-progress':
        return 'text-blue-600 bg-blue-100';
      case 'submitted':
        return 'text-purple-600 bg-purple-100';
      case 'revision-requested':
        return 'text-orange-600 bg-orange-100';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in-progress':
        return <Clock className="h-4 w-4" />;
      case 'submitted':
        return <FileText className="h-4 w-4" />;
      case 'revision-requested':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const filteredOrders = (orders || []).filter(order => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return ['pending', 'assigned', 'in-progress', 'submitted', 'revision-requested'].includes(order.status);
    if (activeTab === 'completed') return order.status === 'completed';
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (deadline: string) => {
    return new Date(deadline) < new Date();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            Manage your orders and track progress from your dashboard.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{(orders || []).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Orders</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(orders || []).filter(o => ['pending', 'assigned', 'in-progress', 'submitted', 'revision-requested'].includes(o.status)).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(orders || []).filter(o => o.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageCircle className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Unread Messages</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(orders || []).reduce((sum, order) => sum + (order.unreadMessages?.client || 0), 0)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Link
            to="/place-order"
            className="bg-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-navy-light transition-colors duration-200 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Place New Order</span>
          </Link>
          
          <button className="bg-white text-navy border border-navy px-6 py-3 rounded-lg font-semibold hover:bg-navy hover:text-white transition-colors duration-200 flex items-center space-x-2">
            <MessageCircle className="h-5 w-5" />
            <span>Contact Support</span>
          </button>
        </div>

        {/* Orders Section */}
        <div className="bg-white rounded-lg shadow">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'all', label: 'All Orders' },
                { key: 'active', label: 'Active Orders' },
                { key: 'completed', label: 'Completed' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-navy text-navy'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Orders List */}
          <div className="p-6">
            {error ? (
              <div className="text-center py-12">
                <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Orders</h3>
                <p className="text-gray-500 mb-6">{error}</p>
                <button
                  onClick={fetchOrders}
                  className="bg-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-navy-light transition-colors duration-200"
                >
                  Try Again
                </button>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-500 mb-6">
                  {activeTab === 'all' 
                    ? "You haven't placed any orders yet." 
                    : `No ${activeTab} orders found.`}
                </p>
                <Link
                  to="/place-order"
                  className="bg-navy text-white px-6 py-3 rounded-lg font-semibold hover:bg-navy-light transition-colors duration-200 inline-flex items-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Place Your First Order</span>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map(order => (
                  <div key={order._id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {order.title}
                          </h3>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            <span className="ml-1 capitalize">{order.status.replace('-', ' ')}</span>
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <span>Order #{order.orderNumber}</span>
                          <span>•</span>
                          <span>{order.subject}</span>
                          <span>•</span>
                          <span>${order.totalPrice}</span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>
                            Deadline: {formatDate(order.deadline)}
                            {isOverdue(order.deadline) && order.status !== 'completed' && (
                              <span className="text-red-600 font-medium ml-1">(Overdue)</span>
                            )}
                          </span>
                          {order.writer && (
                            <>
                              <span>•</span>
                              <span>
                                Writer: {order.writer.firstName} {order.writer.lastName}
                                <div className="inline-flex items-center ml-2">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  <span className="ml-1">{order.writer.writerProfile.stats.averageRating.toFixed(1)}</span>
                                </div>
                              </span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        {order.unreadMessages?.client > 0 && (
                          <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                            {order.unreadMessages.client} new
                          </span>
                        )}
                        
                        <button className="p-2 text-gray-400 hover:text-gray-600">
                          <MessageCircle className="h-5 w-5" />
                        </button>
                        
                        {order.status === 'completed' && (
                          <button className="p-2 text-gray-400 hover:text-gray-600">
                            <Download className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    {order.status !== 'completed' && order.status !== 'cancelled' && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{order.progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-navy h-2 rounded-full transition-all duration-300"
                            style={{ width: `${order.progressPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <Link
                        to={`/orders/${order._id}`}
                        className="text-navy hover:text-navy-light font-medium text-sm"
                      >
                        View Details
                      </Link>
                      
                      <Link
                        to={`/orders/${order._id}/messages`}
                        className="text-navy hover:text-navy-light font-medium text-sm"
                      >
                        Messages
                      </Link>
                      
                      {order.status === 'submitted' && (
                        <button className="text-green-600 hover:text-green-700 font-medium text-sm">
                          Approve Work
                        </button>
                      )}
                      
                      {order.status === 'submitted' && (
                        <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                          Request Revision
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
