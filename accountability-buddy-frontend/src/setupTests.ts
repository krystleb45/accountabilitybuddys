import "@testing-library/jest-dom/extend-expect"; // For extended assertions with Jest-DOM
import fetchMock from "jest-fetch-mock";

// Polyfill for MutationObserver (React rendering behavior in tests)
class MockMutationObserver {
  constructor(callback: MutationCallback) {}
  disconnect(): void {}
  observe(element: HTMLElement, initObject: MutationObserverInit): void {}
  takeRecords(): MutationRecord[] {
    return [];
  }
}

global.MutationObserver = MockMutationObserver as unknown as typeof MutationObserver;

// Polyfill for IntersectionObserver (used in component visibility tests)
class MockIntersectionObserver {
  constructor(callback: IntersectionObserverCallback) {}
  disconnect(): void {}
  observe(): void {}
  unobserve(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

global.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;

// Polyfill for ResizeObserver (used in layout change tests)
class MockResizeObserver {
  constructor(callback: ResizeObserverCallback) {}
  disconnect(): void {}
  observe(): void {}
  unobserve(): void {}
}

global.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

// Mocking the global fetch API
fetchMock.enableMocks();

// Explicitly cast global.fetch to jest-fetch-mock's type
global.fetch = fetchMock as unknown as typeof fetch;

// Set up global fetch mock defaults
beforeAll(() => {
  fetchMock.resetMocks();
});

// Reset fetch mock after each test to prevent carryover
afterEach(() => {
  fetchMock.resetMocks();
});

// Mock console warnings and errors to keep the test output clean
let consoleErrorSpy: jest.SpyInstance;
let consoleWarnSpy: jest.SpyInstance;

beforeAll(() => {
  consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation(() => {});
});

// Restore console after all tests
afterAll(() => {
  consoleErrorSpy.mockRestore();
  consoleWarnSpy.mockRestore();
});
