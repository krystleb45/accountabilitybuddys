// src/setupTests.js

import '@testing-library/jest-dom/extend-expect'; // Custom matchers for asserting on DOM nodes
import { server } from './mocks/server'; // Import your MSW (Mock Service Worker) server

// Establish API mocking before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));

// Reset any request handlers after each test to avoid test interference
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());
