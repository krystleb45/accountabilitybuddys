// src/utils/dateUtils.js - Utility functions for date manipulation

/**
 * Formats a date to a readable string format.
 *
 * @param {string|Date} date - The date to format (can be a string or Date object).
 * @param {string} [locale='en-US'] - The locale for formatting (default is 'en-US').
 * @param {object} [options] - Options for formatting the date.
 * @returns {string} - The formatted date string.
 * @throws {Error} - Throws an error if the date is invalid.
 */
export const formatDate = (date, locale = 'en-US', options = { year: "numeric", month: "long", day: "numeric" }) => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) {
    throw new Error('Invalid date provided');
  }
  return parsedDate.toLocaleDateString(locale, options);
};

/**
 * Calculates the difference in days between two dates.
 *
 * @param {string|Date} startDate - The start date (can be a string or Date object).
 * @param {string|Date} endDate - The end date (can be a string or Date object).
 * @returns {number} - The difference in days.
 * @throws {Error} - Throws an error if either date is invalid.
 */
export const getDaysDifference = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start) || isNaN(end)) {
    throw new Error('Invalid date(s) provided');
  }

  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
};

/**
 * Checks if a given date is today.
 *
 * @param {string|Date} date - The date to check (can be a string or Date object).
 * @returns {boolean} - True if the date is today, false otherwise.
 */
export const isToday = (date) => {
  const givenDate = new Date(date);
  const today = new Date();

  return (
    givenDate.getFullYear() === today.getFullYear() &&
    givenDate.getMonth() === today.getMonth() &&
    givenDate.getDate() === today.getDate()
  );
};

/**
 * Adds days to a date and returns the new date.
 *
 * @param {string|Date} date - The initial date (can be a string or Date object).
 * @param {number} days - The number of days to add.
 * @returns {Date} - The new date after adding the days.
 * @throws {Error} - Throws an error if the date is invalid.
 */
export const addDays = (date, days) => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) {
    throw new Error('Invalid date provided');
  }
  parsedDate.setDate(parsedDate.getDate() + days);
  return parsedDate;
};
