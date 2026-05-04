import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { profileValidationSchema } from '../utils/profileValidation';
import { reach as yupReach } from 'yup';
import { useAuth } from '../contexts/AuthContext';
import { userAPI, applicantProfileAPI } from '../services/api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { parseISO, isValid as isValidDate, format as formatDateFns } from 'date-fns';

// Helper function to transform parsed resume data to profile format
const transformParsedData = (parsedData: any) => {
  if (!parsedData || typeof parsedData !== 'object') {
    return {};
  }

  // Handle location (may be object or string)
  let location = '';
  if (parsedData.location) {
    if (typeof parsedData.location === 'object') {
      const { city = '', province = '', country = '' } = parsedData.location;
      location = [city, province, country].filter(Boolean).join(', ');
    } else if (typeof parsedData.location === 'string') {
      location = parsedData.location;
    }
  }

  // Map experience to workExperience
  const workExperience = Array.isArray(parsedData.experience)
    ? parsedData.experience.map((exp: any) => ({
        company: exp.company || '',
        jobTitle: exp.jobTitle || '',
        startDate: exp.startDate || '',
        endDate: exp.endDate || '',
        isCurrentRole: exp.isCurrentRole || false,
        description: exp.description || '',
        location: exp.location || ''
      }))
    : [];

  // Map education
  const education = Array.isArray(parsedData.education)
    ? parsedData.education.map((edu: any) => ({
        institution: edu.institution || '',
        degree: edu.degree || '',
        fieldOfStudy: edu.fieldOfStudy || '',
        startDate: edu.startDate || '',
        endDate: edu.endDate || '',
        isCurrentlyEnrolled: edu.isCurrentlyEnrolled || false,
        grade: edu.grade || '',
        location: edu.location || ''
      }))
    : [];

  return {
    firstName: parsedData.firstName || '',
    lastName: parsedData.lastName || '',
    fullName: [parsedData.firstName, parsedData.lastName].filter(Boolean).join(' '),
    email: parsedData.email || '',
    phone: parsedData.phone || '',
    currentTitle: workExperience.length > 0 ? workExperience[0].jobTitle : '',
    location,
    professionalSummary: parsedData.professionalSummary || '',
    skills: Array.isArray(parsedData.skills) ? parsedData.skills : [],
    workExperience,
    education,
    linkedinUrl: parsedData.linkedinUrl || '',
    githubUrl: parsedData.githubUrl || '',
    portfolioUrl: parsedData.portfolioUrl || '',
    nocCode: parsedData.nocCode || '',
    availability: parsedData.availability || '',
    resumeUrl: parsedData.resumeUrl || ''
  };
};

