import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import axios, { AxiosRequestConfig } from "axios"; // Import axios and types

// Define the shape of the APIContext
interface APIContextType {
  isLoading: boolean;
  apiError: string | null;
  callAPI: (config: AxiosRequestConfig) => Promise<any>;
  clearApiError: () => void;
}

// Create API Context with the appropriate type
const APIContext = createContext<APIContextType | undefined>(undefined);

// Custom hook to use APIContext
export const useAPI = (): APIContextType => {
  const context = useContext(APIContext);
  if (!context) {
    throw new Error("useAPI must be used within an APIProvider");
  }
  return context;
};

// API Context Provider Props
interface APIProviderProps {
  children: ReactNode;
}

// API Context Provider
export const APIProvider: React.FC<APIProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // Function to make API calls with enhanced error handling and cancellation
  const callAPI = useCallback(
    async (config: AxiosRequestConfig): Promise<any> => {
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
      } catch (error: any) {
        if (error.name === "CanceledError") {
          console.log("Request canceled");
        } else {
          setApiError(error.message || "API call failed");
          console.error("API Error:", error);
        }
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [abortController],
  );

  // Function to reset API error
  const clearApiError = useCallback(() => setApiError(null), []);

  return (
    <APIContext.Provider value={{ isLoading, apiError, callAPI, clearApiError }}>
      {children}
    </APIContext.Provider>
  );
};

export default APIContext;
