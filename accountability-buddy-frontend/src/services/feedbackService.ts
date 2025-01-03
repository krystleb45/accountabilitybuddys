import axios from './axiosInstance';

/**
 * FeedbackService - Service for handling user feedback.
 */
const FeedbackService = {
  /**
   * Submit user feedback.
   *
   * @param feedback - The feedback message from the user.
   * @returns The response data from the server.
   * @throws Throws an error if the submission fails.
   */
  submitFeedback: async (feedback: string): Promise<object> => {
    if (!feedback) {
      throw new Error('Feedback cannot be empty.');
    }

    try {
      const response = await axios.post('/feedback', { feedback });
      return response.data; // Return the server response data
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      throw new Error(error.response?.data?.message || 'Failed to submit feedback. Please try again later.');
    }
  },

  /**
   * Retrieve feedback feed.
   *
   * @returns An array of feedback messages.
   * @throws Throws an error if fetching fails.
   */
  getFeedbackFeed: async (): Promise<object[]> => {
    try {
      const response = await axios.get('/feedback/feed');
      return response.data; // Return the feedback data
    } catch (error: any) {
      console.error('Error fetching feedback feed:', error);
      throw new Error(error.response?.data?.message || 'Failed to fetch feedback feed. Please try again later.');
    }
  },
};

export default FeedbackService;
