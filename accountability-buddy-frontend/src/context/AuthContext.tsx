import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "../config/axiosConfig";

// Define the shape of the AuthContext
interface AuthContextType {
  authToken: string | null; // Add authToken if you use it
  isAuthenticated: boolean;  // Define isAuthenticated
  user: any;                // Replace 'any' with your specific user type if available
  loading: boolean;         // Loading state
  login: (token: string) => void; // Login function
  logout: () => void;       // Logout function
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
  const [user, setUser] = useState<any>(null); // User data state
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    if (isAuthenticated && authToken) {
      // Fetch user info logic
      axios
        .get("/user", { headers: { Authorization: `Bearer ${authToken}` } })
        .then((response) => {
          setUser(response.data);
          setLoading(false); // Stop loading once user data is fetched
        })
        .catch(() => {
          setIsAuthenticated(false);
          setLoading(false); // Stop loading if error occurs
        });
    } else {
      setLoading(false); // If not authenticated, stop loading
    }
  }, [isAuthenticated, authToken]);

  const login = (token: string) => {
    localStorage.setItem("authToken", token);
    setAuthToken(token);
    setIsAuthenticated(true);
    setLoading(true); // Optionally set loading true when logging in
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuthToken(null);
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, isAuthenticated, user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
