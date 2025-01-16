import "@testing-library/jest-dom/extend-expect"; // For extended assertions with Jest-DOM
import fetchMock from "jest-fetch-mock"; // Import fetchMock

// Enable the fetch mock globally
fetchMock.enableMocks();

// Polyfill for MutationObserver
global.MutationObserver = class {
  constructor(callback: MutationObserverCallback) {}
  disconnect() {}
  observe(element: Element, initObject?: MutationObserverInit) {}
  takeRecords(): MutationRecord[] {
    return [];
  }
};

// Polyfill for IntersectionObserver
global.IntersectionObserver = class {
  root: Element | Document | null = null;
  rootMargin: string = '';
  thresholds: ReadonlyArray<number> = [];

  constructor(callback: IntersectionObserverCallback) {}
  disconnect() {}
  observe(element: Element) {}
  unobserve(element: Element) {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
};

// Polyfill for ResizeObserver
global.ResizeObserver = class {
  constructor(callback: ResizeObserverCallback) {}
  disconnect() {}
  observe(element: Element) {}
  unobserve(element: Element) {}
};

// Set up global fetch mock defaults
beforeAll(() => {
  global.fetch = fetchMock as unknown as typeof fetch; // Cast fetchMock for TypeScript compatibility
});

// Reset fetch mock after each test to prevent carryover
afterEach(() => {
  fetchMock.resetMocks();
});

// Mock console warnings and errors to keep the test output clean
beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
  jest.spyOn(console, "warn").mockImplementation(() => {});
});

// Restore all mocks after all tests
afterAll(() => {
  jest.restoreAllMocks();
});
