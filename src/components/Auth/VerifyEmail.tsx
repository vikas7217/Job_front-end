import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [code, setCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!code || code.length !== 6) {
      toast.error('Please enter a valid 6-digit code.');
      return;
    }

    // Get email from localStorage
    const tempEmail = localStorage.getItem('tempUserEmail');
    const userData = localStorage.getItem('user');
    let email = '';
    
    if (tempEmail) {
      email = tempEmail;
    } else if (userData) {
      email = JSON.parse(userData).email;
    } else {
      // If no user data in localStorage, ask for email
      const inputEmail = prompt('Please enter your email address:');
      if (!inputEmail) return;
      email = inputEmail;
    }
    
    setIsVerifying(true);
    try {
      const response = await authAPI.verifyEmail(code, email);
      toast.success('Email verified successfully! Logging you in...');
      setIsVerified(true);

      // Use auth context login method
      const { token, user } = response.data;
      login(token, user);

      // Clean up temporary email
      localStorage.removeItem('tempUserEmail');
      // No need to manually navigate, login() will handle redirect
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid or expired verification code.';
      toast.error(errorMessage);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    if (isResending || countdown > 0) return;

    // Get email from localStorage if user data exists
    const tempEmail = localStorage.getItem('tempUserEmail');
    const userData = localStorage.getItem('user');
    const email = tempEmail || (userData ? JSON.parse(userData).email : null);
    
    if (!email) {
      toast.error('Please sign up again to resend verification email.');
      navigate('/signup');
      return;
    }

    setIsResending(true);
    try {
      await authAPI.resendVerification(email);
      toast.success('Verification email sent successfully!');
      
      // Start countdown for 60 seconds
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to resend verification email. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-[#ee2389]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          <span className="font-visa drop-shadow-md text-[#ee2389]">{isVerifying ? 'Verifying your email...' : isVerified ? 'Email verified!' : 'Verify your email'}</span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          <span className="text-[#ee2389] font-visa">
            {isVerifying ? (
              'Please wait while we verify your email address...'
            ) : isVerified ? (
              'Your email has been verified and you are being logged in! Redirecting...'
            ) : (
              <>
                We've sent a 6-digit verification code to your email address.
                <br />
                Please check your inbox and enter the code below.
              </>
            )}
          </span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {!isVerified && (
            <form onSubmit={handleVerifyEmail} className="space-y-6">
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <div className="mt-1">
                  <input
                    id="code"
                    name="code"
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit code"
                    className="appearance-none block w-full px-3 py-3 border border-primary-200 rounded-[8px] shadow focus:shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ee2389] focus:border-[#ee2389] sm:text-sm text-center text-lg font-mono tracking-widest transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isVerifying || code.length !== 6}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    isVerifying || code.length !== 6
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-l from-[#ee2389] to-[#7c0bb3] hover:from-[#d81e7a] hover:to-[#69099e] focus:ring-2 focus:ring-[#ee2389] focus:ring-offset-2 font-visa text-[15px] font-semibold py-[12px] px-[30px] rounded-[10px] transition-all duration-300 ease-in-out tracking-[0.2px] border-0 shadow-md'
                  }`}
                >
                  {isVerifying ? 'Verifying...' : 'Verify Email'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-6">
              Didn't receive the code? Check your spam folder or request a new one.
            </p>
            
            <div className="flex flex-col space-y-4">
              <button
                onClick={handleResendVerification}
                disabled={isResending || countdown > 0}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isResending || countdown > 0
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-l from-[#ee2389] to-[#7c0bb3] hover:from-[#d81e7a] hover:to-[#69099e] focus:ring-2 focus:ring-[#ee2389] focus:ring-offset-2 font-visa text-[15px] font-semibold py-[12px] px-[30px] rounded-[10px] transition-all duration-300 ease-in-out tracking-[0.2px] border-0 shadow-md'
                }`}
              >
                {isResending ? (
                  'Sending...'
                ) : countdown > 0 ? (
                  `Resend in ${countdown}s`
                ) : (
                  'Resend verification code'
                )}
              </button>
              
              {!isVerified && (
                <button
                  onClick={() => navigate('/signin')}
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Return to sign in
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 