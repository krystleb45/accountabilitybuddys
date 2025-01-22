import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import * as authService from 'src/services/authService';
import { expect } from '@jest/globals';

// Mock authService
jest.mock('../services/authService', () => ({
  getToken: jest.fn(() => 'mockToken'),
  getUser: jest.fn(() => Promise.resolve({ name: 'John Doe' })),
  logout: jest.fn(),
}));

describe('Navbar Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without errors and displays loading state initially', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Ensure the loading text is displayed
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });

  it('renders user info when authenticated', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Wait for the user info to load
    await waitFor(() =>
      expect(screen.getByText(/john doe/i)).toBeInTheDocument()
    );
    expect(screen.queryByText(/loading.../i)).not.toBeInTheDocument();
  });

  it('renders login link when not authenticated', async () => {
    jest.spyOn(authService, 'getToken').mockReturnValueOnce(null);

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  });

  it('calls logout function when logout button is clicked', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Wait for the user info to load
    await waitFor(() => screen.getByText(/john doe/i));

    const logoutButton = screen.getByRole('button', { name: /logout/i });
    fireEvent.click(logoutButton);

    expect(authService.logout).toHaveBeenCalledTimes(1);
  });

  it('renders navigation links correctly', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Check for Home and other navigation links
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  it('matches snapshot', () => {
    const { asFragment } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});
