import axios from './axiosInstance';

/**
 * FeedbackService - Service for handling user feedback.
 */
const FeedbackService = {
  /**
   * Submit user feedback.
   *
   * @param {string} feedback - The feedback message from the user.
   * @param {string} [userId] - (Optional) The ID of the user submitting feedback.
   * @returns {Promise<{ success: boolean; message: string }>} - The response data from the server.
   * @throws Throws an error if the submission fails.
   */
  submitFeedback: async (
    feedback: string,
    userId?: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!feedback) {
      throw new Error('Feedback cannot be empty.');
    }

    try {
      const response = await axios.post('/feedback', { feedback, userId });
      return response.data; // Return the server response data
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      throw new Error(
        error.response?.data?.message ||
          'Failed to submit feedback. Please try again later.'
      );
    }
  },

  /**
   * Retrieve feedback feed.
   *
   * @returns {Promise<{ id: string; feedback: string; userId?: string; createdAt: string }[]>} - An array of feedback messages.
   * @throws Throws an error if fetching fails.
   */
  getFeedbackFeed: async (): Promise<
    { id: string; feedback: string; userId?: string; createdAt: string }[]
  > => {
    try {
      const response = await axios.get('/feedback/feed');
      return response.data; // Return the feedback data
    } catch (error: any) {
      console.error('Error fetching feedback feed:', error);
      throw new Error(
        error.response?.data?.message ||
          'Failed to fetch feedback feed. Please try again later.'
      );
    }
  },

  /**
   * Delete a feedback message by ID.
   *
   * @param {string} feedbackId - The ID of the feedback to delete.
   * @returns {Promise<{ success: boolean; message: string }>} - The response data from the server.
   * @throws Throws an error if deletion fails.
   */
  deleteFeedback: async (
    feedbackId: string
  ): Promise<{ success: boolean; message: string }> => {
    if (!feedbackId) {
      throw new Error('Feedback ID cannot be empty.');
    }

    try {
      const response = await axios.delete(`/feedback/${feedbackId}`);
      return response.data; // Return the server response data
    } catch (error: any) {
      console.error('Error deleting feedback:', error);
      throw new Error(
        error.response?.data?.message ||
          'Failed to delete feedback. Please try again later.'
      );
    }
  },
};

export default FeedbackService;
