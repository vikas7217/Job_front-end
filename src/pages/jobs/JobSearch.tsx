import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const jobs = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'Tech Innovators',
    location: 'Remote',
    salary: '$120k - $150k',
    type: 'Full-time',
    description: 'We are looking for a Senior React Developer to join our team...',
    postedAt: '2 days ago',
    skills: ['React', 'TypeScript', 'Node.js'],
  },
  {
    id: 2,
    title: 'Frontend Engineer',
    company: 'Global Systems',
    location: 'New York, NY',
    salary: '$100k - $130k',
    type: 'Full-time',
    description: 'Join our team as a Frontend Engineer and help build...',
    postedAt: '3 days ago',
    skills: ['JavaScript', 'React', 'CSS'],
  },
];

interface FilterState {
  jobType: string[];
  location: string[];
  experience: string[];
  salary: string[];
}

const JobSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    jobType: [],
    location: [],
    experience: [],
    salary: [],
  });

  const handleFilterChange = (category: keyof FilterState, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value],
    }));
  };

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Find Your Dream Job
            </h2>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            {/* Search Input */}
            <div className="md:col-span-3">
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  name="search"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-md sm:text-sm border-gray-300"
                  placeholder="Search jobs by title, company, or keywords"
                />
              </div>
            </div>

            {/* Location Dropdown */}
            <div>
              <select
                id="location"
                name="location"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option>All Locations</option>
                <option>Remote</option>
                <option>New York, NY</option>
                <option>San Francisco, CA</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filters and Results */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>

              {/* Job Type */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Job Type</h4>
                  <div className="mt-2 space-y-2">
                    {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                      <div key={type} className="flex items-center">
                        <input
                          id={`jobType-${type}`}
                          name={`jobType-${type}`}
                          type="checkbox"
                          checked={filters.jobType.includes(type)}
                          onChange={() => handleFilterChange('jobType', type)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`jobType-${type}`} className="ml-2 text-sm text-gray-700">
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Experience Level</h4>
                  <div className="mt-2 space-y-2">
                    {['Entry Level', 'Mid Level', 'Senior Level', 'Lead'].map((level) => (
                      <div key={level} className="flex items-center">
                        <input
                          id={`experience-${level}`}
                          name={`experience-${level}`}
                          type="checkbox"
                          checked={filters.experience.includes(level)}
                          onChange={() => handleFilterChange('experience', level)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`experience-${level}`} className="ml-2 text-sm text-gray-700">
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Salary Range */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Salary Range</h4>
                  <div className="mt-2 space-y-2">
                    {['$0-$50k', '$50k-$100k', '$100k-$150k', '$150k+'].map((range) => (
                      <div key={range} className="flex items-center">
                        <input
                          id={`salary-${range}`}
                          name={`salary-${range}`}
                          type="checkbox"
                          checked={filters.salary.includes(range)}
                          onChange={() => handleFilterChange('salary', range)}
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`salary-${range}`} className="ml-2 text-sm text-gray-700">
                          {range}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
              {jobs.map((job) => (
                <div key={job.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        <Link to={`/jobs/${job.id}`} className="hover:text-indigo-600">
                          {job.title}
                        </Link>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">{job.company}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{job.salary}</p>
                      <p className="mt-1 text-sm text-gray-500">{job.location}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500 line-clamp-2">{job.description}</p>
                  </div>
                  <div className="mt-4">
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-sm text-gray-500">Posted {job.postedAt}</p>
                    <Link
                      to={`/jobs/${job.id}`}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobSearch; 