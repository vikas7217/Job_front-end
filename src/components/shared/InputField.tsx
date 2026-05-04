import React, { InputHTMLAttributes } from 'react';
import { Field, ErrorMessage } from 'formik';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  className = '',
  ...props
}) => {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1">
        <Field
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          className={`appearance-none block w-full px-3 py-2 border border-primary-200 rounded-[8px] shadow focus:shadow-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#ee2389] focus:border-[#ee2389] sm:text-sm transition-all duration-200 ${className}`}
          {...props}
        />
        <ErrorMessage
          name={name}
          component="p"
          className="mt-2 text-sm text-red-600"
        />
      </div>
    </div>
  );
};

export default InputField; 