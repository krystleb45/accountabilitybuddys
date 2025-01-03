import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getUserProfile } from '../services/userService';

// Create UserContext
export const UserContext = createContext();

// UserProvider component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Function to fetch the user profile with retry logic and caching
  const fetchUserProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const profile = await getUserProfile();
      setUser(profile);
      cacheUserProfile(profile);
      setRetryCount(0); // Reset retry count after successful fetch
    } catch (err) {
      setRetryCount((prevRetry) => prevRetry + 1);
      if (retryCount < 3) {
        setTimeout(fetchUserProfile, 2000); // Retry after 2 seconds
      } else {
        setError('Failed to load user profile after multiple attempts.');
      }
    } finally {
      setLoading(false);
    }
  }, [retryCount]);

  // Cache user profile to localStorage
  const cacheUserProfile = (profile) => {
    try {
      localStorage.setItem('userProfile', JSON.stringify(profile));
    } catch (error) {
      console.warn('Failed to cache user profile:', error);
    }
  };

  // Load the user profile from localStorage or fetch it on mount
  useEffect(() => {
    const cachedProfile = localStorage.getItem('userProfile');
    if (cachedProfile) {
      setUser(JSON.parse(cachedProfile));
      setLoading(false);
    } else {
      fetchUserProfile();
    }
  }, [fetchUserProfile]);

  // Refresh the user profile manually
  const refreshUserProfile = async () => {
    setLoading(true);
    try {
      const profile = await getUserProfile();
      setUser(profile);
      cacheUserProfile(profile);
      setError(null); // Reset error on successful refresh
    } catch (err) {
      setError('Failed to refresh user profile.');
    } finally {
      setLoading(false);
    }
  };

  // Handle user logout or session expiration by clearing profile
  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('userProfile'); // Clear cached profile
  };

  return (
    <UserContext.Provider value={{ user, setUser, refreshUserProfile, logoutUser, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
