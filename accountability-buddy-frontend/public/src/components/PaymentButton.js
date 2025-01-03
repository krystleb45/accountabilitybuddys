import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { createSubscriptionSession } from '../services/subscriptionService';
import './PaymentButton.css'; // Optional CSS for styling

const PaymentButton = ({ buttonText }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const { sessionId } = await createSubscriptionSession();
      // Redirect to Stripe checkout session
      window.location = `${process.env.REACT_APP_STRIPE_CHECKOUT_URL}/session/${sessionId}`;
    } catch (err) {
      console.error('Error creating subscription session:', err);
      setError('Failed to create a subscription session. Please try again.');
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
        className={`payment-button ${loading ? 'loading' : ''}`}
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

PaymentButton.defaultProps = {
  buttonText: 'Subscribe Now',
};

export default PaymentButton;
