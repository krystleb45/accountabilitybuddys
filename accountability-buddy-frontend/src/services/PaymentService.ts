const API_URL = process.env.REACT_APP_API_URL || "/api"; // Use environment variable for API URL

// Define types for responses and parameters
export interface CheckoutSessionResponse {
  id: string; // Session ID for the checkout
  url: string; // Optional URL for redirection (if applicable)
}

export interface PaymentStatus {
  status: string; // e.g., "succeeded", "pending", "failed"
  details?: Record<string, any>; // Additional payment details (optional)
}

/**
 * PaymentService - A service for handling payment-related operations.
 */
const PaymentService = {
  /**
   * Creates a checkout session with the specified amount.
   *
   * @param {number} amount - The amount to charge (in cents).
   * @returns {Promise<CheckoutSessionResponse>} - The session details for the checkout session.
   */
  createCheckoutSession: async (amount: number): Promise<CheckoutSessionResponse> => {
    if (!amount || amount <= 0) {
      throw new Error("Invalid amount provided. Amount must be greater than 0.");
    }

    try {
      const response = await fetch(`${API_URL}/create-checkout-session`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to create checkout session: ${response.status} ${response.statusText}`
        );
      }

      const data: CheckoutSessionResponse = await response.json();
      return data; // Return the session details
    } catch (error) {
      console.error("Error creating checkout session:", error);
      throw new Error("An error occurred while creating the checkout session.");
    }
  },

  /**
   * Retrieves the payment status.
   *
   * @param {string} sessionId - The ID of the checkout session.
   * @returns {Promise<PaymentStatus>} - The payment status data.
   */
  getPaymentStatus: async (sessionId: string): Promise<PaymentStatus> => {
    if (!sessionId) {
      throw new Error("Session ID is required to retrieve payment status.");
    }

    try {
      const response = await fetch(`${API_URL}/payment-status/${sessionId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to retrieve payment status: ${response.status} ${response.statusText}`
        );
      }

      const data: PaymentStatus = await response.json();
      return data; // Return payment status data
    } catch (error) {
      console.error("Error fetching payment status:", error);
      throw new Error("An error occurred while retrieving the payment status.");
    }
  },
};

export default PaymentService;
