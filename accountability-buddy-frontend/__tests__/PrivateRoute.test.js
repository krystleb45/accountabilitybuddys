import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Mock useNavigate to simulate redirection
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('PrivateRoute Component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
  });

  test('renders correctly when user is authenticated', () => {
    // Mock the AuthContext value for an authenticated user
    const mockAuthContextValue = { authToken: 'mockAuthToken', loading: false };

    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter>
          <PrivateRoute element={<div>Protected Content</div>} />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Check that the protected content is rendered
    expect(screen.getByText(/protected content/i)).toBeInTheDocument();
  });

  test('redirects to login when user is not authenticated', () => {
    // Mock the AuthContext value for an unauthenticated user
    const mockAuthContextValue = { authToken: null, loading: false };

    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter>
          <PrivateRoute element={<div>Protected Content</div>} />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Check that navigation occurs to the login page
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });

  test('shows loading spinner when loading', () => {
    // Mock the AuthContext value for a loading state
    const mockAuthContextValue = { authToken: null, loading: true };

    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter>
          <PrivateRoute element={<div>Protected Content</div>} />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Check that the loading spinner is displayed
    expect(screen.getByLabelText(/loading, please wait/i)).toBeInTheDocument();
  });
});
