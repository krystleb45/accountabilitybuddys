import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NewsletterSignup from './NewsletterSignup';
import { expect } from '@jest/globals';

describe('NewsletterSignup Component', () => {
  const mockOnSubmit = jest.fn();

  const renderComponent = () =>
    render(<NewsletterSignup onSubmit={mockOnSubmit} />);

  test('renders the newsletter signup form', () => {
    renderComponent();

    const form = screen.getByTestId('newsletter-signup-form');
    const emailInput = screen.getByLabelText(/email address/i);
    const consentCheckbox = screen.getByLabelText(
      /i agree to receive newsletters/i
    );
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    expect(form).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(consentCheckbox).toBeInTheDocument();
    expect(submitButton).toBeInTheDocument();
  });

  test('enables the submit button only when all fields are valid', () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/email address/i);
    const consentCheckbox = screen.getByLabelText(
      /i agree to receive newsletters/i
    );
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    expect(submitButton).toBeDisabled();

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(consentCheckbox);

    expect(submitButton).toBeEnabled();
  });

  test('shows an error message when submitting with an invalid email', () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/email address/i);
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    const errorMessage = screen.getByText(
      /please enter a valid email address/i
    );
    expect(errorMessage).toBeInTheDocument();
  });

  test('calls onSubmit with correct data when the form is submitted', () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/email address/i);
    const consentCheckbox = screen.getByLabelText(
      /i agree to receive newsletters/i
    );
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(consentCheckbox);
    fireEvent.click(submitButton);

    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      consent: true,
    });
  });

  test('clears the form after successful submission', () => {
    renderComponent();

    const emailInput = screen.getByLabelText(/email address/i);
    const consentCheckbox = screen.getByLabelText(
      /i agree to receive newsletters/i
    );
    const submitButton = screen.getByRole('button', { name: /sign up/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.click(consentCheckbox);
    fireEvent.click(submitButton);

    expect(emailInput).toHaveValue('');
    expect(consentCheckbox).not.toBeChecked();
  });
});
