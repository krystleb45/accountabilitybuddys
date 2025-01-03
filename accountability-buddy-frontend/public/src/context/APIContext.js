import React, { createContext, useContext, useState, useCallback } from 'react';
import axios from '../config/axiosConfig';

// Create API Context
const APIContext = createContext();

// Custom hook to use APIContext
export const useAPI = () => useContext(APIContext);

// API Context Provider
export const APIProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [abortController, setAbortController] = useState(null);

  // Function to make API calls with enhanced error handling and cancellation
  const callAPI = useCallback(
    async (config) => {
      // Cancel previous request if any
      if (abortController) {
        abortController.abort();
      }

      const controller = new AbortController();
      setAbortController(controller);

      setIsLoading(true);
      setApiError(null);

      try {
        const response = await axios({
          ...config,
          signal: controller.signal,
        });
        return response.data;
      } catch (error) {
        if (error.name === 'CanceledError') {
          console.log('Request canceled');
        } else {
          setApiError(error.message || 'API call failed');
          console.error('API Error:', error);
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [abortController]
  );

  // Function to reset API error
  const clearApiError = () => setApiError(null);

  return (
    <APIContext.Provider value={{ isLoading, apiError, callAPI, clearApiError }}>
      {children}
    </APIContext.Provider>
  );
};

export default APIContext;
