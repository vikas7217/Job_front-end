import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getNextOnboardingStep, UserData } from '../../utils/onboarding';

interface RedirectIfAuthenticatedProps {
  children: React.ReactNode;
}

const RedirectIfAuthenticated: React.FC<RedirectIfAuthenticatedProps> = ({ children }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // If user is authenticated, redirect them to appropriate page
  if (isAuthenticated && user) {
    try {
      // Map User to UserData format for onboarding functions
      const userData: UserData = {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role || 'applicant',
        nocSelected: !!user.nocCode,
        resumeUploaded: !!user.resumeUploaded,
        nocCode: user.nocCode,
      };
      
      // Get the appropriate next step for this user
      const nextStep = getNextOnboardingStep(userData);
      return <Navigate to={nextStep} replace />;
    } catch (error) {
      console.error('Error determining redirect path:', error);
      // Fallback to dashboard if there's an error
      return <Navigate to="/dashboard" replace />;
    }
  }

  // If not authenticated, show the auth page (signin, signup, etc.)
  return <>{children}</>;
};

export default RedirectIfAuthenticated; 