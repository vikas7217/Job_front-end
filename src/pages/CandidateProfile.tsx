import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { recruiterDashboardAPI } from '../services/api';
import { formatDateRangeSmart, formatDateWithContext } from '../utils/dateUtils';

interface Candidate {
  _id: string;
  fullName: string;
  email: string;
  currentTitle?: string;
  location?: string;
  skills: string[];
  nocCode?: string;
  profilePictureUrl?: string;
  workExperience: any[];
  education: any[];
  certifications: any[];
  languages: any[];
  professionalSummary?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  resumeUrl?: string;
  resume?: string; // Added for new backend structure
  createdAt: string;
}

const CandidateProfile: React.FC = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (candidateId) {
      loadCandidateProfile(candidateId);
    }
  }, [candidateId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (candidate) {
      // Remove debug log for resume presence
    }
  }, [candidate]);

  const loadCandidateProfile = async (id: string) => {
    try {
      const response = await recruiterDashboardAPI.getCandidateProfile(id);
      setCandidate(response.data);
    } catch (error) {
      toast.error('Failed to load candidate profile');
      navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadResume = async () => {
    if (!candidate || !candidate.resumeUrl || !candidateId) return;
    
    setIsDownloading(true);
    try {
      const response = await recruiterDashboardAPI.downloadCandidateResume(candidateId);
      
      // Create blob and download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or create default
      const contentDisposition = response.headers['content-disposition'];
      let filename = `${candidate.fullName.replace(/[^a-zA-Z0-9]/g, '_')}_Resume.pdf`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Resume downloaded successfully');
    } catch (error) {
      toast.error('Failed to download resume');
    } finally {
      setIsDownloading(false);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Candidate not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex items-start space-x-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              {candidate.profilePictureUrl ? (
                <img
                  className="h-24 w-24 rounded-full object-cover"
                  src={candidate.profilePictureUrl}
                  alt={candidate.fullName}
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center">
                  <span className="text-xl font-medium text-gray-700">
                    {getInitials(candidate.fullName)}
                  </span>
                </div>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold font-visa drop-shadow-md text-[#ee2389]">{candidate.fullName}</h1>
              {candidate.currentTitle && (
                <p className="text-xl text-gray-600 mt-1">{candidate.currentTitle}</p>
              )}
              {candidate.nocCode && (
                <p className="text-sm text-gray-500 mt-1">NOC Code: {candidate.nocCode}</p>
              )}
              {candidate.location && (
                <p className="text-sm text-gray-500 flex items-center mt-2">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {candidate.location}
                </p>
              )}

              {/* Contact Info */}
              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`mailto:${candidate.email}`}
                  className="bg-gradient-to-l from-[#ee2389] to-[#7c0bb3] text-white px-4 py-2 rounded-md hover:bg-gray-800 text-sm font-medium"
                >
                  Contact Candidate
                </a>
                {candidate.linkedinUrl && (
                  <a
                    href={candidate.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border border-[#ee2389] text-[#ee2389] px-4 py-2 rounded-md hover:bg-gray-50 text-sm font-medium"
                  >
                    LinkedIn Profile
                  </a>
                )}
                {((candidate.resumeUrl || candidate.resume) && candidate._id) && (
                  <button
                    onClick={handleDownloadResume}
                    disabled={isDownloading}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-l from-[#ee2389] to-[#7c0bb3] text-white text-sm font-medium rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ee2389] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDownloading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Downloading...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 4v12" />
                        </svg>
                        Download Resume
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        {candidate.skills && candidate.skills.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {candidate.skills.map((skill, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Professional Summary */}
        {candidate.professionalSummary && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Summary</h2>
            <p className="text-gray-700 leading-relaxed">{candidate.professionalSummary}</p>
          </div>
        )}

        {/* Work Experience */}
        {candidate.workExperience && candidate.workExperience.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Work Experience</h2>
            <div className="space-y-6">
              {candidate.workExperience.map((job, index) => (
                <div key={index} className="border-l-2 border-gray-200 pl-4">
                  <h3 className="text-lg font-medium text-gray-900">{job.jobTitle}</h3>
                  <p className="text-gray-600">{job.company}</p>
                  <p className="text-sm text-gray-500">
                    {formatDateRangeSmart(job.startDate, job.endDate, job.isCurrentRole)}
                  </p>
                  {job.description && (
                    <p className="mt-2 text-gray-700">{job.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {candidate.education && candidate.education.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Education</h2>
            <div className="space-y-4">
              {candidate.education.map((edu, index) => (
                <div key={index}>
                  <h3 className="text-lg font-medium text-gray-900">{edu.degree}</h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  {edu.fieldOfStudy && (
                    <p className="text-gray-600">{edu.fieldOfStudy}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    {formatDateRangeSmart(edu.startDate, edu.endDate, edu.isCurrentlyEnrolled)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Certifications */}
        {candidate.certifications && candidate.certifications.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Certifications</h2>
            <div className="space-y-4">
              {candidate.certifications.map((cert, index) => (
                <div key={index}>
                  <h3 className="text-lg font-medium text-gray-900">{cert.name}</h3>
                  <p className="text-gray-600">{cert.issuingOrganization}</p>
                  {(cert.issueDate || cert.expirationDate) && (
                    <p className="text-sm text-gray-500">
                      {cert.issueDate && `Issued: ${formatDateWithContext(cert.issueDate, 'issued')}`}
                      {cert.issueDate && cert.expirationDate && ' • '}
                      {cert.expirationDate && `Expires: ${formatDateWithContext(cert.expirationDate, 'expires')}`}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Languages */}
        {candidate.languages && candidate.languages.length > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Languages</h2>
            <div className="grid grid-cols-2 gap-4">
              {candidate.languages.map((lang, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-gray-900">{lang.name}</span>
                  <span className="text-gray-600">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CandidateProfile; 