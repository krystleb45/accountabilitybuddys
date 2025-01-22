import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from '@stripe/react-stripe-js';
import './StripeCheckout.css';

// Load Stripe public key from environment variables
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLIC_KEY || 'pk_test_XXXXXXXXXXXXXXXXXXXX'
);

interface StripeCheckoutFormProps {
  clientSecret: string; // Pass client secret from the backend
  onSuccess: () => void;
  onError: (error: string) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({
  clientSecret,
  onSuccess,
  onError,
  setLoading,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      onError('Stripe is not initialized.');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      onError('Card element not found.');
      setLoading(false);
      return;
    }

    try {
      // Confirm card payment with the provided client secret
      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card: cardElement },
        });

      if (stripeError) {
        onError(stripeError.message || 'Payment failed.');
      } else if (paymentIntent?.status === 'succeeded') {
        onSuccess();
      } else {
        onError('Payment did not succeed. Please try again.');
      }
    } catch (error) {
      onError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-checkout-form">
      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
      <button
        type="submit"
        disabled={!stripe || !clientSecret}
        className="stripe-checkout-button"
      >
        Pay Now
      </button>
    </form>
  );
};

interface StripeCheckoutProps {
  clientSecret: string; // Client secret provided by the backend
  onSuccess: () => void;
  onError: (error: string) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  clientSecret,
  onSuccess,
  onError,
  setLoading,
}) => {
  return (
    <Elements stripe={stripePromise}>
      <StripeCheckoutForm
        clientSecret={clientSecret}
        onSuccess={onSuccess}
        onError={onError}
        setLoading={setLoading}
      />
    </Elements>
  );
};

export default StripeCheckout;
