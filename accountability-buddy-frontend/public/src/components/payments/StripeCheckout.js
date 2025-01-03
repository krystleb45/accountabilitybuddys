import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { trackConversion } from '../../analytics/googleAnalytics'; // Conversion tracking
import './StripeCheckout.css';

// Load your Stripe public key (replace with your actual key)
const stripePromise = loadStripe('pk_test_XXXXXXXXXXXXXXXXXXXX');

const StripeCheckoutForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError('Stripe is not initialized.');
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      // Example: Create a payment intent on the backend (replace with actual API call)
      const { clientSecret } = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: 999, currency: 'usd' }), // Example data
      }).then((res) => res.json());

      // Confirm card payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            email: 'user@example.com', // Replace with actual user email
          },
        },
      });

      if (error) {
        setError(error.message);
      } else if (paymentIntent.status === 'succeeded') {
        trackConversion('Premium Upgrade', 'User upgraded via Stripe'); // Track successful upgrade
        onSuccess(); // Trigger success callback
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-checkout-form" aria-live="polite">
      <CardElement className="card-element" />
      {error && <div className="payment-error" role="alert">{error}</div>}
      <button type="submit" disabled={!stripe || loading} aria-busy={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const StripeCheckout = ({ onSuccess }) => {
  return (
    <Elements stripe={stripePromise}>
      <StripeCheckoutForm onSuccess={onSuccess} />
    </Elements>
  );
};

export default StripeCheckout;
