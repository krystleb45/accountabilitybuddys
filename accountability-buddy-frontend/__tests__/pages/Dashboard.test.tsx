// app/dashboard/dashboard.test.tsx

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'; // For extra matchers like toBeInTheDocument
import Dashboard from '../../src/app/dashboard/page'; // Adjust the import path based on your structure
import { fetchDashboardData } from '../../src/services/apiService'

// Mock Data
const mockFetchData = {
  users: [
    { id: '1', name: 'Alice', role: 'Admin' },
    { id: '2', name: 'Bob', role: 'User' },
  ],
};

// Mocking the fetchDashboardData function
jest.mock('../../services/apiService', () => ({
  fetchDashboardData: jest.fn(() => Promise.resolve(mockFetchData)),
}));

describe('Dashboard Component', () => {
  beforeEach(() => {
    render(<Dashboard />); // Render the Dashboard component before each test
  });

  it('renders correctly', () => {
    expect(screen.getByText(/dashboard/i)).toBeInTheDocument(); // Adjust based on actual text
  });

  it('displays loading state initially', () => {
    expect(screen.getByText(/loading/i)).toBeInTheDocument(); // Check for loading state
  });

  it('renders user data after fetching', async () => {
    // Wait for the user data to be displayed
    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });
  });

  it('handles errors gracefully', async () => {
    // Mock an error response
    jest.spyOn(require('../../services/apiService'), 'fetchDashboardData').mockImplementationOnce(() =>
      Promise.reject(new Error('Failed to fetch data'))
    );

    render(<Dashboard />);

    // Wait for error message to be displayed
    await waitFor(() => {
      expect(screen.getByText(/failed to load data/i)).toBeInTheDocument(); // Adjust based on your error message
    });
  });

  it('updates state on user interaction', async () => {
    // Simulate user interaction (e.g., clicking a button)
    fireEvent.click(screen.getByText(/refresh/i)); // Replace with actual button text

    // Wait for updated data to appear
    await waitFor(() => {
      expect(screen.getByText(/updated data title/i)).toBeInTheDocument(); // Adjust based on your expected outcome
    });
  });
});
