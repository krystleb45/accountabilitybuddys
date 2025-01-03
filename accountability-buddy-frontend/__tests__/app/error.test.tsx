// app/error/error.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // For extra matchers like toBeInTheDocument
import ErrorBoundary from '../../src/components/ErrorBoundary'; // Adjust the import path based on your structure

// A simple component to test the error boundary
const ProblematicComponent = () => {
  throw new Error("I crashed!"); // Simulate an error
};

describe('ErrorBoundary Component', () => {
  it('renders fallback UI when an error occurs', () => {
    render(
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>
    );

    // Check if fallback UI is displayed
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument(); // Adjust based on your fallback message
  });

  it('renders child components without crashing when no error occurs', () => {
    render(
      <ErrorBoundary>
        <div>All is well!</div>
      </ErrorBoundary>
    );

    // Check if child components are displayed correctly
    expect(screen.getByText(/all is well!/i)).toBeInTheDocument();
  });
});
