import axios, { AxiosResponse } from 'axios';

// Base URL for the API
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com';

// Define the shape of the activity details response
export interface ActivityDetails {
  id: string;
  title: string;
  description: string;
  isJoined: boolean;
  [key: string]: any; // For any additional fields
}

/**
 * Fetches activity details by activity ID.
 * @param activityId - The ID of the activity to fetch.
 * @returns The activity details.
 * @throws Will throw an error if the request fails.
 */
export const getActivityDetails = async (activityId: string): Promise<ActivityDetails> => {
  // Validate input
  if (!activityId) {
    throw new Error('Invalid activity ID provided');
  }

  try {
    // Make a GET request to the API
    const response: AxiosResponse<ActivityDetails> = await axios.get(`${BASE_URL}/activities/${activityId}`);

    // Check for a successful response
    if (response.status === 200 && response.data) {
      return response.data;
    } else {
      throw new Error('Unexpected response from the server');
    }
  } catch (error: any) {
    // Log the error for debugging
    console.error('Error fetching activity details:', error);

    // Rethrow the error to be handled by the caller
    throw new Error(error.response?.data?.message || 'Failed to fetch activity details. Please try again later.');
  }
};

/**
 * Joins an activity by activity ID.
 * @param activityId - The ID of the activity to join.
 * @returns A promise that resolves when the action is complete.
 * @throws Will throw an error if the request fails.
 */
export const joinActivity = async (activityId: string): Promise<void> => {
  if (!activityId) {
    throw new Error('Invalid activity ID provided');
  }

  try {
    const response: AxiosResponse = await axios.post(`${BASE_URL}/activities/${activityId}/join`);

    if (response.status !== 200) {
      throw new Error('Failed to join the activity');
    }
  } catch (error: any) {
    console.error('Error joining activity:', error);
    throw new Error(error.response?.data?.message || 'Failed to join the activity. Please try again later.');
  }
};

/**
 * Leaves an activity by activity ID.
 * @param activityId - The ID of the activity to leave.
 * @returns A promise that resolves when the action is complete.
 * @throws Will throw an error if the request fails.
 */
export const leaveActivity = async (activityId: string): Promise<void> => {
  if (!activityId) {
    throw new Error('Invalid activity ID provided');
  }

  try {
    const response: AxiosResponse = await axios.post(`${BASE_URL}/activities/${activityId}/leave`);

    if (response.status !== 200) {
      throw new Error('Failed to leave the activity');
    }
  } catch (error: any) {
    console.error('Error leaving activity:', error);
    throw new Error(error.response?.data?.message || 'Failed to leave the activity. Please try again later.');
  }
};
