import axios from './axiosInstance';

// Define the Activity interface to represent the expected structure of activity data
export interface Activity {
  id: string;
  title: string;
  description: string;
  isJoined: boolean;
  participants?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown; // Allow additional fields for flexibility
}

// Utility function to handle API errors
const handleApiError = (error: unknown): never => {
  console.error('API Error:', error);
  throw new Error(
    error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred. Please try again later.'
  );
};

const ActivityService = {
  /**
   * Fetch details for a specific activity.
   *
   * @param {string} activityId - The ID of the activity.
   * @returns {Promise<Activity>} - The details of the specified activity.
   */
  getActivityDetails: async (activityId: string): Promise<Activity> => {
    try {
      const response = await axios.get(`/activities/${activityId}`);
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid response data');
      }
      return response.data as Activity;
    } catch (error) {
      handleApiError(error);
      throw error; // Rethrow the error to ensure the function always returns a value
    }
  },

  /**
   * Fetch a paginated list of activities.
   *
   * @param {number} page - The page number to fetch.
   * @param {number} limit - The number of activities per page.
   * @returns {Promise<{ activities: Activity[]; total: number }>} - A list of activities and the total count.
   */
  listActivities: async (
    page: number = 1,
    limit: number = 10
  ): Promise<{ activities: Activity[]; total: number } | undefined> => {
    try {
      const response = await axios.get('/activities', {
        params: { page, limit },
      });
      return {
        activities: response.data.activities as Activity[],
        total: response.data.total,
      };
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Join a specific activity.
   *
   * @param {string} activityId - The ID of the activity to join.
   * @returns {Promise<void>} - Resolves if the join operation is successful.
   */
  joinActivity: async (activityId: string): Promise<void> => {
    try {
      await axios.post(`/activities/${activityId}/join`);
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Leave a specific activity.
   *
   * @param {string} activityId - The ID of the activity to leave.
   * @returns {Promise<void>} - Resolves if the leave operation is successful.
   */
  leaveActivity: async (activityId: string): Promise<void> => {
    try {
      await axios.post(`/activities/${activityId}/leave`);
    } catch (error) {
      handleApiError(error);
    }
  },

  /**
   * Create a new activity.
   *
   * @param {Partial<Activity>} activityData - The data for the new activity.
   * @returns {Promise<Activity>} - The created activity.
   */
  createActivity: async (
    activityData: Partial<Activity>
  ): Promise<Activity> => {
    try {
      const response = await axios.post('/activities', activityData);
      return response.data as Activity;
    } catch (error) {
      handleApiError(error);
      return Promise.reject(error); // Add this line
    }
  },

  /**
   * Update an existing activity.
   *
   * @param {string} activityId - The ID of the activity to update.
   * @param {Partial<Activity>} activityData - The updated data for the activity.
   * @returns {Promise<Activity>} - The updated activity.
   */
  updateActivity: async (
    activityId: string,
    activityData: Partial<Activity>
  ): Promise<Activity> => {
    try {
      const response = await axios.put(
        `/activities/${activityId}`,
        activityData
      );
      return response.data as Activity;
    } catch (error) {
      handleApiError(error);
      return Promise.reject(error); // or return a default value
    }
  },

  /**
   * Delete a specific activity.
   *
   * @param {string} activityId - The ID of the activity to delete.
   * @returns {Promise<void>} - Resolves if the delete operation is successful.
   */
  deleteActivity: async (activityId: string): Promise<void> => {
    try {
      await axios.delete(`/activities/${activityId}`);
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default ActivityService;
