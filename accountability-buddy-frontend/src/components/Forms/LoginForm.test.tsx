import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "./LoginForm";
import "@testing-library/jest-dom/extend-expect";
import { expect } from "@jest/globals";

// Mock API call
jest.mock("../services/authService", () => ({
  login: jest.fn(),
}));

describe("LoginForm Component", () => {
  const handleSubmit = jest.fn();

  beforeEach(() => {
    render(<LoginForm onSubmit={handleSubmit} />);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock data after each test
  });

  test("renders login form correctly", () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("displays error message on empty form submission", async () => {
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/please fill in all fields/i)).toBeInTheDocument();
  });

  test("displays error message for invalid email format", async () => {
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "invalid-email" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();
  });

  test("displays error message for short password", async () => {
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "pass" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
  });

  test("disables login button when form is invalid", () => {
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: "" } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: "" } });

    expect(screen.getByRole("button", { name: /login/i })).toBeDisabled();
  });

  test("calls onSubmit function with valid inputs", async () => {
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password123",
      });
    });
  });

  test("shows loading indicator during form submission", async () => {
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId("loading-spinner")).not.toBeInTheDocument();
    });
  });

  test("ensures form elements are accessible", () => {
    expect(screen.getByLabelText(/email/i)).toHaveAccessibleName("Email");
    expect(screen.getByLabelText(/password/i)).toHaveAccessibleName("Password");
    expect(screen.getByRole("button", { name: /login/i })).toHaveAccessibleName("Login");
  });

  test("clears error messages after successful submission", async () => {
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.queryByText(/please fill in all fields/i)).not.toBeInTheDocument();
    });
  });
});
