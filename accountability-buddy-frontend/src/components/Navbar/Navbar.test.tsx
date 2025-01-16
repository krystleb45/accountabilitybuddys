import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import * as authService from '../services/authService';

// Mock authService
jest.mock('../../src/services/authService', () => ({
  getToken: jest.fn(() => 'mockToken'),
}));

describe('Navbar Component', () => {
  it('renders without errors and fetches user info', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
    expect(screen.getByText(/loading.../i)).toBeInTheDocument();
  });
});
