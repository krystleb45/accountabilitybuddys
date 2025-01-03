import axios, { AxiosResponse } from "axios"; // Import AxiosResponse directly from axios
import apiClient from "./axiosInstance"; // Import the axios instance

// Define types for group data
export interface Group {
  id: string;
  name: string;
  description?: string;
  members?: number; // Optional number of members
  [key: string]: any; // Additional fields
}

export interface GroupService {
  createGroup(groupData: Partial<Group>): Promise<Group>;
  fetchGroups(): Promise<Group[]>;
  joinGroup(groupId: string): Promise<Group>;
  leaveGroup(groupId: string): Promise<Group>;
}

// Implementation of GroupService
const GroupService: GroupService = {
  /**
   * Create a new group.
   * @param groupData - Data for the new group.
   * @returns The created group data.
   */
  createGroup: async (groupData: Partial<Group>): Promise<Group> => {
    if (!groupData || !groupData.name) {
      throw new Error("Group data is required, including a name.");
    }
    try {
      const response: AxiosResponse<Group> = await apiClient.post("/groups", groupData);
      return response.data;
    } catch (error: any) {
      console.error("Error creating group:", error);
      throw new Error(error.response?.data?.message || "Failed to create group. Please try again later.");
    }
  },

  /**
   * Fetch groups for the user.
   * @returns An array of user groups.
   */
  fetchGroups: async (): Promise<Group[]> => {
    try {
      const response: AxiosResponse<Group[]> = await apiClient.get("/groups");
      return response.data;
    } catch (error: any) {
      console.error("Error fetching groups:", error);
      throw new Error(error.response?.data?.message || "Failed to fetch groups. Please try again later.");
    }
  },

  /**
   * Join a specific group.
   * @param groupId - The ID of the group to join.
   * @returns The updated group data.
   */
  joinGroup: async (groupId: string): Promise<Group> => {
    if (!groupId) {
      throw new Error("Group ID is required to join a group.");
    }
    try {
      const response: AxiosResponse<Group> = await apiClient.post(`/groups/${groupId}/join`);
      return response.data;
    } catch (error: any) {
      console.error("Error joining group:", error);
      throw new Error(error.response?.data?.message || "Failed to join group. Please try again later.");
    }
  },

  /**
   * Leave a specific group.
   * @param groupId - The ID of the group to leave.
   * @returns The updated group data.
   */
  leaveGroup: async (groupId: string): Promise<Group> => {
    if (!groupId) {
      throw new Error("Group ID is required to leave a group.");
    }
    try {
      const response: AxiosResponse<Group> = await apiClient.post(`/groups/${groupId}/leave`);
      return response.data;
    } catch (error: any) {
      console.error("Error leaving group:", error);
      throw new Error(error.response?.data?.message || "Failed to leave group. Please try again later.");
    }
  },
};

export default GroupService;
