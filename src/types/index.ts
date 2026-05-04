export interface WorkExperience {
  _id?: string;
  company: string;
  jobTitle: string;
  startDate: string;
  endDate?: string;
  isCurrentRole?: boolean;
  description: string;
  location?: string;
}

export interface Education {
  _id?: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  isCurrentlyEnrolled?: boolean;
  grade?: string;
  location?: string;
}

export interface Certification {
  _id?: string;
  name: string;
  issuingOrganization: string;
  issueDate?: string;
  expirationDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface Language {
  _id?: string;
  name: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Native' | 'Fluent';
}

export interface UserProfile {
  _id?: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  currentTitle?: string;
  location?: string;
  professionalSummary?: string;
  workExperience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  languages: Language[];
  skills: string[];
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  profilePictureUrl?: string;
  nocCode?: string;
  resumeUrl?: string;
  nocSelected: boolean;
  resumeUploaded: boolean;
  profileCompleted: boolean;
} 