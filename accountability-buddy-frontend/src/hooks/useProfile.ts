import { useState, useEffect, useCallback } from "react";
import axios from "src/config/axiosConfig";
import { User } from "@/types/User.types";

/**
 * Custom hook to manage user profiles.
 *
 * Provides functionalities to fetch, update, and manage user profile data.
 *
 * @returns An object containing the user profile, loading state, error state, and related operations.
 */
const useProfile = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch the user profile from the server
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<User>("/user/profile");
      setProfile(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Update the user profile on the server
  const updateProfile = useCallback(async (updatedProfile: Partial<User>) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.put<User>("/user/profile", updatedProfile);
      setProfile(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Reset the user profile
  const resetProfile = useCallback(() => {
    setProfile(null);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    resetProfile,
  };
};

export default useProfile;
export type { User };
