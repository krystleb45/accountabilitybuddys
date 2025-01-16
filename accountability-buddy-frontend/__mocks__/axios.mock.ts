const mockAxios = {
  // Mock GET request
  get: jest.fn((url, config) => {
    console.log(`[Axios Mock] GET request to: ${url}`, config);
    return Promise.resolve({ data: {} });
  }),

  // Mock POST request
  post: jest.fn((url, data, config) => {
    console.log(`[Axios Mock] POST request to: ${url}`, { data, config });
    return Promise.resolve({ data: {} });
  }),

  // Mock PUT request
  put: jest.fn((url, data, config) => {
    console.log(`[Axios Mock] PUT request to: ${url}`, { data, config });
    return Promise.resolve({ data: {} });
  }),

  // Mock DELETE request
  delete: jest.fn((url, config) => {
    console.log(`[Axios Mock] DELETE request to: ${url}`, config);
    return Promise.resolve({ data: {} });
  }),

  // Mock PATCH request
  patch: jest.fn((url, data, config) => {
    console.log(`[Axios Mock] PATCH request to: ${url}`, { data, config });
    return Promise.resolve({ data: {} });
  }),

  // Mock OPTIONS request
  options: jest.fn((url, config) => {
    console.log(`[Axios Mock] OPTIONS request to: ${url}`, config);
    return Promise.resolve({ data: {} });
  }),

  // Axios.create() returns a new instance with the same methods
  create: jest.fn(function () {
    console.log(`[Axios Mock] Created new Axios instance`);
    return this;
  }),

  // Mock Axios defaults
  defaults: {
    headers: {
      common: {},
    },
  },

  /**
   * Simulates an error response for testing error scenarios.
   * @param {Error} error - The error to return.
   * @returns {Promise<never>} - A rejected promise with the error.
   */
  mockError: function (error) {
    console.error(`[Axios Mock] Simulated error:`, error);
    return Promise.reject(error);
  },

  /**
   * Simulates a custom response for testing specific scenarios.
   * @param {object} response - The custom response to return.
   * @returns {Promise<object>} - A resolved promise with the response.
   */
  mockResponse: function (response) {
    console.log(`[Axios Mock] Simulated response:`, response);
    return Promise.resolve(response);
  },

  // Example: Add a one-time GET implementation for testing failures
  addMockImplementationOnce: function () {
    this.get.mockImplementationOnce(() => {
      console.error(`[Axios Mock] One-time GET request failure`);
      return Promise.reject(new Error('Network Error'));
    });
  },
};

// Example of setting a one-time failure for GET requests
mockAxios.addMockImplementationOnce();

export default mockAxios;
