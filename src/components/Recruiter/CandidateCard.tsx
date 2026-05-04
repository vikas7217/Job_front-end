import React from 'react';

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
  createdAt: string;
}

interface CandidateCardProps {
  candidate: Candidate;
  onViewProfile: (candidateId: string) => void;
}

const CandidateCard: React.FC<CandidateCardProps> = ({ candidate, onViewProfile }) => {
  // Get initials for avatar if no profile picture
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  // Get employment type (placeholder - would need to be in actual data)
  const getEmploymentType = () => {
    return 'Full-time'; // Default for now
  };

  // Format NOC code display
  const formatNocCode = (code?: string, title?: string) => {
    if (!code) return title || 'No title specified';
    return `NOC ${code}${title ? ` - ${title}` : ''}`;
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            {candidate.profilePictureUrl ? (
              <img
                className="h-12 w-12 rounded-full object-cover"
                src={candidate.profilePictureUrl}
                alt={candidate.fullName}
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">
                  {getInitials(candidate.fullName)}
                </span>
              </div>
            )}
          </div>

          {/* Candidate Info */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {candidate.fullName}
            </h3>
            
            <p className="text-sm text-gray-600 mt-1">
              {formatNocCode(candidate.nocCode, candidate.currentTitle)}
            </p>
            
            <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
              {candidate.location && (
                <span className="flex items-center">
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {candidate.location}
                </span>
              )}
              <span>{getEmploymentType()}</span>
            </div>

            {/* Skills */}
            {candidate.skills && candidate.skills.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {candidate.skills.slice(0, 4).map((skill, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fce4f2] text-[#ee2389]"
                  >
                    {skill}
                  </span>
                ))}
                {candidate.skills.length > 4 && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    +{candidate.skills.length - 4} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0 ml-4">
          <button
            onClick={() => onViewProfile(candidate._id)}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard; 