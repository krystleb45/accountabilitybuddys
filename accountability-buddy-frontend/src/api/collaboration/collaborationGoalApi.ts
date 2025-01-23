import axios from 'axios';
import { getAuthHeader } from '../auth/authApi';

const API_URL = '/api/collaboration-goals';

interface CollaborationGoal {
  status: string;
  dueDate: Date;
  assignedUsers: never[];
  id: string;
  title: string;
  description: string;
  progress: number;
}

interface GoalsResponse {
  goals: CollaborationGoal[];
  totalPages: number;
  currentPage: number;
}

// Helper to identify Axios errors
const isAxiosError = (
  error: unknown
): error is { response: { status: number; data: { message: string } } } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: unknown }).response === 'object' &&
    'data' in (error as { response: { data?: unknown } }).response
  );
};

// Error handler with proper type narrowing
const handleApiError = (error: unknown): never => {
  if (isAxiosError(error)) {
    throw new Error(
      error.response.data.message ||
        'An error occurred. Please try again later.'
    );
  }
  if (error instanceof Error) {
    throw new Error(error.message);
  }
  throw new Error('An unknown error occurred');
};

// Create a new collaboration goal
export const createCollaborationGoal = async (
  goalData: Partial<CollaborationGoal>
): Promise<CollaborationGoal> => {
  try {
    const response = await axios.post<CollaborationGoal>(
      `${API_URL}/create`,
      goalData,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
    return Promise.reject();
  }
};

// Update progress of a goal
export const updateCollaborationGoalProgress = async (
  goalId: string,
  progress: number
): Promise<CollaborationGoal> => {
  try {
    const response = await axios.put<CollaborationGoal>(
      `${API_URL}/${goalId}/update-progress`,
      { progress },
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
    return Promise.reject();
  }
};

// Fetch all collaboration goals
export const getUserCollaborationGoals = async (
  page = 1,
  limit = 10
): Promise<GoalsResponse> => {
  try {
    const response = await axios.get<GoalsResponse>(`${API_URL}/my-goals`, {
      headers: getAuthHeader(),
      params: { page, limit },
    });
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
    return Promise.reject();
  }
};

// Fetch a collaboration goal by ID
export const getCollaborationGoalById = async (
  goalId: string
): Promise<CollaborationGoal> => {
  try {
    const response = await axios.get<CollaborationGoal>(
      `${API_URL}/${goalId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
    return Promise.reject();
  }
};

// Delete a collaboration goal
export const deleteCollaborationGoal = async (
  goalId: string
): Promise<{ message: string }> => {
  try {
    const response = await axios.delete<{ message: string }>(
      `${API_URL}/${goalId}`,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (error: unknown) {
    handleApiError(error);
    return Promise.reject();
  }
};
