/**
 * TypeScript type definitions for the `jest-fetch-mock` library.
 * These definitions enhance the developer experience by providing type safety
 * and IntelliSense for fetch mocking methods.
 */

declare module "jest-fetch-mock" {
  /**
   * Represents the fetch mock instance provided by jest-fetch-mock.
   */
  const fetchMock: {
    /**
     * Enables mocking for fetch globally.
     */
    enableMocks: () => void;

    /**
     * Resets all mocked fetch calls and responses.
     */
    resetMocks: () => void;

    /**
     * Enables mocking for the fetch API.
     */
    doMock: () => void;

    /**
     * Mocks a fetch response with the given body and options.
     * @param body - The response body as a string.
     * @param options - Optional fetch options, such as headers or status.
     */
    mockResponse: (body: string, options?: RequestInit) => void;

    /**
     * Mocks a single fetch response for the next fetch call.
     * @param body - The response body as a string.
     * @param options - Optional fetch options, such as headers or status.
     */
    mockResponseOnce: (body: string, options?: RequestInit) => void;

    /**
     * Mock fetch to reject with an error.
     * @param error - The error object or message to reject with.
     */
    mockReject: (error: Error | string) => void;

    /**
     * Mock fetch to reject with an error for the next fetch call.
     * @param error - The error object or message to reject with.
     */
    mockRejectOnce: (error: Error | string) => void;

    /**
     * Clears all mock implementations for fetch.
     */
    clearMocks: () => void;

    /**
     * Mock fetch with a custom implementation.
     * @param implementation - A custom function to handle fetch calls.
     */
    mockImplementation: (implementation: (...args: any[]) => Promise<Response>) => void;

    /**
     * Mock fetch once with a custom implementation.
     * @param implementation - A custom function to handle a single fetch call.
     */
    mockImplementationOnce: (implementation: (...args: any[]) => Promise<Response>) => void;
  };

  export default fetchMock;
}
