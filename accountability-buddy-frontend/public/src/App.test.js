import axios from 'axios';
import React from 'react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import App from './App';

jest.mock('axios'); // Mock the axios module

beforeEach(() => {
  jest.clearAllMocks(); // Ensure no mocks from previous tests persist
});

afterEach(() => {
  cleanup(); // Unmounts components after each test
});

test('fetches and displays data from API', async () => {
  // Mock API response
  axios.get.mockResolvedValueOnce({ data: { message: 'Hello from API' } });

  render(<App />);

  // Check that loading text is shown initially
  expect(screen.getByText(/Loading data.../i)).toBeInTheDocument();

  // Check if data from the API is displayed
  const dataElement = await screen.findByText(/Hello from API/i);
  expect(dataElement).toBeInTheDocument();
  expect(dataElement).toHaveAccessibleName('Message from API'); // Accessibility check
  
  // Verify loading text is removed after data is loaded
  await waitFor(() => {
    expect(screen.queryByText(/Loading data.../i)).not.toBeInTheDocument();
  });
});

test('displays error message on API failure', async () => {
  // Mock API failure
  axios.get.mockRejectedValueOnce(new Error('Network Error'));

  render(<App />);

  // Check that loading text is shown initially
  expect(screen.getByText(/Loading data.../i)).toBeInTheDocument();

  // Check if error message is displayed
  const errorElement = await screen.findByText(/Error fetching data/i);
  expect(errorElement).toBeInTheDocument();
  expect(errorElement).toHaveAccessibleName('Error message'); // Accessibility check

  // Verify loading text is removed after error occurs
  await waitFor(() => {
    expect(screen.queryByText(/Loading data.../i)).not.toBeInTheDocument();
  });
});
