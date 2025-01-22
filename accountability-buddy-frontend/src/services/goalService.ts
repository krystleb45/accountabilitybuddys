import axios, { AxiosResponse, InternalAxiosRequestConfig, AxiosHeaders } from "axios";
import authService from "../../src/services/authService";

// Define types for the goal data
export interface Goal {
  id: string;
  title: string;
  description: string;
  status: string;
  dueDate?: string;
  [key: string]: any;
}

export interface GoalAnalytics {
  totalGoals: number;
  completedGoals: number;
  inProgressGoals: number;
  [key: string]: any;
}

const apiClient = axios.create({
  baseURL: "https://accountabilitybuddys.com/api/goals",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization header using interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const authHeader = authService.getAuthHeader();
    if (authHeader) {
      if (!config.headers) {
        config.headers = new AxiosHeaders();
      }
      Object.entries(authHeader).forEach(([key, value]) => {
        config.headers.set(key, value as string);
      });
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Create a new goal.
 */
export const createGoal = async (goalData: Partial<Goal>): Promise<Goal | undefined> => {
  try {
    const response: AxiosResponse<Goal> = await apiClient.post("/", goalData);
    return response.data;
  } catch (error) {
    console.error("Error creating goal:", error);
    return undefined; // Explicitly return undefined in case of error
  }
};

/**
 * Get all user goals.
 */
export const getUserGoals = async (): Promise<Goal[] | undefined> => {
  try {
    const response: AxiosResponse<Goal[]> = await apiClient.get("/");
    return response.data;
  } catch (error) {
    console.error("Error fetching user goals:", error);
    return undefined; // Explicitly return undefined in case of error
  }
};

/**
 * Update a goal.
 */
export const updateGoal = async (goalId: string, goalData: Partial<Goal>): Promise<Goal | undefined> => {
  try {
    const response: AxiosResponse<Goal> = await apiClient.put(`/${goalId}`, goalData);
    return response.data;
  } catch (error) {
    console.error("Error updating goal:", error);
    return undefined; // Explicitly return undefined in case of error
  }
};

/**
 * Delete a goal.
 */
export const deleteGoal = async (goalId: string): Promise<boolean> => {
  try {
    await apiClient.delete(`/${goalId}`);
    return true;
  } catch (error) {
    console.error("Error deleting goal:", error);
    return false; // Return false if deletion fails
  }
};

/**
 * Get details of a specific goal.
 */
export const getGoalDetails = async (goalId: string): Promise<Goal | undefined> => {
  try {
    const response: AxiosResponse<Goal> = await apiClient.get(`/${goalId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching goal details:", error);
    return undefined; // Explicitly return undefined in case of error
  }
};

/**
 * Fetch goal analytics.
 */
export const getGoalAnalytics = async (filters?: Record<string, any>): Promise<GoalAnalytics | undefined> => {
  try {
    const response: AxiosResponse<GoalAnalytics> = await apiClient.get("/analytics", { params: filters });
    return response.data;
  } catch (error) {
    console.error("Error fetching goal analytics:", error);
    return undefined; // Explicitly return undefined in case of error
  }
};

const GoalService = {
  createGoal,
  getUserGoals,
  updateGoal,
  deleteGoal,
  getGoalDetails,
  getGoalAnalytics,
};

export default GoalService;
