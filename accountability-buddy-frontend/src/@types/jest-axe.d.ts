// src/types/jest-axe.d.ts

declare module "jest-axe" {
    interface AxeResults {
      violations: Array<{
        id: string;
        impact: string[];
        tags: string[];
        description: string;
        help: string;
        helpUrl: string;
        nodes: Array<{
          html: string;
          target: string[];
          failureSummary: string;
          impact: string[];
          any: Array<{ message: string; impact: string[] }>;
        }>;
      }>;
    }
  
    function axe(element?: Element | Document): Promise<AxeResults>;
  
    namespace jestAxe {
      function toHaveNoViolations(results: AxeResults): jest.CustomMatcher;
    }
  
    export { axe, jestAxe };
  }
  