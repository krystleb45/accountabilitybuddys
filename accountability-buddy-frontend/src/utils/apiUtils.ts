// src/utils/apiUtils.ts - Utility functions for API handling

/**
 * Generic type for API responses.
 */
export interface ApiResponse<T> {
  data: T;
  message?: string; // Optional message from the API
  success?: boolean; // Optional success indicator
}

/**
 * Handles API responses by checking the status and returning parsed JSON.
 *
 * @param response - The fetch API response object.
 * @returns A promise resolving to the parsed JSON data from the response.
 * @throws An error if the response status is not OK.
 */
export const handleResponse = async <T>(response: Response): Promise<T> => {
  try {
    const json = await response.json();

    if (!response.ok) {
      const errorMessage = json?.message || `HTTP Error ${response.status}`;
      throw new Error(errorMessage);
    }

    return json as T; // Type-casting to the expected response type
  } catch (error) {
    console.error('Error parsing response JSON:', error);
    throw new Error('Failed to parse server response.');
  }
};

/**
 * Handles errors that occur during API calls.
 *
 * @param error - The error object from the API call.
 */
export const handleError = (error: unknown): void => {
  if (error instanceof Error) {
    console.error('API Error:', error.message);
  } else {
    console.error('Unexpected API error:', error);
  }
  // Optional: Implement additional error handling (e.g., notifications)
};

/**
 * Fetches data from an API and handles response and errors.
 *
 * @param url - The API endpoint URL.
 * @param options - Optional fetch options (e.g., method, headers, body).
 * @returns A promise resolving to the parsed JSON data from the API response.
 */
export const fetchData = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });
    return await handleResponse<T>(response);
  } catch (error) {
    handleError(error);
    throw error; // Re-throw the error for caller handling
  }
};

/**
 * Helper function to build query strings for GET requests.
 *
 * @param params - An object containing query parameters.
 * @returns A query string (e.g., ?key=value&key2=value2).
 */
export const buildQueryString = (
  params: Record<string, string | number | boolean>
): string => {
  const queryString = new URLSearchParams(
    Object.entries(params).reduce(
      (acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      },
      {} as Record<string, string>
    )
  ).toString();

  return queryString ? `?${queryString}` : '';
};

/**
 * Fetches data with query parameters.
 *
 * @param url - The API endpoint URL.
 * @param params - Query parameters to append to the URL.
 * @returns A promise resolving to the parsed JSON data.
 */
export const fetchWithQueryParams = async <T>(
  url: string,
  params: Record<string, string | number | boolean>
): Promise<T> => {
  const queryString = buildQueryString(params);
  return fetchData<T>(`${url}${queryString}`);
};
