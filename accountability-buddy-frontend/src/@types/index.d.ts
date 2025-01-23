/**
 * Global TypeScript Definitions
 * This file serves as a central hub for all type declarations in the project.
 */

// Import and re-export custom module declarations
import './custom-module.d.ts';

// Import global environment variable types
import './environment.d.ts';

// Declare global interfaces, types, and variables

declare global {
  /**
   * A generic response structure for API calls.
   */
  interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string; // Optional message for errors or status
  }

  /**
   * A generic pagination structure for lists.
   */
  interface Pagination {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
  }

  /**
   * A global utility type for nullable values.
   */
  type Nullable<T> = T | null;

  /**
   * A global utility type for optional values.
   */
  type Optional<T> = T | undefined;

  /**
   * Declare a custom global variable (example: Google Analytics tracking).
   */
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// Export an empty object to make this file a module
export {};
