/**
 * Utility functions for date handling and formatting
 */

/**
 * Safely formats a date string, returning a fallback if the date is invalid
 * @param dateString - The date string to format
 * @param fallback - The fallback text to show if date is invalid (default: 'Not specified')
 * @returns Formatted date string or fallback
 */
export const formatDateSafely = (dateString: string | null | undefined, fallback: string = 'Not specified'): string => {
  if (!dateString) {
    return fallback;
  }

  const date = new Date(dateString);
  
  // Check if the date is valid and not the Unix epoch (Jan 1, 1970)
  if (isNaN(date.getTime()) || date.getTime() === 0) {
    return fallback;
  }

  return date.toLocaleDateString();
};

/**
 * Formats a date range with proper handling of missing dates
 * @param startDate - Start date string
 * @param endDate - End date string
 * @param isCurrent - Whether this is a current position/education
 * @param startFallback - Fallback for missing start date
 * @param endFallback - Fallback for missing end date
 * @returns Formatted date range string
 */
export const formatDateRange = (
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  isCurrent: boolean = false,
  startFallback: string = 'Not specified',
  endFallback: string = 'Present'
): string => {
  const formattedStartDate = formatDateSafely(startDate, startFallback);
  const formattedEndDate = isCurrent ? 'Present' : formatDateSafely(endDate, endFallback);
  
  return `${formattedStartDate} - ${formattedEndDate}`;
};

/**
 * Checks if a date string is valid and not the Unix epoch
 * @param dateString - The date string to validate
 * @returns True if the date is valid and not the Unix epoch
 */
export const isValidDate = (dateString: string | null | undefined): boolean => {
  if (!dateString) {
    return false;
  }

  const date = new Date(dateString);
  return !isNaN(date.getTime()) && date.getTime() !== 0;
};

/**
 * Formats a date range with smart fallbacks for better UX
 * @param startDate - Start date string
 * @param endDate - End date string
 * @param isCurrent - Whether this is a current position/education
 * @returns Formatted date range string with smart fallbacks
 */
export const formatDateRangeSmart = (
  startDate: string | null | undefined,
  endDate: string | null | undefined,
  isCurrent: boolean = false
): string => {
  const hasStartDate = isValidDate(startDate);
  const hasEndDate = isValidDate(endDate);
  
  if (!hasStartDate && !hasEndDate) {
    return 'Dates not specified';
  }
  
  if (!hasStartDate) {
    return `Until ${formatDateSafely(endDate)}`;
  }
  
  if (!hasEndDate || isCurrent) {
    return `${formatDateSafely(startDate)} - Present`;
  }
  
  return `${formatDateSafely(startDate)} - ${formatDateSafely(endDate)}`;
};

/**
 * Formats a single date with smart fallback
 * @param dateString - The date string to format
 * @param context - Context for better fallback messages
 * @returns Formatted date string or contextual fallback
 */
export const formatDateWithContext = (
  dateString: string | null | undefined,
  context: 'issued' | 'expires' | 'start' | 'end' = 'start'
): string => {
  if (!dateString) {
    switch (context) {
      case 'issued':
        return 'Issue date not specified';
      case 'expires':
        return 'No expiration date';
      case 'start':
        return 'Start date not specified';
      case 'end':
        return 'End date not specified';
      default:
        return 'Date not specified';
    }
  }

  return formatDateSafely(dateString);
}; 