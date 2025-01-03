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

    // Check if the protected content is rendered correctly
    expect(screen.getByText(/Protected Content/i)).toBeInTheDocument();
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

    // Ensure the user is redirected to the login page
    expect(mockNavigate).toHaveBeenCalledWith('/login', expect.any(Object));
  });

  test('displays loading spinner when authentication is in progress', () => {
    // Mock the AuthContext value with loading state
    const mockAuthContextValue = { authToken: null, loading: true };

    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter>
          <PrivateRoute element={<div>Protected Content</div>} />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Check if the loading spinner is displayed
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();  // Adjust if spinner text differs
  });

  test('redirects to unauthorized page when user lacks required role', () => {
    // Mock the AuthContext value for an authenticated user without the correct role
    const mockAuthContextValue = {
      authToken: 'mockAuthToken',
      loading: false,
      user: { role: 'user' }, // User has a basic role
    };

    render(
      <AuthContext.Provider value={mockAuthContextValue}>
        <MemoryRouter>
          <PrivateRoute element={<div>Admin Content</div>} requiredRole="admin" />
        </MemoryRouter>
      </AuthContext.Provider>
    );

    // Ensure the user is redirected to the unauthorized page
    expect(mockNavigate).toHaveBeenCalledWith('/unauthorized', expect.any(Object));
  });
});
