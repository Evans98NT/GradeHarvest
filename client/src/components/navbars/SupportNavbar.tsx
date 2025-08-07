import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, MessageCircle, User, LogOut, Home, HelpCircle, Ticket, Users, FileText } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const SupportNavbar: React.FC = () => {
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
    <nav className="bg-green-800 text-white shadow-sm border-b border-green-700">
      <div className="px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Home */}
          <div className="flex items-center space-x-6">
            <Link to="/admin/support" className="text-white font-bold text-xl">
              GradeHarvest Support
            </Link>
            <Link 
              to="/admin/support" 
              className="flex items-center space-x-2 text-green-200 hover:text-white transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link 
              to="/admin/support/tickets" 
              className="flex items-center space-x-2 text-green-200 hover:text-white transition-colors"
            >
              <Ticket className="h-5 w-5" />
              <span>Tickets</span>
            </Link>
            
            <Link 
              to="/admin/support/users" 
              className="flex items-center space-x-2 text-green-200 hover:text-white transition-colors"
            >
              <Users className="h-5 w-5" />
              <span>Users</span>
            </Link>

            <Link 
              to="/admin/support/orders" 
              className="flex items-center space-x-2 text-green-200 hover:text-white transition-colors"
            >
              <FileText className="h-5 w-5" />
              <span>Orders</span>
            </Link>

            <Link 
              to="/admin/support/help" 
              className="flex items-center space-x-2 text-green-200 hover:text-white transition-colors"
            >
              <HelpCircle className="h-5 w-5" />
              <span>Help Center</span>
            </Link>
          </div>

          {/* Right side - User info and controls */}
          <div className="flex items-center space-x-4">
            {/* User greeting */}
            <div className="text-sm text-green-200">
              Hello, <span className="text-white font-medium">{user?.firstName} {user?.lastName}</span>
            </div>

            {/* Notifications */}
            <button className="text-green-200 hover:text-white transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                8
              </span>
            </button>

            {/* Messages */}
            <button className="text-green-200 hover:text-white transition-colors relative">
              <MessageCircle className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                12
              </span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 text-green-200 hover:text-white transition-colors"
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
                    to="/admin/support/settings"
                    className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Support Settings
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

export default SupportNavbar;
