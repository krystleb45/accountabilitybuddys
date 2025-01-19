import axios from "axios";
import { setToken, removeToken } from "../../services/authService"; // Ensure token management is handled

const API_URL = process.env.REACT_APP_API_URL || "https://api.example.com/auth";

// Define the shape of the user data returned from the API
interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    // Add more fields as needed
  };
}

// Define the shape of the registration data
interface RegisterUserData {
  name: string;
  email: string;
  password: string;
  // Add more fields if required by your API
}

// Helper function for error handling
const handleError = (error: any): never => {
  if (error.response && error.response.status === 401) {
    throw new Error("Invalid credentials. Please try again.");
  }
  throw new Error(
    error.response?.data?.message || "An error occurred. Please try again later."
  );
};

// Login user
export const loginUser = async (email: string, password: string): Promise<AuthResponse | undefined> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/login`, { email, password });
    const { token } = response.data;

    if (token) {
      setToken(token); // Save token in localStorage
    }

    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};

// Register new user
export const registerUser = async (userData: RegisterUserData): Promise<AuthResponse | undefined> => {
  try {
    const response = await axios.post<AuthResponse>(`${API_URL}/register`, userData);
    const { token } = response.data;

    if (token) {
      setToken(token); // Save token upon successful registration
    }

    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};
// This function retrieves the auth token from local storage and returns it in the Authorization header
export const getAuthHeader = (): { Authorization: string } => {
  const token = localStorage.getItem("authToken");
  if (!token) {
    throw new Error("Authentication token is missing.");
  }
  return { Authorization: `Bearer ${token}` };
};

// Logout user
export const logoutUser = async (): Promise<void> => {
  try {
    await axios.post(`${API_URL}/logout`);
    removeToken(); // Remove token on logout
  } catch (error: any) {
    handleError(error);
  }
};
