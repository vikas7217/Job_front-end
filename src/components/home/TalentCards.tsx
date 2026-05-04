import React from 'react';

interface TalentCardProps {
  name: string;
  role: string;
  company: string;
  companyLogo: string;
  profileImage: string;
  position: 'top-left' | 'bottom-left' | 'bottom-right';
}

const TalentCard: React.FC<TalentCardProps> = ({ name, role, company, companyLogo, profileImage, position }) => {
  const positionClasses = {
    'top-left': 'top-10 left-4 sm:top-20 sm:left-20',
    'bottom-left': 'bottom-10 left-4 sm:bottom-20 sm:left-20',
    'bottom-right': 'bottom-10 right-4 sm:bottom-20 sm:right-20',
  };

  return (
    <div className={`absolute ${positionClasses[position]} z-30`}>
      {/* Connection line */}
      <div className="absolute w-32 h-px bg-yellow-400 opacity-60 transform rotate-45 origin-left"></div>
      
      {/* Card */}
      <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-purple-500/20 shadow-2xl max-w-xs">
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Profile Image */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-bold text-lg sm:text-xl flex-shrink-0">
            {profileImage ? (
              <img src={profileImage} alt={name} className="w-full h-full rounded-full object-cover" />
            ) : (
              name.charAt(0)
            )}
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-semibold text-base sm:text-lg truncate">{name}</h3>
            <p className="text-gray-300 text-sm">{role}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className="text-gray-400 text-xs">WORKING IN</span>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 sm:w-4 sm:h-4 bg-white rounded flex items-center justify-center">
                  <span className="text-black text-xs font-bold">{companyLogo}</span>
                </div>
                <span className="text-white text-xs sm:text-sm font-medium truncate">{company}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TalentCards: React.FC = () => {
  const talents = [
    {
      name: 'Meenakshi MS',
      role: 'ML Engineer',
      company: 'Apple',
      companyLogo: '🍎',
      profileImage: '',
      position: 'top-left' as const,
    },
    {
      name: 'Aditya Patil',
      role: 'ML Engineer',
      company: 'Google',
      companyLogo: 'G',
      profileImage: '',
      position: 'bottom-left' as const,
    },
    {
      name: 'Bhavik Amban',
      role: 'SDE II',
      company: 'amazon',
      companyLogo: 'A',
      profileImage: '',
      position: 'bottom-right' as const,
    },
  ];

  return (
    <div className="relative h-64 sm:h-96">
      {talents.map((talent, index) => (
        <TalentCard key={index} {...talent} />
      ))}
    </div>
  );
};

export default TalentCards; 