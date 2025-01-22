// Import Jest DOM matchers for extended assertions
import '@testing-library/jest-dom';
// src/types/tests/setupTests.tsx
import './matchers/customMatchers';

// Enable Fetch Mock for API requests
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

//console.log("setupTests.tsx is loaded");

// Polyfill: MutationObserver
global.MutationObserver = class {
  constructor(callback: MutationObserverCallback) {}
  disconnect() {}
  observe(element: Element, initObject?: MutationObserverInit) {}
  takeRecords(): MutationRecord[] {
    return [];
  }
};

// Polyfill: IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  root: Element | Document | null = null;
  rootMargin: string = '';
  thresholds: ReadonlyArray<number> = [];

  constructor(
    callback: IntersectionObserverCallback,
    options?: IntersectionObserverInit
  ) {}

  disconnect() {}

  observe(element: Element) {}

  unobserve(element: Element) {}

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};

// Polyfill: ResizeObserver
global.ResizeObserver = class {
  constructor(callback: ResizeObserverCallback) {}
  disconnect() {}
  observe(element: Element) {}
  unobserve(element: Element) {}
};

// Global setup for fetch mocks
beforeAll(() => {
  global.fetch = fetchMock as unknown as typeof fetch;
});

// Reset fetch mocks after each test
afterEach(() => {
  fetchMock.resetMocks();
});

// Suppress console errors and warnings during tests
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

// Restore mocks after all tests
afterAll(() => {
  jest.restoreAllMocks();
});
