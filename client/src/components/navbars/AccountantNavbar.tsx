import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, MessageCircle, User, LogOut, Home, DollarSign, FileText, BarChart3, Calculator, CreditCard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AccountantNavbar: React.FC = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  return (
    <nav className="bg-indigo-800 text-white shadow-sm border-b border-indigo-700">
      <div className="px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Home */}
          <div className="flex items-center space-x-6">
            <Link to="/admin/accountant" className="text-white font-bold text-xl">
              GradeHarvest Finance
            </Link>
            <Link 
              to="/admin/accountant" 
              className="flex items-center space-x-2 text-indigo-200 hover:text-white transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link 
              to="/admin/accountant/payments" 
              className="flex items-center space-x-2 text-indigo-200 hover:text-white transition-colors"
            >
              <CreditCard className="h-5 w-5" />
              <span>Payments</span>
            </Link>
            
            <Link 
              to="/admin/accountant/invoices" 
              className="flex items-center space-x-2 text-indigo-200 hover:text-white transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span>Invoices</span>
            </Link>

            <Link 
              to="/admin/accountant/revenue" 
              className="flex items-center space-x-2 text-indigo-200 hover:text-white transition-colors"
            >
              <DollarSign className="h-5 w-5" />
              <span>Revenue</span>
            </Link>

            <Link 
              to="/admin/accountant/reports" 
              className="flex items-center space-x-2 text-indigo-200 hover:text-white transition-colors"
            >
              <BarChart3 className="h-5 w-5" />
              <span>Reports</span>
            </Link>

            <Link 
              to="/admin/accountant/calculator" 
              className="flex items-center space-x-2 text-indigo-200 hover:text-white transition-colors"
            >
              <Calculator className="h-5 w-5" />
              <span>Calculator</span>
            </Link>
          </div>

          {/* Right side - User info and controls */}
          <div className="flex items-center space-x-4">
            {/* User greeting */}
            <div className="text-sm text-indigo-200">
              Hello, <span className="text-white font-medium">{user?.firstName} {user?.lastName}</span>
            </div>

            {/* Notifications */}
            <button className="text-indigo-200 hover:text-white transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                4
              </span>
            </button>

            {/* Messages */}
            <button className="text-indigo-200 hover:text-white transition-colors relative">
              <MessageCircle className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                1
              </span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 text-indigo-200 hover:text-white transition-colors"
              >
                <User className="h-5 w-5" />
                <span>{user?.firstName}</span>
              </button>
              
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/admin/accountant/settings"
                    className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Finance Settings
                  </Link>
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors flex items-center space-x-2"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AccountantNavbar;
