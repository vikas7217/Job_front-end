import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import './Navigation.css';

const Navigation: React.FC = () => {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY > 0;
      setIsSticky(scrolled);
      
      // Add/remove body padding for sticky header
      if (scrolled) {
        document.body.classList.add('header-sticky-active');
      } else {
        document.body.classList.remove('header-sticky-active');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.body.classList.remove('header-sticky-active');
    };
  }, []);

  return (
    <header className={`header-area ${isSticky ? 'header-sticky' : ''} bg-white shadow-sm relative z-20 transition-all duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between" style={{ minHeight: '75px' }}>
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="logo flex items-center space-x-3">
              <div className="relative">
                <img 
                  src="/logo-getset.svg" 
                  alt="JobPortal Logo" 
                  className="logo-img"
                  style={{ maxWidth: '55px', marginTop: '3px' }}
                />
              </div>
              
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/signup"
              className="flex items-center space-x-1 text-gray-900 hover:text-purple-600 cursor-pointer transition-colors"
            >
              <span className="text-sm font-medium">For Companies</span>
              <ChevronDownIcon className="w-4 h-4" />
            </Link>
            <Link
              to="/signup"
              className="flex items-center space-x-1 text-gray-900 hover:text-purple-600 cursor-pointer transition-colors"
            >
              <span className="text-sm font-medium">For Talents</span>
              <ChevronDownIcon className="w-4 h-4" />
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-6">
            <Link
              to="/signin"
              className="text-gray-900 hover:text-purple-600 font-semibold text-sm transition-colors duration-200 uppercase tracking-wide"
            >
              LOGIN
            </Link>
            <Link
              to="/signup"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md text-sm uppercase tracking-wide"
            >
              SIGN UP
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navigation; 