import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useHistory } from 'react-router-dom';

// Replace with your public Stripe API key
const stripePromise = loadStripe('your-public-stripe-key');

const PaymentPage = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory(); // Assuming you are using React Router

  const handlePayment = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const stripe = await stripePromise;

      // Call your backend to create the Checkout Session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      const session = await response.json();

      // Redirect to Checkout
      const result = await stripe.redirectToCheckout({ sessionId: session.id });

      if (result.error) {
        console.error(result.error.message);
      }
    } catch (error) {
      console.error('Payment Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <h1>Make a Payment</h1>
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
    </div>
  );
};

export default PaymentPage;
