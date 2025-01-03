import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePage from '../../app/profile/page';
import axios from 'axios';

// Mocking axios for API calls
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mocking token service to handle authentication tokens
jest.mock('../../utils/tokenService', () => ({
  getToken: () => 'mockToken',
}));

describe('ProfilePage Tests', () => {
  beforeEach(() => {
    // Render the component before each test
    render(<ProfilePage />);
  });

  it('renders profile form fields correctly', () => {
    // Check that the form fields are rendered
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
  });

  it('fetches and displays profile information', async () => {
    // Mock API call for fetching profile data
    mockedAxios.get.mockResolvedValueOnce({
      data: {
        name: 'Test User',
        email: 'testuser@example.com',
      },
    });

    // Re-render the component to trigger the API call
    render(<ProfilePage />);

    // Wait for the profile information to be displayed
    await waitFor(() => {
      expect(screen.getByPlaceholderText(/name/i)).toHaveValue('Test User');
      expect(screen.getByPlaceholderText(/email/i)).toHaveValue('testuser@example.com');
    });
  });

  it('handles successful profile update', async () => {
    // Mock successful API response for updating the profile
    mockedAxios.put.mockResolvedValueOnce({ status: 200 });

    // Update the profile form fields
    fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: 'Updated Name' } });
    fireEvent.click(screen.getByText(/update profile/i));

    // Check for success message
    await waitFor(() => {
      expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
    });
  });

  it('handles profile update error', async () => {
    // Mock error response for profile update
    mockedAxios.put.mockRejectedValueOnce(new Error('Update failed'));

    // Attempt to update the profile
    fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: 'Updated Name' } });
    fireEvent.click(screen.getByText(/update profile/i));

    // Check for error message
    await waitFor(() => {
      expect(screen.getByText(/profile update failed/i)).toBeInTheDocument();
    });
  });
});
