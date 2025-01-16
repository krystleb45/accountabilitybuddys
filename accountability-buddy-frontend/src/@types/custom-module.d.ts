/**
 * TypeScript type definitions for "custom-module".
 * These definitions are used to provide type safety when working with the module.
 */

declare module "custom-module" {
    // Define interfaces and types exposed by the module
  
    /**
     * Example interface for a response object returned by the module.
     */
    export interface CustomModuleResponse {
      id: string;
      name: string;
      createdAt: Date;
      metadata?: Record<string, any>; // Optional metadata as key-value pairs
    }
  
    /**
     * Example options object passed to a function in the module.
     */
    export interface CustomModuleOptions {
      verbose?: boolean; // Enable verbose logging
      retries?: number;  // Number of retry attempts
      timeout?: number;  // Request timeout in milliseconds
    }
  
    /**
     * Function that performs a specific action and returns a promise.
     * @param data - Data required for the action
     * @param options - Optional configuration for the action
     * @returns A promise that resolves to a CustomModuleResponse
     */
    export function performAction(
      data: Record<string, any>,
      options?: CustomModuleOptions
    ): Promise<CustomModuleResponse>;
  
    /**
     * Synchronous utility function provided by the module.
     * @param input - The input string to process
     * @returns A transformed string
     */
    export function transformInput(input: string): string;
  
    /**
     * Asynchronous function to fetch module settings.
     * @returns A promise that resolves to a settings object
     */
    export function fetchSettings(): Promise<Record<string, any>>;
  }
  