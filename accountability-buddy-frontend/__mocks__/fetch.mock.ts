/**
 * Mocks the global `fetch` function using Jest and provides utility functions
 * for simulating different response scenarios.
 */

// Define the mocked fetch function
const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;

/**
 * Custom mock for successful fetch responses.
 * @param data - The mock data to return in the response.
 * @param status - The HTTP status code (default: 200).
 */
export function mockFetchSuccess(data: unknown, status = 200): void {
  fetchMock.mockImplementationOnce(() =>
    Promise.resolve({
      ok: true,
      status,
      json: async () => data,
    } as Response)
  );
}

/**
 * Custom mock for error fetch responses.
 * @param errorMessage - The error message to include in the response (default: 'Fetch failed').
 * @param status - The HTTP status code (default: 500).
 */
export function mockFetchError(
  errorMessage = 'Fetch failed',
  status = 500
): void {
  fetchMock.mockImplementationOnce(() =>
    Promise.resolve({
      ok: false,
      status,
      json: async () => ({ message: errorMessage }),
    } as Response)
  );
}

/**
 * Custom mock for network errors (e.g., when the request fails to reach the server).
 * @param error - The error to throw (default: new Error('Network Error')).
 */
export function mockFetchNetworkError(
  error = new Error('Network Error')
): void {
  fetchMock.mockImplementationOnce(() => Promise.reject(error));
}

// Assign the mocked fetch function to the global fetch
global.fetch = fetchMock;

export { fetchMock };
