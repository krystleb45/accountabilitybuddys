import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Notification from "./Notification"; // Adjust the path if necessary
import { expect } from "@jest/globals";

const defaultProps = {
    message: "This is a notification",
    type: "success", // Change this line
    duration: 3000,
  };

  it("renders the notification message", () => {
    render(<Notification {...defaultProps} />);
    expect(screen.getByText(defaultProps.message)).toBeInTheDocument();
  });

  it("applies the correct class for the notification type", () => {
    const { rerender } = render(<Notification {...defaultProps} type="success" />);
    expect(screen.getByText(defaultProps.message)).toHaveClass("notification-success");

    rerender(<Notification {...defaultProps} type="error" />);
    expect(screen.getByText(defaultProps.message)).toHaveClass("notification-error");

    rerender(<Notification {...defaultProps} type="warning" />);
    expect(screen.getByText(defaultProps.message)).toHaveClass("notification-warning");

    rerender(<Notification {...defaultProps} type="info" />);
    expect(screen.getByText(defaultProps.message)).toHaveClass("notification-info");
  });

  it("hides the notification after the specified duration", () => {
    jest.useFakeTimers();
    render(<Notification {...defaultProps} />);

    const notification = screen.getByText(defaultProps.message);
    expect(notification).toBeInTheDocument();

    jest.advanceTimersByTime(defaultProps.duration);
    expect(notification).not.toBeInTheDocument();

    jest.useRealTimers();
  });

  it("allows manual dismissal of the notification", () => {
    const onDismiss = jest.fn();
    render(<Notification {...defaultProps} onDismiss={onDismiss} />);

    const dismissButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(dismissButton);

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("handles default props correctly", () => {
    render(<Notification message="Default message" />);

    const notification = screen.getByText("Default message");
    expect(notification).toBeInTheDocument();
    expect(notification).toHaveClass("notification-info");
  });

  it("handles invalid or missing type gracefully", () => {
    render(<Notification {...defaultProps} type="invalid-type" />);

    const notification = screen.getByText(defaultProps.message);
    expect(notification).toHaveClass("notification-info"); // Defaults to "info" type
  });

