import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getNextOnboardingStep, UserData, isOnboardingComplete } from '../../utils/onboarding';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresOnboarding?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiresOnboarding = false 
}) => {
  const location = useLocation();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  // If user data exists and onboarding is required, check onboarding status
  if (user && requiresOnboarding) {
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
      
      // If onboarding is not complete, redirect to next step
      if (!isOnboardingComplete(userData)) {
        const nextStep = getNextOnboardingStep(userData);
        
        // Don't redirect if we're already on the correct step
        if (location.pathname !== nextStep) {
          return <Navigate to={nextStep} replace />;
        }
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error);
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute; 