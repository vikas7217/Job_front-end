import React from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';
import InputField from '../components/shared/InputField';
import Button from '../components/shared/Button';

const SignUpSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm password is required'),
});

const SignUpPage: React.FC = () => {
  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      // Handle signup logic here
    } catch (error) {
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          <span className="font-visa drop-shadow-md text-[#ee2389]">Create your account</span>
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          <span className="text-[#7c0bb3] font-visa">Join our platform to find your dream job or hire top talent</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              email: '',
              password: '',
              confirmPassword: '',
            }}
            validationSchema={SignUpSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    name="firstName"
                    type="text"
                    label="First name"
                    placeholder="John"
                  />
                  <InputField
                    name="lastName"
                    type="text"
                    label="Last name"
                    placeholder="Doe"
                  />
                </div>

                <InputField
                  name="email"
                  type="email"
                  label="Email address"
                  placeholder="john@example.com"
                />

                <InputField
                  name="password"
                  type="password"
                  label="Password"
                  placeholder="••••••••"
                />

                <InputField
                  name="confirmPassword"
                  type="password"
                  label="Confirm password"
                  placeholder="••••••••"
                />

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  isLoading={isSubmitting}
                >
                  Sign up
                </Button>
              </Form>
            )}
          </Formik>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/signin"
                className="w-full flex justify-center font-visa text-[15px] font-semibold py-[12px] px-[30px] rounded-[10px] transition-all duration-300 ease-in-out tracking-[0.2px] border-0 shadow-md text-white bg-gradient-to-l from-[#ee2389] to-[#7c0bb3] hover:from-[#d81e7a] hover:to-[#69099e] focus:ring-2 focus:ring-[#ee2389] focus:ring-offset-2"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage; 