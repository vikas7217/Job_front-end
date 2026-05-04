import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';
import RecruiterDashboard from '../RecruiterDashboard';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isNavigating, setIsNavigating] = useState(false);

  // Show recruiter dashboard for recruiters
  if (user?.role === 'recruiter') {
    return <RecruiterDashboard />;
  }

  const handleUpdateProfile = () => {
    setIsNavigating(true);
    toast.loading('Loading profile editor...', { 
      duration: 1000,
      id: 'profile-navigation'
    });
    
    // Small delay to show the loading feedback
    setTimeout(() => {
      navigate('/edit-profile');
      setIsNavigating(false);
    }, 500);
  };

  const handleUploadResume = () => {
    navigate('/upload-resume');
  };

  const handleSearchJobs = () => {
    navigate('/jobs');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold font-visa drop-shadow-md text-[#ee2389]">Welcome to Your Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Manage your job applications, profile, and career opportunities all in one place.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">📄</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Applications</dt>
                  <dd className="text-lg font-medium text-gray-900">0</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">✅</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Interviews</dt>
                  <dd className="text-lg font-medium text-gray-900">0</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">👁️</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Profile Views</dt>
                  <dd className="text-lg font-medium text-gray-900">0</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-medium">💼</span>
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Job Matches</dt>
                  <dd className="text-lg font-medium text-gray-900">0</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Applications</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">📄</div>
              <p className="text-gray-500">No applications yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Start applying to jobs to see your applications here
              </p>
            </div>
          </div>
        </div>

        {/* Recommended Jobs */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recommended Jobs</h2>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <div className="text-gray-400 text-4xl mb-4">🎯</div>
              <p className="text-gray-500">No job recommendations yet</p>
              <p className="text-sm text-gray-400 mt-2">
                Complete your profile to get personalized job recommendations
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={handleUpdateProfile}
            disabled={isNavigating}
            className={`flex items-center justify-center font-visa text-[15px] font-semibold py-[12px] px-[30px] rounded-[10px] transition-all duration-300 ease-in-out tracking-[0.2px] border-0 shadow-md text-white bg-gradient-to-l from-[#ee2389] to-[#7c0bb3] hover:from-[#d81e7a] hover:to-[#69099e] focus:ring-2 focus:ring-[#ee2389] focus:ring-offset-2 ${isNavigating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isNavigating ? (
              <>
                <div className="mr-2 w-4 h-4 border-2 border-[#ee2389] border-t-2 border-[#7c0bb3] rounded-full animate-spin"></div>
                Loading...
              </>
            ) : (
              <>
                <span className="mr-2">📝</span>
                Update Profile
              </>
            )}
          </button>
          <button 
            onClick={handleUploadResume}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <span className="mr-2">📄</span>
            Upload Resume
          </button>
          <button 
            onClick={handleSearchJobs}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <span className="mr-2">🔍</span>
            Search Jobs
          </button>
          <button 
            onClick={handleSettings}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <span className="mr-2">⚙️</span>
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 