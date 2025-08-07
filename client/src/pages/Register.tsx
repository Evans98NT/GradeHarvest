import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ordersAPI } from '../services/api';
import { User, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  country: string;
  role: 'client' | 'writer';
  agreeToTerms: boolean;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    country: '',
    role: 'client',
    agreeToTerms: false
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Check if user is coming from payment completion
  const fromPayment = location.state?.fromPayment;
  const paymentOrderData = location.state?.orderData;
  const paymentMessage = location.state?.message;

  useEffect(() => {
    // If coming from payment, force role to client since they're placing an order
    if (fromPayment) {
      setFormData(prev => ({ ...prev, role: 'client' }));
    }
  }, [fromPayment]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Country validation
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createOrderAfterRegistration = async () => {
    try {
      // Get the pending order data from localStorage
      const pendingOrderData = localStorage.getItem('pendingOrder');
      const completedPaymentData = localStorage.getItem('completedPayment');
      
      if (pendingOrderData && completedPaymentData) {
        const orderData = JSON.parse(pendingOrderData);
        const paymentData = JSON.parse(completedPaymentData);
        
        // Create FormData for the order
        const submitData = new FormData();
        submitData.append('title', orderData.title);
        submitData.append('subject', orderData.subject);
        submitData.append('academicLevel', orderData.academicLevel);
        submitData.append('paperType', orderData.paperType);
        submitData.append('instructions', orderData.instructions);
        submitData.append('wordCount', orderData.wordCount.toString());
        submitData.append('deadline', orderData.deadline);
        submitData.append('urgency', orderData.urgency);
        submitData.append('requirements', JSON.stringify(orderData.requirements));
        submitData.append('totalPrice', orderData.totalPrice.toString());
        
        // Add attachments if any (Note: Files might not persist in localStorage, this is a limitation)
        if (orderData.attachments && orderData.attachments.length > 0) {
          orderData.attachments.forEach((file: File, index: number) => {
            submitData.append(`attachment_${index}`, file);
          });
        }
        
        // Create the order
        const response = await ordersAPI.createOrder(submitData);
        
        if (response && response.data && (response.data as any).success) {
          // Clean up localStorage
          localStorage.removeItem('pendingOrder');
          localStorage.removeItem('completedPayment');
          
          // Navigate to order success with the created order data
          navigate('/order-success', {
            state: {
              orderData: {
                ...(response.data as any).order,
                status: 'paid',
                paymentMethod: paymentData.paymentMethod,
                paidAt: paymentData.paidAt
              }
            }
          });
        }
      }
    } catch (error) {
      console.error('Error creating order after registration:', error);
      // If order creation fails, still redirect to dashboard but show a message
      navigate('/dashboard', {
        state: {
          message: 'Registration successful! However, there was an issue creating your order. Please contact support.'
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const registrationData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        country: formData.country,
        role: formData.role
      };

      await register(registrationData);
      
      // If coming from payment, create the order after successful registration
      if (fromPayment && paymentOrderData) {
        await createOrderAfterRegistration();
      } else {
        // Normal registration flow
        if (formData.role === 'writer') {
          // Writers should complete the application form after registration
          navigate('/writer-application');
        } else {
          navigate('/dashboard');
        }
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      
      if (error.response?.data?.message) {
        setErrors({ submit: error.response.data.message });
      } else if (error.response?.status === 400) {
        setErrors({ submit: 'Invalid registration data. Please check your information.' });
      } else if (error.response?.status === 409) {
        setErrors({ submit: 'An account with this email already exists.' });
      } else {
        setErrors({ submit: 'Registration failed. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {fromPayment ? 'Complete your registration to finalize your order' : 'Join GradeHarvest and get started today'}
          </p>
        </div>

        {/* Payment Success Message */}
        {fromPayment && paymentMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
              <p className="text-green-800 text-sm font-medium">{paymentMessage}</p>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-lg" onSubmit={handleSubmit}>
          {/* Role Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              I want to register as:
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label className="relative">
                <input
                  type="radio"
                  name="role"
                  value="client"
                  checked={formData.role === 'client'}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${
                  formData.role === 'client' 
                    ? 'border-navy bg-navy text-white' 
                    : 'border-gray-300 hover:border-navy'
                }`}>
                  <User className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-medium">Client</span>
                  <p className="text-xs mt-1 opacity-75">Place orders</p>
                </div>
              </label>
              <label className="relative">
                <input
                  type="radio"
                  name="role"
                  value="writer"
                  checked={formData.role === 'writer'}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <div className={`p-4 border-2 rounded-lg cursor-pointer text-center transition-all ${
                  formData.role === 'writer' 
                    ? 'border-navy bg-navy text-white' 
                    : 'border-gray-300 hover:border-navy'
                }`}>
                  <User className="w-6 h-6 mx-auto mb-2" />
                  <span className="font-medium">Writer</span>
                  <p className="text-xs mt-1 opacity-75">Complete orders</p>
                </div>
              </label>
            </div>
          </div>

          {/* Name Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy ${
                  errors.firstName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="John"
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.firstName}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy ${
                  errors.lastName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Doe"
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="mt-1 relative">
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 pl-10 border rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="john@example.com"
              />
              <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 pl-10 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="mt-1 relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`block w-full px-3 py-2 pl-10 pr-10 border rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="••••••••"
              />
              <Lock className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Country Field */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700">
              Country
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-navy focus:border-navy ${
                errors.country ? 'border-red-300' : 'border-gray-300'
              }`}
            >
              <option value="">Select your country</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Sweden">Sweden</option>
              <option value="Norway">Norway</option>
              <option value="Denmark">Denmark</option>
              <option value="Kenya">Kenya</option>
              <option value="Nigeria">Nigeria</option>
              <option value="South Africa">South Africa</option>
              <option value="Ghana">Ghana</option>
              <option value="Uganda">Uganda</option>
              <option value="Tanzania">Tanzania</option>
              <option value="India">India</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Bangladesh">Bangladesh</option>
              <option value="Philippines">Philippines</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Singapore">Singapore</option>
              <option value="Other">Other</option>
            </select>
            {errors.country && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.country}
              </p>
            )}
          </div>

          {/* Terms Agreement */}
          <div>
            <label className="flex items-start">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="mt-1 h-4 w-4 text-navy focus:ring-navy border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <Link to="/terms" className="text-navy hover:text-navy-light">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-navy hover:text-navy-light">
                  Privacy Policy
                </Link>
              </span>
            </label>
            {errors.agreeToTerms && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.agreeToTerms}
              </p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                {errors.submit}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-navy hover:bg-navy-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Account...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Create Account
              </>
            )}
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-navy hover:text-navy-light">
                Sign in here
              </Link>
            </p>
          </div>
        </form>

        {/* Writer Application Note */}
        {formData.role === 'writer' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <strong>Note for Writers:</strong> After registration, you'll need to complete a separate writer application process to be approved for writing assignments.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
