import axios from 'axios';
import jwtDecode from 'jwt-decode';

// Base API URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://accountabilitybuddys.com/api';

// Save token to localStorage or sessionStorage
export const setToken = (token, useSession = false) => {
  if (useSession) {
    sessionStorage.setItem('token', token); // Store in sessionStorage
  } else {
    localStorage.setItem('token', token); // Store in localStorage
  }
};

// Retrieve token from localStorage or sessionStorage
export const getToken = () => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  // Check if token exists and is not expired
  if (token && !isTokenExpired(token)) {
    return token;
  } else {
    removeToken(); // Remove expired or invalid token
    return null; // Return null if no valid token exists
  }
};

// Remove token from both localStorage and sessionStorage
export const removeToken = () => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};

// Check if a token is expired
export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now(); // Token expiration check
  } catch (error) {
    console.error('Invalid token:', error);
    return true; // Treat as expired if decoding fails
  }
};

// Get the authorization header with the token
export const getAuthHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Refresh token logic
export const refreshAuthToken = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, { headers: getAuthHeader() });
    if (response.data.token) {
      setToken(response.data.token); // Update the token
      return response.data.token;
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    logout(); // Logout if refresh fails
  }
};

// Login function
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    if (response.data.token) {
      setToken(response.data.token); // Save token upon successful login
      return response.data; // Return user data on successful login
    } else {
      throw new Error('Login failed. Please try again.');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw new Error(error.response?.data?.message || 'An error occurred during login.');
  }
};

// Register function
export const register = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data; // Return registration data
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error(error.response?.data?.message || 'An error occurred during registration.');
  }
};

// Get user info function
export const getUserInfo = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user`, { headers: getAuthHeader() });
    return response.data; // Return user info
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw new Error('Failed to fetch user info');
  }
};

// Logout function
export const logout = () => {
  removeToken(); // Clear token upon logout
  window.location.reload(); // Optionally reload the page
};

// Exporting all functions as default
export default {
  setToken,
  getToken,
  removeToken,
  isTokenExpired,
  getAuthHeader,
  refreshAuthToken,
  login,
  register,
  getUserInfo,
  logout,
};
