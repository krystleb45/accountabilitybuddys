import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginPage from '../../src/app/login/page';

// Mock necessary components and hooks
jest.mock('../../../components/LoadingSpinner', () => () => (
  <div>Loading...</div>
));

describe('LoginPage Tests', () => {
  beforeEach(() => {
    render(<LoginPage />);
  });

  it('displays an error message when fields are empty', async () => {
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    });

    expect(screen.getByText(/all fields are required/i)).toBeInTheDocument();
  });

  it('handles successful login', async () => {
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'password123' },
      });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    });

    await waitFor(() => {
      expect(screen.getByText(/login successful/i)).toBeInTheDocument();
    });
  });

  it('handles login error', async () => {
    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText(/email/i), {
        target: { value: 'invalid@example.com' },
      });
      fireEvent.change(screen.getByPlaceholderText(/password/i), {
        target: { value: 'wrongpassword' },
      });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));
    });

    expect(screen.getByText(/login failed/i)).toBeInTheDocument();
  });
});
