/**
 * Represents a generic API response structure.
 *
 * @template T - The type of the `data` field in the response.
 */
export interface ApiResponse<T> {
  /** The primary data returned by the API. */
  data: T;

  /** Indicates whether the request was successful. */
  success: boolean;

  /** A human-readable message providing additional context about the response. */
  message: string;

  /** Optional metadata for additional information about the response (e.g., pagination). */
  meta?: Record<string, unknown>;

  /** Optional error details for failed requests. */
  error?: {
    code?: string; // Error code, if applicable.
    details?: string; // Detailed error information.
  };
}

/**
 * A specialized API response structure for paginated data.
 *
 * @template T - The type of the items in the paginated data.
 */
export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    /** The total number of items available. */
    totalItems: number;

    /** The number of items per page. */
    itemsPerPage: number;

    /** The current page number. */
    currentPage: number;

    /** The total number of pages available. */
    totalPages: number;
  };
}
