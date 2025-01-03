import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { StripeProvider } from "@stripe/react-stripe-js";
import StripeCheckoutForm from "../src/components/StripeCheckout";
import { loadStripe } from "@stripe/stripe-js";

jest.mock("@stripe/stripe-js");
jest.mock("axios");

const stripePromise = loadStripe("pk_test_XXXXXXXXXXXXXXXXXXXX");

describe("StripeCheckoutForm Component", () => {
  test("renders the form", () => {
    render(
      <StripeProvider stripe={stripePromise}>
        <StripeCheckoutForm />
      </StripeProvider>
    );
    expect(screen.getByText(/payment details/i)).toBeInTheDocument();
  });

  test("handles successful payment", async () => {
    // Mocking successful payment logic here...
    render(
      <StripeProvider stripe={stripePromise}>
        <StripeCheckoutForm />
      </StripeProvider>
    );

    // Simulate filling in the card details and submitting the form...
    fireEvent.change(screen.getByLabelText(/card number/i), { target: { value: "4242 4242 4242 4242" } });
    fireEvent.click(screen.getByText(/pay/i));

    await waitFor(() => {
      expect(screen.getByText(/payment successful/i)).toBeInTheDocument();
    });
  });

  test("handles payment errors", async () => {
    // Simulate payment error...
    render(
      <StripeProvider stripe={stripePromise}>
        <StripeCheckoutForm />
      </StripeProvider>
    );

    fireEvent.change(screen.getByLabelText(/card number/i), { target: { value: "4000 0000 0000 9995" } });
    fireEvent.click(screen.getByText(/pay/i));

    await waitFor(() => {
      expect(screen.getByText(/payment failed/i)).toBeInTheDocument();
    });
  });
});
