// src/_mock_/axios.js
const mockAxios = {
  get: jest.fn((url, config) => {
    // Default behavior: return an empty data object
    return Promise.resolve({ data: {} });
  }),

  post: jest.fn((url, data, config) => {
    // Default behavior: return an empty data object
    return Promise.resolve({ data: {} });
  }),

  put: jest.fn((url, data, config) => {
    // Default behavior: return an empty data object
    return Promise.resolve({ data: {} });
  }),

  delete: jest.fn((url, config) => {
    // Default behavior: return an empty data object
    return Promise.resolve({ data: {} });
  }),

  patch: jest.fn((url, data, config) => {
    // Default behavior: return an empty data object
    return Promise.resolve({ data: {} });
  }),

  options: jest.fn((url, config) => {
    // Default behavior: return an empty data object
    return Promise.resolve({ data: {} });
  }),

  create: jest.fn(function () {
    // Axios.create() returns a new instance with the same methods
    return this;
  }),

  defaults: {
    headers: {
      common: {},
    },
  },

  // Method to simulate an error response
  mockError: (error) => {
    return Promise.reject(error);
  },

  // Method to simulate a custom successful response
  mockResponse: (response) => {
    return Promise.resolve(response);
  },
};

// Export the mockAxios object
export default mockAxios;
