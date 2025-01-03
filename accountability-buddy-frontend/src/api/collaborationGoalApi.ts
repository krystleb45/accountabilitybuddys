import axios from "axios";
import { getAuthHeader } from "./authApi"; // Ensure that the authorization token is included in requests

const API_URL = "/api/collaboration-goals";

// Define the shape of the goal data
interface CollaborationGoal {
  id: string;
  title: string;
  description: string;
  progress: number;
  // Add more fields as needed
}

// Define the shape of the API response for a list of goals with pagination
interface GoalsResponse {
  goals: CollaborationGoal[];
  totalPages: number;
  currentPage: number;
  // Add more fields if needed
}

// Function to create a new collaboration goal
export const createCollaborationGoal = async (goalData: Partial<CollaborationGoal>): Promise<CollaborationGoal> => {
  try {
    const response = await axios.post<CollaborationGoal>(`${API_URL}/create`, goalData, {
      headers: getAuthHeader(), // Include Authorization header with JWT token
    });
    return response.data; // Return the created goal
  } catch (error: any) {
    console.error("Error creating collaboration goal:", error);
    throw new Error(
      error.response?.data?.message || "Failed to create collaboration goal."
    );
  }
};

// Function to update progress of a collaboration goal
export const updateCollaborationGoalProgress = async (
  goalId: string,
  progress: number
): Promise<CollaborationGoal> => {
  try {
    const response = await axios.put<CollaborationGoal>(
      `${API_URL}/${goalId}/update-progress`,
      { progress },
      {
        headers: getAuthHeader(), // Include Authorization header with JWT token
      }
    );
    return response.data; // Return the updated goal
  } catch (error: any) {
    console.error("Error updating collaboration goal progress:", error);
    throw new Error(
      error.response?.data?.message || "Failed to update collaboration goal progress."
    );
  }
};

// Function to fetch all collaboration goals for the authenticated user (with pagination)
export const getUserCollaborationGoals = async (
  page = 1,
  limit = 10
): Promise<GoalsResponse> => {
  try {
    const response = await axios.get<GoalsResponse>(`${API_URL}/my-goals`, {
      headers: getAuthHeader(), // Include Authorization header with JWT token
      params: { page, limit }, // Pagination parameters
    });
    return response.data; // Return the list of goals and pagination info
  } catch (error: any) {
    console.error("Error fetching user collaboration goals:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch collaboration goals."
    );
  }
};

// Function to fetch a single collaboration goal by its ID
export const getCollaborationGoalById = async (goalId: string): Promise<CollaborationGoal> => {
  try {
    const response = await axios.get<CollaborationGoal>(`${API_URL}/${goalId}`, {
      headers: getAuthHeader(), // Include Authorization header with JWT token
    });
    return response.data; // Return the goal details
  } catch (error: any) {
    console.error("Error fetching collaboration goal:", error);
    throw new Error(
      error.response?.data?.message || "Failed to fetch collaboration goal."
    );
  }
};

// Function to delete a collaboration goal
export const deleteCollaborationGoal = async (goalId: string): Promise<{ message: string }> => {
  try {
    const response = await axios.delete<{ message: string }>(`${API_URL}/${goalId}`, {
      headers: getAuthHeader(), // Include Authorization header with JWT token
    });
    return response.data; // Return success message
  } catch (error: any) {
    console.error("Error deleting collaboration goal:", error);
    throw new Error(
      error.response?.data?.message || "Failed to delete collaboration goal."
    );
  }
};
