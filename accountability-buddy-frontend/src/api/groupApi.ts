import axios from "axios";
import { getAuthHeader } from "../services/authService"; // Helper for getting the auth header with token

const API_URL = process.env.REACT_APP_API_URL || "https://api.example.com/users";

// Define the shape of a Group
interface Group {
  id: string;
  name: string;
  description: string;
  members: Member[];
  // Add more fields as needed based on your API
}

// Define the shape of a Member
interface Member {
  id: string;
  name: string;
  email: string;
  // Add more fields as needed
}

// Helper function to handle API errors
const handleError = (error: any): never => {
  if (error.response && error.response.status === 401) {
    throw new Error("Invalid credentials. Please try again.");
  }
  throw new Error(
    error.response?.data?.message || "An error occurred. Please try again later."
  );
};

// Fetch all groups
export const fetchGroups = async (): Promise<Group[] | undefined> => {
  try {
    const response = await axios.get<Group[]>(`${API_URL}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};

// Fetch a single group by ID
export const fetchGroupById = async (groupId: string): Promise<Group | undefined> => {
  try {
    const response = await axios.get<Group>(`${API_URL}/${groupId}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};

// Create a new group
export const createGroup = async (groupData: Partial<Group>): Promise<Group | undefined> => {
  try {
    const response = await axios.post<Group>(`${API_URL}/create`, groupData, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};

// Join a group
export const joinGroup = async (groupId: string): Promise<Group | undefined> => {
  try {
    const response = await axios.put<Group>(
      `${API_URL}/${groupId}/join`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};

// Leave a group
export const leaveGroup = async (groupId: string): Promise<Group | undefined> => {
  try {
    const response = await axios.put<Group>(
      `${API_URL}/${groupId}/leave`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};

// Fetch group members
export const fetchGroupMembers = async (groupId: string): Promise<Member[] | undefined> => {
  try {
    const response = await axios.get<Member[]>(`${API_URL}/${groupId}/members`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error: any) {
    handleError(error);
    return undefined; // Explicitly return undefined to satisfy TypeScript
  }
};
