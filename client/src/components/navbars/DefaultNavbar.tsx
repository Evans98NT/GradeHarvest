import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ChevronDown, Phone } from 'lucide-react';

const DefaultNavbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleServices = () => setIsServicesOpen(!isServicesOpen);

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
            {/* Services Dropdown */}
            <div className="relative">
              <button 
                onClick={toggleServices}
                className="flex items-center space-x-1 hover:text-gray-300 transition"
              >
                <span>Services</span>
                <ChevronDown className="h-4 w-4" />
              </button>
              
              {isServicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white text-navy shadow-lg rounded-md py-2 z-50">
                  <Link 
                    to="/services/essay-writing" 
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    Essay Writing
                  </Link>
                  <Link 
                    to="/services/research-papers" 
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    Research Papers
                  </Link>
                  <Link 
                    to="/services/dissertations" 
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    Dissertations
                  </Link>
                  <Link 
                    to="/services/homework-help" 
                    className="block px-4 py-2 hover:bg-gray-100 transition"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    Homework Help
                  </Link>
                </div>
              )}
            </div>
            
            <Link 
              to="/about" 
              className="hover:text-gray-300 transition"
            >
              About us
            </Link>
            
            <Link 
              to="/guarantees" 
              className="hover:text-gray-300 transition"
            >
              Guarantees
            </Link>
            
            <Link 
              to="/testimonials" 
              className="hover:text-gray-300 transition"
            >
              Reviews
            </Link>
          </div>

          {/* Right Section - 24/7, Phone, Login, Order */}
          <div className="hidden md:flex items-center space-x-6">
            {/* 24/7 Support */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">24/7</span>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">19794064586</span>
              </div>
            </div>
            
            {/* Login Link */}
            <Link 
              to="/login" 
              className="hover:text-gray-300 transition"
            >
              Log in
            </Link>
            
            {/* Order Button */}
            <Link 
              to="/place-order" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded transition font-medium"
            >
              Order
            </Link>
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
              {/* Services Mobile */}
              <div className="px-4">
                <button 
                  onClick={toggleServices}
                  className="flex items-center justify-between w-full hover:text-gray-300 transition"
                >
                  <span>Services</span>
                  <ChevronDown className="h-4 w-4" />
                </button>
                {isServicesOpen && (
                  <div className="mt-2 ml-4 space-y-2">
                    <Link 
                      to="/services/essay-writing" 
                      className="block hover:text-gray-300 transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Essay Writing
                    </Link>
                    <Link 
                      to="/services/research-papers" 
                      className="block hover:text-gray-300 transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Research Papers
                    </Link>
                    <Link 
                      to="/services/dissertations" 
                      className="block hover:text-gray-300 transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Dissertations
                    </Link>
                    <Link 
                      to="/services/homework-help" 
                      className="block hover:text-gray-300 transition"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Homework Help
                    </Link>
                  </div>
                )}
              </div>
              
              <Link 
                to="/about" 
                className="hover:text-gray-300 transition px-4"
                onClick={() => setIsMenuOpen(false)}
              >
                About us
              </Link>
              
              <Link 
                to="/guarantees" 
                className="hover:text-gray-300 transition px-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Guarantees
              </Link>
              
              <Link 
                to="/reviews" 
                className="hover:text-gray-300 transition px-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Reviews
              </Link>
              
              {/* Mobile Support Info */}
              <div className="px-4 py-2 border-t border-navy-light">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm font-medium">24/7 Support:</span>
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">19794064586</span>
                </div>
              </div>
              
              <Link 
                to="/login" 
                className="hover:text-gray-300 transition px-4"
                onClick={() => setIsMenuOpen(false)}
              >
                Log in
              </Link>
              
              <Link 
                to="/place-order" 
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 mx-4 rounded transition font-medium text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Order
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default DefaultNavbar;
