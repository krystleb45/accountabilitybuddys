import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Elements } from '@stripe/react-stripe-js';
import StripeCheckoutForm from '../../src/components/Stripe/StripeCheckout';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';

jest.mock('@stripe/stripe-js');
jest.mock('axios');

const stripePromise = loadStripe('pk_test_XXXXXXXXXXXXXXXXXXXX');

describe('StripeCheckoutForm Component', () => {
  const mockOnSuccess = jest.fn();
  const mockOnError = jest.fn();
  const mockSetLoading = jest.fn();

  const renderComponent = () =>
    render(
      <Elements stripe={stripePromise}>
        <StripeCheckoutForm
          onSuccess={mockOnSuccess}
          onError={mockOnError}
          setLoading={mockSetLoading}
        />
      </Elements>
    );

  test('renders the form', () => {
    renderComponent();
    expect(screen.getByText(/payment details/i)).toBeInTheDocument();
  });

  test('handles successful payment', async () => {
    // Mock axios to simulate a successful payment response
    (axios.post as jest.Mock).mockResolvedValueOnce({
      data: { success: true },
    });

    renderComponent();

    // Simulate filling in card details
    fireEvent.change(screen.getByLabelText(/card number/i), {
      target: { value: '4242 4242 4242 4242' },
    });
    fireEvent.change(screen.getByLabelText(/expiry date/i), {
      target: { value: '12/34' },
    });
    fireEvent.change(screen.getByLabelText(/cvc/i), {
      target: { value: '123' },
    });

    // Simulate clicking the "Pay" button
    fireEvent.click(screen.getByText(/pay/i));

    // Wait for successful payment message
    await waitFor(() => {
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(screen.getByText(/payment successful/i)).toBeInTheDocument();
    });
  });

  test('handles payment errors', async () => {
    // Mock axios to simulate a payment failure response
    (axios.post as jest.Mock).mockRejectedValueOnce(
      new Error('Payment failed')
    );

    renderComponent();

    // Simulate filling in card details
    fireEvent.change(screen.getByLabelText(/card number/i), {
      target: { value: '4000 0000 0000 9995' },
    });
    fireEvent.change(screen.getByLabelText(/expiry date/i), {
      target: { value: '12/34' },
    });
    fireEvent.change(screen.getByLabelText(/cvc/i), {
      target: { value: '123' },
    });

    // Simulate clicking the "Pay" button
    fireEvent.click(screen.getByText(/pay/i));

    // Wait for error handling
    await waitFor(() => {
      expect(mockOnError).toHaveBeenCalledWith('Payment failed');
      expect(screen.getByText(/payment failed/i)).toBeInTheDocument();
    });
  });
});
