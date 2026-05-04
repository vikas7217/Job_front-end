import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getNextOnboardingStep, UserData } from '../utils/onboarding';
import { authAPI } from '../services/api';

interface User {
  _id: string;
  fullName: string;
  email: string;
  role?: string;
  emailVerified?: boolean;
  onboardingComplete?: boolean;
  nocCode?: string;
  profileComplete?: boolean;
  profileCompleted?: boolean;
  resumeUploaded?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');

      if (token && userStr) {
        try {
          const userData = JSON.parse(userStr);
          setUser(userData);
        } catch (error) {
          console.error('Error parsing user data:', error);
          clearAuthData();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const clearAuthData = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('tempUserEmail');
    localStorage.removeItem('tempRecruiterData');
    setUser(null);
  };

  const login = (token: string, userData: User) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);

    // Navigate to appropriate page based on onboarding status
    try {
      const userDataForOnboarding: UserData = {
        id: userData._id,
        fullName: userData.fullName,
        email: userData.email,
        role: userData.role || 'applicant',
        nocSelected: !!userData.nocCode,
        resumeUploaded: !!userData.resumeUploaded,
        profileCompleted: !!userData.profileCompleted || !!userData.profileComplete,
        nocCode: userData.nocCode,
      };
      
      const nextStep = getNextOnboardingStep(userDataForOnboarding);
      navigate(nextStep, { replace: true });
    } catch (error) {
      console.error('Error determining next step:', error);
      navigate('/dashboard', { replace: true });
    }
  };

  const logout = async () => {
    try {
      // Call backend logout endpoint
      await authAPI.logout();
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout API call failed:', error);
    } finally {
      clearAuthData();
      toast.success('Successfully signed out');
      navigate('/signin', { replace: true });
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 