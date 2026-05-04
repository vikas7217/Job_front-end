import React from 'react';
import { Link } from 'react-router-dom';
import { Navigation, HeroSection, ProfessionalProfiles, Footer } from '../components/home';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gsv-gradient relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-20 w-32 h-32 bg-yellow-400 rounded-full opacity-20 blur-xl animate-pulse"></div>
        <div className="absolute bottom-40 left-10 w-24 h-24 bg-[#ee2389] rounded-full opacity-30 blur-lg animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-[#7c0bb3] rounded-full opacity-25 blur-md animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10">
        <Navigation />
        <HeroSection />
        <ProfessionalProfiles />
        <Footer />
      </div>
    </div>
  );
};

export default HomePage; 