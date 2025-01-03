// apiUtils.js - Utility functions for API handling
export const handleResponse = (response) => {
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    return response.json();
  };
  
  export const handleError = (error) => {
    console.error('API Error:', error);
    throw error;
  };

  