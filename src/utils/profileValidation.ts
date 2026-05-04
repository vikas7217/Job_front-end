import * as Yup from 'yup';

export const profileValidationSchema = Yup.object().shape({
  firstName: Yup.string().min(2).max(50).required(),
  lastName: Yup.string().min(2).max(50).required(),
  email: Yup.string().email().required(),
  phone: Yup.string().matches(/^[+]?[0-9\s\-()]{10,15}$/).required(),
  currentTitle: Yup.string().min(2).max(100).required(),
  location: Yup.string().min(2).max(100).required(),
  professionalSummary: Yup.string().min(50).max(2000).required(),
  workExperience: Yup.array().of(
    Yup.object().shape({
      company: Yup.string()
        .min(2, 'Company name is too short')
        .max(100, 'Company name is too long')
        .required('Company name is required'),
      jobTitle: Yup.string()
        .min(2, 'Job title is too short')
        .max(100, 'Job title is too long')
        .required('Job title is required'),
      startDate: Yup.date()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .max(new Date(), 'Start date cannot be in the future')
        .nullable(),
      endDate: Yup.date()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(),
      location: Yup.string()
        .min(2, 'Location is too short')
        .max(100, 'Location is too long')
        .required('Location is required'),
      description: Yup.string()
        .min(20, 'Description is too short')
        .max(1000, 'Description is too long')
        .required('Description is required'),
      isCurrentRole: Yup.boolean(),
    })
  ).min(1, 'At least one work experience is required'),
  education: Yup.array().of(
    Yup.object().shape({
      institution: Yup.string()
        .min(2, 'Institution name is too short')
        .max(100, 'Institution name is too long')
        .required('Institution name is required'),
      degree: Yup.string()
        .min(2, 'Degree is too short')
        .max(100, 'Degree is too long')
        .required('Degree is required'),
      fieldOfStudy: Yup.string()
        .min(2, 'Field of study is too short')
        .max(100, 'Field of study is too long')
        .required('Field of study is required'),
      startDate: Yup.date()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(),
      endDate: Yup.date()
        .transform((value, originalValue) => originalValue === '' ? null : value)
        .nullable(),
      grade: Yup.string(),
      location: Yup.string()
        .min(2, 'Location is too short')
        .max(100, 'Location is too long')
        .required('Location is required'),
      isCurrentlyEnrolled: Yup.boolean(),
    })
  ).min(1, 'At least one education entry is required'),
  skills: Yup.array().of(Yup.string().min(2).max(50)).min(3).max(20),
  linkedinUrl: Yup.string().url().nullable(),
  portfolioUrl: Yup.string().url().nullable(),
  githubUrl: Yup.string().url().nullable(),
}); 