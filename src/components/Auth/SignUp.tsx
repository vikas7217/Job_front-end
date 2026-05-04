import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { authAPI } from '../../services/api';
import Button from '../shared/Button';

interface ApplicantSignUpFormValues {
  fullName: string;
  email: string;
  password: string;
}

interface RecruiterSignUpFormValues {
  fullName: string;
  companyName: string;
  businessEmail: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

type UserRole = 'applicant' | 'recruiter';

const ApplicantSignUpSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces')
    .required('Full name is required'),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, lowercase letter, number, and special character'
    )
    .required('Password is required'),
});

const RecruiterSignUpSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Name is too short')
    .max(50, 'Name is too long')
    .required('Full name is required'),
  companyName: Yup.string()
    .min(2, 'Company name is too short')
    .max(100, 'Company name is too long')
    .required('Company name is required'),
  businessEmail: Yup.string()
    .email('Invalid email address')
    .required('Business email is required'),
  phoneNumber: Yup.string()
    .matches(/^[+]?[0-9\s\-()]{10,15}$/, 'Please enter a valid phone number')
    .required('Phone number is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    )
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  acceptTerms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and privacy policy')
    .required('You must accept the terms and privacy policy'),
});

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole>('applicant');
  
  const applicantForm = useForm<ApplicantSignUpFormValues>({
    resolver: yupResolver(ApplicantSignUpSchema),
    mode: 'onBlur'
  });

  const recruiterForm = useForm<RecruiterSignUpFormValues>({
    resolver: yupResolver(RecruiterSignUpSchema),
    mode: 'onBlur'
  });

  const onApplicantSubmit = async (values: ApplicantSignUpFormValues) => {
    try {
      const signupData = {
        ...values,
        role: 'applicant'
      };
      
      const response = await authAPI.signup(signupData);
      
      // Store email temporarily for verification
      localStorage.setItem('tempUserEmail', values.email);
      
      toast.success(response.data.message || 'Account created successfully! Please check your email for the verification code.');
      navigate('/verify-email');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create account. Please try again.';
      toast.error(errorMessage);
    }
  };

  const onRecruiterSubmit = async (values: RecruiterSignUpFormValues) => {
    try {
      const signupData = {
        fullName: values.fullName,
        email: values.businessEmail,
        password: values.password,
        role: 'recruiter'
      };
      
      const response = await authAPI.signup(signupData);
      
      // Store email temporarily for verification
      localStorage.setItem('tempUserEmail', values.businessEmail);
      
      // Store additional recruiter data for profile prefill
      localStorage.setItem('tempRecruiterData', JSON.stringify({
        companyName: values.companyName,
        phoneNumber: values.phoneNumber
      }));
      
      toast.success(response.data.message || 'Account created successfully! Please check your email for the verification code.');
      navigate('/verify-email');
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create account. Please try again.';
      toast.error(errorMessage);
    }
  };

  // TODO: Enable social logins once functionality is implemented
  /*
  const handleGoogleSignUp = () => {
    toast('Google sign up coming soon!', { icon: 'ℹ️' });
  };

  const handleLinkedInSignUp = () => {
    toast('LinkedIn sign up coming soon!', { icon: 'ℹ️' });
  };
  */

  return (
    <div className="mx-auto w-full max-w-sm lg:w-96">
      <div>
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {selectedRole === 'applicant' ? 'Create your account' : 'Create Recruiter Account'}
          </h2>
          <p className="text-sm text-gray-600">
            {selectedRole === 'applicant' 
              ? 'Join thousands of candidates finding their dream jobs'
              : 'Join our platform to find top talent'
            }
          </p>
        </div>

        {/* Role Toggle */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Sign up as:
          </label>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setSelectedRole('applicant')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                selectedRole === 'applicant'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Applicant
              </div>
            </button>
            <button
              type="button"
              onClick={() => setSelectedRole('recruiter')}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                selectedRole === 'recruiter'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className="flex items-center justify-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Recruiter
              </div>
            </button>
          </div>
        </div>

        {/* Applicant Sign Up Form */}
        {selectedRole === 'applicant' && (
          <form onSubmit={applicantForm.handleSubmit(onApplicantSubmit)} className="space-y-6">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  {...applicantForm.register('fullName')}
                  id="fullName"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  className={`appearance-none block w-full px-3 py-3 border ${
                    applicantForm.formState.errors.fullName ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {applicantForm.formState.errors.fullName && (
                  <p className="mt-2 text-sm text-red-600">{applicantForm.formState.errors.fullName.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  {...applicantForm.register('email')}
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email"
                  className={`appearance-none block w-full px-3 py-3 border ${
                    applicantForm.formState.errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {applicantForm.formState.errors.email && (
                  <p className="mt-2 text-sm text-red-600">{applicantForm.formState.errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  {...applicantForm.register('password')}
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Create a password"
                  className={`appearance-none block w-full px-3 py-3 border ${
                    applicantForm.formState.errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {applicantForm.formState.errors.password && (
                  <p className="mt-2 text-sm text-red-600">{applicantForm.formState.errors.password.message}</p>
                )}
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={applicantForm.formState.isSubmitting}
                variant="primary"
              >
                {applicantForm.formState.isSubmitting ? 'Creating account...' : 'Create account'}
              </Button>
            </div>
          </form>
        )}

        {/* Recruiter Sign Up Form */}
        {selectedRole === 'recruiter' && (
          <form onSubmit={recruiterForm.handleSubmit(onRecruiterSubmit)} className="space-y-6">
            {/* Full Name */}
            <div>
              <label htmlFor="recruiterFullName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  {...recruiterForm.register('fullName')}
                  id="recruiterFullName"
                  type="text"
                  placeholder="Enter your full name"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    recruiterForm.formState.errors.fullName ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {recruiterForm.formState.errors.fullName && (
                  <p className="mt-2 text-sm text-red-600">{recruiterForm.formState.errors.fullName.message}</p>
                )}
              </div>
            </div>

            {/* Company Name */}
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <div className="mt-1">
                <input
                  {...recruiterForm.register('companyName')}
                  id="companyName"
                  type="text"
                  placeholder="Enter company name"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    recruiterForm.formState.errors.companyName ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {recruiterForm.formState.errors.companyName && (
                  <p className="mt-2 text-sm text-red-600">{recruiterForm.formState.errors.companyName.message}</p>
                )}
              </div>
            </div>

            {/* Business Email */}
            <div>
              <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-700">
                Business Email
              </label>
              <div className="mt-1">
                <input
                  {...recruiterForm.register('businessEmail')}
                  id="businessEmail"
                  type="email"
                  placeholder="Enter business email"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    recruiterForm.formState.errors.businessEmail ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {recruiterForm.formState.errors.businessEmail && (
                  <p className="mt-2 text-sm text-red-600">{recruiterForm.formState.errors.businessEmail.message}</p>
                )}
              </div>
            </div>

            {/* Phone Number */}
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  {...recruiterForm.register('phoneNumber')}
                  id="phoneNumber"
                  type="tel"
                  placeholder="Enter phone number"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    recruiterForm.formState.errors.phoneNumber ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {recruiterForm.formState.errors.phoneNumber && (
                  <p className="mt-2 text-sm text-red-600">{recruiterForm.formState.errors.phoneNumber.message}</p>
                )}
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="recruiterPassword" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  {...recruiterForm.register('password')}
                  id="recruiterPassword"
                  type="password"
                  placeholder="Create password"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    recruiterForm.formState.errors.password ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {recruiterForm.formState.errors.password && (
                  <p className="mt-2 text-sm text-red-600">{recruiterForm.formState.errors.password.message}</p>
                )}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <div className="mt-1">
                <input
                  {...recruiterForm.register('confirmPassword')}
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm password"
                  className={`appearance-none block w-full px-3 py-2 border ${
                    recruiterForm.formState.errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {recruiterForm.formState.errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-600">{recruiterForm.formState.errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-center">
              <input
                {...recruiterForm.register('acceptTerms')}
                id="acceptTerms"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <Link to="/terms" className="text-indigo-600 hover:text-indigo-500">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {recruiterForm.formState.errors.acceptTerms && (
              <p className="text-sm text-red-600">{recruiterForm.formState.errors.acceptTerms.message}</p>
            )}

            <div>
              <Button
                type="submit"
                disabled={recruiterForm.formState.isSubmitting}
                variant="primary"
              >
                {recruiterForm.formState.isSubmitting ? 'Creating account...' : 'Create Recruiter Account'}
              </Button>
            </div>
          </form>
        )}

        {/* Terms and Privacy Policy - Only for Applicants */}
        {selectedRole === 'applicant' && (
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-600">
              By signing up, you agree to our{' '}
              <Link to="/terms" className="font-medium text-indigo-600 hover:text-indigo-500">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="font-medium text-indigo-600 hover:text-indigo-500">
                Privacy Policy
              </Link>
            </p>
          </div>
        )}

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 