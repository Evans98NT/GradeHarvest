import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Bell, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  return (
    <nav className="bg-navy text-white shadow-lg relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold hover:text-gray-300 transition">
            GradeHarvest
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {/* <Link to="/" className="hover:text-gray-300 transition">
              Home
            </Link> */}
            
            {!isAuthenticated ? (
              <>
                <Link to="/place-order" className="hover:text-gray-300 transition">
                  Place Order
                </Link>
                <Link to="/writer-landing" className="hover:text-gray-300 transition">
                  For Writers
                </Link>
                {/* <Link to="/admin" className="hover:text-gray-300 transition">
                  For Admin
                </Link> */}
                <div className="flex space-x-4">
                  <Link 
                    to="/login" 
                    className="hover:text-gray-300 transition px-4 py-2 rounded border border-white hover:bg-white hover:text-navy"
                  >
                    Login
                  </Link>
                  <Link 
                    to="/place-order" 
                    className="bg-white text-navy px-4 py-2 rounded hover:bg-gray-100 transition"
                  >
                  Order Now
                  </Link>
                </div>
              </>
            ) : (
              <>
                {/* Role-based navigation */}
                {user?.role === 'client' && (
                  <>
                    <Link to="/dashboard" className="hover:text-gray-300 transition">
                      My Orders
                    </Link>
                    <Link to="/place-order" className="hover:text-gray-300 transition">
                      Place Order
                    </Link>
                  </>
                )}
                
                {user?.role === 'writer' && (
                  <>
                    <Link to="/writers/dashboard" className="hover:text-gray-300 transition">
                      Dashboard
                    </Link>
                    <Link to="/writers/orders" className="hover:text-gray-300 transition">
                      Available Orders
                    </Link>
                  </>
                )}
                
                {['manager', 'support', 'accountant', 'tech'].includes(user?.role || '') && (
                  <Link to="/admin" className="hover:text-gray-300 transition">
                    Admin Panel
                  </Link>
                )}

                {/* Notifications and Messages */}
                <div className="flex items-center space-x-4">
                  <button className="relative hover:text-gray-300 transition">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      3
                    </span>
                  </button>
                  
                  <button className="relative hover:text-gray-300 transition">
                    <MessageCircle className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full h-4 w-4 flex items-center justify-center">
                      2
                    </span>
                  </button>
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={toggleUserMenu}
                    className="flex items-center space-x-2 hover:text-gray-300 transition"
                  >
                    <User className="h-5 w-5" />
                    <span>{user?.firstName}</span>
                  </button>
                  
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg py-2 z-50">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 hover:bg-gray-100 transition"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        to="/settings"
                        className="block px-4 py-2 hover:bg-gray-100 transition"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Settings
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 hover:bg-gray-100 transition flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white hover:text-gray-300">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-navy-light py-4">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="hover:text-gray-300 transition px-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              
              {!isAuthenticated ? (
                <>
                  <Link 
                    to="/place-order" 
                    className="hover:text-gray-300 transition px-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Place Order
                  </Link>
                  <Link 
                    to="/writers" 
                    className="hover:text-gray-300 transition px-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    For Writers
                  </Link>
                  <Link 
                    to="/admin" 
                    className="hover:text-gray-300 transition px-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    For Admin
                  </Link>
                  <Link 
                    to="/login" 
                    className="hover:text-gray-300 transition px-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="hover:text-gray-300 transition px-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              ) : (
                <>
                  {user?.role === 'client' && (
                    <>
                      <Link 
                        to="/dashboard" 
                        className="hover:text-gray-300 transition px-4"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      <Link 
                        to="/place-order" 
                        className="hover:text-gray-300 transition px-4"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Place Order
                      </Link>
                    </>
                  )}
                  
                  {user?.role === 'writer' && (
                    <>
                      <Link 
                        to="/writers/dashboard" 
                        className="hover:text-gray-300 transition px-4"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link 
                        to="/writers/orders" 
                        className="hover:text-gray-300 transition px-4"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Available Orders
                      </Link>
                    </>
                  )}
                  
                  <Link 
                    to="/profile" 
                    className="hover:text-gray-300 transition px-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left hover:text-gray-300 transition px-4"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
