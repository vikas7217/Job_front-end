export interface Company {
  name: string;
  website?: string;
  industry?: string;
}

export interface Location {
  city: string;
  province: string;
  country: string;
}

export interface SocialLinks {
  linkedin?: string;
}

export interface RecruiterProfile {
  _id?: string;
  userId: string;
  fullName: string;
  company: Company;
  businessEmail: string;
  phone: string;
  location: Location;
  summary: string;
  specializations: string[];
  socialLinks?: SocialLinks;
  bookmarks: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRecruiterProfileDto {
  fullName: string;
  company: Company;
  businessEmail: string;
  phone: string;
  location: Location;
  summary: string;
  specializations?: string[];
  socialLinks?: SocialLinks;
}

export interface UpdateRecruiterProfileDto {
  fullName?: string;
  company?: Partial<Company>;
  businessEmail?: string;
  phone?: string;
  location?: Partial<Location>;
  summary?: string;
  specializations?: string[];
  socialLinks?: SocialLinks;
} 