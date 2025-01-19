// Feed.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import Feed from './Feed';
import { mockPosts } from './mockData';
import '@testing-library/jest-dom';
import { expect } from '@jest/globals';

test('renders Feed component with posts', () => {
  render(<Feed posts={mockPosts} />);
  const postElements = screen.getAllByRole('article');
  expect(postElements).toHaveLength(mockPosts.length); // Ensure the array length matches
});

test('renders Feed component with empty state', () => {
  render(<Feed posts={[]} />);
  const emptyMessage = screen.getByText(/no posts available/i);
  expect(emptyMessage).toBeInTheDocument(); // Verify empty state message
});
