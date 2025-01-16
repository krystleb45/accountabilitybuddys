import axios from "axios";

// Base URL setup for Axios
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000",
  timeout: 15000, // Extended timeout to 15 seconds for better reliability
  headers: {
    "Content-Type": "application/json", // Ensures all requests use JSON format
  },
});

// Helper function to get the auth token from localStorage
const getAuthToken = () => localStorage.getItem("authToken");

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // Additional headers if needed (e.g., for CSRF protection)
    // config.headers['X-CSRF-Token'] = 'your-csrf-token';

    return config;
  },
  (error) => {
    console.error("Request error:", error); // Improved logging for debugging
    return Promise.reject(error);
  },
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration or unauthorized access (401)
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Prevents infinite retry loops

      // Clear token and redirect to login
      localStorage.removeItem("authToken");
      window.location.href = "/login";

      return Promise.reject(error);
    }

    // Handle other error statuses (e.g., 403, 404, 500)
    if (error.response) {
      switch (error.response.status) {
        case 403:
          alert("Access denied. Please check your permissions.");
          break;
        case 404:
          alert("Requested resource not found.");
          break;
        case 500:
          alert("Server error. Please try again later.");
          break;
        default:
          alert("An unexpected error occurred.");
      }
    } else if (error.request) {
      console.error("No response received:", error.request);
      alert("Network error. Please check your connection.");
    } else {
      console.error("Error setting up request:", error.message);
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
