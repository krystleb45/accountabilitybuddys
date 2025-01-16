// __mocks__/api.mock.ts

interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: string | null;
}

const mockApiResponses: Record<string, unknown> = {
  '/users': [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
  ],
  '/goals': [
    { id: 1, title: 'Learn TypeScript', completed: false },
    { id: 2, title: 'Build a mock API', completed: true },
  ],
};

/**
 * Mock function to simulate an API GET request.
 * @param endpoint - The API endpoint to fetch.
 * @returns A Promise resolving to a mock response object.
 */
function get<T>(endpoint: string): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = mockApiResponses[endpoint] as T | undefined;
      if (data) {
        console.log(`[API Mock] GET ${endpoint} - Success`, data);
        resolve({ success: true, data, error: null });
      } else {
        console.error(`[API Mock] GET ${endpoint} - Not Found`);
        resolve({ success: false, data: null, error: 'Endpoint not found' });
      }
    }, 100); // Simulate network latency
  });
}

/**
 * Mock function to simulate an API POST request.
 * @param endpoint - The API endpoint to send data to.
 * @param payload - The data to send in the request body.
 * @returns A Promise resolving to a mock response object.
 */
function post<T>(endpoint: string, payload: T): Promise<ApiResponse<T>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (mockApiResponses[endpoint]) {
        console.log(`[API Mock] POST ${endpoint} - Success`, payload);
        resolve({ success: true, data: payload, error: null });
      } else {
        console.error(`[API Mock] POST ${endpoint} - Not Found`);
        resolve({ success: false, data: null, error: 'Endpoint not found' });
      }
    }, 100); // Simulate network latency
  });
}

/**
 * Mock function to simulate an API DELETE request.
 * @param endpoint - The API endpoint to delete data from.
 * @returns A Promise resolving to a mock response object.
 */
function del(endpoint: string): Promise<ApiResponse<null>> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (mockApiResponses[endpoint]) {
        console.log(`[API Mock] DELETE ${endpoint} - Success`);
        delete mockApiResponses[endpoint];
        resolve({ success: true, data: null, error: null });
      } else {
        console.error(`[API Mock] DELETE ${endpoint} - Not Found`);
        resolve({ success: false, data: null, error: 'Endpoint not found' });
      }
    }, 100); // Simulate network latency
  });
}

/**
 * Mock function to reset all mock API data (useful for tests).
 */
function resetApiData(): void {
  console.log(`[API Mock] Reset all mock data.`);
  mockApiResponses['/users'] = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Doe', email: 'jane@example.com' },
  ];
  mockApiResponses['/goals'] = [
    { id: 1, title: 'Learn TypeScript', completed: false },
    { id: 2, title: 'Build a mock API', completed: true },
  ];
}

// Export mock functions
export { get, post, del, resetApiData };
