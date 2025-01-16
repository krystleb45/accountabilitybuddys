// src/utils/stringUtils.js

/**
 * Trims whitespace from both ends of a string.
 *
 * @param {string} str - The string to trim.
 * @returns {string} - The trimmed string.
 * @throws {Error} - Throws an error if the input is not a string.
 */
export const trimString = (str) => {
    if (typeof str !== 'string') {
      throw new Error('Input must be a string');
    }
    return str.trim();
  };
  
  /**
   * Capitalizes the first letter of each word in a string.
   *
   * @param {string} str - The string to capitalize.
   * @returns {string} - The capitalized string.
   * @throws {Error} - Throws an error if the input is not a string.
   */
  export const capitalizeWords = (str) => {
    if (typeof str !== 'string') {
      throw new Error('Input must be a string');
    }
    return str.replace(/\b\w/g, (char) => char.toUpperCase());
  };
  
  /**
   * Converts a string to kebab-case.
   *
   * @param {string} str - The string to convert.
   * @returns {string} - The kebab-cased string.
   * @throws {Error} - Throws an error if the input is not a string.
   */
  export const toKebabCase = (str) => {
    if (typeof str !== 'string') {
      throw new Error('Input must be a string');
    }
    return str
      .trim()
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with dashes
      .replace(/[^\w-]+/g, ''); // Remove all non-word chars
  };
  
  /**
   * Converts a string to camelCase.
   *
   * @param {string} str - The string to convert.
   * @returns {string} - The camelCased string.
   * @throws {Error} - Throws an error if the input is not a string.
   */
  export const toCamelCase = (str) => {
    if (typeof str !== 'string') {
      throw new Error('Input must be a string');
    }
    return str
      .trim()
      .toLowerCase()
      .split(' ')
      .map((word, index) => (index === 0 ? word : capitalizeWords(word)))
      .join('');
  };
  
  /**
   * Checks if a string is a valid email address.
   *
   * @param {string} email - The string to check.
   * @returns {boolean} - True if the string is a valid email, false otherwise.
   */
  export const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email validation
    return regex.test(email);
  };
  