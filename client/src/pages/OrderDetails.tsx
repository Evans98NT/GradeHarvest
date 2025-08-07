import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ChevronDown,
  ChevronUp,
  AlertCircle,
  FileText,
  Paperclip,
  Upload,
  Send,
  Info
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI, messagesAPI } from '../services/api';

interface Order {
  _id: string;
  orderNumber: string;
  title: string;
  subject: string;
  status: string;
  deadline: string;
  totalPrice: number;
  client: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
  completedAt?: string;
  academicLevel?: string;
  wordCount?: number;
  instructions?: string;
  urgency?: string;
  formattingStyle?: string;
  languageStyle?: string;
  sources?: number;
  attachments?: Array<{
    filename: string;
    url: string;
    uploadedAt: string;
  }>;
}

interface Message {
  _id: string;
  sender: {
    _id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  content: string;
  createdAt: string;
  isRead: boolean;
}

const OrderDetails: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'support' | 'customer'>('support');
  const [newMessage, setNewMessage] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [submissionFile, setSubmissionFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Mock data based on the screenshot
  const mockOrder = {
    _id: '3957441',
    orderNumber: '3957441',
    title: 'Data work Mapblomas',
    subject: 'Geography',
    status: 'completed',
    deadline: '2025-08-03T20:58:00Z',
    totalPrice: 30.96,
    client: {
      _id: '959548',
      firstName: 'Customer',
      lastName: 'Name'
    },
    createdAt: '2025-08-06T21:41:00Z',
    completedAt: '2025-08-03T20:54:00Z',
    academicLevel: 'Undergraduate',
    wordCount: 1650,
    instructions: 'Hi the work hasn\'t been presented on a word document with the data work on R downloaded from there onto a document.',
    formattingStyle: 'Harvard',
    languageStyle: 'English (U.K.)',
    sources: 15,
    attachments: [
      {
        filename: 'spatial-analysis-of-amazon-deforestation.docx',
        url: '#',
        uploadedAt: '2025-08-03T20:53:00Z'
      },
      {
        filename: 'finr-project.rar',
        url: '#',
        uploadedAt: '2025-08-03T05:11:00Z'
      }
    ]
  };

  const mockMessages = [
    {
      _id: '1',
      sender: {
        _id: 'jade123',
        firstName: 'Jade',
        lastName: 'Support',
        role: 'support'
      },
      content: 'Dear Anthony Oloo,\nWe have received the customer\'s instructions and activated the Revision. Please, review the requirements and pay attention to the deadline. Good luck!',
      createdAt: '2025-08-03T00:00:00Z',
      isRead: true
    },
    {
      _id: '2',
      sender: {
        _id: 'customer123',
        firstName: 'Customer',
        lastName: 'User',
        role: 'client'
      },
      content: 'Okay, thanks a lot',
      createdAt: '2025-08-03T00:05:00Z',
      isRead: true
    }
  ];

  useEffect(() => {
    // Use mock data for now
    setOrder(mockOrder as any);
    setMessages(mockMessages as any);
    setLoading(false);
  }, [orderId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateOnly = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    // Implementation for sending message
    setNewMessage('');
  };

  const handleFileUpload = async () => {
    if (!submissionFile) return;
    // Implementation for file upload
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order not found</h2>
          <button
            onClick={() => navigate('/writers/dashboard')}
            className="text-red-600 hover:text-red-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="px-3 py-1 rounded text-sm font-medium uppercase bg-teal-600 text-white">
                COMPLETED
              </span>
              <span className="text-lg font-semibold text-gray-900">
                Order ID: {order.orderNumber}
              </span>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600 flex items-center">
                Total: ${order.totalPrice}
                <Info className="h-4 w-4 ml-1 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Info</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Customer's subject:</span>
                    <p className="text-gray-900">{order.subject}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-600">Topic:</span>
                    <p className="text-gray-900">{order.title}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-600">Type of work:</span>
                    <p className="text-gray-900">Assignment</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-600">Level:</span>
                    <p className="text-gray-900">{order.academicLevel}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-600">Number of pages:</span>
                    <p className="text-gray-900">
                      {Math.ceil((order.wordCount || 0) / 275)} pages = {order.wordCount} words (${(order.totalPrice * 0.3).toFixed(2)})
                    </p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-600">Formatting style:</span>
                    <p className="text-gray-900">{order.formattingStyle}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-600">Language Style:</span>
                    <p className="text-gray-900">{order.languageStyle}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-600">Sources:</span>
                    <p className="text-gray-900">{order.sources}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-600">Customer ID:</span>
                    <p className="text-gray-900">{order.client._id}</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <span className="text-sm font-medium text-gray-600">Deadline:</span>
                    <p className="text-gray-900">{formatDate(order.deadline)}</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-600">Customer Time:</span>
                    <p className="text-gray-900">{formatDate(order.createdAt)} (GMT +01:00)</p>
                  </div>
                  
                  <div>
                    <span className="text-sm font-medium text-gray-600">Completed:</span>
                    <p className="text-gray-900">
                      {order.completedAt ? formatDate(order.completedAt) : 'Not completed'}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <AlertCircle className="h-4 w-4 text-orange-500" />
                    <span>UK spelling</span>
                    <span className="text-gray-400">|</span>
                    <span>275 words per page</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Instructions</h2>
                <button
                  onClick={() => setShowInstructions(!showInstructions)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <span className="text-sm">View more</span>
                  {showInstructions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
              </div>
              
              <div className={`text-gray-700 ${showInstructions ? '' : 'line-clamp-3'}`}>
                {order.instructions}
              </div>
              
              <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
                <FileText className="h-4 w-4 text-green-600" />
                <span>Looking for referencing style templates?</span>
                <button className="text-red-600 hover:text-red-700 underline">
                  Click here
                </button>
              </div>
            </div>

            {/* Paper Upload Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Paper</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload file <span className="text-red-500">*</span>
                </label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <input
                    type="file"
                    onChange={(e) => setSubmissionFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx"
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <p className="text-gray-600">
                      Drag & drop any images or documents that might be helpful here, or{' '}
                      <span className="text-red-600 underline">browse</span>
                    </p>
                  </label>
                </div>
                
                <button
                  onClick={handleFileUpload}
                  disabled={!submissionFile || submitting}
                  className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  UPLOAD PAPER
                </button>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center space-x-2 text-sm text-orange-600 mb-2">
                  <AlertCircle className="h-4 w-4" />
                  <span className="font-medium">Make sure these requirements are met:</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span>UK spelling</span>
                  <span className="text-gray-400">|</span>
                  <span>275 words per page</span>
                </div>
              </div>
              
              {/* Attachments History */}
              <div className="mt-6">
                <button
                  onClick={() => setShowAttachments(!showAttachments)}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                  <span className="text-sm font-medium">Hide attachments history</span>
                  {showAttachments ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>
                
                {showAttachments && order.attachments && (
                  <div className="space-y-3">
                    {order.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Paperclip className="h-4 w-4 text-gray-500" />
                          <span className="text-sm text-gray-700">{attachment.filename}</span>
                        </div>
                        <div className="text-xs text-gray-500">
                          Downloaded on {formatDateOnly(attachment.uploadedAt)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Messaging Sidebar */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-fit">
            {/* Message Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab('support')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium ${
                  activeTab === 'support'
                    ? 'text-white bg-green-600 rounded-tl-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>Support</span>
              </button>
              <button
                onClick={() => setActiveTab('customer')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 text-sm font-medium ${
                  activeTab === 'customer'
                    ? 'text-white bg-gray-600 rounded-tr-lg'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>Customer</span>
              </button>
            </div>

            {/* Response Time */}
            <div className="p-4 bg-gray-50 text-center">
              <p className="text-xs text-gray-600">Average response time - 3 minutes</p>
            </div>

            {/* Messages */}
            <div className="p-4 h-96 overflow-y-auto">
              <div className="space-y-4">
                {activeTab === 'support' && (
                  <div className="p-3 rounded-lg bg-green-500 text-white ml-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">Jade</span>
                      <span className="text-xs">August 3, 2025</span>
                    </div>
                    <p className="text-sm">
                      Dear Anthony Oloo,<br />
                      We have received the customer's instructions and activated the Revision. 
                      Please, review the requirements and pay attention to the deadline. Good luck!
                    </p>
                  </div>
                )}
                
                {activeTab === 'customer' && (
                  <div className="p-3 rounded-lg bg-gray-100 mr-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-gray-700">Customer</span>
                      <span className="text-xs text-gray-500">Read ✓</span>
                    </div>
                    <p className="text-sm text-gray-800">Okay, thanks a lot</p>
                  </div>
                )}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Write a message..."
                  rows={3}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent resize-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">Press Enter to send message</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
