import axios from 'axios';

// Use environment variable or fallback to localhost
const API_BASE_URL = (window as any).env?.REACT_APP_API_URL 
  ? `${(window as any).env.REACT_APP_API_URL}/api` 
  : '/api'; // This will use the proxy configuration

// Debug logging utility
const debugLog = (type: string, message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.group(`🔍 [API DEBUG] ${type} - ${timestamp}`);
  console.log(`📝 Message: ${message}`);
  if (data) {
    console.log('📊 Data:', data);
  }
  console.groupEnd();
};

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token with debug logging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Debug logging for outgoing requests
    debugLog('REQUEST', `${config.method?.toUpperCase()} ${config.url}`, {
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      headers: config.headers,
      data: config.data,
      timeout: config.timeout,
      hasToken: !!token
    });

    return config;
  },
  (error) => {
    debugLog('REQUEST_ERROR', 'Request interceptor error', {
      message: error.message,
      config: error.config
    });
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors with debug logging
api.interceptors.response.use(
  (response) => {
    // Debug logging for successful responses
    debugLog('RESPONSE_SUCCESS', `${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      responseTime: response.headers['x-response-time'] || 'N/A'
    });

    return response;
  },
  (error) => {
    // Debug logging for error responses
    const errorInfo = {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      baseURL: error.config?.baseURL,
      timeout: error.config?.timeout,
      responseData: error.response?.data,
      requestData: error.config?.data
    };

    debugLog('RESPONSE_ERROR', `API call failed: ${error.message}`, errorInfo);

    // Handle specific error cases
    if (error.code === 'ECONNABORTED') {
      debugLog('TIMEOUT_ERROR', 'Request timed out', {
        timeout: error.config?.timeout,
        url: error.config?.url
      });
    }

    if (error.code === 'ERR_NETWORK') {
      debugLog('NETWORK_ERROR', 'Network error - server may be down', {
        baseURL: error.config?.baseURL,
        url: error.config?.url
      });
    }

    if (error.response?.status === 401) {
      debugLog('AUTH_ERROR', 'Unauthorized - redirecting to login', {
        currentToken: localStorage.getItem('token') ? 'Present' : 'Missing',
        url: error.config?.url
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (email: string, password: string) => {
    debugLog('AUTH_LOGIN', 'Attempting login', {
      email,
      passwordLength: password.length,
      endpoint: '/auth/login',
      baseURL: API_BASE_URL
    });
    return api.post('/auth/login', { email, password });
  },
  
  register: (userData: any) =>
    api.post('/auth/register', userData),
  
  getMe: () =>
    api.get('/auth/me'),
  
  logout: () =>
    api.post('/auth/logout'),
  
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  
  resetPassword: (token: string, password: string) =>
    api.put(`/auth/reset-password/${token}`, { password }),
};

// Orders API calls
export const ordersAPI = {
  createOrder: (orderData: any) => {
    // If orderData contains files, use FormData
    if (orderData.attachments && orderData.attachments.length > 0) {
      const formData = new FormData();
      
      // Add all non-file fields
      Object.keys(orderData).forEach(key => {
        if (key !== 'attachments') {
          if (typeof orderData[key] === 'object') {
            formData.append(key, JSON.stringify(orderData[key]));
          } else {
            formData.append(key, orderData[key]);
          }
        }
      });
      
      // Add files
      orderData.attachments.forEach((file: File, index: number) => {
        formData.append(`attachment_${index}`, file);
      });
      
      return api.post('/orders', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      return api.post('/orders', orderData);
    }
  },
  
  createGuestOrder: (orderData: any) => {
    // If orderData contains files, use FormData
    if (orderData.attachments && orderData.attachments.length > 0) {
      const formData = new FormData();
      
      // Add all non-file fields
      Object.keys(orderData).forEach(key => {
        if (key !== 'attachments') {
          if (typeof orderData[key] === 'object') {
            formData.append(key, JSON.stringify(orderData[key]));
          } else {
            formData.append(key, orderData[key]);
          }
        }
      });
      
      // Add files
      orderData.attachments.forEach((file: File, index: number) => {
        formData.append(`attachment_${index}`, file);
      });
      
      return api.post('/orders/guest', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      return api.post('/orders/guest', orderData);
    }
  },
  
  getOrders: (params?: any) =>
    api.get('/orders', { params }),
  
  getOrder: (id: string) =>
    api.get(`/orders/${id}`),
  
  updateOrder: (id: string, data: any) =>
    api.put(`/orders/${id}`, data),
  
  applyForOrder: (id: string, applicationData: any) =>
    api.post(`/orders/${id}/apply`, applicationData),
  
  assignWriter: (id: string, writerId: string) =>
    api.put(`/orders/${id}/assign`, { writerId }),
  
  submitWork: (id: string, formData: FormData) =>
    api.post(`/orders/${id}/submit`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  requestRevision: (id: string, revisionData: any) =>
    api.post(`/orders/${id}/revision`, revisionData),
  
  completeOrder: (id: string, rating?: any) =>
    api.post(`/orders/${id}/complete`, rating),
  
  linkGuestOrder: (orderId: string, userData: any) =>
    api.put(`/orders/${orderId}/link-guest`, userData),
};

// Messages API calls
export const messagesAPI = {
  sendMessage: (messageData: any) =>
    api.post('/messages', messageData),
  
  getConversations: () =>
    api.get('/messages/conversations'),
  
  getConversation: (conversationId: string, params?: any) =>
    api.get(`/messages/conversations/${conversationId}`, { params }),
  
  markAsRead: (conversationId: string) =>
    api.put(`/messages/conversations/${conversationId}/read`),
  
  getUnreadCount: () =>
    api.get('/messages/unread-count'),
  
  startSupportConversation: () =>
    api.post('/messages/support'),
};

// Payments API calls
export const paymentsAPI = {
  processOrderPayment: (orderId: string, paymentData: any) =>
    api.post(`/payments/orders/${orderId}`, paymentData),
  
  getUserPayments: (params?: any) =>
    api.get('/payments', { params }),
  
  getPayment: (id: string) =>
    api.get(`/payments/${id}`),
  
  requestWithdrawal: (withdrawalData: any) =>
    api.post('/payments/withdrawals', withdrawalData),
  
  getWriterEarnings: () =>
    api.get('/payments/earnings'),
};

// Users API calls
export const usersAPI = {
  getUsers: (params?: any) =>
    api.get('/users', { params }),
  
  getUser: (id: string) =>
    api.get(`/users/${id}`),
  
  updateUser: (id: string, userData: any) =>
    api.put(`/users/${id}`, userData),
  
  updateProfile: (profileData: any) =>
    api.put('/auth/profile', profileData),
  
  getWriterApplications: () =>
    api.get('/users/writers/applications'),
  
  approveWriter: (id: string) =>
    api.put(`/users/writers/${id}/approve`),
  
  rejectWriter: (id: string) =>
    api.put(`/users/writers/${id}/reject`),
};

// Notifications API calls
export const notificationsAPI = {
  getNotifications: (params?: any) =>
    api.get('/notifications', { params }),
  
  markAsRead: (id: string) =>
    api.put(`/notifications/${id}/read`),
  
  markAllAsRead: () =>
    api.put('/notifications/mark-all-read'),
  
  getUnreadCount: () =>
    api.get('/notifications/unread-count'),
};

// Writer Applications API calls
export const writerApplicationsAPI = {
  submitApplication: (formData: FormData) =>
    api.post('/writer-applications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
  
  getApplicationStatus: (identifier: string) =>
    api.get(`/writer-applications/status/${identifier}`),
  
  getApplications: (params?: any) =>
    api.get('/writer-applications', { params }),
  
  getApplication: (id: string) =>
    api.get(`/writer-applications/${id}`),
  
  updateReviewStage: (id: string, stage: string, data: any) =>
    api.put(`/writer-applications/${id}/review/${stage}`, data),
};

export default api;
