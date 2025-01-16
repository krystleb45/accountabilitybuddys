import React, { createContext, useState, useContext, useCallback, ReactNode } from "react";

// Define the shape of the ErrorContext
interface ErrorContextType {
  error: string | null;
  errorType: string;
  handleError: (message: string, type?: string, autoClear?: boolean) => void;
  clearError: () => void;
}

// Create Error Context with the appropriate type
const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// Custom hook to use ErrorContext
export const useError = (): ErrorContextType => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};

// ErrorProvider component props
interface ErrorProviderProps {
  children: ReactNode;
}

// Error Context Provider
export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [error, setError] = useState<string | null>(null);
  const [errorType, setErrorType] = useState<string>(""); // Track error types

  // Handle error with type and optional auto-clear
  const handleError = useCallback(
    (message: string, type: string = "general", autoClear: boolean = false) => {
      setError(message);
      setErrorType(type);
      console.error(`[${type.toUpperCase()}] Error:`, message);

      if (autoClear) {
        setTimeout(() => clearError(), 5000); // Auto-clear error after 5 seconds
      }
    },
    [],
  );

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
    setErrorType("");
  }, []);

  return (
    <ErrorContext.Provider value={{ error, errorType, handleError, clearError }}>
      {children}
      {error && (
        <div className={`error-banner ${errorType}`}>
          {error}
          <button onClick={clearError} className="close-button">
            X
          </button>
        </div>
      )}
    </ErrorContext.Provider>
  );
};

export default ErrorContext;
