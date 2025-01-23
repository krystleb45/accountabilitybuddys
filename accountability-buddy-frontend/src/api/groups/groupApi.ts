import axios from 'axios';
import { getAuthHeader } from 'src/services/authService';

const API_URL =
  process.env.REACT_APP_API_URL || 'https://api.example.com/users';

// Define the shape of a Group
interface Group {
  id: string;
  name: string;
  description: string;
  members: Member[];
}

// Define the shape of a Member
interface Member {
  id: string;
  name: string;
  email: string;
}

// Type guard to check if error is an Axios error
const isAxiosError = (
  error: unknown
): error is { response: { status: number; data: { message: string } } } => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as { response?: unknown }).response === 'object'
  );
};

// Helper function to handle API errors
const handleError = (error: unknown): never => {
  if (isAxiosError(error) && error.response?.status === 401) {
    throw new Error('Invalid credentials. Please try again.');
  }
  throw new Error(
    isAxiosError(error)
      ? error.response?.data?.message ||
        'An error occurred. Please try again later.'
      : 'An unknown error occurred.'
  );
};

// Fetch all groups
export const fetchGroups = async (): Promise<Group[]> => {
  try {
    const response = await axios.get<Group[]>(`${API_URL}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
  }
  throw new Error('Failed to fetch groups.');
};

// Fetch a single group by ID
export const fetchGroupById = async (groupId: string): Promise<Group> => {
  try {
    const response = await axios.get<Group>(`${API_URL}/${groupId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
  }
  throw new Error('Failed to fetch group details.');
};

// Create a new group
export const createGroup = async (
  groupData: Partial<Group>
): Promise<Group> => {
  try {
    const response = await axios.post<Group>(`${API_URL}/create`, groupData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: unknown) {
    handleError(error);
  }
  throw new Error('Failed to create the group.');
};

// Join a group
export const joinGroup = async (groupId: string): Promise<Group> => {
  try {
    const response = await axios.put<Group>(
      `${API_URL}/${groupId}/join`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error: unknown) {
    handleError(error);
  }
  throw new Error('Failed to join the group.');
};

// Leave a group
export const leaveGroup = async (groupId: string): Promise<Group> => {
  try {
    const response = await axios.put<Group>(
      `${API_URL}/${groupId}/leave`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error: unknown) {
    handleError(error);
  }
  throw new Error('Failed to leave the group.');
};

// Fetch group members
export const fetchGroupMembers = async (groupId: string): Promise<Member[]> => {
  try {
    const response = await axios.get<Member[]>(
      `${API_URL}/${groupId}/members`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error: unknown) {
    handleError(error);
  }
  throw new Error('Failed to fetch group members.');
};
