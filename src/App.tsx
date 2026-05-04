import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider } from './contexts/AuthContext';

// Layouts
import AuthLayout from './components/layouts/AuthLayout';
import MainLayout from './components/layouts/MainLayout';

// Components
import ProtectedRoute from './components/Auth/ProtectedRoute';
import RedirectIfAuthenticated from './components/Auth/RedirectIfAuthenticated';

// Pages
import SignIn from './components/Auth/SignIn';
import SignUp from './components/Auth/SignUp';
import VerifyEmail from './components/Auth/VerifyEmail';
import CandidateProfile from './pages/CandidateProfile';
import SelectNOC from './pages/SelectNOC';
import UploadResume from './pages/UploadResume';
import EditProfile from './pages/EditProfile';
import Dashboard from './pages/dashboard/Dashboard';
import ForgotPassword from './pages/forgot-password';
import ResetPassword from './pages/reset-password';
import HomePage from './pages/HomePage';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Auth routes - redirect if already authenticated */}
          <Route element={<AuthLayout />}>
            <Route 
              path="/signin" 
              element={
                <RedirectIfAuthenticated>
                  <SignIn />
                </RedirectIfAuthenticated>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <RedirectIfAuthenticated>
                  <SignUp />
                </RedirectIfAuthenticated>
              } 
            />
            <Route 
              path="/verify-email" 
              element={
                <RedirectIfAuthenticated>
                  <VerifyEmail />
                </RedirectIfAuthenticated>
              } 
            />
          </Route>

          {/* Protected onboarding routes */}
          <Route 
            path="/select-noc" 
            element={
              <ProtectedRoute requiresOnboarding={true}>
                <SelectNOC />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/upload-resume" 
            element={
              <ProtectedRoute requiresOnboarding={true}>
                <UploadResume />
              </ProtectedRoute>
            } 
          />
          
          {/* Protected routes with main layout */}
          <Route element={<MainLayout />}>
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit-profile" 
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/candidates/:candidateId/profile" 
              element={
                <ProtectedRoute>
                  <CandidateProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/jobs" 
              element={
                <ProtectedRoute>
                  <div className="p-8">
                    <h1 className="text-2xl font-bold">Jobs (Coming Soon)</h1>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/companies" 
              element={
                <ProtectedRoute>
                  <div className="p-8">
                    <h1 className="text-2xl font-bold">Companies (Coming Soon)</h1>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/messages" 
              element={
                <ProtectedRoute>
                  <div className="p-8">
                    <h1 className="text-2xl font-bold">Messages (Coming Soon)</h1>
                  </div>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <div className="p-8">
                    <h1 className="text-2xl font-bold">Settings (Coming Soon)</h1>
                  </div>
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* Catch all route - redirect to sign-in */}
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;
