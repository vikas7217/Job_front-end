import React from 'react';

/**
 * Utility function to highlight matched keywords in text
 * @param text - The text to highlight keywords in
 * @param query - The search query to highlight
 * @returns JSX element with highlighted keywords
 */
export const highlightMatch = (text: string, query: string): JSX.Element => {
  if (!query.trim() || !text) {
    return <span>{text}</span>;
  }

  try {
    // Escape special regex characters in the query
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // Create regex for case-insensitive search
    const regex = new RegExp(`(${escapedQuery})`, 'gi');
    
    // Split text by the query matches
    const parts = text.split(regex);
    
    // If no matches found, return original text
    if (parts.length === 1) {
      return <span>{text}</span>;
    }
    
    return (
      <span>
        {parts.map((part, index) => {
          // Check if this part matches the original query (case-insensitive)
          const isMatch = part.toLowerCase() === query.toLowerCase();
          
          if (isMatch && part.trim()) {
            return (
              <mark key={index} className="bg-yellow-200 text-yellow-900 font-medium px-1 rounded">
                {part}
              </mark>
            );
          } else {
            return <span key={index}>{part}</span>;
          }
        })}
      </span>
    );
  } catch (error) {
    // Fallback to original text if regex fails
    console.warn('Highlight function error:', error);
    return <span>{text}</span>;
  }
};

/**
 * Utility function to highlight multiple keywords in text (for word-based search)
 * @param text - The text to highlight keywords in
 * @param query - The search query to highlight
 * @returns JSX element with highlighted keywords
 */
export const highlightMultipleMatches = (text: string, query: string): JSX.Element => {
  if (!query.trim() || !text) {
    return <span>{text}</span>;
  }

  try {
    // Split query into individual words
    const words = query.trim().split(/\s+/).filter(word => word.length > 0);
    
    if (words.length === 0) {
      return <span>{text}</span>;
    }

    // If only one word, use simple highlight
    if (words.length === 1) {
      return highlightMatch(text, words[0]);
    }

    // For multiple words, create a combined regex pattern
    const escapedWords = words.map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    const combinedPattern = `(${escapedWords.join('|')})`;
    const regex = new RegExp(combinedPattern, 'gi');
    
    // Split text by matches
    const parts = text.split(regex);
    
    // If no matches found, return original text
    if (parts.length === 1) {
      return <span>{text}</span>;
    }
    
    return (
      <span>
        {parts.map((part, index) => {
          // Check if this part matches any of the search words
          const isMatch = words.some(word => 
            part.toLowerCase() === word.toLowerCase()
          );
          
          if (isMatch && part.trim()) {
            return (
              <mark key={index} className="bg-yellow-200 text-yellow-900 font-medium px-1 rounded">
                {part}
              </mark>
            );
          } else {
            return <span key={index}>{part}</span>;
          }
        })}
      </span>
    );
  } catch (error) {
    // Fallback to simple highlight using the full query
    console.warn('Multiple highlight function error:', error);
    return highlightMatch(text, query);
  }
};

/**
 * Get display text for search input placeholder and label
 * @param searchQuery - Current search query
 * @returns Object with appropriate label and placeholder text
 */
export const getSearchUIText = (searchQuery: string) => {
  const isNumericQuery = /^\d+$/.test(searchQuery.trim());
  
  return {
    label: isNumericQuery || !searchQuery.trim() 
      ? "Enter a NOC code or job title" 
      : "Search by job title or NOC code",
    placeholder: isNumericQuery || !searchQuery.trim()
      ? "Enter NOC code (e.g., 21231) or job title (e.g., 'data scientist')"
      : "Continue typing to search job titles...",
  };
}; 