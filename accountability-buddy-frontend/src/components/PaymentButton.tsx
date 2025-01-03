import React, { useState } from "react";
import { createSubscriptionSession } from "../services/subscriptionService";
import "./PaymentButton.css"; // Optional CSS for styling

interface PaymentButtonProps {
  buttonText: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ buttonText }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const { sessionId } = await createSubscriptionSession();
      // Redirect to Stripe checkout session
      window.location.href = `${process.env.REACT_APP_STRIPE_CHECKOUT_URL}/session/${sessionId}`;
    } catch (err) {
      console.error("Error creating subscription session:", err);
      setError("Failed to create a subscription session. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-button-container">
      <button
        onClick={handlePayment}
        disabled={loading}
        aria-busy={loading}
        aria-label="Start Payment Process"
      >
        {loading ? "Processing..." : buttonText}
      </button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default PaymentButton;
