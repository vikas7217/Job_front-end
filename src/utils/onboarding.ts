export interface OnboardingStatus {
  nocSelected: boolean;
  resumeUploaded: boolean;
  profileCompleted: boolean;
}

export interface UserData {
  id: string;
  fullName: string;
  email: string;
  role: string;
  nocSelected: boolean;
  resumeUploaded: boolean;
  profileCompleted?: boolean;
  nocCode?: string;
  resumeUrl?: string;
}

export const getNextOnboardingStep = (user: UserData): string => {
  // Recruiters go directly to dashboard (no NOC/resume requirements)
  if (user.role === 'recruiter') {
    return '/dashboard';
  }
  // --- NEW: If user has completed their profile, go directly to dashboard (regardless of resume upload) ---
  if (user.profileCompleted) {
    return '/dashboard';
  }
  // Applicant onboarding flow
  if (!user.nocSelected) {
    return '/select-noc';
  }
  if (!user.resumeUploaded) {
    return '/upload-resume';
  }
  // For new users who haven't completed profile yet, go to upload-resume
  // This maintains the flow for first-time users
  return '/upload-resume';
};

export const isOnboardingComplete = (user: UserData): boolean => {
  // Recruiters don't need NOC/resume onboarding
  if (user.role === 'recruiter') {
    return true;
  }
  
  // Applicants need NOC selection, resume upload, and profile completion
  return user.nocSelected && user.resumeUploaded && !!user.profileCompleted;
};

export const getOnboardingProgress = (user: UserData): number => {
  // Recruiters are always 100% complete (no onboarding steps)
  if (user.role === 'recruiter') {
    return 100;
  }
  
  // Applicant onboarding progress - now includes profile completion
  const steps = ['nocSelected', 'resumeUploaded', 'profileCompleted'];
  const completedSteps = steps.filter(step => {
    if (step === 'profileCompleted') {
      return !!user.profileCompleted;
    }
    return user[step as keyof UserData];
  });
  return (completedSteps.length / steps.length) * 100;
}; 