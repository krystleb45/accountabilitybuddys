import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AnimatedButton from './AnimatedButton';
import { expect } from '@jest/globals';

describe('AnimatedButton Component', () => {
  it('renders the button with the correct label', () => {
    render(<AnimatedButton label="Click Me" />);
    expect(
      screen.getByRole('button', { name: /click me/i })
    ).toBeInTheDocument();
  });

  it('applies the correct styles based on the variant prop', () => {
    const { rerender } = render(
      <AnimatedButton label="Primary" variant="primary" />
    );
    expect(screen.getByRole('button', { name: /primary/i })).toHaveClass(
      'primary'
    );

    rerender(<AnimatedButton label="Secondary" variant="secondary" />);
    expect(screen.getByRole('button', { name: /secondary/i })).toHaveClass(
      'secondary'
    );

    rerender(<AnimatedButton label="Outline" variant="outline" />);
    expect(screen.getByRole('button', { name: /outline/i })).toHaveClass(
      'outline'
    );
  });

  it('applies the correct size based on the size prop', () => {
    const { rerender } = render(<AnimatedButton label="Small" size="small" />);
    expect(screen.getByRole('button', { name: /small/i })).toHaveClass('small');

    rerender(<AnimatedButton label="Medium" size="medium" />);
    expect(screen.getByRole('button', { name: /medium/i })).toHaveClass(
      'medium'
    );

    rerender(<AnimatedButton label="Large" size="large" />);
    expect(screen.getByRole('button', { name: /large/i })).toHaveClass('large');
  });

  it('handles the loading state correctly', () => {
    render(<AnimatedButton label="Loading" isLoading />);
    expect(screen.getByRole('button', { name: /loading/i })).toBeDisabled();
    expect(screen.getByLabelText(/loading/i)).toHaveAttribute(
      'aria-busy',
      'true'
    );
    expect(screen.getByText('Processing...')).toBeInTheDocument();
  });

  it('handles the disabled state correctly', () => {
    render(<AnimatedButton label="Disabled" disabled />);
    expect(screen.getByRole('button', { name: /disabled/i })).toBeDisabled();
  });

  it('triggers the onClick function when clicked', () => {
    const handleClick = jest.fn();
    render(<AnimatedButton label="Click Me" onClick={handleClick} />);
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not trigger onClick when disabled', () => {
    const handleClick = jest.fn();
    render(<AnimatedButton label="Click Me" onClick={handleClick} disabled />);
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('matches the snapshot', () => {
    const { container } = render(<AnimatedButton label="Snapshot Test" />);
    expect(container.firstChild).toMatchSnapshot();
  });
});
