import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from "axios";
import authService from "../../src/services/authService"; // Correct import

// Define types for the goal data
export interface Goal {
  id: string;
  title: string;
  description: string;
  status: string; // e.g., "in-progress", "completed"
  dueDate?: string; // Optional ISO date string
  [key: string]: any; // Additional fields
}

export interface GoalAnalytics {
  totalGoals: number;
  completedGoals: number;
  inProgressGoals: number;
  [key: string]: any; // Additional analytics fields
}

// Create an axios instance for goals API
const apiClient = axios.create({
  baseURL: "https://accountabilitybuddys.com/api/goals",
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios interceptor to add the Authorization header to every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const authHeader = authService.getAuthHeader(); // Use authService to get the token
    if (authHeader) {
      if (!config.headers) {
        config.headers = new AxiosHeaders(); // Ensure headers is an AxiosHeaders instance
      }
      Object.entries(authHeader).forEach(([key, value]) => {
        config.headers.set(key, value as string); // Use AxiosHeaders.set to add headers
      });
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Utility function to handle retries with exponential backoff
const axiosRetry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error: any) {
      if (attempt < retries - 1 && error.response?.status >= 500) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
        attempt++;
      } else {
        console.error("Request failed:", error); // Log error for debugging
        throw new Error(
          error.response?.data?.message || "An error occurred. Please try again."
        );
      }
    }
  }
  throw new Error("Failed after multiple retries."); // Explicit return for completion
};

// Goal service methods

/**
 * Create a new goal.
 * @param goalData - The data for the new goal.
 * @returns The created goal.
 */
export const createGoal = async (goalData: Partial<Goal>): Promise<Goal> => {
  try {
    const response: AxiosResponse<Goal> = await apiClient.post("/", goalData);
    return response.data;
  } catch (error: any) {
    console.error("Error creating goal:", error);
    throw new Error(error.response?.data?.message || "Failed to create goal.");
  }
};

/**
 * Get all user goals.
 * @returns An array of goals.
 */
export const getUserGoals = async (): Promise<Goal[]> => {
  try {
    const response: AxiosResponse<Goal[]> = await apiClient.get("/");
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user goals:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch user goals.");
  }
};

/**
 * Update a goal.
 * @param goalId - The ID of the goal to update.
 * @param goalData - The updated goal data.
 * @returns The updated goal.
 */
export const updateGoal = async (goalId: string, goalData: Partial<Goal>): Promise<Goal> => {
  try {
    const response: AxiosResponse<Goal> = await apiClient.put(`/${goalId}`, goalData);
    return response.data;
  } catch (error: any) {
    console.error("Error updating goal:", error);
    throw new Error(error.response?.data?.message || "Failed to update goal.");
  }
};

/**
 * Delete a goal.
 * @param goalId - The ID of the goal to delete.
 */
export const deleteGoal = async (goalId: string): Promise<void> => {
  try {
    await apiClient.delete(`/${goalId}`);
  } catch (error: any) {
    console.error("Error deleting goal:", error);
    throw new Error(error.response?.data?.message || "Failed to delete goal.");
  }
};

/**
 * Get details of a specific goal.
 * @param goalId - The ID of the goal.
 * @returns The goal details.
 */
export const getGoalDetails = async (goalId: string): Promise<Goal> => {
  try {
    const response: AxiosResponse<Goal> = await apiClient.get(`/${goalId}`);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching goal details:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch goal details.");
  }
};

/**
 * Fetch goal analytics.
 * @param filters - Optional filters for analytics.
 * @returns The goal analytics data.
 */
export const getGoalAnalytics = async (filters?: Record<string, any>): Promise<GoalAnalytics> => {
  try {
    const response: AxiosResponse<GoalAnalytics> = await axiosRetry(() =>
      apiClient.get("/analytics", { params: filters })
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching goal analytics:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch goal analytics.");
  }
};

// Export all functions as a single object
const GoalService = {
  createGoal,
  getUserGoals,
  updateGoal,
  deleteGoal,
  getGoalDetails,
  getGoalAnalytics,
};

export default GoalService;
