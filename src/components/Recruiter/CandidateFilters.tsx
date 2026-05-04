import React, { useState, useEffect } from 'react';
import { recruiterDashboardAPI } from '../../services/api';
import toast from 'react-hot-toast';

interface FilterOptions {
  nocCodes: string[];
  skills: string[];
  locations: string[];
  availability: string[];
}

interface FilterValues {
  search: string;
  nocCode: string;
  skills: string[];
  location: string;
  availability: string[];
}

interface CandidateFiltersProps {
  onFiltersChange: (filters: FilterValues) => void;
  isLoading: boolean;
}

const CandidateFilters: React.FC<CandidateFiltersProps> = ({ onFiltersChange, isLoading }) => {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    nocCodes: [],
    skills: [],
    locations: [],
    availability: ['Full-time', 'Part-time', 'Contract', 'Internship']
  });
  
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    nocCode: '',
    skills: [],
    location: '',
    availability: []
  });

  const [skillInput, setSkillInput] = useState('');
  const [showSkillsDropdown, setShowSkillsDropdown] = useState(false);

  useEffect(() => {
    loadFilterOptions();
  }, []);

  const loadFilterOptions = async () => {
    try {
      const response = await recruiterDashboardAPI.getCandidateFilters();
      setFilterOptions(response.data);
    } catch (error) {
      toast.error('Failed to load filter options');
    }
  };

  const handleFilterChange = (key: keyof FilterValues, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleSkillAdd = (skill: string) => {
    if (skill && !filters.skills.includes(skill)) {
      handleFilterChange('skills', [...filters.skills, skill]);
    }
    setSkillInput('');
    setShowSkillsDropdown(false);
  };

  const handleSkillRemove = (skillToRemove: string) => {
    handleFilterChange('skills', filters.skills.filter(skill => skill !== skillToRemove));
  };

  const filteredSkills = filterOptions.skills.filter(skill =>
    skill.toLowerCase().includes(skillInput.toLowerCase()) &&
    !filters.skills.includes(skill)
  );

  const handleAvailabilityChange = (availability: string, checked: boolean) => {
    const newAvailability = checked
      ? [...filters.availability, availability]
      : filters.availability.filter(a => a !== availability);
    handleFilterChange('availability', newAvailability);
  };

  const clearAllFilters = () => {
    const clearedFilters = {
      search: '',
      nocCode: '',
      skills: [],
      location: '',
      availability: []
    };
    setFilters(clearedFilters);
    setSkillInput('');
    onFiltersChange(clearedFilters);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Filters</h3>
        <button
          onClick={clearAllFilters}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Clear All
        </button>
      </div>

      {/* Search Candidates */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Candidates
        </label>
        <input
          type="text"
          placeholder="Job title, skills, keywords..."
          value={filters.search}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ee2389] focus:border-[#ee2389] sm:text-sm"
        />
      </div>

      {/* NOC Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          NOC Code
        </label>
        <select
          value={filters.nocCode}
          onChange={(e) => handleFilterChange('nocCode', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ee2389] focus:border-[#ee2389] sm:text-sm"
        >
          <option value="">Select NOC Code</option>
          {filterOptions.nocCodes.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>

      {/* Skills */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skills
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Add skill..."
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onFocus={() => setShowSkillsDropdown(true)}
            onBlur={() => setTimeout(() => setShowSkillsDropdown(false), 200)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ee2389] focus:border-[#ee2389] sm:text-sm"
          />
          
          {/* Skills Dropdown */}
          {showSkillsDropdown && filteredSkills.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
              {filteredSkills.slice(0, 10).map((skill) => (
                <div
                  key={skill}
                  onClick={() => handleSkillAdd(skill)}
                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-[#ee2389] hover:text-[#7c0bb3]"
                >
                  {skill}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Selected Skills */}
        {filters.skills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {filters.skills.map((skill) => (
              <span
                key={skill}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#fce4f2] text-[#ee2389]"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => handleSkillRemove(skill)}
                  className="ml-1 text-[#ee2389] hover:text-[#7c0bb3]"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location
        </label>
        <select
          value={filters.location}
          onChange={(e) => handleFilterChange('location', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#ee2389] focus:border-[#ee2389] sm:text-sm"
        >
          <option value="">All Locations</option>
          {filterOptions.locations.map((location) => (
            <option key={location} value={location}>
              {location}
            </option>
          ))}
        </select>
      </div>

      {/* Availability */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Availability
        </label>
        <div className="space-y-2">
          {filterOptions.availability.map((availability) => (
            <label key={availability} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.availability.includes(availability)}
                onChange={(e) => handleAvailabilityChange(availability, e.target.checked)}
                className="h-4 w-4 text-[#ee2389] focus:ring-[#ee2389] border-[#ee2389] rounded"
              />
              <span className="ml-2 text-sm text-gray-700">{availability}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Apply Filters Button */}
      <button
        onClick={() => onFiltersChange(filters)}
        disabled={isLoading}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-[#ee2389] hover:bg-[#7c0bb3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500'
        }`}
      >
        {isLoading ? 'Searching...' : 'Apply Filters'}
      </button>
    </div>
  );
};

export default CandidateFilters; 