import React from 'react';
import { render, screen } from '@testing-library/react';
import BadgeSystem from './BadgeSystem';
import { expect } from '@jest/globals';

const mockBadges = [
  {
    id: '1',
    name: 'Achiever',
    description: 'Awarded for achieving 10 goals',
    imageUrl: '/images/achiever.png',
  },
  {
    id: '2',
    name: 'Starter',
    description: 'Awarded for starting your first goal',
    imageUrl: '/images/starter.png',
  },
];

test('renders badges correctly', () => {
  render(<BadgeSystem badges={mockBadges} />);
  const badgeElements = screen.getAllByRole('img');
  expect(badgeElements).toHaveLength(mockBadges.length); // Should now work
});

test('renders empty state when no badges', () => {
  render(<BadgeSystem badges={[]} />);
  const emptyMessage = screen.getByText(/no badges available/i);
  expect(emptyMessage).toBeInTheDocument(); // Should now work
});
