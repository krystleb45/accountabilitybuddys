import axios, { AxiosResponse } from "axios";
import jwtDecode from "jwt-decode"; // Correctly import jwtDecode

const API_BASE_URL = process.env.REACT_APP_API_URL || "https://accountabilitybuddys.com/api";

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

export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token); // Ensure exp is part of the decoded token
    return decoded.exp ? decoded.exp * 1000 < Date.now() : true;
  } catch (error) {
    console.error("Invalid token:", error);
    return true;
  }
};

export const setToken = (token: string, useSession = false): void => {
  if (useSession) {
    sessionStorage.setItem("token", token);
  } else {
    localStorage.setItem("token", token);
  }
};

export const getToken = (): string | null => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return token && !isTokenExpired(token) ? token : null;
};

export const removeToken = (): void => {
  localStorage.removeItem("token");
  sessionStorage.removeItem("token");
};

export const getAuthHeader = (): Record<string, string> | {} => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const refreshAuthToken = async (): Promise<string | void> => {
  try {
    const response: AxiosResponse<{ token: string }> = await axios.post(
      `${API_BASE_URL}/auth/refresh-token`,
      {},
      { headers: getAuthHeader() }
    );
    if (response.data.token) {
      setToken(response.data.token);
      return response.data.token;
    }
  } catch (error: any) {
    console.error("Token refresh error:", error);
    logout();
  }
};

export const login = async (credentials: LoginCredentials): Promise<{ token: string }> => {
  try {
    const response: AxiosResponse<{ token: string }> = await axios.post(
      `${API_BASE_URL}/auth/login`,
      credentials
    );
    if (response.data.token) {
      setToken(response.data.token);
      return response.data;
    }
    throw new Error("Login failed. Please try again.");
  } catch (error: any) {
    console.error("Login error:", error);
    throw new Error(error.response?.data?.message || "An error occurred during login.");
  }
};

export const register = async (userData: RegisterData): Promise<any> => {
  try {
    const response: AxiosResponse = await axios.post(`${API_BASE_URL}/auth/register`, userData);
    return response.data;
  } catch (error: any) {
    console.error("Registration error:", error);
    throw new Error(error.response?.data?.message || "An error occurred during registration.");
  }
};

export const getUserInfo = async (): Promise<UserInfo> => {
  try {
    const response: AxiosResponse<UserInfo> = await axios.get(`${API_BASE_URL}/user`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user info:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch user info.");
  }
};

export const logout = (): void => {
  removeToken();
  window.location.href = "/login";
};

const authService = {
  isTokenExpired,
  setToken,
  getToken,
  removeToken,
  getAuthHeader,
  refreshAuthToken,
  login,
  register,
  getUserInfo,
  logout,
};

export default authService;
