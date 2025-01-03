import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LoginForm from './LoginForm';
import '@testing-library/jest-dom/extend-expect';

// Mock API call
jest.mock('../services/authService', () => ({
  login: jest.fn(),
}));

describe('LoginForm Component', () => {
  const handleSubmit = jest.fn();

  beforeEach(() => {
    render(<LoginForm onSubmit={handleSubmit} />);
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mock data after each test
  });

  test('renders login form correctly', () => {
    // Check if email input is present
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();

    // Check if password input is present
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // Check if login button is present
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  test('shows error message on empty form submission', async () => {
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Check if error message is shown
    expect(await screen.findByText(/please fill in all fields/i)).toBeInTheDocument();
  });

  test('shows error message for invalid email format', async () => {
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Check if error message for invalid email is shown
    expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument();
  });

  test('shows error message for short password', async () => {
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'pass' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Check if error message for short password is shown
    expect(await screen.findByText(/password must be at least 6 characters/i)).toBeInTheDocument();
  });

  test('disables login button when form is invalid', () => {
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: '' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '' } });

    // Check if button is disabled
    expect(screen.getByRole('button', { name: /login/i })).toBeDisabled();
  });

  test('calls onSubmit function with valid inputs', async () => {
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Ensure the form submission is called with correct data
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  test('shows loading indicator when submitting', async () => {
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Check if loading indicator is displayed
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();

    // Ensure it disappears after submission
    await waitFor(() => {
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  });

  test('has accessible form elements', () => {
    // Check if all form elements have accessible roles
    expect(screen.getByLabelText(/email/i)).toHaveAccessibleName('Email');
    expect(screen.getByLabelText(/password/i)).toHaveAccessibleName('Password');
    expect(screen.getByRole('button', { name: /login/i })).toHaveAccessibleName('Login');
  });
});
