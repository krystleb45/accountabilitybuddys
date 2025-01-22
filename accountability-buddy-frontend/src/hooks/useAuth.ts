// useAuth.ts

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "src/config/axiosConfig";
import { User } from "@/types/User.types";

interface UseAuthResult {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const useAuth = (): UseAuthResult => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  // Fetch user data from the API
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/user");
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = useCallback(
    async (email: string, password: string) => {
      try {
        setLoading(true);
        const response = await axios.post("/auth/login", { email, password });

        // Save token in localStorage or cookie
        localStorage.setItem("authToken", response.data.token);

        // Fetch user data after login
        await fetchUser();

        // Redirect to dashboard or home
        navigate("/dashboard");
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchUser, navigate]
  );

  // Logout function
  const logout = useCallback(() => {
    try {
      // Clear token and user data
      localStorage.removeItem("authToken");
      setUser(null);
      setIsAuthenticated(false);

      // Redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  }, [navigate]);

  // Refresh user data manually
  const refreshUser = useCallback(async () => {
    try {
      await fetchUser();
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  }, [fetchUser]);

  // Initial user fetch on mount
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [fetchUser]);

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
    refreshUser,
  };
};

export default useAuth;
