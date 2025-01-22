import axios, { AxiosResponse } from 'axios';
import { jwtDecode } from 'jwt-decode'; // Use named import

const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://accountabilitybuddys.com/api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  [key: string]: any;
}

export interface UserInfo {
  id: string;
  name: string;
  email: string;
  [key: string]: any;
}

// Define the structure of the decoded JWT payload
interface DecodedToken {
  exp: number; // Expiration time as a Unix timestamp
}

// Utility: Check if the token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token); // Decode and type the token
    return decoded.exp * 1000 < Date.now(); // Compare expiration time with current time
  } catch (error) {
    console.error('Invalid token:', error);
    return true; // Treat invalid tokens as expired
  }
};

// Utility: Set token in storage
export const setToken = (token: string, useSession = false): void => {
  if (useSession) {
    sessionStorage.setItem('token', token);
  } else {
    localStorage.setItem('token', token);
  }
};

// Utility: Get token from storage
export const getToken = (): string | null => {
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

// Utility: Clear token from storage
export const clearToken = (): void => {
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
};

// Utility: Get Authorization header
export const getAuthHeader = (): Record<string, string> => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Create Axios instance
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: Add Authorization header
apiClient.interceptors.request.use((config) => {
  const authHeader = getAuthHeader();
  if (authHeader.Authorization) {
    config.headers = new axios.AxiosHeaders({ ...config.headers, ...authHeader });
  }
  return config;
});

const AuthService = {
  /**
   * Login a user.
   * @param {LoginCredentials} credentials - The user's email and password.
   * @returns {Promise<{ token: string; user: UserInfo }>} - The authentication token and user info.
   */
  login: async (credentials: LoginCredentials): Promise<{ token: string; user: UserInfo }> => {
    try {
      const response: AxiosResponse<{ token: string; user: UserInfo }> = await apiClient.post('/login', credentials);
      setToken(response.data.token);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error('Failed to login. Please check your credentials.');
    }
  },

  /**
   * Register a new user.
   * @param {RegisterData} data - The registration data.
   * @returns {Promise<UserInfo>} - The registered user info.
   */
  register: async (data: RegisterData): Promise<UserInfo> => {
    try {
      const response: AxiosResponse<UserInfo> = await apiClient.post('/register', data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error('Failed to register. Please try again later.');
    }
  },

  /**
   * Refresh the authentication token.
   * @returns {Promise<string>} - The new authentication token.
   */
  refreshToken: async (): Promise<string> => {
    try {
      const response: AxiosResponse<{ token: string }> = await apiClient.post('/refresh');
      setToken(response.data.token);
      return response.data.token;
    } catch (error) {
      console.error('Token refresh error:', error);
      throw new Error('Failed to refresh token. Please login again.');
    }
  },

  /**
   * Log out the user by clearing the token.
   */
  logout: (): void => {
    clearToken();
  },

  /**
   * Retrieve the current user's information.
   * @returns {Promise<UserInfo>} - The current user's info.
   */
  getUserInfo: async (): Promise<UserInfo> => {
    try {
      const response: AxiosResponse<UserInfo> = await apiClient.get('/me');
      return response.data;
    } catch (error) {
      console.error('Failed to fetch user info:', error);
      throw new Error('Unable to fetch user information.');
    }
  },

  /**
   * Get Authorization header.
   * @returns {Record<string, string>} - The authorization header.
   */
  getAuthHeader,
};

export default AuthService;
export function logout(logout: any) {
  throw new Error("Function not implemented.");
}

