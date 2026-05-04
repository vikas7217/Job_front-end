import React from 'react';
import Highlighter from 'react-highlight-words';

interface HighlightTextProps {
  text: string;
  searchWords: string[];
  className?: string;
  highlightClassName?: string;
  caseSensitive?: boolean;
  autoEscape?: boolean;
}

/**
 * Enhanced text highlighting component with smooth UX and accessibility
 */
export const HighlightText: React.FC<HighlightTextProps> = ({
  text,
  searchWords,
  className = '',
  highlightClassName = '',
  caseSensitive = false,
  autoEscape = true,
}) => {
  // Filter out empty search words
  const validSearchWords = searchWords.filter(word => word && word.trim().length > 0);

  if (validSearchWords.length === 0) {
    return <span className={className}>{text}</span>;
  }

  return (
    <Highlighter
      highlightClassName={`highlight-match ${highlightClassName}`}
      searchWords={validSearchWords}
      autoEscape={autoEscape}
      textToHighlight={text}
      caseSensitive={caseSensitive}
      className={className}
      highlightTag="mark"
    />
  );
};

/**
 * Utility function to split search query into words for highlighting
 */
export const getSearchWords = (query: string): string[] => {
  if (!query || !query.trim()) {
    return [];
  }

  // Split by spaces and filter out empty strings
  return query
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0);
};

/**
 * Enhanced highlight component specifically for NOC search results
 */
interface NOCHighlightProps {
  text: string;
  searchQuery: string;
  className?: string;
  isTitle?: boolean;
}

export const NOCHighlight: React.FC<NOCHighlightProps> = ({
  text,
  searchQuery,
  className = '',
  isTitle = false,
}) => {
  const searchWords = getSearchWords(searchQuery);
  
  return (
    <HighlightText
      text={text}
      searchWords={searchWords}
      className={className}
      highlightClassName={isTitle ? 'highlight-title' : 'highlight-description'}
    />
  );
};

export default HighlightText; 