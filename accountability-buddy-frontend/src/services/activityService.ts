import axios from './axiosInstance';

// Define the Activity interface
export interface Activity {
  title: string;
  description: string;
  isJoined: boolean;
  // Add any other properties your API returns
}

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
      return response.data as Activity; // Ensure the response matches the Activity type
    } catch (error) {
      console.error('Error fetching activity details:', error);
      throw new Error('Failed to fetch activity details. Please try again later.');
    }
  },

  /**
   * Join a specific activity.
   *
   * @param {string} activityId - The ID of the activity to join.
   * @returns {Promise<Activity>} - The updated activity data.
   */
  joinActivity: async (activityId: string): Promise<Activity> => {
    try {
      const response = await axios.post(`/activities/${activityId}/join`);
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid response data');
      }
      return response.data as Activity;
    } catch (error) {
      console.error('Error joining activity:', error);
      throw new Error('Failed to join activity. Please try again later.');
    }
  },

  /**
   * Leave a specific activity.
   *
   * @param {string} activityId - The ID of the activity to leave.
   * @returns {Promise<Activity>} - The updated activity data.
   */
  leaveActivity: async (activityId: string): Promise<Activity> => {
    try {
      const response = await axios.post(`/activities/${activityId}/leave`);
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid response data');
      }
      return response.data as Activity;
    } catch (error) {
      console.error('Error leaving activity:', error);
      throw new Error('Failed to leave activity. Please try again later.');
    }
  },

  /**
   * Create a new activity.
   *
   * @param {Partial<Activity>} activityData - The data for the new activity.
   * @returns {Promise<Activity>} - The created activity data.
   */
  createActivity: async (activityData: Partial<Activity>): Promise<Activity> => {
    try {
      const response = await axios.post('/activities', activityData);
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid response data');
      }
      return response.data as Activity;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw new Error('Failed to create activity. Please try again later.');
    }
  },

  /**
   * Update an existing activity.
   *
   * @param {string} activityId - The ID of the activity to update.
   * @param {Partial<Activity>} activityData - The updated data for the activity.
   * @returns {Promise<Activity>} - The updated activity data.
   */
  updateActivity: async (activityId: string, activityData: Partial<Activity>): Promise<Activity> => {
    try {
      const response = await axios.put(`/activities/${activityId}`, activityData);
      if (!response.data || typeof response.data !== 'object') {
        throw new Error('Invalid response data');
      }
      return response.data as Activity;
    } catch (error) {
      console.error('Error updating activity:', error);
      throw new Error('Failed to update activity. Please try again later.');
    }
  },
};

export default ActivityService;
