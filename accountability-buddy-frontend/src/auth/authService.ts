// authService.ts

import axios from 'axios';

/**
 * Logs in a user with the provided email and password.
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A promise resolving to the server response.
 */
export const login = async (email: string, password: string) => {
  return await axios.post('/api/auth/login', { email, password });
};

/**
 * Registers a new user with the provided email and password.
 * @param email - The user's email address.
 * @param password - The user's password.
 * @returns A promise resolving to the server response.
 */
export const register = async (email: string, password: string) => {
  return await axios.post('/api/auth/register', { email, password });
};

/**
 * Sends a password reset request to the server.
 * @param email - The user's email address.
 * @returns A promise resolving to the server response.
 */
export const requestPasswordReset = async (email: string) => {
  return await axios.post('/api/auth/forgot-password', { email });
};

/**
 * Resets a user's password using a reset token and new password.
 * @param token - The password reset token.
 * @param password - The new password.
 * @returns A promise resolving to the server response.
 */
export const resetPassword = async (token: string, password: string) => {
  return await axios.post(`/api/auth/reset-password/${token}`, { password });
};

/**
 * Logs out the current user by clearing authentication tokens.
 */
export const logout = () => {
  localStorage.removeItem('token');
};

/**
 * Retrieves the current user's authentication token from localStorage.
 * @returns The authentication token, or null if not logged in.
 */
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};
