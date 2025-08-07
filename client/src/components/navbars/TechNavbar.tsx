import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, MessageCircle, User, LogOut, Home, Server, Database, Settings, Code, Monitor, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const TechNavbar: React.FC = () => {
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
    <nav className="bg-gray-900 text-white shadow-sm border-b border-gray-700">
      <div className="px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Home */}
          <div className="flex items-center space-x-6">
            <Link to="/admin/tech" className="text-white font-bold text-xl">
              GradeHarvest Tech
            </Link>
            <Link 
              to="/admin/tech" 
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Home className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link 
              to="/admin/tech/servers" 
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Server className="h-5 w-5" />
              <span>Servers</span>
            </Link>
            
            <Link 
              to="/admin/tech/database" 
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Database className="h-5 w-5" />
              <span>Database</span>
            </Link>

            <Link 
              to="/admin/tech/monitoring" 
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Monitor className="h-5 w-5" />
              <span>Monitoring</span>
            </Link>

            <Link 
              to="/admin/tech/security" 
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Shield className="h-5 w-5" />
              <span>Security</span>
            </Link>

            <Link 
              to="/admin/tech/code" 
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Code className="h-5 w-5" />
              <span>Code</span>
            </Link>

            <Link 
              to="/admin/tech/settings" 
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
          </div>

          {/* Right side - User info and controls */}
          <div className="flex items-center space-x-4">
            {/* User greeting */}
            <div className="text-sm text-gray-300">
              Hello, <span className="text-white font-medium">{user?.firstName} {user?.lastName}</span>
            </div>

            {/* Notifications */}
            <button className="text-gray-300 hover:text-white transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                2
              </span>
            </button>

            {/* Messages */}
            <button className="text-gray-300 hover:text-white transition-colors relative">
              <MessageCircle className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                1
              </span>
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors"
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
                    to="/admin/tech/settings"
                    className="block px-4 py-2 hover:bg-gray-100 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    System Settings
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

export default TechNavbar;
