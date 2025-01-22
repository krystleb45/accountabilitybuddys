import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Card from './Card';
import { expect } from '@jest/globals';

describe('Card Component', () => {
  it('renders the children correctly', () => {
    render(<Card>Test Content</Card>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies additional class names', () => {
    render(<Card className="custom-class">Custom Class Content</Card>);
    const card = screen.getByText('Custom Class Content');
    expect(card).toHaveClass('custom-class');
  });

  it('applies the elevated class when the elevated prop is true', () => {
    render(<Card elevated>Elevated Card</Card>);
    const card = screen.getByText('Elevated Card');
    expect(card).toHaveClass('elevated');
  });

  it('applies the bordered class when the bordered prop is true', () => {
    render(<Card bordered>Bordered Card</Card>);
    const card = screen.getByText('Bordered Card');
    expect(card).toHaveClass('bordered');
  });

  it('handles the onClick event', () => {
    const handleClick = jest.fn();
    render(<Card onClick={handleClick}>Clickable Card</Card>);
    const card = screen.getByText('Clickable Card');
    fireEvent.click(card);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is accessible via keyboard when onClick is provided', () => {
    const handleClick = jest.fn();
    render(<Card onClick={handleClick}>Focusable Card</Card>);
    const card = screen.getByText('Focusable Card');

    // Simulate focus and pressing Enter
    card.focus();
    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);

    // Simulate pressing Space
    fireEvent.keyDown(card, { key: ' ', code: 'Space' });
    expect(handleClick).toHaveBeenCalledTimes(2);
  });

  it('does not have a button role or tabIndex when onClick is not provided', () => {
    render(<Card>No Interaction</Card>);
    const card = screen.getByText('No Interaction');
    expect(card).not.toHaveAttribute('role', 'button');
    expect(card).not.toHaveAttribute('tabIndex');
  });

  it('matches the snapshot', () => {
    const { container } = render(<Card>Snapshot Test</Card>);
    expect(container.firstChild).toMatchSnapshot();
  });
});
