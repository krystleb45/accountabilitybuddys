import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import { getToken, removeToken } from '../services/authService';
import { useNavigate } from 'react-router-dom';

// Mock the getToken, removeToken, and useNavigate functions
jest.mock('../services/authService', () => ({
  getToken: jest.fn(),
  removeToken: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Navbar Component', () => {
  const mockNavigate = jest.fn();
  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders correctly when user is not logged in', () => {
    // Mock getToken to return null (user not logged in)
    getToken.mockReturnValue(null);

    // Render the Navbar component
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Check for "Login" link
    expect(screen.getByText(/Login/i)).toBeInTheDocument();

    // Check for "Signup" link
    expect(screen.getByText(/Signup/i)).toBeInTheDocument();

    // Ensure "Profile" and "Logout" are not in the document
    expect(screen.queryByText(/Profile/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Logout/i)).not.toBeInTheDocument();
  });

  test('renders correctly when user is logged in', () => {
    // Mock getToken to return a token (user logged in)
    getToken.mockReturnValue('valid_token');

    // Render the Navbar component
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Check for "Profile" link
    expect(screen.getByText(/Profile/i)).toBeInTheDocument();

    // Check for "Logout" button
    expect(screen.getByText(/Logout/i)).toBeInTheDocument();

    // Ensure "Login" and "Signup" are not in the document
    expect(screen.queryByText(/Login/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Signup/i)).not.toBeInTheDocument();
  });

  test('logs out correctly when user clicks logout', () => {
    // Mock getToken to return a token (user logged in)
    getToken.mockReturnValue('valid_token');

    // Render the Navbar component
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Click the "Logout" button
    fireEvent.click(screen.getByText(/Logout/i));

    // Check that removeToken was called
    expect(removeToken).toHaveBeenCalled();

    // Check that navigation to login occurred
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
