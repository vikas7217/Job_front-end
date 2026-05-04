import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { recruiterProfileAPI } from '../../services/api';
import { UpdateRecruiterProfileDto, RecruiterProfile } from '../../types/recruiter-profile';

const RecruiterEditProfileSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Full name must be at least 2 characters')
    .max(50, 'Full name cannot exceed 50 characters')
    .required('Full name is required'),
  
  companyName: Yup.string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name cannot exceed 100 characters')
    .required('Company name is required'),
  
  businessEmail: Yup.string()
    .email('Please enter a valid business email')
    .required('Business email is required'),
  
  phoneNumber: Yup.string()
    .matches(/^[+]?[0-9\s\-()]{10,15}$/, 'Please enter a valid phone number')
    .required('Phone number is required'),
});

const RecruiterEditProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [existingProfile, setExistingProfile] = useState<RecruiterProfile | null>(null);

  // Get signup data from AuthContext and localStorage
  const tempRecruiterData = localStorage.getItem('tempRecruiterData');
  const parsedTempData = tempRecruiterData ? JSON.parse(tempRecruiterData) : {};
  
  const signupData = {
    fullName: user?.fullName || '',
    companyName: parsedTempData.companyName || '',
    businessEmail: user?.email || '',
    phoneNumber: parsedTempData.phoneNumber || '',
  };

  const initialValues = {
    fullName: existingProfile?.fullName || signupData.fullName,
    companyName: existingProfile?.company?.name || signupData.companyName,
    businessEmail: existingProfile?.businessEmail || signupData.businessEmail,
    phoneNumber: existingProfile?.phone || signupData.phoneNumber,
  };

  useEffect(() => {
    loadExistingProfile();
  }, []);

  const loadExistingProfile = async () => {
    try {
      setIsLoading(true);
      const response = await recruiterProfileAPI.getProfile();
      setExistingProfile(response.data);
    } catch (error: any) {
      if (error.response?.status !== 404) {
        toast.error('Failed to load profile data');
      }
      // If no profile exists, we'll use signup data
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      setIsSaving(true);
      
      const profileData: UpdateRecruiterProfileDto = {
        fullName: values.fullName,
        company: {
          name: values.companyName,
        },
        businessEmail: values.businessEmail,
        phone: values.phoneNumber,
      };

      await recruiterProfileAPI.updateProfile(profileData);
      toast.success('Profile updated successfully!');
      
      // Clean up temporary recruiter data after successful save
      localStorage.removeItem('tempRecruiterData');
      
      navigate('/dashboard');
    } catch (error: any) {
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ee2389] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
          <p className="mt-2 text-sm text-gray-500">Fetching your information to prefill the form</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-visa drop-shadow-md text-[#ee2389]">Edit Your Recruiter Profile</h1>
              <p className="text-gray-600 mt-1">
                Update your professional information and company details
              </p>
            </div>
            <button
              onClick={() => {
                // Trigger form submission
                const form = document.querySelector('form');
                if (form) {
                  const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
                  if (submitButton) {
                    submitButton.click();
                  }
                }
              }}
              disabled={isSaving}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={RecruiterEditProfileSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ errors, touched, isSubmitting, values }) => (
            <Form className="space-y-6">
              {/* Hidden submit button for header to trigger */}
              <button
                type="submit"
                disabled={isSaving || isSubmitting}
                className="hidden"
              >
                Submit
              </button>
              {/* Personal Information */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <Field
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.fullName && touched.fullName ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ee2389] focus:border-[#ee2389] sm:text-sm`}
                    />
                    <ErrorMessage name="fullName" component="p" className="mt-2 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      Business Email
                    </label>
                    <Field
                      id="businessEmail"
                      name="businessEmail"
                      type="email"
                      placeholder="Enter business email"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.businessEmail && touched.businessEmail ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ee2389] focus:border-[#ee2389] sm:text-sm`}
                    />
                    <ErrorMessage name="businessEmail" component="p" className="mt-2 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <Field
                      id="companyName"
                      name="companyName"
                      type="text"
                      placeholder="Enter company name"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.companyName && touched.companyName ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ee2389] focus:border-[#ee2389] sm:text-sm`}
                    />
                    <ErrorMessage name="companyName" component="p" className="mt-2 text-sm text-red-600" />
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <Field
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="Enter phone number"
                      className={`appearance-none block w-full px-3 py-2 border ${
                        errors.phoneNumber && touched.phoneNumber ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ee2389] focus:border-[#ee2389] sm:text-sm`}
                    />
                    <ErrorMessage name="phoneNumber" component="p" className="mt-2 text-sm text-red-600" />
                  </div>
                </div>
              </div>


            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RecruiterEditProfileForm; 