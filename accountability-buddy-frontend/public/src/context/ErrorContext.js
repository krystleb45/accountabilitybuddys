import React, { createContext, useState, useContext, useCallback } from 'react';

// Create Error Context
const ErrorContext = createContext();

// Custom hook to use ErrorContext
export const useError = () => useContext(ErrorContext);

// Error Context Provider
export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(''); // Track error types

  // Handle error with type and optional auto-clear
  const handleError = useCallback((message, type = 'general', autoClear = false) => {
    setError(message);
    setErrorType(type);
    console.error(`[${type.toUpperCase()}] Error:`, message);

    if (autoClear) {
      setTimeout(() => clearError(), 5000); // Auto-clear error after 5 seconds
    }
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
    setErrorType('');
  }, []);

  return (
    <ErrorContext.Provider value={{ error, errorType, handleError, clearError }}>
      {children}
      {error && (
        <div className={`error-banner ${errorType}`}>
          {error}
          <button onClick={clearError} className="close-button">X</button>
        </div>
      )}
    </ErrorContext.Provider>
  );
};

export default ErrorContext;
