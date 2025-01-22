import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminManagementPage from '../../src/app/admin-management/page';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('AdminManagementPage', () => {
  beforeEach(() => {
    render(<AdminManagementPage />);
  });

  test('renders the Admin Management page correctly', () => {
    expect(screen.getByText(/admin management/i)).toBeInTheDocument();
  });

  test('displays admin users like Alice and Bob', async () => {
    // Mock the API response
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        { name: 'Alice', role: 'Admin' },
        { name: 'Bob', role: 'User' },
      ],
    });

    // Re-render after mock setup
    render(<AdminManagementPage />);

    await waitFor(() => {
      expect(screen.getByText(/alice/i)).toBeInTheDocument();
      expect(screen.getByText(/bob/i)).toBeInTheDocument();
    });
  });

  test('handles user role change successfully', async () => {
    mockedAxios.put.mockResolvedValueOnce({ status: 200 });

    // Simulate role change logic here
    // (You can add role-changing simulation based on your UI)

    await waitFor(() => {
      expect(
        screen.getByText(/role updated successfully/i)
      ).toBeInTheDocument();
    });
  });

  test('displays an error message when role update fails', async () => {
    mockedAxios.put.mockRejectedValueOnce(new Error('Update failed'));

    // Simulate error scenario here
    // (You can add error simulation based on your UI)

    await waitFor(() => {
      expect(screen.getByText(/update failed/i)).toBeInTheDocument();
    });
  });
});
