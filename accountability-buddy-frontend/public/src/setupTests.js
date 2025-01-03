import '@testing-library/jest-dom/extend-expect'; // Provides additional matchers for testing DOM elements
import './_mocks_/axios';        // Mocking Axios for API requests in tests
import './_mocks_/localStorage';  // Mocking localStorage for tests
import './_mocks_/notification';  // Mocking Notifications API for tests
import './_mocks_/fetch';         // Mocking Fetch API for tests
import './_mocks_/sessionStorage'; // Mocking sessionStorage for tests

// Optional: Enzyme setup for React 17 or 18
// Uncomment and configure as needed
// import { configure } from 'enzyme';
// import Adapter from '@wojtekmaj/enzyme-adapter-react-17'; // For React 17
// import Adapter from '@wojtekmaj/enzyme-adapter-react-18'; // For React 18
// configure({ adapter: new Adapter() });

// Polyfill MutationObserver to avoid errors in Jest environment
global.MutationObserver = class {
  constructor(callback) {
    this.callback = callback;
  }
  disconnect() { }
  observe(target, options) {
    this.callback([], this); // Simulate an empty record for testing purposes
  }
  takeRecords() { return []; }
};

// Polyfill window.matchMedia for components relying on media queries
global.matchMedia = global.matchMedia || function() {
  return {
    matches: false,
    addListener: jest.fn(), // Deprecated
    removeListener: jest.fn(), // Deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  };
};

// Polyfill window.scrollTo for components using scrolling
global.scrollTo = jest.fn();

// Add any additional global mocks or setup logic here if needed
