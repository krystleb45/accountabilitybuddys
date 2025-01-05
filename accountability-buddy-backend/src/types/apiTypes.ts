export interface ApiResponse<T> {
  success: boolean; // Indicates whether the API request was successful
  message: string;  // Describes the result of the request
  data?: T;         // Contains the response data if successful
  errorCode?: string; // Optional error code for failed responses
  errors?: string[];  // Optional array of detailed error messages
  pagination?: Pagination; // Optional pagination data for paged responses
}

// Pagination interface for paged API responses
export interface Pagination {
  totalItems: number;      // Total number of items
  totalPages: number;      // Total number of pages
  currentPage: number;     // Current page number
  pageSize: number;        // Number of items per page
}
