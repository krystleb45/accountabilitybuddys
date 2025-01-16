import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe public key
const STRIPE_PUBLIC_KEY = 'your-public-stripe-key';

// Create a Stripe instance
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

/**
 * Initialize Stripe configuration.
 *
 * @returns {Promise<Stripe | null>} - A promise that resolves to the Stripe object or null.
 */
export const initializeStripe = async () => {
  if (!stripePromise) {
    console.error('Stripe has not been initialized properly.');
    return null;
  }
  return await stripePromise;
};

/**
 * Create a payment session.
 *
 * @param {number} amount - The amount to charge (in cents).
 * @returns {Promise<string>} - The session ID for the checkout session.
 */
export const createCheckoutSession = async (amount) => {
  try {
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
    return session.id; // Return the session ID
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error; // Rethrow the error for handling in the component
  }
};

export default stripePromise;
