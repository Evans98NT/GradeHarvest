import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, MessageCircle, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const WriterNavbar: React.FC = () => {
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

  // Mock user ID and balance for now - these would come from user data in real implementation
  const userID = "369274";
  const balance = "$30.96";

  return (
    <nav className="bg-gray-800 text-white shadow-sm border-b border-gray-700">
      <div className="px-6">
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/writers/dashboard" className="text-white font-semibold text-lg">
              GradeHarvest
            </Link>
          </div>

          {/* Right side - User info and controls */}
          <div className="flex items-center space-x-6">
            {/* User greeting with initials */}
            <div className="flex items-center space-x-3 text-sm text-gray-300">
              <span>Hello, <span className="text-white font-medium">{user?.firstName} {user?.lastName}</span> (ID: {userID})</span>
              <div className="bg-red-600 px-2 py-1 rounded-full">
                <span className="text-sm font-medium text-white">AW</span>
              </div>
            </div>

            {/* Notifications */}
            <button className="text-gray-300 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
            </button>

            {/* Messages */}
            <button className="text-gray-300 hover:text-white transition-colors">
              <MessageCircle className="h-5 w-5" />
            </button>

            {/* Balance */}
            <div className="flex items-center space-x-2 bg-gray-700 px-3 py-1 rounded">
              <span className="text-sm text-gray-300">Balance:</span>
              <span className="text-sm font-semibold text-white">{balance}</span>
            </div>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="text-gray-300 hover:text-white transition-colors"
              >
                <User className="h-5 w-5" />
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
                    to="/settings"
                    className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    Settings
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

export default WriterNavbar;
