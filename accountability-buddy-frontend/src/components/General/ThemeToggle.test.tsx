import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeToggle from './ThemeToggle';
import { expect } from '@jest/globals';

describe('ThemeToggle Component', () => {
  const mockOnToggle = jest.fn();

  const renderComponent = (isDarkMode: boolean) =>
    render(<ThemeToggle isDarkMode={isDarkMode} onToggle={mockOnToggle} />);

  test('renders the toggle button', () => {
    renderComponent(false);

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(toggleButton).toBeInTheDocument();
  });

  test('displays light mode icon and label when in light mode', () => {
    renderComponent(false);

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    const lightIcon = screen.getByTestId('light-mode-icon');

    expect(toggleButton).toHaveTextContent('Light Mode');
    expect(lightIcon).toBeInTheDocument();
  });

  test('displays dark mode icon and label when in dark mode', () => {
    renderComponent(true);

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    const darkIcon = screen.getByTestId('dark-mode-icon');

    expect(toggleButton).toHaveTextContent('Dark Mode');
    expect(darkIcon).toBeInTheDocument();
  });

  test('calls onToggle when the toggle button is clicked', () => {
    renderComponent(false);

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(toggleButton);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });
});
