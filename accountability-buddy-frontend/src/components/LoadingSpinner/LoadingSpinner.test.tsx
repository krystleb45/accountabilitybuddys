import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoadingSpinner from './LoadingSpinner';
import { expect } from '@jest/globals';

describe('LoadingSpinner Component', () => {
  test('renders the spinner when loading is true', () => {
    render(<LoadingSpinner size={40} color="#007bff" loading={true} />);

    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toBeInTheDocument();
  });

  test('does not render the spinner when loading is false', () => {
    render(<LoadingSpinner size={40} color="#007bff" loading={false} />);

    const spinner = screen.queryByTestId('loading-spinner');
    expect(spinner).not.toBeInTheDocument();
  });

  test('applies the correct size and color styles', () => {
    render(<LoadingSpinner size={50} color="#ff5733" loading={true} />);

    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveStyle({
      width: '50px',
      height: '50px',
      borderColor: '#ff5733',
    });
  });

  test('has the correct ARIA role and label for accessibility', () => {
    render(<LoadingSpinner size={40} color="#007bff" loading={true} />);

    const spinner = screen.getByTestId('loading-spinner');
    expect(spinner).toHaveAttribute('role', 'status');
    expect(spinner).toHaveAttribute('aria-label', 'Loading...');
  });
});
