import React from 'react';
import { Outlet } from 'react-router-dom';
import AuthFooter from '../shared/AuthFooter';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex flex-1">
        {/* Left side with background image */}
        <div className="relative hidden w-0 flex-1 lg:block">
          <div className="absolute inset-0 bg-gsv-gradient" />
          <div className="absolute inset-0 flex items-center justify-center p-8">
            <div className="max-w-lg">
              <h1 className="text-4xl font-bold tracking-tight text-white font-visa drop-shadow-md sm:text-5xl">
                Find Your Dream Job
              </h1>
              <p className="mt-6 text-xl leading-8 text-gray-300">
                Connect with top employers and discover opportunities that match your skills and aspirations.
                Join thousands of professionals who have found their perfect career match through our platform.
              </p>
            </div>
          </div>
        </div>

        {/* Right side with auth forms */}
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <Outlet />
        </div>
      </div>
      
      {/* Footer */}
      <AuthFooter />
    </div>
  );
};

export default AuthLayout; 