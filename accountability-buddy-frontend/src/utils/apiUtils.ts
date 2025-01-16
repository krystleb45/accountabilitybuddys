// src/utils/apiUtils.js - Utility functions for API handling

/**
 * Handles API responses by checking the status and returning parsed JSON.
 *
 * @param {Response} response - The fetch API response object.
 * @returns {Promise<object>} - The parsed JSON data from the response.
 * @throws {Error} - Throws an error if the response is not ok.
 */
export const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json(); // Attempt to parse error response
    throw new Error(`Error ${response.status}: ${errorData.message || 'An unexpected error occurred'}`);
  }
  return response.json(); // Return parsed JSON data
};

/**
 * Handles errors that occur during API calls.
 *
 * @param {Error} error - The error object from the API call.
 * @returns {void} - Logs the error and can be enhanced to provide user feedback.
 */
export const handleError = (error) => {
  console.error("API Error:", error);
  // Additional error handling logic can be added here (e.g., showing notifications)
};

/**
 * Fetches data from an API and handles response and error.
 *
 * @param {string} url - The API endpoint URL.
 * @param {object} [options={}] - Optional fetch options (e.g., method, headers, body).
 * @returns {Promise<object>} - The parsed JSON data from the API response.
 * @throws {Error} - Throws an error if the request fails.
 */
export const fetchData = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    return await handleResponse(response); // Handle the response
  } catch (error) {
    handleError(error); // Handle the error
    throw error; // Re-throw error for further handling if necessary
  }
};
