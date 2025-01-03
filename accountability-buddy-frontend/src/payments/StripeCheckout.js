import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useHistory } from 'react-router-dom';

// Replace with your actual Stripe public key
const stripePromise = loadStripe('your-public-stripe-key');

const StripeCheckout = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const history = useHistory();

  const handlePayment = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null); // Reset error state

    try {
      const stripe = await stripePromise;

      // Call your backend to create a Checkout Session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const session = await response.json();

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        setError(result.error.message);
      }
    } catch (err) {
      console.error('Payment Error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stripe-checkout">
      <h1>Checkout</h1>
      <form onSubmit={handlePayment}>
        <label>
          Amount (in cents):
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : 'Pay Now'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default StripeCheckout;
