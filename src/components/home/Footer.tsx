import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black py-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Support text */}
          <p className="text-white text-sm mb-4">
            Proudly supported by
          </p>
          
          {/* Alberta Innovates Logo */}
          <div className="flex items-center justify-center space-x-2">
            <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-600 transform rotate-45"></div>
            </div>
            <span className="text-white font-semibold text-lg">
              ALBERTA INNOVATES
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 