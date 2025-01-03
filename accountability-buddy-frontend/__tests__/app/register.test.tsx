import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterPage from '../../app/register/page'; // Adjust the import path if necessary
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('RegisterPage Component', () => {
  test('displays validation errors when fields are left blank', async () => {
    render(<RegisterPage />);
    
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Use findByText to wait for validation error messages
    expect(await screen.findByText(/all fields are required/i)).toBeInTheDocument();
  });

  test('submits the form successfully with valid data', async () => {
    mockedAxios.post.mockResolvedValueOnce({ status: 201 });

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Wait for the success message to appear
    await waitFor(() => {
      expect(screen.getByText(/registration successful/i)).toBeInTheDocument();
    });
  });

  test('handles registration errors gracefully', async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error('Registration failed'));

    render(<RegisterPage />);

    fireEvent.change(screen.getByPlaceholderText(/name/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), { target: { value: 'password123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/registration failed/i)).toBeInTheDocument();
    });
  });
});
