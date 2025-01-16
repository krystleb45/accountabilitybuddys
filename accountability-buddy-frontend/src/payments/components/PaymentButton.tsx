import React, { useState } from "react";
import PropTypes from "prop-types";
import { createSubscriptionSession } from "../../services/subscriptionService";
import "./PaymentButton.css"; // Optional CSS for styling

interface PaymentButtonProps {
  buttonText?: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ buttonText = "Subscribe Now" }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const { sessionId } = await createSubscriptionSession();

      if (!sessionId) {
        throw new Error("Session ID not received from server.");
      }

      // Redirect to Stripe checkout session
      const stripeCheckoutUrl = process.env.REACT_APP_STRIPE_CHECKOUT_URL;
      if (!stripeCheckoutUrl) {
        throw new Error("Stripe checkout URL is not defined in environment variables.");
      }

      window.location.href = `${stripeCheckoutUrl}/session/${sessionId}`;
    } catch (err: any) {
      console.error("Error creating subscription session:", err);

      const errorMessage =
        err.response?.data?.message || err.message || "An unexpected error occurred.";
      setError(errorMessage);
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
        aria-label="Subscribe to a premium plan"
        className={`payment-button ${loading ? "loading" : ""}`}
      >
        {loading ? (
          <span className="button-loading">
            <span className="spinner" aria-hidden="true"></span> Processing...
          </span>
        ) : (
          buttonText
        )}
      </button>

      {error && (
        <p className="error-message" role="alert" aria-live="assertive">
          {error}
        </p>
      )}
    </div>
  );
};

PaymentButton.propTypes = {
  buttonText: PropTypes.string,
};

export default PaymentButton;
