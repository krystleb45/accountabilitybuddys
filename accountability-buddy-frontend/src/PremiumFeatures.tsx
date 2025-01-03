import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardElement,
} from "@stripe/react-stripe-js";
import "./StripeCheckout.css";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || "your_key_here");

interface StripeCheckoutFormProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const StripeCheckoutForm: React.FC<StripeCheckoutFormProps> = ({
  onSuccess,
  onError,
  setLoading,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      const errMessage = "Stripe is not initialized.";
      setError(errMessage);
      onError(errMessage);
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      const errMessage = "Card Element not found.";
      setError(errMessage);
      onError(errMessage);
      setLoading(false);
      return;
    }

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment("client_secret", {
        payment_method: {
          card: cardElement,
        },
      });

      if (stripeError) {
        setError(stripeError.message || "Payment failed.");
        onError(stripeError.message || "Payment failed.");
      } else if (paymentIntent?.status === "succeeded") {
        onSuccess();
      }
    } catch (err) {
      const errMessage = "An unexpected error occurred.";
      setError(errMessage);
      onError(errMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-checkout-form">
      <CardElement />
      {error && <p className="error-message">{error}</p>}
      <button type="submit" disabled={!stripe}>
        Pay Now
      </button>
    </form>
  );
};

interface StripeCheckoutProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  onSuccess,
  onError,
  setLoading,
}) => {
  return (
    <Elements stripe={stripePromise}>
      <StripeCheckoutForm onSuccess={onSuccess} onError={onError} setLoading={setLoading} />
    </Elements>
  );
};

export default StripeCheckout;
