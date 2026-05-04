import React, { Fragment, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { UserCircleIcon, MagnifyingGlassIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [currentLocation, setCurrentLocation] = useState('');
  const [destination, setDestination] = useState('');

  const userNavigation = [
    { name: 'Your Profile', href: '/profile' },
    { name: 'Sign out', action: 'logout' },
  ];

  const handleMenuItemClick = (item: any) => {
    if (item.action === 'logout') {
      logout();
    }
  };

  const handleSearch = () => {
    // Handle search functionality
    console.log('Searching for:', { currentLocation, destination });
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">J</span>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">JobPortal</span>
            </Link>
          </div>

          {/* Search Section - Only show if not authenticated */}
          {!isAuthenticated && (
            <div className="flex-1 max-w-2xl mx-8">
              <div className="flex items-end space-x-4">
                {/* Current Location Input */}
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    I am from
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={currentLocation}
                      onChange={(e) => setCurrentLocation(e.target.value)}
                      placeholder="Select your current location"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 text-sm font-medium"
                    />
                    <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Destination Input */}
                <div className="flex-1">
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    I want to work in
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Select your destination"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 text-sm font-medium"
                    />
                    <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-md flex items-center justify-center"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {/* Navigation for authenticated users */}
          {isAuthenticated && (
            <div className="flex items-center space-x-8">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-purple-600 font-medium text-sm transition-colors duration-200"
              >
                Dashboard
              </Link>
              <Link
                to="/jobs"
                className="text-gray-700 hover:text-purple-600 font-medium text-sm transition-colors duration-200"
              >
                Jobs
              </Link>
              <Link
                to="/profile"
                className="text-gray-700 hover:text-purple-600 font-medium text-sm transition-colors duration-200"
              >
                Profile
              </Link>
            </div>
          )}

          {/* Auth Section */}
          <div className="flex items-center space-x-6">
            {!isAuthenticated ? (
              <>
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
              </>
            ) : (
              /* Profile dropdown for authenticated users */
              <Menu as="div" className="relative">
                <div>
                  <Menu.Button className="bg-white rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 border border-gray-200 shadow-sm">
                    <span className="sr-only">Open user menu</span>
                    <UserCircleIcon className="h-8 w-8 text-purple-600" />
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="origin-top-right absolute right-0 mt-2 w-64 rounded-lg shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-900 truncate">{user?.fullName}</p>
                      <p className="text-sm text-gray-500 truncate" title={user?.email}>{user?.email}</p>
                    </div>
                    {userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          item.action === 'logout' ? (
                            <button
                              onClick={() => handleMenuItemClick(item)}
                              className={`block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 ${active ? 'bg-gray-50' : ''}`}
                            >
                              {item.name}
                            </button>
                          ) : (
                            <Link
                              to={item.href!}
                              className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 ${active ? 'bg-gray-50' : ''}`}
                            >
                              {item.name}
                            </Link>
                          )
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 