import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PaymentButton from "./PaymentButton";
import * as subscriptionService from "src/services/subscriptionService";
import { expect } from '@jest/globals';

jest.mock("../services/subscriptionService");

describe("PaymentButton Component", () => {
  const mockCreateSubscriptionSession = jest.spyOn(
    subscriptionService,
    "createSubscriptionSession"
  );

  beforeEach(() => {
    mockCreateSubscriptionSession.mockClear();
  });

  it("renders the button with the correct label", () => {
    render(<PaymentButton buttonText="Subscribe Now" />);
    expect(screen.getByRole("button", { name: /subscribe now/i })).toBeInTheDocument();
  });

  it("calls createSubscriptionSession and redirects on success", async () => {
    mockCreateSubscriptionSession.mockResolvedValueOnce({ sessionId: "test-session-id" });

    const originalLocation = window.location;
    window.location.href = "";
    window.location = { href: "" } as Location;

    render(<PaymentButton buttonText="Subscribe Now" />);
    const button = screen.getByRole("button", { name: /subscribe now/i });

    fireEvent.click(button);

    await waitFor(() => {
      expect(mockCreateSubscriptionSession).toHaveBeenCalledTimes(1);
      expect(window.location.href).toBe(
        `${process.env.REACT_APP_STRIPE_CHECKOUT_URL}/session/test-session-id`
      );
    });

    window.location = originalLocation;
  });

  it("displays an error message when createSubscriptionSession fails", async () => {
    mockCreateSubscriptionSession.mockRejectedValueOnce(new Error("Network Error"));

    render(<PaymentButton buttonText="Subscribe Now" />);
    const button = screen.getByRole("button", { name: /subscribe now/i });

    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/failed to create a subscription session/i)).toBeInTheDocument();
    });
  });

  it("disables the button and shows loading state during processing", async () => {
    mockCreateSubscriptionSession.mockResolvedValueOnce({ sessionId: "test-session-id" });

    render(<PaymentButton buttonText="Subscribe Now" />);
    const button = screen.getByRole("button", { name: /subscribe now/i });

    fireEvent.click(button);

    expect(button).toBeDisabled();
    expect(screen.getByText("Processing...")).toBeInTheDocument();

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it("does not call createSubscriptionSession when the button is disabled", () => {
    render(<PaymentButton buttonText="Subscribe Now" />);
    const button = screen.getByRole("button", { name: /subscribe now/i });

    button.setAttribute("disabled", "true");
    fireEvent.click(button);

    expect(mockCreateSubscriptionSession).not.toHaveBeenCalled();
  });

  it("matches the snapshot", () => {
    const { container } = render(<PaymentButton buttonText="Subscribe Now" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
