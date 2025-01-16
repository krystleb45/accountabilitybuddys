import React from 'react';
import PropTypes from 'prop-types';

/**
 * PaymentSuccess - Component to display a success message after payment.
 *
 * @param {Object} props - Component properties.
 * @param {number} props.amount - The amount that was charged (in cents).
 * @param {string} props.transactionId - The ID of the successful transaction.
 * @param {function} props.onContinue - Callback function to navigate back to the main application or continue shopping.
 */
const PaymentSuccess = ({ amount, transactionId, onContinue }) => {
  return (
    <div className="payment-success" role="alert">
      <h1>Payment Successful!</h1>
      <p>Thank you for your payment.</p>
      <p>
        You have been charged: <strong>${(amount / 100).toFixed(2)}</strong>
      </p>
      <p>
        Transaction ID: <strong>{transactionId}</strong>
      </p>
      <button onClick={onContinue}>Continue</button>
    </div>
  );
};

// PropTypes for component validation
PaymentSuccess.propTypes = {
  amount: PropTypes.number.isRequired,
  transactionId: PropTypes.string.isRequired,
  onContinue: PropTypes.func.isRequired,
};

export default PaymentSuccess;
