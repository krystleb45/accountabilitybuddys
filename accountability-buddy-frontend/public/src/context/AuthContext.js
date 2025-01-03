import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from '../config/axiosConfig';

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);

// Auth Context Provider
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  const [user, setUser] = useState(null);
  const [tokenExpiry, setTokenExpiry] = useState(localStorage.getItem('tokenExpiry') || null);

  useEffect(() => {
    if (isAuthenticated && !isTokenExpired()) {
      fetchUser();
    } else {
      logout(); // Log out if token is expired
    }
  }, [isAuthenticated]);

  // Check if token is expired
  const isTokenExpired = useCallback(() => {
    if (!tokenExpiry) return false;
    return Date.now() >= parseInt(tokenExpiry, 10);
  }, [tokenExpiry]);

  // Function to fetch user data
  const fetchUser = async () => {
    try {
      const response = await axios.get('/user');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      logout(); // Log out if fetching user fails
    }
  };

  // Login function with token and expiry handling
  const login = (token, expiry) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('tokenExpiry', expiry);
    setTokenExpiry(expiry);
    setIsAuthenticated(true);
  };

  // Refresh token function (placeholder logic)
  const refreshToken = async () => {
    try {
      const response = await axios.post('/auth/refresh-token');
      const { token, expiry } = response.data;
      login(token, expiry); // Update token and expiry
    } catch (error) {
      console.error('Failed to refresh token:', error);
      logout(); // Log out if token refresh fails
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpiry');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