// Skills Tag Input Component
const SkillsTagInput: React.FC<{
  skills: string[];
  onChange: (skills: string[]) => void;
  onBlur: () => void;
  className?: string;
  placeholder?: string;
  fieldPath?: string;
}> = ({ skills, onChange, onBlur, className, placeholder, fieldPath }) => {
  const [inputValue, setInputValue] = useState('');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    // Ignore empty or whitespace-only entries
    if (!trimmedSkill) return;
    // Check maximum limit
    if (skills.length >= 20) {
      // Show a toast notification about the limit
      return;
    }
    // Prevent duplicate skills (case-insensitive)
    if (skills.some(existingSkill => existingSkill.toLowerCase() === trimmedSkill.toLowerCase())) {
      setInputValue('');
      return;
    }
    // Add the skill and reset input
    const newSkills = [...skills, trimmedSkill];
    onChange(newSkills);
    setInputValue('');
    // Ensure input stays focused after adding
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  const removeSkill = (indexToRemove: number) => {
    const newSkills = skills.filter((_, index) => index !== indexToRemove);
    onChange(newSkills);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(inputValue);
      // Ensure input stays focused after adding
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } else if (e.key === 'Backspace' && inputValue === '' && skills.length > 0) {
      // Remove last skill when backspace is pressed with empty input
      removeSkill(skills.length - 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    // If user types a comma, add the skill immediately
    if (value.includes(',')) {
      const parts = value.split(',');
      // Add all complete parts except the last one
      parts.slice(0, -1).forEach(part => addSkill(part));
      // Keep the last part as the new input value
      setInputValue(parts[parts.length - 1]);
    } else {
      setInputValue(value);
    }
  };

  // These helpers must be passed as props or imported if needed
  // const error = getFieldError('skills');
  // const touched = isFieldTouched('skills');
  // const hasError = error && (touched || Object.keys(validationErrors).length > 0);

  return (
    <div className="relative">
      <div 
        className={`
          ${className || 'w-full px-3 py-2 border rounded-md focus-within:outline-none focus-within:ring-2 transition-all duration-200'}
          min-h-[42px] flex flex-wrap items-center gap-1.5 cursor-text
        `}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Render existing skills as tags */}
        {skills.map((skill, index) => (
          <div
            key={index}
            className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-200 transition-colors relative max-w-full"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <span className="truncate max-w-[150px] sm:max-w-[200px]" title={skill}>{skill}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                removeSkill(index);
              }}
              className="ml-1 inline-flex items-center justify-center w-4 h-4 sm:w-5 sm:h-5 text-blue-600 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors touch-manipulation"
              title="Remove skill"
              aria-label={`Remove ${skill}`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Tooltip */}
            {hoveredIndex === index && (
              <div className="absolute z-20 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap pointer-events-none">
                Remove
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-900"></div>
              </div>
            )}
          </div>
        ))}
        {/* Input field */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            // Add current input value as skill if it exists
            if (inputValue.trim() && skills.length < 20) {
              addSkill(inputValue);
            }
            onBlur();
          }}
          placeholder={skills.length === 0 ? placeholder : skills.length >= 20 ? 'Maximum skills reached' : ''}
          className={`flex-1 min-w-[120px] border-none outline-none bg-transparent text-sm ${skills.length >= 20 ? 'placeholder-orange-400 cursor-not-allowed' : 'placeholder-gray-400'}`}
          data-field-path={fieldPath}
          disabled={skills.length >= 20}
        />
      </div>
      {/* Helper text */}
      <div className="mt-1 text-xs text-gray-500">
        {skills.length >= 20 ? (
          <span className="text-orange-600 font-medium">
            Maximum number of skills reached (20/20)
          </span>
        ) : (
          <>
            Type a skill and press <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">Enter</kbd> or <kbd className="px-1.5 py-0.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded">,</kbd> to add it
            {skills.length > 0 && (
              <span className="ml-2 text-gray-400">
                • Use <kbd className="px-1 py-0.5 text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-200 rounded">Backspace</kbd> to remove the last skill
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any>({});
  const [touchedFields, setTouchedFields] = useState<any>({});
  const [profile, setProfile] = useState<any>({
    fullName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    currentTitle: '',
    location: '',
    professionalSummary: '',
    workExperience: [] as any[],
    education: [] as any[],
    skills: [] as string[],
    linkedinUrl: '',
    portfolioUrl: '',
    githubUrl: ''
  });
  // Add section-level error state
  const [sectionErrors, setSectionErrors] = useState<{ workExperience?: string; education?: string }>({});

  const parsedData = location.state?.parsedData;
  const isFromScratch = location.state?.fromScratch;

  // Validation helper functions
  const validateField = async (fieldPath: string, value: any, fullProfile?: any) => {
    try {
      const profileToValidate = fullProfile || profile;
      const schema = yupReach(profileValidationSchema, fieldPath);
      if (schema && (schema as any)._type !== 'ref' && typeof (schema as any).validate === 'function') {
        await (schema as any).validate(value, { context: profileToValidate });
      }
      // Clear error for this field
      setValidationErrors((prev: any) => {
        const newErrors = { ...prev };
        const pathParts = fieldPath.split('.');
        let current = newErrors;
        for (let i = 0; i < pathParts.length - 1; i++) {
          if (typeof current[pathParts[i]] === 'string') {
            return prev;
          }
          if (!current[pathParts[i]]) return prev;
          current = current[pathParts[i]];
        }
        delete current[pathParts[pathParts.length - 1]];
        return newErrors;
      });
    } catch (error: any) {
      // Set error for this field
      setValidationErrors((prev: any) => {
        const newErrors = { ...prev };
        // Normalize path for nested arrays
        const normalizedPath = fieldPath.replace(/\[(\d+)\]/g, '.$1');
        const pathParts = normalizedPath.split('.');
        let current = newErrors;
        for (let i = 0; i < pathParts.length - 1; i++) {
          if (typeof current[pathParts[i]] === 'string') {
            current[pathParts[i]] = {};
          }
          if (!current[pathParts[i]]) current[pathParts[i]] = {};
          current = current[pathParts[i]];
        }
        current[pathParts[pathParts.length - 1]] = error.message;
        return newErrors;
      });
    }
  };

  const validateFullForm = async () => {
    try {
      await profileValidationSchema.validate(profile, { abortEarly: false });
      setValidationErrors({});
      setSectionErrors({});
      return true;
    } catch (error: any) {
      const errors: any = {};
      let sectionErrs: { workExperience?: string; education?: string } = {};
      error.inner.forEach((err: any) => {
        // Normalize path for nested arrays
        const normalizedPath = err.path ? err.path.replace(/\[(\d+)\]/g, '.$1') : '';
        const pathParts = normalizedPath.split('.');
        let current = errors;
        for (let i = 0; i < pathParts.length - 1; i++) {
          if (!current[pathParts[i]]) current[pathParts[i]] = {};
          current = current[pathParts[i]];
        }
        current[pathParts[pathParts.length - 1]] = err.message;
        if (err.path === 'workExperience') sectionErrs.workExperience = err.message;
        if (err.path === 'education') sectionErrs.education = err.message;
      });
      setValidationErrors(errors);
      setSectionErrors(sectionErrs);
      return false;
    }
  };

  const markFieldAsTouched = (fieldPath: string) => {
    setTouchedFields((prev: any) => {
      const newTouched = { ...prev };
      const pathParts = fieldPath.split('.');
      let current = newTouched;
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!current[pathParts[i]]) current[pathParts[i]] = {};
        current = current[pathParts[i]];
      }
      
      current[pathParts[pathParts.length - 1]] = true;
      return newTouched;
    });
  };

  // Mark all fields as touched to show all validation errors
  const markAllFieldsAsTouched = () => {
    const allFieldsTouched: any = {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      currentTitle: true,
      location: true,
      professionalSummary: true,
      skills: true,
      linkedinUrl: true,
      portfolioUrl: true,
      githubUrl: true,
      workExperience: {},
      education: {}
    };

    // Mark work experience fields as touched
    profile.workExperience?.forEach((_: any, index: number) => {
      allFieldsTouched.workExperience[index] = {
        company: true,
        jobTitle: true,
        startDate: true,
        endDate: true,
        location: true,
        description: true
      };
    });

    // Mark education fields as touched
    profile.education?.forEach((_: any, index: number) => {
      allFieldsTouched.education[index] = {
        institution: true,
        degree: true,
        fieldOfStudy: true,
        startDate: true,
        endDate: true,
        grade: true,
        location: true
      };
    });

    setTouchedFields(allFieldsTouched);
  };

  // Find the first field with an error and scroll to it
  const scrollToFirstError = () => {
    // Helper function to find first error in nested object
    const findFirstErrorPath = (errors: any, prefix = ''): string | null => {
      for (const key in errors) {
        if (errors.hasOwnProperty(key)) {
          const currentPath = prefix ? `${prefix}.${key}` : key;
          
          if (typeof errors[key] === 'string') {
            return currentPath;
          } else if (typeof errors[key] === 'object' && errors[key] !== null) {
            const nestedPath = findFirstErrorPath(errors[key], currentPath);
            if (nestedPath) return nestedPath;
          }
        }
      }
      return null;
    };

    const firstErrorPath = findFirstErrorPath(validationErrors);
    if (firstErrorPath) {
      // Convert path to a CSS selector or element ID
      const elementId = firstErrorPath.replace(/\./g, '-');
      
      // Try to find the input element
      const element = document.querySelector(`[data-field-path="${firstErrorPath}"]`) ||
                    document.querySelector(`input[data-field="${firstErrorPath}"]`) ||
                    document.querySelector(`textarea[data-field="${firstErrorPath}"]`) ||
                    document.querySelector(`#${elementId}`) ||
                    // Fallback: find by name attribute
                    document.querySelector(`[name="${firstErrorPath}"]`);
      
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center',
          inline: 'nearest'
        });
        
        // Focus the element after a short delay to ensure scroll is complete
        setTimeout(() => {
          (element as HTMLElement).focus();
        }, 500);
      } else {
        // Fallback: scroll to the section containing the error
        const sections = ['basic-info', 'work-experience', 'education', 'skills', 'professional-links'];
        for (const sectionId of sections) {
          const section = document.getElementById(sectionId);
          if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            break;
          }
        }
      }
    }
  };

  const getFieldError = (fieldPath: string) => {
    const pathParts = fieldPath.split('.');
    let current = validationErrors;
    
    for (const part of pathParts) {
      if (!current || !current[part]) return null;
      current = current[part];
    }
    
    return current;
  };

  const isFieldTouched = (fieldPath: string) => {
    const pathParts = fieldPath.split('.');
    let current = touchedFields;
    
    for (const part of pathParts) {
      if (!current || !current[part]) return false;
      current = current[part];
    }
    
    return current === true;
  };

  const getInputClassName = (fieldPath: string, baseClass: string = '') => {
    const error = getFieldError(fieldPath);
    const touched = isFieldTouched(fieldPath);
    
    // Show error styling if field is touched OR if there are validation errors (from save attempt)
    const hasError = error && (touched || Object.keys(validationErrors).length > 0);
    const baseClasses = baseClass || 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200';
    
    if (hasError) {
      return `${baseClasses} border-red-500 focus:ring-red-500 focus:border-red-500 bg-red-50 shadow-sm`;
    }
    
    return `${baseClasses} border-gray-300 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400`;
  };

  // Error message component
  const ErrorMessage: React.FC<{ fieldPath: string }> = ({ fieldPath }) => {
    const error = getFieldError(fieldPath);
    const touched = isFieldTouched(fieldPath);
    
    // Show errors if field is touched OR if there are validation errors (from save attempt)
    if (!error || (!touched && Object.keys(validationErrors).length === 0)) return null;
    
    return (
      <div className="mt-1 flex items-center text-red-600 text-sm animate-pulse">
        <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span className="font-medium">{error}</span>
      </div>
    );
  };

  // Replace formatDate function to use date-fns and handle Date objects
  const formatDate = (date: any): Date | null => {
    if (!date) return null;
    if (typeof date === 'string') {
      // Accept both ISO and yyyy-MM-dd
      const d = date.length > 10 ? parseISO(date) : new Date(date);
      if (isValidDate(d)) return d;
    }
    if (date instanceof Date && isValidDate(date)) {
      return date;
    }
    return null;
  };

  const normalizeExperience = (experience: any[]) => {
    return (experience || []).map(exp => ({
      ...exp,
      startDate: formatDate(exp.startDate),
      endDate: formatDate(exp.endDate),
    }));
  };

  const normalizeEducation = (education: any[]) => {
    return (education || []).map(edu => ({
      ...edu,
      startDate: formatDate(edu.startDate),
      endDate: formatDate(edu.endDate),
    }));
  };

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    try {
      // Try to get applicant profile first, fallback to user profile
      let response;
      let profileData;
      
      try {
        response = await applicantProfileAPI.getProfile();
        profileData = response.data.profile;
      } catch (applicantProfileError) {
        response = await userAPI.getProfile();
        profileData = response.data;
      }

      // Get user data from AuthContext as backup for critical fields
      const authUserData = user;
      
      // Normalize profile data to handle both user and applicant profile formats
      // Prioritize API data, but use AuthContext user as fallback for essential fields
      const normalizedProfile = {
        fullName: profileData.fullName || authUserData?.fullName || `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim(),
        firstName: profileData.firstName || (authUserData?.fullName ? authUserData.fullName.split(' ')[0] : '') || '',
        lastName: profileData.lastName || (authUserData?.fullName ? authUserData.fullName.split(' ').slice(1).join(' ') : '') || '',
        email: profileData.email || authUserData?.email || '',
        phone: profileData.phone || '',
        currentTitle: profileData.currentTitle || '',
        location: typeof profileData.location === 'object' 
          ? `${profileData.location.city || ''}, ${profileData.location.province || ''}, ${profileData.location.country || ''}`.replace(/^,\s*|,\s*$/g, '').replace(/,\s*,/g, ',')
          : profileData.location || '',
        professionalSummary: profileData.professionalSummary || '',
        workExperience: normalizeExperience(profileData.workExperience || profileData.experience || []),
        education: normalizeEducation(profileData.education || []),
        skills: profileData.skills || [],
        linkedinUrl: profileData.linkedinUrl || profileData.socialLinks?.linkedin || '',
        portfolioUrl: profileData.portfolioUrl || profileData.socialLinks?.portfolio || '',
        githubUrl: profileData.githubUrl || profileData.socialLinks?.github || '',
        nocCode: profileData.nocCode || '',
        resumeUrl: profileData.resumeUrl || profileData.resume?.url || ''
      };
      
      // If we have parsed data, transform and merge it
      if (parsedData && typeof parsedData === 'object' && !Array.isArray(parsedData)) {
        const transformedData = transformParsedData(parsedData);
        const mergedProfile = { ...normalizedProfile, ...transformedData };
        setProfile(mergedProfile);
        toast.success('Profile data loaded from your resume!');
      } else {
        setProfile(normalizedProfile);
      }
    } catch (error) {
      // On error, try to get basic info from AuthContext
      let fallbackProfile = {
        fullName: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        currentTitle: '',
        location: '',
        professionalSummary: '',
        workExperience: [] as any[],
        education: [] as any[],
        skills: [] as string[],
        linkedinUrl: '',
        portfolioUrl: '',
        githubUrl: ''
      };

      if (user) {
        fallbackProfile = {
          ...fallbackProfile,
          fullName: user.fullName || '',
          firstName: user.fullName ? user.fullName.split(' ')[0] : '',
          lastName: user.fullName ? user.fullName.split(' ').slice(1).join(' ') : '',
          email: user.email || ''
        };
      }

      // If we have parsed data even when profile loading fails, use it
      if (parsedData && typeof parsedData === 'object' && !Array.isArray(parsedData)) {
        const transformedData = transformParsedData(parsedData);
        fallbackProfile = { ...fallbackProfile, ...transformedData };
        toast.success('Profile created from your resume!');
      } else {
        toast('Starting with a fresh profile. Please fill in your information below.', { 
          icon: 'ℹ️' 
        });
      }

      setProfile(fallbackProfile);
    } finally {
      setIsLoading(false);
    }
  }, [parsedData, user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    // Remove all debug logging (console.log, console.debug, etc.) from this file.
  }, [profile]);

  const handleInputChange = async (field: string, value: any) => {
    // Prevent workExperience and education from being set to a non-array value
    if ((field === 'workExperience' || field === 'education') && !Array.isArray(value)) {
      return;
    }
    if (field === 'skills') {
      setProfile((prev: any) => ({
        ...prev,
        skills: value
      }));
    } else {
      const newProfile = {
        ...profile,
        [field]: value
      };
      setProfile(newProfile);
    }
    // Mark field as touched and validate
    markFieldAsTouched(field);
    await validateField(field, value, field === 'skills' ? { ...profile, skills: value } : { ...profile, [field]: value });
  };

  const addWorkExperience = () => {
    const newExperience = {
      company: '',
      jobTitle: '',
      startDate: '',
      endDate: '',
      isCurrentRole: false,
      description: '',
      location: ''
    };
    
    setProfile((prev: any) => ({
      ...prev,
      workExperience: [...prev.workExperience, newExperience]
    }));
  };

  const updateWorkExperience = async (index: number, field: string, value: any) => {
  
    const newProfile = {
      ...profile,
      workExperience: profile.workExperience.map((exp: any, i: number) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    };
    
    setProfile(newProfile);
    
    // Mark field as touched and validate
    const fieldPath = `workExperience.${index}.${field}`;
    markFieldAsTouched(fieldPath);
    
    await validateField(fieldPath, value, newProfile);
    
  };

  const removeWorkExperience = (index: number) => {
    setProfile((prev: any) => ({
      ...prev,
      workExperience: prev.workExperience.filter((_: any, i: number) => i !== index)
    }));
  };

  const addEducation = () => {
    const newEducation = {
      institution: '',
      degree: '',
      fieldOfStudy: '',
      startDate: '',
      endDate: '',
      isCurrentlyEnrolled: false,
      grade: '',
      location: ''
    };
    
    setProfile((prev: any) => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const updateEducation = async (index: number, field: string, value: any) => {
    const newProfile = {
      ...profile,
      education: profile.education.map((edu: any, i: number) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    };
    
    setProfile(newProfile);
    
    // Mark field as touched and validate
    const fieldPath = `education.${index}.${field}`;
    markFieldAsTouched(fieldPath);
    await validateField(fieldPath, value, newProfile);
  };

  const removeEducation = (index: number) => {
    setProfile((prev: any) => ({
      ...prev,
      education: prev.education.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Validate entire form first
    const isValid = await validateFullForm();
    if (!isValid) {
      setIsSaving(false);
      
      // Mark all fields as touched to show all error messages
      markAllFieldsAsTouched();
      
      // Scroll to the first field with an error
      setTimeout(() => {
        scrollToFirstError();
      }, 100);
      
      // Show improved error message
      toast.error('Some fields need your attention. Please review the highlighted fields below.');
      return;
    }
    
    try {
      // Prepare the data for applicant profile
      const updatedProfile = {
        ...profile,
        fullName: profile.firstName && profile.lastName 
          ? `${profile.firstName} ${profile.lastName}` 
          : profile.fullName
      };

      // Filter out incomplete work experience entries
      if (updatedProfile.workExperience) {
        updatedProfile.workExperience = updatedProfile.workExperience.filter((exp: any) => 
          exp.company && exp.company.trim() !== '' && 
          exp.jobTitle && exp.jobTitle.trim() !== '' &&
          exp.description && exp.description.trim() !== ''
        );
      }

      // Filter out incomplete education entries
      if (updatedProfile.education) {
        updatedProfile.education = updatedProfile.education.filter((edu: any) => 
          edu.institution && edu.institution.trim() !== '' && 
          edu.degree && edu.degree.trim() !== ''
        );
      }

      // Filter out empty skills
      if (updatedProfile.skills) {
        updatedProfile.skills = updatedProfile.skills.filter((skill: string) => 
          skill && skill.trim() !== ''
        );
      }

      // Remove empty URL fields to avoid validation errors
      if (updatedProfile.linkedinUrl === '') {
        delete updatedProfile.linkedinUrl;
      }
      if (updatedProfile.portfolioUrl === '') {
        delete updatedProfile.portfolioUrl;
      }
      if (updatedProfile.githubUrl === '') {
        delete updatedProfile.githubUrl;
      }

      const response = await applicantProfileAPI.updateProfile(updatedProfile);
      toast.success('Your profile has been successfully updated!');
      // Update AuthContext with actual profileCompleted value from backend
      if (response.data && typeof response.data.profileCompleted !== 'undefined') {
        updateUser({ profileCompleted: response.data.profileCompleted });
        if (response.data.profileCompleted) {
          navigate('/dashboard');
        } else {
          navigate('/upload-resume');
        }
      } else {
        // Fallback: go to dashboard
        navigate('/dashboard');
      }
    } catch (error: any) {
      toast.error('Failed to save profile: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your profile...</p>
          <p className="mt-2 text-sm text-gray-500">Fetching your information to prefill the form</p>
        </div>
      </div>
    );
  }

  // Helper to ensure Date | undefined for minDate/maxDate
  const dateOrUndefined = (d: Date | null) => (d ? d : undefined);

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
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 sticky top-0 z-20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold font-visa drop-shadow-md text-[#ee2389]">Edit Your Profile</h1>
              <p className="text-gray-600 mt-1">
                {isFromScratch ? 'Build your professional profile from scratch' : 'Update your professional information'}
              </p>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Basic Information */}
        <div id="basic-info" className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
              <input
                type="text"
                className={getInputClassName('firstName')}
                value={profile.firstName || ''}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                onBlur={() => markFieldAsTouched('firstName')}
                placeholder="John"
                data-field-path="firstName"
              />
              <ErrorMessage fieldPath="firstName" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
              <input
                type="text"
                className={getInputClassName('lastName')}
                value={profile.lastName || ''}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                onBlur={() => markFieldAsTouched('lastName')}
                placeholder="Anderson"
                data-field-path="lastName"
              />
              <ErrorMessage fieldPath="lastName" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className={getInputClassName('email')}
                value={profile.email || ''}
                onChange={(e) => handleInputChange('email', e.target.value)}
                onBlur={() => markFieldAsTouched('email')}
                placeholder="john.anderson@example.com"
                data-field-path="email"
              />
              <ErrorMessage fieldPath="email" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input
                type="tel"
                className={getInputClassName('phone')}
                value={profile.phone || ''}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                onBlur={() => markFieldAsTouched('phone')}
                placeholder="(555) 123-4567"
                data-field-path="phone"
              />
              <ErrorMessage fieldPath="phone" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Title</label>
              <input
                type="text"
                className={getInputClassName('currentTitle')}
                value={profile.currentTitle || ''}
                onChange={(e) => handleInputChange('currentTitle', e.target.value)}
                onBlur={() => markFieldAsTouched('currentTitle')}
                placeholder="Senior UX Designer"
                data-field-path="currentTitle"
              />
              <ErrorMessage fieldPath="currentTitle" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input
                type="text"
                className={getInputClassName('location')}
                value={profile.location || ''}
                onChange={(e) => handleInputChange('location', e.target.value)}
                onBlur={() => markFieldAsTouched('location')}
                placeholder="San Francisco, CA"
                data-field-path="location"
              />
              <ErrorMessage fieldPath="location" />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Professional Summary
            </label>
            <textarea
              className={getInputClassName('professionalSummary', 'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200')}
              rows={4}
              value={profile.professionalSummary || ''}
              onChange={(e) => handleInputChange('professionalSummary', e.target.value)}
              onBlur={() => markFieldAsTouched('professionalSummary')}
              placeholder="Experienced UX Designer with over 5 years of expertise in creating user-centered digital experiences..."
              data-field-path="professionalSummary"
            />
            <ErrorMessage fieldPath="professionalSummary" />
          </div>
        </div>

        {/* Work Experience */}
        <div id="work-experience" className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Work Experience</h2>
            <button
              onClick={addWorkExperience}
              className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              Add Experience
            </button>
          </div>
          {/* Section-level error for work experience */}
          {sectionErrors.workExperience && (
            <div className="text-red-600 text-sm mb-3 animate-fade-in">{sectionErrors.workExperience}</div>
          )}
          {Array.isArray(profile.workExperience) && profile.workExperience.map((exp: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium text-gray-900">Experience {index + 1}</h3>
                <button
                  onClick={() => removeWorkExperience(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
                  <input
                    type="text"
                    className={getInputClassName(`workExperience.${index}.company`)}
                    value={exp.company || ''}
                    onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                    onBlur={() => markFieldAsTouched(`workExperience.${index}.company`)}
                    placeholder="TechCorp Inc."
                  />
                  <ErrorMessage fieldPath={`workExperience.${index}.company`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Title</label>
                  <input
                    type="text"
                    className={getInputClassName(`workExperience.${index}.jobTitle`)}
                    value={exp.jobTitle || ''}
                    onChange={(e) => updateWorkExperience(index, 'jobTitle', e.target.value)}
                    onBlur={() => markFieldAsTouched(`workExperience.${index}.jobTitle`)}
                    placeholder="Senior UX Designer"
                  />
                  <ErrorMessage fieldPath={`workExperience.${index}.jobTitle`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <DatePicker
                    selected={formatDate(exp.startDate)}
                    onChange={(date: Date | null) => updateWorkExperience(index, 'startDate', date ? date.toISOString().slice(0, 10) : '')}
                    dateFormat="yyyy-MM-dd"
                    className={getInputClassName(`workExperience.${index}.startDate`)}
                    placeholderText="YYYY-MM-DD"
                    onBlur={() => markFieldAsTouched(`workExperience.${index}.startDate`)}
                    maxDate={dateOrUndefined(formatDate(exp.endDate))}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    isClearable
                    autoComplete="off"
                    id={`workExperience-startDate-${index}`}
                  />
                  <ErrorMessage fieldPath={`workExperience.${index}.startDate`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <DatePicker
                    selected={formatDate(exp.endDate)}
                    onChange={(date: Date | null) => updateWorkExperience(index, 'endDate', date ? date.toISOString().slice(0, 10) : '')}
                    dateFormat="yyyy-MM-dd"
                    className={getInputClassName(`workExperience.${index}.endDate`)}
                    placeholderText="YYYY-MM-DD"
                    onBlur={() => markFieldAsTouched(`workExperience.${index}.endDate`)}
                    minDate={dateOrUndefined(formatDate(exp.startDate))}
                    disabled={exp.isCurrentRole}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    isClearable
                    autoComplete="off"
                    id={`workExperience-endDate-${index}`}
                  />
                  <ErrorMessage fieldPath={`workExperience.${index}.endDate`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    className={getInputClassName(`workExperience.${index}.location`)}
                    value={exp.location || ''}
                    onChange={(e) => updateWorkExperience(index, 'location', e.target.value)}
                    onBlur={() => markFieldAsTouched(`workExperience.${index}.location`)}
                    placeholder="San Francisco, CA"
                  />
                  <ErrorMessage fieldPath={`workExperience.${index}.location`} />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`current-role-${index}`}
                    checked={exp.isCurrentRole || false}
                    onChange={(e) => {
                      updateWorkExperience(index, 'isCurrentRole', e.target.checked);
                      // Also validate endDate when checkbox changes
                      setTimeout(() => {
                        validateField(`workExperience.${index}.endDate`, exp.endDate);
                      }, 100);
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={`current-role-${index}`} className="text-sm text-gray-700">
                    Current Role
                  </label>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  className={getInputClassName(`workExperience.${index}.description`)}
                  rows={3}
                  value={exp.description || ''}
                  onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                  onBlur={() => markFieldAsTouched(`workExperience.${index}.description`)}
                  placeholder="• Led the redesign of the company's flagship product..."
                />
                <ErrorMessage fieldPath={`workExperience.${index}.description`} />
              </div>
            </div>
          ))}
        </div>

        {/* Education */}
        <div id="education" className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Education</h2>
            <button
              onClick={addEducation}
              className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition-colors"
            >
              Add Education
            </button>
          </div>
          {/* Section-level error for education */}
          {sectionErrors.education && (
            <div className="text-red-600 text-sm mb-3 animate-fade-in">{sectionErrors.education}</div>
          )}
          {Array.isArray(profile.education) && profile.education.map((edu: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium text-gray-900">Education {index + 1}</h3>
                <button
                  onClick={() => removeEducation(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Institution</label>
                  <input
                    type="text"
                    className={getInputClassName(`education.${index}.institution`)}
                    value={edu.institution || ''}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    onBlur={() => markFieldAsTouched(`education.${index}.institution`)}
                    placeholder="Stanford University"
                  />
                  <ErrorMessage fieldPath={`education.${index}.institution`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Degree</label>
                  <input
                    type="text"
                    className={getInputClassName(`education.${index}.degree`)}
                    value={edu.degree || ''}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    onBlur={() => markFieldAsTouched(`education.${index}.degree`)}
                    placeholder="Bachelor of Science"
                  />
                  <ErrorMessage fieldPath={`education.${index}.degree`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Field of Study</label>
                  <input
                    type="text"
                    className={getInputClassName(`education.${index}.fieldOfStudy`)}
                    value={edu.fieldOfStudy || ''}
                    onChange={(e) => updateEducation(index, 'fieldOfStudy', e.target.value)}
                    onBlur={() => markFieldAsTouched(`education.${index}.fieldOfStudy`)}
                    placeholder="Computer Science"
                  />
                  <ErrorMessage fieldPath={`education.${index}.fieldOfStudy`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grade/GPA</label>
                  <input
                    type="text"
                    className={getInputClassName(`education.${index}.grade`)}
                    value={edu.grade || ''}
                    onChange={(e) => updateEducation(index, 'grade', e.target.value)}
                    onBlur={() => markFieldAsTouched(`education.${index}.grade`)}
                    placeholder="3.8/4.0"
                  />
                  <ErrorMessage fieldPath={`education.${index}.grade`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <DatePicker
                    selected={formatDate(edu.startDate)}
                    onChange={(date: Date | null) => updateEducation(index, 'startDate', date ? date.toISOString().slice(0, 10) : '')}
                    dateFormat="yyyy-MM-dd"
                    className={getInputClassName(`education.${index}.startDate`)}
                    placeholderText="YYYY-MM-DD"
                    onBlur={() => markFieldAsTouched(`education.${index}.startDate`)}
                    maxDate={dateOrUndefined(formatDate(edu.endDate))}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    isClearable
                    autoComplete="off"
                    id={`education-startDate-${index}`}
                  />
                  <ErrorMessage fieldPath={`education.${index}.startDate`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <DatePicker
                    selected={formatDate(edu.endDate)}
                    onChange={(date: Date | null) => updateEducation(index, 'endDate', date ? date.toISOString().slice(0, 10) : '')}
                    dateFormat="yyyy-MM-dd"
                    className={getInputClassName(`education.${index}.endDate`)}
                    placeholderText="YYYY-MM-DD"
                    onBlur={() => markFieldAsTouched(`education.${index}.endDate`)}
                    minDate={dateOrUndefined(formatDate(edu.startDate))}
                    disabled={edu.isCurrentlyEnrolled}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    isClearable
                    autoComplete="off"
                    id={`education-endDate-${index}`}
                  />
                  <ErrorMessage fieldPath={`education.${index}.endDate`} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    className={getInputClassName(`education.${index}.location`)}
                    value={edu.location || ''}
                    onChange={(e) => updateEducation(index, 'location', e.target.value)}
                    onBlur={() => markFieldAsTouched(`education.${index}.location`)}
                    placeholder="Stanford, CA"
                  />
                  <ErrorMessage fieldPath={`education.${index}.location`} />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id={`currently-enrolled-${index}`}
                    checked={edu.isCurrentlyEnrolled || false}
                    onChange={(e) => {
                      updateEducation(index, 'isCurrentlyEnrolled', e.target.checked);
                      // Also validate endDate when checkbox changes
                      setTimeout(() => {
                        validateField(`education.${index}.endDate`, edu.endDate);
                      }, 100);
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={`currently-enrolled-${index}`} className="text-sm text-gray-700">
                    Currently Enrolled
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div id="skills" className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Skills</h2>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Your Skills
          </label>
          <SkillsTagInput
            skills={Array.isArray(profile.skills) ? profile.skills : []}
            onChange={(newSkills) => handleInputChange('skills', newSkills)}
            onBlur={() => markFieldAsTouched('skills')}
            placeholder="Type a skill and press Enter (e.g., React, Python, UI/UX Design)"
            fieldPath="skills"
          />
          <ErrorMessage fieldPath="skills" />
          
          {/* Skills count and limit indicator */}
          <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
            <span>
              {Array.isArray(profile.skills) ? profile.skills.length : 0} skills added
              {Array.isArray(profile.skills) && profile.skills.length >= 3 && (
                <span className="ml-1 text-green-600 font-medium">✓ Minimum requirement met</span>
              )}
            </span>
            <span>
              Maximum: 20 skills
            </span>
          </div>
        </div>

        {/* Professional Links */}
        <div id="professional-links" className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Professional Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn URL</label>
              <input
                type="url"
                className={getInputClassName('linkedinUrl')}
                value={profile.linkedinUrl || ''}
                onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                onBlur={() => markFieldAsTouched('linkedinUrl')}
                placeholder="https://linkedin.com/in/yourprofile"
                data-field-path="linkedinUrl"
              />
              <ErrorMessage fieldPath="linkedinUrl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio URL</label>
              <input
                type="url"
                className={getInputClassName('portfolioUrl')}
                value={profile.portfolioUrl || ''}
                onChange={(e) => handleInputChange('portfolioUrl', e.target.value)}
                onBlur={() => markFieldAsTouched('portfolioUrl')}
                placeholder="https://yourportfolio.com"
                data-field-path="portfolioUrl"
              />
              <ErrorMessage fieldPath="portfolioUrl" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">GitHub URL</label>
              <input
                type="url"
                className={getInputClassName('githubUrl')}
                value={profile.githubUrl || ''}
                onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                onBlur={() => markFieldAsTouched('githubUrl')}
                placeholder="https://github.com/yourusername"
                data-field-path="githubUrl"
              />
              <ErrorMessage fieldPath="githubUrl" />
            </div>
          </div>
        </div>

        {/* Validation Summary */}
        {Object.keys(validationErrors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 animate-fade-in">
            <div className="flex items-center mb-3">
              <svg className="w-5 h-5 text-red-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <h3 className="text-sm font-medium text-red-800">Form Validation Errors</h3>
            </div>
            <div className="text-sm text-red-700">
              <p className="mb-2">Please review and correct the highlighted fields below:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                {validationErrors.firstName && <li>Check your first name</li>}
                {validationErrors.lastName && <li>Check your last name</li>}
                {validationErrors.email && <li>Verify your email address</li>}
                {validationErrors.phone && <li>Correct your phone number</li>}
                {validationErrors.currentTitle && <li>Add your current job title</li>}
                {validationErrors.location && <li>Provide your location</li>}
                {validationErrors.professionalSummary && <li>Complete your professional summary</li>}
                {validationErrors.workExperience && <li>Review your work experience entries</li>}
                {validationErrors.education && <li>Check your education information</li>}
                {validationErrors.skills && <li>Add at least 3 skills</li>}
                {(validationErrors.linkedinUrl || validationErrors.portfolioUrl || validationErrors.githubUrl) && <li>Fix invalid URLs in professional links</li>}
              </ul>
            </div>
          </div>
        )}

        {/* Save Button */}
        {/* Removed bottom save button and cancel button */}
      </div>
    </div>
  );
};

export default EditProfile; 