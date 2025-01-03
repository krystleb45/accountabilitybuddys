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
      common: {}
    }
  },

  // Mock implementation for errors, can be called when needed in a test
  mockError: function (error) {
    return Promise.reject(error);
  },

  // Mock for custom responses, can be used for specific scenarios in tests
  mockResponse: function (response) {
    return Promise.resolve(response);
  },


mockAxios.get.mockImplementationOnce(() =>
  Promise.reject(new Error("Network Error"))
)
};


export default mockAxios;
