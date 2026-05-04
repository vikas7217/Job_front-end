import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { nocAPI, userAPI } from "../services/api";
import useDebounce from "../hooks/useDebounce";
import { getNextOnboardingStep, UserData } from "../utils/onboarding";
import { NOCHighlight } from "../components/shared/HighlightText";
import { useAuth } from "../contexts/AuthContext";
import NocCard from "../components/card/NocCard";

interface NOCCode {
  _id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  skillLevel?: string;
  subCategory?: string;
}

const SelectNOC: React.FC = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<NOCCode[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Debounce search query to avoid excessive API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Live search effect
  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      handleLiveSearch(debouncedSearchQuery.trim());
    } else {
      setSearchResults([]);
      setError("");
      setHasSearched(false);
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    fetchInitialNOCs();
  }, []);

  const fetchInitialNOCs = async () => {
    try {
      const data = await nocAPI.getAllNoc();
      setSearchResults(data);
    } catch (error) {
      console.error("Error fetching initial NOCs:", error);
    }
  };

  const handleLiveSearch = async (query: string) => {
    // Improved validation - allow both numeric and text searches
    // For numeric queries, validate NOC code format (1-5 digits)
    const isNumericQuery = /^\d+$/.test(query);

    if (isNumericQuery && query.length > 5) {
      setError("NOC codes are maximum 5 digits. Please enter a valid code.");
      setSearchResults([]);
      setHasSearched(true);
      return;
    }

    // For text queries, require at least 2 characters to avoid too broad searches
    if (!isNumericQuery && query.length < 2) {
      setError("");
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setError("");
    setHasSearched(true);

    try {
      const results = await nocAPI.searchNOCCodes(query);
      setSearchResults(results);

      if (results.length === 0) {
        if (isNumericQuery) {
          setError("Entry not found. Please try a different NOC code.");
        } else {
          setError(
            "No job titles found matching your search. Try different keywords."
          );
        }
      }
    } catch (error) {
      setError("Search failed. Please try again.");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNOCSelect = async (noc: NOCCode) => {
    if (!user) {
      toast.error("User not found. Please try signing in again.");
      return;
    }

    setIsUpdating(true);

    try {
      // Update NOC selection on the backend
      await userAPI.updateNOCSelection(noc.code);

      // Update user state using AuthContext
      const updatedUserData = {
        ...user,
        nocCode: noc.code,
        // The backend should update nocSelected, but we'll set it here for immediate UI response
      };

      updateUser(updatedUserData);

      toast.success(`Selected: ${noc.code} - ${noc.title}`);

      // Navigate to next step after successful update
      // Create UserData format for onboarding logic
      const userDataForOnboarding: UserData = {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role || "applicant",
        nocSelected: true, // This should be true after NOC selection
        resumeUploaded: !!user.resumeUploaded,
        nocCode: noc.code,
      };

      const nextStep = getNextOnboardingStep(userDataForOnboarding);

      setTimeout(() => {
        navigate(nextStep);
      }, 500); // Reduced timeout for faster UX
    } catch (error) {
      console.error("Failed to save NOC selection:", error);
      toast.error("Failed to save NOC selection. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const searchUIText = {
    label: "Enter a NOC code or job title",
    placeholder: "Search by NOC code or job title",
  };
  const isNumericQuery = /^\d+$/.test(searchQuery.trim());

  return (
    <div className="min-h-screen bg-gray-50  py-12">
      <div
        id="style"
        className="   "
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          className="bg-white py-8 px-6 shadow-lg sm:rounded-lg"
          style={{ height: "53rem", width: "95rem" }}
        >
          {/* Header */}

          {/* Search Section */}
          <div className="mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  <span className="font-visa drop-shadow-md text-[#ee2389]">
                    Select Your NOC
                  </span>
                </h2>
                <p className="text-lg text-gray-700">
                  <span className="text-[#7c0bb3]">
                    Use the search below to find your National Occupation
                    Classification (NOC) code.
                  </span>
                </p>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-3 p-3 error-message text-red-700 rounded-md text-sm">
                  <div className="flex items-center">
                    <svg
                      className="w-4 h-4 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {error}
                  </div>
                </div>
              )}

              {/* Search Input */}
              <div className="relative">
                <input
                  id="noc-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={searchUIText.placeholder}
                  className="search-input w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-12 text-gray-900 placeholder-gray-500"
                  disabled={isUpdating}
                  aria-label={searchUIText.label}
                  aria-describedby={error ? "search-error" : undefined}
                />
                {(isLoading || isUpdating) && (
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <div
                      className="spinner h-5 w-5"
                      aria-label="Loading search results"
                    ></div>
                  </div>
                )}
              </div>

              {/* Search Tips */}
              <div className="mt-4">
                <button
                  type="button"
                  className="text-blue-600 text-sm hover:text-blue-800 flex items-center transition-colors group"
                  onClick={() =>
                    window.open("https://noc.esdc.gc.ca/", "_blank")
                  }
                >
                  <svg
                    className="w-4 h-4 mr-1 group-hover:scale-110 transition-transform"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Need help finding your NOC code?
                </button>
              </div>
            </div>

            <div className ="w-70 border-b-2 border-gray my-2"></div>
            <div>
              {/* Live Search Results */}
              {searchResults.length > 0 && (
                <div className="search-results mt-4 space-y-3 animate-slide-down">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Found {searchResults.length} result
                      {searchResults.length !== 1 ? "s" : ""}
                    </p>
                    <div className="text-xs text-gray-500">
                      {searchQuery && `Searching for: "${searchQuery}"`}
                    </div>
                  </div>

                  {searchResults.map((noc, index) => (
                    <div
                      key={noc._id}
                      onClick={() => !isUpdating && handleNOCSelect(noc)}
                      className={`search-result-item group p-5 border border-gray-200 rounded-xl ${
                        isUpdating
                          ? "cursor-not-allowed opacity-50"
                          : "cursor-pointer hover:border-blue-500 hover:bg-blue-50"
                      } animate-search-result-enter`}
                      style={{ animationDelay: `${index * 100}ms` }}
                      role="button"
                      tabIndex={0}
                      aria-label={`Select NOC code ${noc.code}: ${noc.title}`}
                      onKeyDown={(e) => {
                        if (
                          (e.key === "Enter" || e.key === " ") &&
                          !isUpdating
                        ) {
                          handleNOCSelect(noc);
                        }
                      }}
                    >
                      <div className="flex items-center">
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors text-lg">
                            <span className="text-blue-600">{noc.code}</span> -{" "}
                            <NOCHighlight
                              text={noc.title}
                              searchQuery={searchQuery}
                              isTitle={true}
                            />
                          </div>
                          <div className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                            <NOCHighlight
                              text={noc.description}
                              searchQuery={searchQuery}
                              isTitle={false}
                            />
                          </div>
                          <div className="flex items-center mt-3 space-x-3 text-xs">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              {noc.category}
                            </span>
                            {noc.skillLevel && (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                Skill Level: {noc.skillLevel}
                              </span>
                            )}
                          </div>
                        </div>
                        {!isUpdating && (
                          <div className="ml-6 opacity-0 group-hover:opacity-100 transition-all duration-200 transform group-hover:scale-110">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
                              <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <NocCard details={searchResults} handleNOCSelect={handleNOCSelect} />


                </div>
              )}

              {/* No Results Message */}
              {hasSearched &&
                searchResults.length === 0 &&
                !isLoading &&
                searchQuery.trim() && (
                  <div className="mt-4 text-center py-8 text-gray-500 animate-fade-in">
                    <div className="text-5xl mb-3">🔍</div>
                    <p className="text-lg font-medium">
                      No {isNumericQuery ? "NOC codes" : "job titles"} found
                    </p>
                    <p className="text-sm mt-1 text-gray-400">
                      {isNumericQuery
                        ? `No results for NOC code "${searchQuery}". Try a different code or search by job title.`
                        : `No results for "${searchQuery}". Try different keywords or search by NOC code.`}
                    </p>
                  </div>
                )}
            </div>
          </div>

          {/* Footer Links */}
          <div className="text-center text-xs text-gray-500">
            <p className="mb-2">
              *Source: Government of Canada – National Occupational
              Classification (NOC)*
            </p>
            <div className="space-y-1">
              <p>
                <a
                  href="https://noc.esdc.gc.ca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors hover:underline"
                >
                  https://noc.esdc.gc.ca/
                </a>
              </p>
              <p>
                <a
                  href="https://www.canada.ca/en/immigration-refugees-citizenship/services/immigrate-canada/find-national-occupation-code.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 transition-colors hover:underline"
                >
                  Find your NOC code - Immigration, Refugees and Citizenship
                  Canada
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectNOC;
