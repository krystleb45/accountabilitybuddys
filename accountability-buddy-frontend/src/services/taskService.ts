import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import authService from "./authService"; // Helper function for Authorization header
import { AxiosHeaders } from 'axios';


// Define types for task data
export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string; // ISO date string
  status: "pending" | "in-progress" | "completed";
  priority?: "low" | "medium" | "high"; // Optional field for task priority
  [key: string]: any; // Additional fields
}

// Define the type for task creation or updates
export interface TaskInput {
  title: string;
  description?: string;
  dueDate?: string;
  status?: "pending" | "in-progress" | "completed";
  priority?: "low" | "medium" | "high"; // Optional field for task priority
}

// Create an axios instance for tasks API
const apiClient = axios.create({
  baseURL: "https://accountabilitybuddys.com/api/tasks",
  headers: {
    "Content-Type": "application/json",
  },
});

// Axios interceptor to add the Authorization header to every request
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const authHeader = authService.getAuthHeader();

    if (!config.headers) {
      config.headers = new AxiosHeaders();
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
          error.response?.data?.message ||
            "An error occurred. Please try again."
        );
      }
    }
  }
  throw new Error("Failed after multiple retries.");
};

// Task service methods

/**
 * Create a new task.
 * @param taskData - The data for the new task.
 * @returns The created task.
 */
export const createTask = async (taskData: TaskInput): Promise<Task> => {
  if (!taskData.title) {
    throw new Error("Task title is required to create a task.");
  }

  try {
    const response: AxiosResponse<Task> = await axiosRetry(() =>
      apiClient.post("/create", taskData)
    );
    console.log("Task created successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error creating task:", error);
    throw new Error(error.response?.data?.message || "Failed to create task.");
  }
};

/**
 * Fetch all tasks for the user.
 * @returns An array of tasks.
 */
export const getUserTasks = async (): Promise<Task[]> => {
  try {
    const response: AxiosResponse<Task[]> = await axiosRetry(() =>
      apiClient.get("/list")
    );
    console.log("User tasks fetched successfully:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching user tasks:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch user tasks."
    );
  }
};

/**
 * Update an existing task.
 * @param taskId - The ID of the task to update.
 * @param taskData - The updated task data.
 * @returns The updated task.
 */
export const updateTask = async (
  taskId: string,
  taskData: Partial<TaskInput>
): Promise<Task> => {
  if (!taskId) {
    throw new Error("Task ID is required to update a task.");
  }

  try {
    const response: AxiosResponse<Task> = await axiosRetry(() =>
      apiClient.put(`/update/${taskId}`, taskData)
    );
    console.log(`Task ${taskId} updated successfully:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error updating task:", error);
    throw new Error(error.response?.data?.message || "Failed to update task.");
  }
};

/**
 * Delete a task.
 * @param taskId - The ID of the task to delete.
 */
export const deleteTask = async (taskId: string): Promise<void> => {
  if (!taskId) {
    throw new Error("Task ID is required to delete a task.");
  }

  try {
    await axiosRetry(() => apiClient.delete(`/delete/${taskId}`));
    console.log(`Task ${taskId} deleted successfully.`);
  } catch (error: any) {
    console.error("Error deleting task:", error);
    throw new Error(error.response?.data?.message || "Failed to delete task.");
  }
};

/**
 * Fetch task details by ID.
 * @param taskId - The ID of the task.
 * @returns The task details.
 */
export const getTaskDetails = async (taskId: string): Promise<Task> => {
  if (!taskId) {
    throw new Error("Task ID is required to fetch task details.");
  }

  try {
    const response: AxiosResponse<Task> = await axiosRetry(() =>
      apiClient.get(`/details/${taskId}`)
    );
    console.log(`Task details fetched for ID ${taskId}:`, response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error fetching task details:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch task details."
    );
  }
};

// Export all functions as a single object
const TaskService = {
  createTask,
  getUserTasks,
  updateTask,
  deleteTask,
  getTaskDetails,
};

export default TaskService;
