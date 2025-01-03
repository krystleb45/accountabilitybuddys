import '@testing-library/jest-dom/extend-expect'; // For extended assertions with Jest-DOM

// Polyfill for MutationObserver (React rendering behavior in tests)
global.MutationObserver = class {
  constructor(callback) {}
  disconnect() {}
  observe(element, initObject) {}
  takeRecords() { return []; }
};

// Polyfill for IntersectionObserver (used in component visibility tests)
global.IntersectionObserver = class {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() { return []; }
};

// Polyfill for ResizeObserver (used in layout change tests)
global.ResizeObserver = class {
  constructor(callback) {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Mocking the global fetch API
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Set up global fetch mock defaults
beforeAll(() => {
  global.fetch = fetchMock;
});

// Reset fetch mock after each test to prevent carryover
afterEach(() => {
  fetchMock.resetMocks();
});

// Mock console warnings and errors to keep the test output clean
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

// Restore console after all tests
afterAll(() => {
  console.error.mockRestore();
  console.warn.mockRestore();
});
