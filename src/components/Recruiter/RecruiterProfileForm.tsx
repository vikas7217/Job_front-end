import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { recruiterProfileAPI } from '../../services/api';
import { CreateRecruiterProfileDto, RecruiterProfile } from '../../types/recruiter-profile';

const RecruiterProfileSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name cannot exceed 50 characters')
    .required('Full name is required'),
  
  'company.name': Yup.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name cannot exceed 100 characters')
    .required('Company name is required'),
  
  'company.website': Yup.string()
    .url('Please enter a valid website URL')
    .optional(),
  
  'company.industry': Yup.string()
    .min(2, 'Industry must be at least 2 characters')
    .max(50, 'Industry cannot exceed 50 characters')
    .optional(),
  
  businessEmail: Yup.string()
    .email('Please enter a valid business email')
    .required('Business email is required'),
  
  phone: Yup.string()
    .matches(/^[\+]?[0-9\s\-\(\)]{10,15}$/, 'Please enter a valid phone number')
    .required('Phone number is required'),
  
  'location.city': Yup.string()
    .min(2, 'City must be at least 2 characters')
    .max(50, 'City cannot exceed 50 characters')
    .required('City is required'),
  
  'location.province': Yup.string()
    .min(2, 'Province must be at least 2 characters')
    .max(50, 'Province cannot exceed 50 characters')
    .required('Province is required'),
  
  'location.country': Yup.string()
    .min(2, 'Country must be at least 2 characters')
    .max(50, 'Country cannot exceed 50 characters')
    .required('Country is required'),
  
  summary: Yup.string()
    .min(50, 'Summary must be at least 50 characters')
    .max(500, 'Summary cannot exceed 500 characters')
    .required('Professional summary is required'),
  
  'socialLinks.linkedin': Yup.string()
    .url('Please enter a valid LinkedIn URL')
    .optional(),
});

interface RecruiterProfileFormProps {
  isEdit?: boolean;
  onSuccess?: (profile: RecruiterProfile) => void;
}

const RecruiterProfileForm: React.FC<RecruiterProfileFormProps> = ({ 
  isEdit = false, 
  onSuccess 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [existingProfile, setExistingProfile] = useState<RecruiterProfile | null>(null);

  const initialValues = {
    fullName: existingProfile?.fullName || '',
    company: {
      name: existingProfile?.company?.name || '',
      website: existingProfile?.company?.website || '',
      industry: existingProfile?.company?.industry || '',
    },
    businessEmail: existingProfile?.businessEmail || '',
    phone: existingProfile?.phone || '',
    location: {
      city: existingProfile?.location?.city || '',
      province: existingProfile?.location?.province || '',
      country: existingProfile?.location?.country || '',
    },
    summary: existingProfile?.summary || '',
    specializations: existingProfile?.specializations || [],
    socialLinks: {
      linkedin: existingProfile?.socialLinks?.linkedin || '',
    },
  };

  useEffect(() => {
    if (isEdit) {
      loadExistingProfile();
    }
  }, [isEdit]);

  const loadExistingProfile = async () => {
    try {
      setIsLoading(true);
      const response = await recruiterProfileAPI.getProfile();
      setExistingProfile(response.data);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        toast.error('Failed to load profile data');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setIsSaving(true);
      
      const profileData: CreateRecruiterProfileDto = {
        fullName: values.fullName,
        company: {
          name: values.company.name,
          website: values.company.website || undefined,
          industry: values.company.industry || undefined,
        },
        businessEmail: values.businessEmail,
        phone: values.phone,
        location: {
          city: values.location.city,
          province: values.location.province,
          country: values.location.country,
        },
        summary: values.summary,
        specializations: values.specializations || [],
        socialLinks: {
          linkedin: values.socialLinks.linkedin || undefined,
        },
      };

      const response = isEdit 
        ? await recruiterProfileAPI.updateProfile(profileData)
        : await recruiterProfileAPI.createProfile(profileData);

      toast.success(isEdit ? 'Profile updated successfully!' : 'Profile created successfully!');
      
      if (onSuccess) {
        onSuccess(response.data);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#ee2389] border-t-2 border-[#7c0bb3]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gsv-gradient font-visa drop-shadow-md">
          <span className="font-visa drop-shadow-md text-[#ee2389]">Create Recruiter Account</span>
        </h2>
        <p className="mt-2 text-center text-sm text-[#ee2389] font-visa">
          <span className="text-[#7c0bb3]">Join our platform to find top talent</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Formik
            initialValues={initialValues}
            validationSchema={RecruiterProfileSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            {({ errors, touched }) => (
              <Form className="space-y-6">
                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <Field
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.fullName && touched.fullName ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    <ErrorMessage name="fullName" component="p" className="mt-2 text-sm text-red-600" />
                  </div>
                </div>

                {/* Company Name */}
                <div>
                  <label htmlFor="company.name" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <div className="mt-1">
                    <Field
                      id="company.name"
                      name="company.name"
                      type="text"
                      placeholder="Enter company name"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.company?.name && touched.company?.name ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    <ErrorMessage name="company.name" component="p" className="mt-2 text-sm text-red-600" />
                  </div>
                </div>

                {/* Business Email */}
                <div>
                  <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-700">
                    Business Email
                  </label>
                  <div className="mt-1">
                    <Field
                      id="businessEmail"
                      name="businessEmail"
                      type="email"
                      placeholder="Enter business email"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.businessEmail && touched.businessEmail ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    <ErrorMessage name="businessEmail" component="p" className="mt-2 text-sm text-red-600" />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <Field
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="Enter phone number"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.phone && touched.phone ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    <ErrorMessage name="phone" component="p" className="mt-2 text-sm text-red-600" />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <Field
                      id="password"
                      name="password"
                      type="password"
                      placeholder="Create password"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1">
                    <Field
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Terms and Privacy Policy */}
                <div className="flex items-center">
                  <Field
                    id="acceptTerms"
                    name="acceptTerms"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-900">
                    I agree to the{' '}
                    <a href="/terms" className="text-indigo-600 hover:text-indigo-500">
                      terms and privacy policy
                    </a>
                  </label>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                      isSaving ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSaving ? 'Creating Account...' : 'Create My Recruiter Account'}
                  </button>
                </div>

                {/* TODO: Enable social logins once functionality is implemented */}
                {/* Social Login */}
                {/*
                <div className="mt-6">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Google
                    </button>

                    <button
                      type="button"
                      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </button>
                  </div>
                </div>
                */}

                {/* Sign In Link */}
                <div className="text-center">
                  <span className="text-sm text-gray-600">
                    Already have an account?{' '}
                    <a href="/signin" className="font-medium text-indigo-600 hover:text-indigo-500">
                      Sign in
                    </a>
                  </span>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default RecruiterProfileForm; 