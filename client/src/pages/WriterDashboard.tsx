import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  MessageCircle, 
  DollarSign,
  Star,
  TrendingUp,
  Award,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Eye,
  EyeOff,
  Bell,
  BookOpen,
  HelpCircle,
  Mail,
  BarChart3,
  Wallet,
  Settings,
  User,
  Calendar,
  Target,
  Zap,
  Globe,
  Shield,
  Info,
  MessageSquare,
  Upload,
  Send,
  HandHeart,
  Gavel,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../services/api';
import WriterApplicationStatus from '../components/WriterApplicationStatus';

interface Order {
  _id: string;
  orderNumber: string;
  title: string;
  subject: string;
  status: string;
  deadline: string;
  totalPrice: number;
  client: {
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  progressPercentage: number;
  unreadMessages: {
    writer: number;
  };
  academicLevel?: string;
  wordCount?: number;
  instructions?: string;
  urgency?: string;
  applications?: Array<{
    writer: string;
    bidAmount: number;
    message: string;
    status: string;
  }>;
  completedAt?: string;
  rating?: {
    score: number;
    review: string;
  };
}

const WriterDashboard: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [availableOrders, setAvailableOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('available-orders');
  const [myOrdersExpanded, setMyOrdersExpanded] = useState(false);
  const [showTrialOrders, setShowTrialOrders] = useState(false);
  const [filterSubject, setFilterSubject] = useState('');
  const [grouping, setGrouping] = useState('no-grouping');
  const [showHiddenOrders, setShowHiddenOrders] = useState(false);
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching data for user:', user);
      
      const [myOrdersResponse, availableOrdersResponse] = await Promise.all([
        ordersAPI.getOrders({ writer: user?._id }),
        ordersAPI.getOrders({ status: 'pending' })
      ]);
      
      console.log('📊 My Orders Response:', myOrdersResponse);
      console.log('📊 Available Orders Response:', availableOrdersResponse);
      console.log('📊 My Orders Data:', myOrdersResponse.data);
      console.log('📊 Available Orders Data:', availableOrdersResponse.data);
      
      // Try both possible response structures
      const myOrders = (myOrdersResponse.data as any).orders || (myOrdersResponse.data as any).data || [];
      const availableOrdersData = (availableOrdersResponse.data as any).orders || (availableOrdersResponse.data as any).data || [];
      
      console.log('📊 Processed My Orders:', myOrders);
      console.log('📊 Processed Available Orders:', availableOrdersData);
      console.log('📊 Available Orders Length:', availableOrdersData.length);
      
      setOrders(myOrders);
      setAvailableOrders(availableOrdersData);
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      setOrders([]);
      setAvailableOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getInProgressCount = () => {
    return orders.filter(order => ['assigned', 'in-progress', 'submitted', 'revision-requested'].includes(order.status)).length;
  };

  const getCompletedCount = () => {
    return orders.filter(order => order.status === 'completed').length;
  };

  const handleBidSubmit = async () => {
    if (!selectedOrder || !bidAmount || !bidMessage) return;

    try {
      setSubmitting(true);
      await ordersAPI.applyForOrder(selectedOrder._id, {
        bidAmount: parseFloat(bidAmount),
        message: bidMessage
      });
      
      // Refresh data
      await fetchData();
      
      // Close modal and reset form
      setBidModalOpen(false);
      setSelectedOrder(null);
      setBidAmount('');
      setBidMessage('');
      
      alert('Bid submitted successfully!');
    } catch (error) {
      console.error('Error submitting bid:', error);
      alert('Failed to submit bid. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTakeOrder = async (order: Order) => {
    if (!window.confirm(`Are you sure you want to take this order: "${order.title}"?`)) return;

    try {
      setSubmitting(true);
      await ordersAPI.assignWriter(order._id, user?._id || '');
      
      // Refresh data
      await fetchData();
      
      alert('Order taken successfully!');
    } catch (error) {
      console.error('Error taking order:', error);
      alert('Failed to take order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const openBidModal = (order: Order) => {
    setSelectedOrder(order);
    setBidAmount(order.totalPrice.toString());
    setBidMessage('');
    setBidModalOpen(true);
  };

  const formatDeadline = (deadline: string) => {
    const date = new Date(deadline);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Due today';
    if (diffDays === 1) return 'Due tomorrow';
    return `${diffDays} days left`;
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case '24-hours': return 'text-red-600 bg-red-50';
      case '3-days': return 'text-orange-600 bg-orange-50';
      case '7-days': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If user is not an active writer (pending application), show application status
  if (user?.role === 'writer' && user?.status !== 'active') {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome, {user?.firstName}!
            </h1>
            <p className="text-gray-600">
              Your writer application is currently being reviewed.
            </p>
          </div>
          
          <WriterApplicationStatus identifier={user?.email || ''} />
        </div>
      </div>
    );
  }

  const renderOrderRow = (order: Order, showActions: boolean = false) => {
    const hasApplied = order.applications?.some(app => app.writer === user?._id);
    const completedDate = order.completedAt ? new Date(order.completedAt) : null;
    const pages = Math.ceil((order.wordCount || 0) / 250); // Assuming 250 words per page
    const cpp = pages > 0 ? (order.totalPrice / pages).toFixed(2) : '0.00';
    
    return (
      <div key={order._id} className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors">
        <Link 
          to={`/writers/orders/${order._id}`}
          className="grid grid-cols-7 gap-4 p-4 items-center cursor-pointer block"
        >
          {/* Order Info */}
          <div className="col-span-1">
            <div className="flex items-start space-x-2">
              {order.status === 'completed' && (
                <div className="w-3 h-4 bg-red-600 rounded-sm mt-1 flex-shrink-0"></div>
              )}
              <div>
                <div className="font-semibold text-gray-900 text-sm">{order.orderNumber}</div>
                <div className="text-xs text-gray-600 mt-1">
                  <div><span className="font-medium">Subject:</span> {order.subject}</div>
                  <div><span className="font-medium">Type:</span> {order.academicLevel || 'Assignment'}</div>
                  <div><span className="font-medium">Topic:</span> {order.title}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="col-span-1 text-center">
            {completedDate ? (
              <div className="text-sm text-gray-700">
                <div>{completedDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div>{completedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            ) : (
              <div className="text-sm text-gray-500">-</div>
            )}
          </div>

          {/* Pages */}
          <div className="col-span-1 text-center">
            <div className="text-sm text-gray-700">{pages}</div>
          </div>

          {/* CPP (Cost Per Page) */}
          <div className="col-span-1 text-center">
            <div className="text-sm text-gray-700">${cpp}</div>
          </div>

          {/* Total - Show 30% for writers */}
          <div className="col-span-1 text-center">
            <div className="text-sm font-semibold text-gray-900">${(order.totalPrice * 0.3).toFixed(2)}</div>
          </div>

          {/* Status */}
          <div className="col-span-1 text-center">
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
              order.status === 'completed' ? 'bg-green-100 text-green-800' :
              order.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
              order.status === 'assigned' ? 'bg-blue-100 text-blue-800' :
              order.status === 'submitted' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {order.status === 'completed' ? 'Paid' : 
               order.status === 'in-progress' ? 'In Progress' :
               order.status === 'assigned' ? 'Assigned' :
               order.status === 'submitted' ? 'Submitted' :
               order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          {/* Feedback Score */}
          <div className="col-span-1 text-center">
            {order.rating ? (
              <div className="text-sm text-gray-700">{order.rating.score}/10</div>
            ) : (
              <div className="text-sm text-gray-500">-</div>
            )}
          </div>
        </Link>

        {/* Action buttons for available orders */}
        {showActions && (
          <div className="px-4 pb-4">
            <div className="flex space-x-3">
              {hasApplied ? (
                <div className="flex-1 bg-gray-100 text-gray-600 px-4 py-2 rounded-lg text-center text-sm font-medium">
                  Application Submitted
                </div>
              ) : (
                <>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      openBidModal(order);
                    }}
                    disabled={submitting}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Gavel className="h-4 w-4" />
                    <span>Place Bid</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleTakeOrder(order);
                    }}
                    disabled={submitting}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <HandHeart className="h-4 w-4" />
                    <span>Take Order</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderInProgressOrders = () => {
    const inProgressOrders = orders.filter(order => 
      ['assigned', 'in-progress', 'submitted', 'revision-requested'].includes(order.status)
    ).sort((a, b) => {
      const dateA = a.deadline ? new Date(a.deadline).getTime() : 0;
      const dateB = b.deadline ? new Date(b.deadline).getTime() : 0;
      return dateA - dateB;
    });

    if (inProgressOrders.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <Clock className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders in progress</h3>
          <p className="text-gray-500">Orders you're working on will appear here.</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-7 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-sm text-gray-700">
          <div className="col-span-1">Order info</div>
          <div className="col-span-1 text-center">Completed ▲</div>
          <div className="col-span-1 text-center">Pages ▲</div>
          <div className="col-span-1 text-center">CPP ▲</div>
          <div className="col-span-1 text-center">Total ▲</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1 text-center">Feedback score</div>
        </div>
        {/* Table Body */}
        {inProgressOrders.map(order => renderOrderRow(order, false))}
      </div>
    );
  };

  const renderCompletedOrders = () => {
    const completedOrders = orders.filter(order => order.status === 'completed').sort((a, b) => {
      const dateA = a.completedAt ? new Date(a.completedAt).getTime() : 0;
      const dateB = b.completedAt ? new Date(b.completedAt).getTime() : 0;
      return dateB - dateA;
    });

    if (completedOrders.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No completed orders</h3>
          <p className="text-gray-500">Completed orders will appear here.</p>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-7 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-sm text-gray-700">
          <div className="col-span-1">Order info</div>
          <div className="col-span-1 text-center">Completed ▲</div>
          <div className="col-span-1 text-center">Pages ▲</div>
          <div className="col-span-1 text-center">CPP ▲</div>
          <div className="col-span-1 text-center">Total ▲</div>
          <div className="col-span-1 text-center">Status</div>
          <div className="col-span-1 text-center">Feedback score</div>
        </div>
        {/* Table Body */}
        {completedOrders.map(order => renderOrderRow(order, false))}
      </div>
    );
  };

  const renderEmptyState = () => {
    return (
      <div className="text-center py-16">
        <div className="w-32 h-32 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
          <Search className="h-16 w-16 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">There are no available orders right now.</h3>
        <p className="text-gray-500 mb-6">Once any available orders appear, they will be automatically displayed. No need to refresh the page.</p>
      </div>
    );
  };

  const renderMainContent = () => {
    switch (activeSection) {
      case 'available-orders':
        return (
          <div className="space-y-6">
            {/* AI Warning Banner */}
            <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-r-lg shadow-sm">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Info className="h-5 w-5 text-orange-400 mt-0.5" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-orange-800 leading-relaxed">
                    Using AI tools like ChatGPT for task completion is prohibited and may result in a $500 fine. To avoid client complaints, verify your work with widely used AI detectors like Turnitin, Scribbr, and GPTZero before submission. Check only the main body of the document, excluding the title page and references section.
                  </p>
                </div>
              </div>
            </div>

            {/* Orders Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Orders</h2>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showTrialOrders}
                      onChange={(e) => setShowTrialOrders(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      showTrialOrders ? 'bg-red-600' : 'bg-gray-200'
                    }`}>
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        showTrialOrders ? 'translate-x-6' : 'translate-x-1'
                      }`} />
                    </div>
                    <span className="ml-2 text-sm text-gray-700">Show trial orders</span>
                  </label>
                </div>

                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-600 focus:border-transparent"
                >
                  <option value="">Filter by subject</option>
                  <option value="mathematics">Mathematics</option>
                  <option value="english">English</option>
                  <option value="science">Science</option>
                  <option value="history">History</option>
                </select>

                <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setGrouping('no-grouping')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      grouping === 'no-grouping' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    No grouping
                  </button>
                  <button
                    onClick={() => setGrouping('by-subject')}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      grouping === 'by-subject' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    By subject
                  </button>
                </div>

                <button
                  onClick={() => setShowHiddenOrders(!showHiddenOrders)}
                  className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {showHiddenOrders ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span>View hidden orders</span>
                </button>
              </div>
            </div>

            {availableOrders.length === 0 ? renderEmptyState() : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Table Header */}
                <div className="grid grid-cols-7 gap-4 p-4 bg-gray-50 border-b border-gray-200 font-medium text-sm text-gray-700">
                  <div className="col-span-1">Order info</div>
                  <div className="col-span-1 text-center">Completed ▲</div>
                  <div className="col-span-1 text-center">Pages ▲</div>
                  <div className="col-span-1 text-center">CPP ▲</div>
                  <div className="col-span-1 text-center">Total ▲</div>
                  <div className="col-span-1 text-center">Status</div>
                  <div className="col-span-1 text-center">Feedback score</div>
                </div>
                {/* Table Body */}
                {availableOrders.map(order => renderOrderRow(order, true))}
              </div>
            )}
          </div>
        );

      case 'in-progress':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Orders in Progress</h2>
            </div>
            {renderInProgressOrders()}
          </div>
        );

      case 'completed':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Completed Orders</h2>
            </div>
            {renderCompletedOrders()}
          </div>
        );

      default:
        return (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Settings className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Feature Coming Soon</h3>
            <p className="text-gray-500">This section is under development and will be available soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-sm min-h-screen border-r border-gray-200">
          <div className="py-6">
            <nav className="space-y-1">
              {/* Available Orders */}
              <button
                onClick={() => setActiveSection('available-orders')}
                className={`w-full flex items-center px-6 py-3 text-left text-sm font-medium transition-colors ${
                  activeSection === 'available-orders'
                    ? 'text-red-600 bg-red-50 border-r-2 border-red-600'
                    : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                }`}
              >
                <Globe className="h-5 w-5 mr-3" />
                Available Orders
              </button>

              {/* My Orders */}
              <div>
                <button
                  onClick={() => setMyOrdersExpanded(!myOrdersExpanded)}
                  className={`w-full flex items-center justify-between px-6 py-3 text-left text-sm font-medium transition-colors ${
                    ['in-progress', 'completed'].includes(activeSection)
                      ? 'text-red-600 bg-red-50'
                      : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-3" />
                    My Orders
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${
                    myOrdersExpanded ? 'rotate-180' : ''
                  }`} />
                </button>

                {/* Sub-items for My Orders */}
                {myOrdersExpanded && (
                  <div className="bg-gray-50">
                    <button
                      onClick={() => setActiveSection('in-progress')}
                      className={`w-full flex items-center justify-between px-12 py-2 text-left text-sm transition-colors ${
                        activeSection === 'in-progress'
                          ? 'text-red-600 bg-red-50'
                          : 'text-gray-600 hover:text-red-600'
                      }`}
                    >
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        In progress
                      </div>
                      {getInProgressCount() > 0 && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 text-xs rounded-full font-medium">
                          {getInProgressCount()}
                        </span>
                      )}
                    </button>
                    
                    <button
                      onClick={() => setActiveSection('completed')}
                      className={`w-full flex items-center justify-between px-12 py-2 text-left text-sm transition-colors ${
                        activeSection === 'completed'
                          ? 'text-red-600 bg-red-50'
                          : 'text-gray-600 hover:text-red-600'
                      }`}
                    >
                      <div className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Completed
                      </div>
                      {getCompletedCount() > 0 && (
                        <span className="bg-red-100 text-red-800 px-2 py-1 text-xs rounded-full font-medium">
                          {getCompletedCount()}
                        </span>
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Payments */}
              <button
                onClick={() => setActiveSection('payments')}
                className={`w-full flex items-center px-6 py-3 text-left text-sm font-medium transition-colors ${
                  activeSection === 'payments'
                    ? 'text-red-600 bg-red-50 border-r-2 border-red-600'
                    : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                }`}
              >
                <Wallet className="h-5 w-5 mr-3" />
                Payments
              </button>

              {/* My Stats */}
              <button
                onClick={() => setActiveSection('my-stats')}
                className={`w-full flex items-center px-6 py-3 text-left text-sm font-medium transition-colors ${
                  activeSection === 'my-stats'
                    ? 'text-red-600 bg-red-50 border-r-2 border-red-600'
                    : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                }`}
              >
                <BarChart3 className="h-5 w-5 mr-3" />
                My Stats
              </button>

              {/* Spacer */}
              <div className="py-4"></div>

              {/* News */}
              <button
                onClick={() => setActiveSection('news')}
                className={`w-full flex items-center px-6 py-3 text-left text-sm font-medium transition-colors ${
                  activeSection === 'news'
                    ? 'text-red-600 bg-red-50 border-r-2 border-red-600'
                    : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                }`}
              >
                <Bell className="h-5 w-5 mr-3" />
                News
              </button>

              {/* Writer's guide */}
              <button
                onClick={() => setActiveSection('writers-guide')}
                className={`w-full flex items-center px-6 py-3 text-left text-sm font-medium transition-colors ${
                  activeSection === 'writers-guide'
                    ? 'text-red-600 bg-red-50 border-r-2 border-red-600'
                    : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                }`}
              >
                <BookOpen className="h-5 w-5 mr-3" />
                Writer's guide
              </button>

              {/* Contact Us */}
              <button
                onClick={() => setActiveSection('contact-us')}
                className={`w-full flex items-center px-6 py-3 text-left text-sm font-medium transition-colors ${
                  activeSection === 'contact-us'
                    ? 'text-red-600 bg-red-50 border-r-2 border-red-600'
                    : 'text-gray-700 hover:text-red-600 hover:bg-gray-50'
                }`}
              >
                <Mail className="h-5 w-5 mr-3" />
                Contact Us
              </button>
            </nav>
          </div>

          {/* Feedback Button */}
          <div className="absolute bottom-6 left-6">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>feedback</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {renderMainContent()}
        </div>
      </div>

      {/* Bid Modal */}
      {bidModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Place Bid</h3>
              <button
                onClick={() => setBidModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-4">
              <h4 className="font-medium text-gray-900 mb-2">{selectedOrder.title}</h4>
              <p className="text-sm text-gray-600 mb-2">
                Original Price: <span className="font-semibold">${selectedOrder.totalPrice}</span>
              </p>
              <p className="text-sm text-gray-600">
                Deadline: {formatDeadline(selectedOrder.deadline)}
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Bid Amount ($)
                </label>
                <input
                  type="number"
                  value={bidAmount}
                  onChange={(e) => setBidAmount(e.target.value)}
                  min="1"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Enter your bid amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message to Client
                </label>
                <textarea
                  value={bidMessage}
                  onChange={(e) => setBidMessage(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Explain why you're the best fit for this order..."
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setBidModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBidSubmit}
                disabled={submitting || !bidAmount || !bidMessage}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {submitting ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Bid</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WriterDashboard;
