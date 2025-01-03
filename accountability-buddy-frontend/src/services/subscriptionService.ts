import axios, { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import authService from "./authService"; // Use the centralized authService for Authorization headers

// Define types for subscription data
export interface SubscriptionStatus {
  status: string; // e.g., "active", "inactive", "canceled"
  planId: string; // ID of the current subscription plan
  [key: string]: any; // Additional fields if needed
}

// Create an axios instance for the subscriptions API
const apiClient = axios.create({
  baseURL: "https://accountabilitybuddys.com/api/subscription",
  headers: new axios.AxiosHeaders({
    "Content-Type": "application/json",
  }),
});

// Axios interceptor to dynamically add Authorization header to requests
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

// Utility function to handle retries with exponential backoff
const axiosRetry = async <T>(fn: () => Promise<T>, retries = 3): Promise<T> => {
  let attempt = 0;
  while (attempt < retries) {
    try {
      return await fn();
    } catch (error: any) {
      if (attempt < retries - 1 && error.response?.status >= 500) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
        attempt++;
      } else {
        console.error("Request failed:", error); // Log error for debugging
        throw new Error(
          error.response?.data?.message || "An error occurred. Please try again."
        );
      }
    }
  }
  throw new Error("Failed after multiple retries.");
};

// Fetch subscription status
export const getSubscriptionStatus = async (): Promise<SubscriptionStatus> => {
  try {
    const response: AxiosResponse<SubscriptionStatus> = await axiosRetry(() =>
      apiClient.get("/status")
    );
    return response.data;
  } catch (error: any) {
    console.error("Error fetching subscription status:", error);
    throw new Error(error.response?.data?.message || "Failed to fetch subscription status.");
  }
};

// Upgrade subscription
export const upgradeSubscription = async (planId: string): Promise<void> => {
  try {
    await axiosRetry(() => apiClient.post("/upgrade", { planId }));
  } catch (error: any) {
    console.error("Error upgrading subscription:", error);
    throw new Error(error.response?.data?.message || "Failed to upgrade subscription.");
  }
};

// Downgrade subscription
export const downgradeSubscription = async (planId: string): Promise<void> => {
  try {
    await axiosRetry(() => apiClient.post("/downgrade", { planId }));
  } catch (error: any) {
    console.error("Error downgrading subscription:", error);
    throw new Error(error.response?.data?.message || "Failed to downgrade subscription.");
  }
};

// Cancel subscription
export const cancelSubscription = async (): Promise<void> => {
  try {
    await axiosRetry(() => apiClient.post("/cancel"));
  } catch (error: any) {
    console.error("Error canceling subscription:", error);
    throw new Error(error.response?.data?.message || "Failed to cancel subscription.");
  }
};

// Create a new subscription session
export const createSubscriptionSession = async (): Promise<{ sessionId: string }> => {
  try {
    const response: AxiosResponse<{ sessionId: string }> = await axiosRetry(() =>
      apiClient.post("/create-session")
    );
    return response.data;
  } catch (error: any) {
    console.error("Error creating subscription session:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create subscription session."
    );
  }
};

// Export all functions as a single object
const SubscriptionService = {
  getSubscriptionStatus,
  upgradeSubscription,
  downgradeSubscription,
  cancelSubscription,
  createSubscriptionSession,
};

export default SubscriptionService;
