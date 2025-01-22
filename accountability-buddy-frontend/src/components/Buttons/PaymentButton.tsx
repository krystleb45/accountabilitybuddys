import React, { useState } from 'react';
import { createSubscriptionSession } from 'src/services/subscriptionService';
import styles from './PaymentButton.module.css';

interface PaymentButtonProps {
  buttonText: string;
  onSuccess?: () => void; // Optional callback for success handling
  onError?: (error: string) => void; // Optional callback for error handling
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  buttonText,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const { sessionId } = await createSubscriptionSession();
      if (onSuccess) onSuccess();
      // Redirect to Stripe checkout session
      window.location.href = `${process.env.REACT_APP_STRIPE_CHECKOUT_URL}/session/${sessionId}`;
    } catch (err: unknown) {
      console.error('Error creating subscription session:', err);
      const errorMessage =
        'Failed to create a subscription session. Please try again.';
      setError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles['payment-button-container']}>
      <button
        onClick={handlePayment}
        disabled={loading}
        aria-busy={loading}
        aria-label="Start Payment Process"
        className={`${styles['payment-button']} ${loading ? styles.loading : ''}`}
      >
        {loading ? 'Processing...' : buttonText}
      </button>
      {error && <p className={styles['error-message']}>{error}</p>}
    </div>
  );
};

export default PaymentButton;
