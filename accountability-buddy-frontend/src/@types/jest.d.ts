/**
 * TypeScript type definitions for extending Jest functionality.
 * This file is intended to augment Jest's built-in types and add custom matchers.
 */

declare namespace jest {
  /**
   * Extend Jest matchers for custom assertions.
   */
  interface Matchers<R> {
    /**
     * Custom matcher to assert that an element contains a specific text.
     * @param text - The expected text content.
     */
    toContainText(text: string): R;

    /**
     * Custom matcher to assert that a function throws a specific error.
     * @param error - The expected error or error message.
     */
    toThrowErrorMatching(error: string | RegExp): R;
  }
}

export {};
