import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Profile from './Profile';
import { useAuth } from 'src/context/auth/AuthContext';
import axios from 'axios';
import { expect } from '@jest/globals';

jest.mock('src/context/auth/AuthContext', () => ({
  useAuth: jest.fn(),
}));

jest.mock('axios');

describe('Profile Component', () => {
  const mockAuthToken = 'mock-token';
  const mockLogout = jest.fn();

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue({
      authToken: mockAuthToken,
      logout: mockLogout,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<Profile />);
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it('renders profile form correctly after loading', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        username: 'John Doe',
        email: 'john.doe@example.com',
        subscriptionStatus: 'Active',
      },
    });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue('john.doe@example.com')
    ).toBeInTheDocument();
  });

  it('shows an error message if profile fetch fails', async () => {
    (axios.get as jest.Mock).mockRejectedValue(
      new Error('Failed to load profile')
    );

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load profile/i)).toBeInTheDocument();
    });
  });

  it('allows updating the profile', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        username: 'John Doe',
        email: 'john.doe@example.com',
        subscriptionStatus: 'Active',
      },
    });

    (axios.put as jest.Mock).mockResolvedValue({});

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const saveButton = screen.getByText(/save changes/i);

    fireEvent.change(usernameInput, { target: { value: 'Jane Doe' } });
    fireEvent.change(emailInput, { target: { value: 'jane.doe@example.com' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(
        screen.getByText(/profile updated successfully/i)
      ).toBeInTheDocument();
    });
  });

  it('validates email format before submitting', async () => {
    (axios.get as jest.Mock).mockResolvedValue({
      data: {
        username: 'John Doe',
        email: 'john.doe@example.com',
        subscriptionStatus: 'Active',
      },
    });

    render(<Profile />);

    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText(/email/i);
    const saveButton = screen.getByText(/save changes/i);

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
    });
  });
});
