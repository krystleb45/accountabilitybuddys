import React, { createContext, useState, ReactNode, useContext, useEffect } from "react";
import axios from "axios";
import { User } from "../../types/User"; // Import centralized User type

// Define the UserContextType interface
interface UserContextType {
  user: User | null;
  refreshUserProfile: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

// Create the UserContext
const UserContext = createContext<UserContextType | undefined>(undefined);

// Custom Hook for consuming the UserContext
export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};

// Provider Component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch and refresh user profile
  const refreshUserProfile = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<User>("/api/user/profile"); // Replace with your actual API endpoint
      setUser(response.data);
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
      setError("Failed to fetch user profile.");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Initial user profile fetch
  useEffect(() => {
    refreshUserProfile();
  }, []);

  return (
    <UserContext.Provider value={{ user, refreshUserProfile, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
