// AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "src/config/axiosConfig";
import { User } from "@/types/User.types"; // Import your User type

// Define the shape of the AuthContext
export interface AuthContextType { // Explicitly export the interface
  authToken: string | null; // Authentication token
  isAuthenticated: boolean; // User authentication state
  user: User | null; // Replace 'any' with your User type
  loading: boolean; // Loading state
  login: (token: string) => void; // Login function
  logout: () => void; // Logout function
  refreshUser: () => void; // Refresh user data function
}

// Create AuthContext with the appropriate type
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authToken, setAuthToken] = useState<string | null>(localStorage.getItem("authToken"));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!authToken);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch user data when authToken or isAuthenticated changes
  useEffect(() => {
    if (isAuthenticated && authToken) {
      fetchUserData();
    } else {
      setLoading(false); // Stop loading if not authenticated
    }
  }, [isAuthenticated, authToken]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/user", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = (token: string) => {
    localStorage.setItem("authToken", token);
    setAuthToken(token);
    setIsAuthenticated(true);
    fetchUserData();
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  const refreshUser = () => {
    if (authToken) fetchUserData();
  };

  return (
    <AuthContext.Provider
      value={{ authToken, isAuthenticated, user, loading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
