// src/utils/numberUtils.js

/**
 * Rounds a number to a specified number of decimal places.
 *
 * @param {number} num - The number to round.
 * @param {number} decimalPlaces - The number of decimal places to round to.
 * @returns {number} - The rounded number.
 * @throws {Error} - Throws an error if the input is not a number.
 */
export const roundToDecimal = (num, decimalPlaces) => {
    if (typeof num !== 'number') {
      throw new Error('Input must be a number');
    }
    return Number(num.toFixed(decimalPlaces));
  };
  
  /**
   * Formats a number as currency.
   *
   * @param {number} num - The number to format.
   * @param {string} [locale='en-US'] - The locale to use for formatting (default is 'en-US').
   * @param {string} [currency='USD'] - The currency to use for formatting.
   * @returns {string} - The formatted currency string.
   */
  export const formatCurrency = (num, locale = 'en-US', currency = 'USD') => {
    if (typeof num !== 'number') {
      throw new Error('Input must be a number');
    }
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(num);
  };
  
  /**
   * Checks if a number is even.
   *
   * @param {number} num - The number to check.
   * @returns {boolean} - True if the number is even, false otherwise.
   * @throws {Error} - Throws an error if the input is not a number.
   */
  export const isEven = (num) => {
    if (typeof num !== 'number') {
      throw new Error('Input must be a number');
    }
    return num % 2 === 0;
  };
  
  /**
   * Checks if a number is odd.
   *
   * @param {number} num - The number to check.
   * @returns {boolean} - True if the number is odd, false otherwise.
   * @throws {Error} - Throws an error if the input is not a number.
   */
  export const isOdd = (num) => {
    if (typeof num !== 'number') {
      throw new Error('Input must be a number');
    }
    return num % 2 !== 0;
  };
  
  /**
   * Generates a random number between a specified range.
   *
   * @param {number} min - The minimum value of the range.
   * @param {number} max - The maximum value of the range.
   * @returns {number} - A random number between min and max.
   * @throws {Error} - Throws an error if min is greater than max.
   */
  export const getRandomNumber = (min, max) => {
    if (min > max) {
      throw new Error('Minimum value cannot be greater than maximum value');
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  