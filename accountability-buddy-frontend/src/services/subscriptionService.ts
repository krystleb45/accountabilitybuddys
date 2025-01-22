import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import authService from "./authService"; // Use centralized authService for Authorization headers

// Define types for subscription data
export interface SubscriptionStatus {
  status: string; // e.g., "active", "inactive", "canceled"
  planId: string; // ID of the current subscription plan
  expirationDate?: string; // Optional field for subscription expiration
  [key: string]: any; // Additional fields if needed
}

export interface SubscriptionSession {
  sessionId: string; // ID of the newly created subscription session
  redirectUrl?: string; // Optional URL for redirecting the user
}

// Create an axios instance for the subscriptions API
const apiClient = axios.create({
  baseURL: "https://accountabilitybuddys.com/api/subscription",
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios interceptor to dynamically add Authorization header to requests
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const authHeader = authService.getAuthHeader();
    if (!config.headers) {
      config.headers = new axios.AxiosHeaders();
    }
    Object.entries(authHeader).forEach(([key, value]) => {
      config.headers[key] = value as string;
    });
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
        console.error("Request failed:", error);
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
    console.log("Fetched subscription status:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching subscription status:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch subscription status."
    );
  }
};

// Upgrade subscription
export const upgradeSubscription = async (planId: string): Promise<void> => {
  if (!planId) {
    throw new Error("Plan ID is required to upgrade subscription.");
  }

  try {
    await axiosRetry(() => apiClient.post("/upgrade", { planId }));
    console.log(`Subscription upgraded to plan: ${planId}`);
  } catch (error: any) {
    console.error("Error upgrading subscription:", error);
    throw new Error(
      error.response?.data?.message || "Failed to upgrade subscription."
    );
  }
};

// Downgrade subscription
export const downgradeSubscription = async (planId: string): Promise<void> => {
  if (!planId) {
    throw new Error("Plan ID is required to downgrade subscription.");
  }

  try {
    await axiosRetry(() => apiClient.post("/downgrade", { planId }));
    console.log(`Subscription downgraded to plan: ${planId}`);
  } catch (error: any) {
    console.error("Error downgrading subscription:", error);
    throw new Error(
      error.response?.data?.message || "Failed to downgrade subscription."
    );
  }
};

// Cancel subscription
export const cancelSubscription = async (): Promise<void> => {
  try {
    await axiosRetry(() => apiClient.post("/cancel"));
    console.log("Subscription canceled successfully.");
  } catch (error: any) {
    console.error("Error canceling subscription:", error);
    throw new Error(
      error.response?.data?.message || "Failed to cancel subscription."
    );
  }
};

// Create a new subscription session
export const createSubscriptionSession = async (): Promise<SubscriptionSession> => {
  try {
    const response: AxiosResponse<SubscriptionSession> = await axiosRetry(() =>
      apiClient.post("/create-session")
    );
    console.log("Subscription session created:", response.data);
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
