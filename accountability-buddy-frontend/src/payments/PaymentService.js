const API_URL = '/api'; // Replace with your actual API base URL

/**
 * PaymentService - A service for handling payment-related operations.
 */
const PaymentService = {
  /**
   * Creates a checkout session with the specified amount.
   *
   * @param {number} amount - The amount to charge (in cents).
   * @returns {Promise<string>} - The session ID for the checkout session.
   */
  createCheckoutSession: async (amount) => {
    try {
      const response = await fetch(`${API_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error(`Failed to create checkout session: ${response.statusText}`);
      }

      const data = await response.json();
      return data.id; // Return the session ID
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error; // Rethrow error for handling in the component
    }
  },

  /**
   * Retrieves the payment status.
   *
   * @param {string} sessionId - The ID of the checkout session.
   * @returns {Promise<object>} - The payment status data.
   */
  getPaymentStatus: async (sessionId) => {
    try {
      const response = await fetch(`${API_URL}/payment-status/${sessionId}`);

      if (!response.ok) {
        throw new Error(`Failed to retrieve payment status: ${response.statusText}`);
      }

      const data = await response.json();
      return data; // Return payment status data
    } catch (error) {
      console.error('Error fetching payment status:', error);
      throw error; // Rethrow error for handling in the component
    }
  },
};

export default PaymentService;
