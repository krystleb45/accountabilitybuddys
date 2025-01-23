import axios, { AxiosResponse } from 'axios';

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com';

export interface ActivityDetails {
  id: string;
  title: string;
  description: string;
  isJoined: boolean;
  createdAt?: string;
  updatedAt?: string;
  participants?: number;
  [key: string]: unknown;
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

/**
 * Fetches activity details by activity ID.
 */
export const getActivityDetails = async (
  activityId: string
): Promise<ActivityDetails | undefined> => {
  if (!activityId) {
    throw new Error('Invalid activity ID provided');
  }

  try {
    const response: AxiosResponse<ActivityDetails> = await axios.get(
      `${BASE_URL}/activities/${activityId}`
    );
    return response.data;
  } catch (error) {
    handleError('getActivityDetails', error);
    return undefined; // Explicitly return undefined on error
  }
};

/**
 * Joins an activity by activity ID.
 */
export const joinActivity = async (activityId: string): Promise<void> => {
  if (!activityId) {
    throw new Error('Invalid activity ID provided');
  }

  try {
    await axios.post(`${BASE_URL}/activities/${activityId}/join`, null, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    handleError('joinActivity', error);
  }
};

/**
 * Leaves an activity by activity ID.
 */
export const leaveActivity = async (activityId: string): Promise<void> => {
  if (!activityId) {
    throw new Error('Invalid activity ID provided');
  }

  try {
    await axios.post(`${BASE_URL}/activities/${activityId}/leave`, null, {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    handleError('leaveActivity', error);
  }
};

export default {
  getActivityDetails,
  joinActivity,
  leaveActivity,
};
