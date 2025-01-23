/**
 * TypeScript type definitions for the `jest-axe` library.
 * These definitions enhance accessibility testing in Jest by providing
 * type safety and IntelliSense for Axe-related functions and results.
 */

declare module 'jest-axe' {
  /**
   * Represents the result of an Axe accessibility test.
   */
  interface AxeResults {
    violations: Array<{
      id: string;
      impact: 'minor' | 'moderate' | 'serious' | 'critical' | null; // Restrict impact levels
      tags: string[];
      description: string;
      help: string;
      helpUrl: string;
      nodes: Array<{
        html: string;
        target: string[];
        failureSummary: string;
        impact: 'minor' | 'moderate' | 'serious' | 'critical' | null;
        any: Array<{
          message: string;
          impact: 'minor' | 'moderate' | 'serious' | 'critical' | null;
        }>;
      }>;
    }>;
  }

  /**
   * The main `axe` function to run accessibility tests.
   * @param element - The DOM element or document to test.
   * @returns A Promise resolving to AxeResults.
   */
  function axe(element?: Element | Document): Promise<AxeResults>;

  /**
   * The `jestAxe` namespace, providing custom Jest matchers for Axe results.
   */
  namespace jestAxe {
    /**
     * Custom Jest matcher to assert that there are no accessibility violations.
     * @param results - The AxeResults object from an `axe` test.
     * @returns Jest matcher result indicating pass/fail.
     */

    function toHaveNoViolations(results: AxeResults): jest.CustomMatcherResult;
  }

  export { axe, jestAxe };
}
