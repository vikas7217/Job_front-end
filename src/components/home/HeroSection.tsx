import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SlideAnimation: React.FC = () => {
  const phrases = [
    'Skilled Workers with Canadian Employers',
    'Top Talent With Leading Recruiters',
    'Founders With Strategic Investors',
    'Global Visa With Certified Immigration Consultants'
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
    const interval = setInterval(() => {
      // Hide current text ultra-fast
      setIsVisible(false);
      
      // After ultra-fast hiding, change to next phrase and show
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % phrases.length);
        setIsVisible(true);
      }, 100); // Ultra-fast slide out
    }, 6000); // Stay visible longer for reading

    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      <span className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white">
        Connecting →
      </span>
      <div className="overflow-hidden relative">
                 <span 
           className="text-3xl sm:text-4xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 font-mono tracking-wide inline-block transition-all duration-300 ease-out"
           style={{ 
             fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
             transform: isVisible ? 'translateX(0) rotateY(0deg)' : 'translateX(-100%) rotateY(-90deg)',
             transformOrigin: 'left center',
             perspective: '1000px',
             transition: isVisible ? 'all 0.3s ease-out' : 'all 0.1s ease-in'
           }}
        >
          {phrases[currentIndex]}
        </span>
      </div>
    </div>
  );
};

const HeroSection: React.FC = () => {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8" style={{ backgroundColor: '#3F005F' }}>
      <div className="max-w-7xl mx-auto text-center">
        {/* Secondary headline */}
        <div className="mb-6">
          <h2 className="text-white text-lg sm:text-xl font-medium">
            Find, hire & manage your offshore team seamlessly.
          </h2>
        </div>

        {/* Main headline with glow effect */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-[#ee2389]/20 to-[#7c0bb3]/20 rounded-3xl blur-2xl"></div>
          <div className="relative bg-black/30 backdrop-blur-sm rounded-3xl p-8 sm:p-12 border border-[#ee2389]/20">
            <div className="mb-4">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4">
                ✨ With AI & Human Intelligence
              </h3>
            </div>
            <SlideAnimation />
          </div>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/signin"
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors duration-200 text-base sm:text-lg w-full sm:w-auto text-center"
          >
            Hire a Talent
          </Link>
          <Link
            to="/signin"
            className="bg-black hover:bg-gray-800 text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-lg transition-colors duration-200 text-base sm:text-lg border border-white/20 w-full sm:w-auto text-center"
          >
            Find a Job
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 