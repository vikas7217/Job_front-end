import axios from 'axios';
import toast from 'react-hot-toast';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:4001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and automatic logout
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - automatically logout
    if (error.response?.status === 401) {
      // Clear auth data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('tempUserEmail');
      
      // Show error message
      toast.error('Session expired. Please sign in again.');
      
      // Redirect to signin page
      window.location.href = '/signin';
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  signup: (data: { fullName: string; email: string; password: string }) =>
    api.post('/auth/signup', data),
  signin: (data: { email: string; password: string }) =>
    api.post('/auth/signin', data),
  logout: () =>
    api.post('/auth/logout'),
  /**
   * Verifies the user's email with the code and email.
   * Returns: { token: string, user: User }
   */
  verifyEmail: (code: string, email: string) =>
    api.post<{ token: string; user: any }>('/auth/verify-email', { code, email }),
  resendVerification: (email: string) =>
    api.post('/auth/resend-verification', { email }),
  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),
};

export const userAPI = {
  getProfile: () =>
    api.get('/users/profile'),
  updateProfile: (data: any) =>
    api.post('/users/profile', data),
  updateNOCSelection: (nocCode: string) =>
    api.put('/users/noc-selection', { nocCode }),
  updateResumeUpload: (resumeUrl: string) =>
    api.put('/users/resume-upload', { resumeUrl }),
  getOnboardingStatus: () =>
    api.get('/users/onboarding-status'),
};

export const applicantProfileAPI = {
  getProfile: () =>
    api.get('/applicant-profiles'),
  createProfile: (data: any) =>
    api.post('/applicant-profiles', data),
  updateProfile: (data: any) =>
    api.put('/applicant-profiles', data),
  deleteProfile: () =>
    api.delete('/applicant-profiles'),
};

// NOC API functions
export const nocAPI = {
  searchNOCCodes: async (query: string) => {
    const response = await api.get(`/noc/search?q=${encodeURIComponent(query)}`);
    return response.data;
  },

  getNOCByCode: async (code: string) => {
    const response = await api.get(`/noc/code/${code}`);
    return response.data;
  },

  seedNOCCodes: async () => {
    const response = await api.post('/noc/seed');
    return response.data;
  },

  getNOCCount: async () => {
    const response = await api.get('/noc/count');
    return response.data;
  },

   getAllNoc: async () => {
    const response = await api.get('/noc/getallnoccodes');
    return response.data;
  }
};

export const recruiterProfileAPI = {
  getProfile: () =>
    api.get('/recruiters/profile'),
  createProfile: (data: any) =>
    api.post('/recruiters/profile', data),
  updateProfile: (data: any) =>
    api.patch('/recruiters/profile', data),
  deleteProfile: () =>
    api.delete('/recruiters/profile'),
};

export const recruiterDashboardAPI = {
  searchCandidates: (params: {
    search?: string;
    nocCode?: string;
    skills?: string[];
    location?: string;
    availability?: string[];
    page?: number;
    limit?: number;
  }) => {
    const searchParams = new URLSearchParams();
    
    if (params.search) searchParams.append('search', params.search);
    if (params.nocCode) searchParams.append('nocCode', params.nocCode);
    if (params.skills?.length) searchParams.append('skills', params.skills.join(','));
    if (params.location) searchParams.append('location', params.location);
    if (params.availability?.length) searchParams.append('availability', params.availability.join(','));
    if (params.page) searchParams.append('page', params.page.toString());
    if (params.limit) searchParams.append('limit', params.limit.toString());
    
    return api.get(`/recruiters/candidates/search?${searchParams.toString()}`);
  },
  
  getCandidateFilters: () =>
    api.get('/recruiters/candidates/filters'),
    
  getDashboardStats: () =>
    api.get('/recruiters/dashboard/stats'),
    
  getCandidateProfile: (candidateId: string) =>
    api.get(`/recruiters/candidates/${candidateId}`),
    
  downloadCandidateResume: (candidateId: string) =>
    api.get(`/applicant-profiles/${candidateId}/resume`, {
      responseType: 'blob',
    }),
};

export const parseResume = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post(`${API_BASE_URL}/cv-parser/parse`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export default api; 