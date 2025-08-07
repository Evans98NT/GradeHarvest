import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getRoleBasedDashboardRoute, UserRole } from '../utils/roleRedirects';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🔍 [LOGIN DEBUG] Form submission started');
    console.log('🔍 [LOGIN DEBUG] Email:', email);
    console.log('🔍 [LOGIN DEBUG] Password length:', password.length);
    
    setIsLoading(true);
    setError('');

    try {
      console.log('🔍 [LOGIN DEBUG] Calling login function from AuthContext');
      await login(email, password);
      
      console.log('🔍 [LOGIN DEBUG] Login successful, redirecting...');
      
      // Get the user data from localStorage since the context might not be updated yet
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        const dashboardRoute = getRoleBasedDashboardRoute(parsedUser.role as UserRole);
        console.log('🔍 [LOGIN DEBUG] Redirecting to role-based dashboard:', dashboardRoute);
        navigate(dashboardRoute);
      } else {
        // Fallback to default dashboard
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('🔍 [LOGIN DEBUG] Login failed:', err);
      console.error('🔍 [LOGIN DEBUG] Error message:', err.message);
      console.error('🔍 [LOGIN DEBUG] Error response:', err.response?.data);
      
      // Handle specific error cases
      if (err.response?.status === 429) {
        const retryAfter = err.response?.data?.retryAfter || 900; // Default to 15 minutes
        const minutes = Math.ceil(retryAfter / 60);
        setError(`Too many login attempts. Please try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.`);
      } else if (err.response?.status === 401) {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (err.response?.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        setError(err.response?.data?.message || err.message || 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
      console.log('🔍 [LOGIN DEBUG] Login attempt completed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-6 text-center">Login to GradeHarvest</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="you@example.com"
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 font-semibold">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            placeholder="Enter your password"
            required
            disabled={isLoading}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-navy text-white py-2 rounded hover:bg-navy-light transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default Login;
