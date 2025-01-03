global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true, // Indicate that the response is successful
    status: 200, // Default HTTP status
    json: () => Promise.resolve({}), // Default JSON response
  }),
);

// Custom mock for success responses
global.mockFetchSuccess = (data, status = 200) => {
  global.fetch.mockImplementationOnce(() =>
    Promise.resolve({
      ok: true,
      status,
      json: () => Promise.resolve(data),
    }),
  );
};

// Custom mock for error responses
global.mockFetchError = (errorMessage = "Fetch failed", status = 500) => {
  global.fetch.mockImplementationOnce(() =>
    Promise.resolve({
      ok: false,
      status,
      json: () => Promise.resolve({ message: errorMessage }),
    }),
  );
};

// Custom mock for network errors (e.g., when the request fails to reach the server)
global.mockFetchNetworkError = (error = new Error("Network Error")) => {
  global.fetch.mockImplementationOnce(() => Promise.reject(error));
};
