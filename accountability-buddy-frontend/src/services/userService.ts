import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import authService from "./authService"; // Import helper to get Authorization header

// Define types for user data and actions
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role?: string; // e.g., "admin" or "user"
  [key: string]: any; // Additional fields as needed
}

export interface UpdateProfileData {
  name?: string;
  email?: string;
  password?: string;
  [key: string]: any; // Additional fields for profile updates
}

export type UserAction = "block" | "unblock";

// Create an axios instance to centralize base URL and headers
const apiClient = axios.create({
  baseURL: "https://accountabilitybuddys.com/api/users",
  headers: new axios.AxiosHeaders({
    "Content-Type": "application/json",
  }),
});

// Axios interceptor to dynamically add the Authorization header to every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const authHeader = authService.getAuthHeader();
    if (!config.headers) {
      config.headers = new axios.AxiosHeaders();
    }
    for (const [key, value] of Object.entries(authHeader)) {
      config.headers.set(key, value);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Utility function to handle retries for axios requests with exponential backoff
const axiosRetry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error: any) {
      // Only retry for server errors (status code >= 500)
      if (attempt < retries - 1 && error.response?.status >= 500) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
        attempt++;
      } else {
        console.error("Request failed:", error);
        throw new Error(
          error.response?.data?.message || "An error occurred. Please try again."
        );
      }
    }
  }
  throw new Error("Failed after multiple retries.");
};

// User service methods

/**
 * Fetch the current user's profile.
 * @returns The user's profile.
 */
export const fetchUserProfile = async (): Promise<UserProfile> => {
  try {
    const response: AxiosResponse<UserProfile> = await axiosRetry(() =>
      apiClient.get("/profile")
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user profile:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch user profile.");
  }
};

/**
 * Update the current user's profile.
 * @param profileData - The data to update.
 * @returns The updated profile.
 */
export const updateUserProfile = async (
  profileData: UpdateProfileData
): Promise<UserProfile> => {
  try {
    const response: AxiosResponse<UserProfile> = await axiosRetry(() =>
      apiClient.put("/profile", profileData)
    );
    return response.data;
  } catch (error: any) {
    console.error("Error updating user profile:", error);
    throw new Error(error.response?.data?.message || "Failed to update profile.");
  }
};

/**
 * Delete the current user's account.
 */
export const deleteUserAccount = async (): Promise<void> => {
  try {
    await axiosRetry(() => apiClient.delete("/account"));
  } catch (error: any) {
    console.error("Error deleting user account:", error);
    throw new Error(error.response?.data?.message || "Failed to delete user account.");
  }
};

/**
 * Fetch all users (admin only).
 * @returns An array of user profiles.
 */
export const fetchAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const response: AxiosResponse<UserProfile[]> = await axiosRetry(() =>
      apiClient.get("/all")
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching all users:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch all users.");
  }
};

/**
 * Block or unblock a user (admin only).
 * @param userId - The ID of the user.
 * @param action - The action to perform ("block" or "unblock").
 */
export const toggleUserStatus = async (
  userId: string,
  action: UserAction
): Promise<void> => {
  if (!["block", "unblock"].includes(action)) {
    throw new Error("Invalid action. Must be 'block' or 'unblock'.");
  }

  try {
    await axiosRetry(() => apiClient.post(`/${userId}/${action}`));
  } catch (error: any) {
    console.error(`Error ${action}ing user:`, error);
    throw new Error(error.response?.data?.message || `Failed to ${action} user.`);
  }
};

// Export all functions as a single object
const UserService = {
  fetchUserProfile,
  updateUserProfile,
  deleteUserAccount,
  fetchAllUsers,
  toggleUserStatus,
};

export default UserService;
