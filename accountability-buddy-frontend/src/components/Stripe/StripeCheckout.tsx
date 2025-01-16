import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import "./StripeCheckout.css";

// Load Stripe public key
const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLIC_KEY || "pk_test_XXXXXXXXXXXXXXXXXXXX"
);

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      const errorMessage = "Stripe is not initialized.";
      onError(errorMessage);
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      const errorMessage = "Card element not found.";
      onError(errorMessage);
      setLoading(false);
      return;
    }

    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        "client_secret_from_backend",
        { payment_method: { card: cardElement } }
      );

      if (stripeError) {
        onError(stripeError.message || "Payment failed.");
      } else if (paymentIntent?.status === "succeeded") {
        onSuccess();
      }
    } catch {
      onError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="stripe-checkout-form">
      <CardElement />
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

const StripeCheckout: React.FC<StripeCheckoutProps> = ({
  onSuccess,
  onError,
  setLoading,
}) => {
  return (
    <Elements stripe={stripePromise}>
      <StripeCheckoutForm
        onSuccess={onSuccess}
        onError={onError}
        setLoading={setLoading}
      />
    </Elements>
  );
};

export default StripeCheckout;
