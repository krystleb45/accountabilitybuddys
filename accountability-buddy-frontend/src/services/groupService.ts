import axios, { AxiosResponse } from 'axios';
import apiClient from './axiosInstance';

export interface Group {
  id: string;
  name: string;
  description?: string;
  members?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface GroupService {
  createGroup(groupData: Partial<Group>): Promise<Group | undefined>;
  fetchGroups(): Promise<Group[] | undefined>;
  getGroupDetails(groupId: string): Promise<Group | undefined>;
  joinGroup(groupId: string): Promise<Group | undefined>;
  leaveGroup(groupId: string): Promise<Group | undefined>;
}

const handleError = (functionName: string, error: unknown): void => {
  console.error(`Error in ${functionName}:`, error);

  if (axios.isAxiosError(error)) {
    if (error.response) {
      console.error(
        `Server responded with status: ${error.response.status}`,
        error.response.data
      );
    } else if (error.request) {
      console.error('Request made, but no response received.');
    }
  } else {
    console.error('Unexpected error:', error);
  }
};

const GroupService: GroupService = {
  createGroup: async (
    groupData: Partial<Group>
  ): Promise<Group | undefined> => {
    if (!groupData || !groupData.name) {
      throw new Error('Group data is required, including a name.');
    }

    try {
      const response: AxiosResponse<Group> = await apiClient.post(
        '/groups',
        groupData
      );
      return response.data;
    } catch (error) {
      handleError('createGroup', error);
      return undefined;
    }
  },

  fetchGroups: async (): Promise<Group[] | undefined> => {
    try {
      const response: AxiosResponse<Group[]> = await apiClient.get('/groups');
      return response.data;
    } catch (error) {
      handleError('fetchGroups', error);
      return undefined;
    }
  },

  getGroupDetails: async (groupId: string): Promise<Group | undefined> => {
    if (!groupId) {
      throw new Error('Group ID is required to fetch group details.');
    }

    try {
      const response: AxiosResponse<Group> = await apiClient.get(
        `/groups/${groupId}`
      );
      return response.data;
    } catch (error) {
      handleError('getGroupDetails', error);
      return undefined;
    }
  },

  joinGroup: async (groupId: string): Promise<Group | undefined> => {
    if (!groupId) {
      throw new Error('Group ID is required to join a group.');
    }

    try {
      const response: AxiosResponse<Group> = await apiClient.post(
        `/groups/${groupId}/join`
      );
      return response.data;
    } catch (error) {
      handleError('joinGroup', error);
      return undefined;
    }
  },

  leaveGroup: async (groupId: string): Promise<Group | undefined> => {
    if (!groupId) {
      throw new Error('Group ID is required to leave a group.');
    }

    try {
      const response: AxiosResponse<Group> = await apiClient.post(
        `/groups/${groupId}/leave`
      );
      return response.data;
    } catch (error) {
      handleError('leaveGroup', error);
      return undefined;
    }
  },
};

export default GroupService;
