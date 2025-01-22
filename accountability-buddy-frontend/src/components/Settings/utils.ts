/**
 * Validates an email address.
 * @param email - The email address to validate.
 * @returns True if the email is valid, false otherwise.
 */
export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Formats a URL to ensure it has a proper protocol (http or https).
   * @param url - The URL to format.
   * @returns A properly formatted URL.
   */
  export const formatUrl = (url: string): string => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
    return url;
  };
  
  /**
   * Truncates a string to a specified length, adding "..." if it exceeds the limit.
   * @param text - The text to truncate.
   * @param maxLength - The maximum allowed length.
   * @returns The truncated string.
   */
  export const truncateText = (text: string, maxLength: number): string => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength) + "...";
    }
    return text;
  };