// jest.setup.js

import '@testing-library/jest-dom'; // Import jest-dom for extended assertions
import { jest } from '@jest/globals';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn().mockResolvedValue(undefined),
    back: jest.fn(),
  }),
}));

// Mock next/link
jest.mock(
  'next/link',
  () =>
    ({ children, href }) =>
      <a href={href}>{children}</a>,
);

// Mock console.error to avoid unnecessary test noise
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((message) => {
    if (!message.includes('React')) {
      console.warn(message); // Optionally log non-React errors as warnings
    }
  });
});

afterAll(() => {
  jest.restoreAllMocks();
});
