import React from 'react';
import { Link } from 'react-router-dom';
import { BriefcaseIcon } from '@heroicons/react/24/outline';

const AuthFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          {/* Brand */}
          <div className="flex items-center">
            <BriefcaseIcon className="h-6 w-6 text-[#ee2389]" />
            <span className="ml-2 text-lg font-bold text-[#ee2389]">JobPortal</span>
          </div>

          {/* Quick Links */}
          <div className="flex space-x-6">
            {quickLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-sm text-gray-600 hover:text-[#ee2389] focus:text-[#7c0bb3] transition-colors duration-200"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-sm text-gray-500">
            © {currentYear} JobPortal Inc.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default AuthFooter; 