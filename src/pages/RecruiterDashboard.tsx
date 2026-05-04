import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import CandidateFilters from '../components/Recruiter/CandidateFilters';
import CandidateCard from '../components/Recruiter/CandidateCard';
import { recruiterDashboardAPI } from '../services/api';

interface DashboardStats {
  activeCandidates: number;
  newThisWeek: number;
  interviewsScheduled: number;
}

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

interface SearchResults {
  candidates: Candidate[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCandidates: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface FilterValues {
  search: string;
  nocCode: string;
  skills: string[];
  location: string;
  availability: string[];
}

const RecruiterDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    activeCandidates: 0,
    newThisWeek: 0,
    interviewsScheduled: 0
  });
  const [searchResults, setSearchResults] = useState<SearchResults>({
    candidates: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalCandidates: 0,
      hasNext: false,
      hasPrev: false
    }
  });
  const [currentPage, setCurrentPage] = useState(1);
  
  // Get user info for welcome message from AuthContext
  const firstName = user?.fullName?.split(' ')[0] || 'Recruiter';

  useEffect(() => {
    loadDashboardStats();
    searchCandidates({});
  }, []);

  const loadDashboardStats = async () => {
    try {
      const response = await recruiterDashboardAPI.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard stats');
    }
  };

  const searchCandidates = async (filters: Partial<FilterValues>, page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await recruiterDashboardAPI.searchCandidates({
        ...filters,
        page,
        limit: 10
      });
      setSearchResults(response.data);
      setCurrentPage(page);
    } catch (error) {
      toast.error('Failed to search candidates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFiltersChange = (filters: FilterValues) => {
    searchCandidates(filters, 1);
  };

  const handleViewProfile = (candidateId: string) => {
    navigate(`/candidates/${candidateId}/profile`);
  };

  const handlePageChange = (page: number, filters?: Partial<FilterValues>) => {
    searchCandidates(filters || {}, page);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gsv-gradient font-visa drop-shadow-md">
            <span className="font-visa drop-shadow-md text-[#ee2389]">Welcome back, {firstName}!</span>
          </h1>
          <p className="mt-2 text-lg text-[#ee2389] font-visa">
            <span className="text-[#7c0bb3]">Find the perfect candidates for your open positions</span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">👥</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active Candidates</dt>
                    <dd className="text-2xl font-bold text-gray-900">{stats.activeCandidates}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">📈</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">New This Week</dt>
                    <dd className="text-2xl font-bold text-gray-900">{stats.newThisWeek}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">📅</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Interviews Scheduled</dt>
                    <dd className="text-2xl font-bold text-gray-900">{stats.interviewsScheduled}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-12 gap-6">
          {/* Filters Sidebar */}
          <div className="col-span-3">
            <CandidateFilters 
              onFiltersChange={handleFiltersChange}
              isLoading={isLoading}
            />
          </div>

          {/* Results */}
          <div className="col-span-9">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-gray-900">
                    Candidate Results ({searchResults.pagination.totalCandidates})
                  </h2>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                    <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {isLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                  </div>
                ) : searchResults.candidates.length > 0 ? (
                  <div className="space-y-4">
                    {searchResults.candidates.map((candidate) => (
                      <CandidateCard
                        key={candidate._id}
                        candidate={candidate}
                        onViewProfile={handleViewProfile}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-400 text-4xl mb-4">🔍</div>
                    <p className="text-gray-500">No candidates found</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Try adjusting your search filters
                    </p>
                  </div>
                )}

                {/* Pagination */}
                {searchResults.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-6">
                    <div className="flex flex-1 justify-between sm:hidden">
                      <button
                        onClick={() => searchResults.pagination.hasPrev && handlePageChange(currentPage - 1)}
                        disabled={!searchResults.pagination.hasPrev}
                        className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => searchResults.pagination.hasNext && handlePageChange(currentPage + 1)}
                        disabled={!searchResults.pagination.hasNext}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing{' '}
                          <span className="font-medium">
                            {((currentPage - 1) * 10) + 1}
                          </span>{' '}
                          to{' '}
                          <span className="font-medium">
                            {Math.min(currentPage * 10, searchResults.pagination.totalCandidates)}
                          </span>{' '}
                          of{' '}
                          <span className="font-medium">
                            {searchResults.pagination.totalCandidates}
                          </span>{' '}
                          candidates
                        </p>
                      </div>
                      <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                          <button
                            onClick={() => searchResults.pagination.hasPrev && handlePageChange(currentPage - 1)}
                            disabled={!searchResults.pagination.hasPrev}
                            className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                          >
                            Previous
                          </button>
                          {[...Array(searchResults.pagination.totalPages)].map((_, i) => (
                            <button
                              key={i + 1}
                              onClick={() => handlePageChange(i + 1)}
                              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                                currentPage === i + 1
                                  ? 'z-10 bg-gradient-to-l from-[#ee2389] to-[#7c0bb3] text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                              }`}
                            >
                              {i + 1}
                            </button>
                          ))}
                          <button
                            onClick={() => searchResults.pagination.hasNext && handlePageChange(currentPage + 1)}
                            disabled={!searchResults.pagination.hasNext}
                            className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
                          >
                            Next
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard; 