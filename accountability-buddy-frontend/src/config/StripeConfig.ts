import { loadStripe, Stripe } from '@stripe/stripe-js';

/**
 * Stripe public key (retrieved from environment variables).
 * Ensure REACT_APP_STRIPE_PUBLIC_KEY is set in your environment.
 */
const STRIPE_PUBLIC_KEY = process.env.REACT_APP_STRIPE_PUBLIC_KEY || '';

// Validate the public key
if (!STRIPE_PUBLIC_KEY) {
  console.error(
    'Stripe public key is not set. Please configure REACT_APP_STRIPE_PUBLIC_KEY.'
  );
}

// Create a Stripe instance
const stripePromise = loadStripe(STRIPE_PUBLIC_KEY);

/**
 * Initialize Stripe configuration.
 *
 * @returns {Promise<Stripe | null>} - A promise that resolves to the Stripe object or null.
 */
export const initializeStripe = async (): Promise<Stripe | null> => {
  if (!stripePromise) {
    console.error('Stripe has not been initialized properly.');
    return null;
  }
  try {
    return await stripePromise;
  } catch (error) {
    console.error('Error initializing Stripe:', error);
    return null;
  }
};

/**
 * Create a payment session for Stripe Checkout.
 *
 * @param {number} amount - The amount to charge (in cents).
 * @returns {Promise<string>} - The session ID for the checkout session.
 */
export const createCheckoutSession = async (
  amount: number
): Promise<string> => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create checkout session: ${response.statusText}`
      );
    }

    const session = await response.json();
    return session.id; // Return the session ID
  } catch (error) {
    console.error('Error creating checkout session:', error);
    throw error; // Rethrow the error for handling in the component
  }
};

export default stripePromise;
