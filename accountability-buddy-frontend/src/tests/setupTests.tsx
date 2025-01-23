// Import Jest DOM matchers for extended assertions
import '@testing-library/jest-dom';
// Import custom matchers for Jest
import './matchers/customMatchers';

// Enable Fetch Mock for API requests
import fetchMock from 'jest-fetch-mock';
fetchMock.enableMocks();

// Polyfill: MutationObserver
global.MutationObserver = class MutationObserver {
  constructor(_callback: MutationObserverCallback) {
    // No implementation needed for mock
  }
  disconnect(): void {}
  observe(_element: Element, _initObject?: MutationObserverInit): void {}
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
    _callback: IntersectionObserverCallback,
    _options?: IntersectionObserverInit
  ) {
    // No implementation needed for mock
  }

  disconnect(): void {}
  observe(_element: Element): void {}
  unobserve(_element: Element): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};

// Polyfill: ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(_callback: ResizeObserverCallback) {
    // No implementation needed for mock
  }
  disconnect(): void {}
  observe(_element: Element): void {}
  unobserve(_element: Element): void {}
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
