import React from 'react';
import PropTypes from 'prop-types';

/**
 * PaymentError - Component to display payment error messages.
 *
 * @param {Object} props - Component properties.
 * @param {string} props.errorMessage - The error message to display.
 * @param {function} props.onRetry - Callback function to retry the payment.
 */
const PaymentError = ({ errorMessage, onRetry }) => {
  return (
    <div className="payment-error" role="alert">
      <h2>Payment Error</h2>
      <p>{errorMessage || 'An unexpected error occurred while processing your payment. Please try again.'}</p>
      <button onClick={onRetry}>Retry Payment</button>
    </div>
  );
};

// PropTypes for component validation
PaymentError.propTypes = {
  errorMessage: PropTypes.string.isRequired,
  onRetry: PropTypes.func.isRequired,
};

export default PaymentError;
