export interface Location {
  city?: string;
  province?: string;
  country?: string;
}

export interface Resume {
  url?: string;
  uploadedAt?: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
}

export interface Experience {
  company: string;
  jobTitle: string;
  startDate: string;
  endDate?: string;
  isCurrentRole?: boolean;
  description: string;
  location?: string;
}

export interface Education {
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  isCurrentlyEnrolled?: boolean;
  grade?: string;
  location?: string;
}

export interface ApplicantProfile {
  _id?: string;
  userId: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  currentTitle?: string;
  location?: Location;
  professionalSummary?: string;
  nocCode?: string;
  resume?: Resume;
  experience: Experience[];
  education: Education[];
  skills: string[];
  socialLinks?: SocialLinks;
  availability?: string;
  visibility?: 'public' | 'private' | 'recruiter-only';
  createdAt?: string;
  updatedAt?: string;
}