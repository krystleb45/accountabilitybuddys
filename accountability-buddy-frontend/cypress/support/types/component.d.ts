/// <reference types="cypress" />
/// <reference types="cypress/react18" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Mount a React component for testing.
     * @param component - The React component to mount.
     * @param options - Additional options for mounting the component.
     */
    mount(
      component: React.ReactNode,
      options?: MountOptions
    ): Chainable<Subject>;

    /**
     * Mount a component with a context provider.
     * @param component - The React component to mount.
     * @param context - The context provider to wrap the component with.
     */
    mountWithContext(
      component: React.ReactNode,
      context: React.ReactElement
    ): Chainable<Subject>;

    /**
     * Simulate a user interaction within a mounted component.
     * @param selector - The CSS selector for the element to interact with.
     * @param interaction - The interaction to perform (e.g., 'click', 'type').
     * @param value - The value to provide for the interaction (optional, e.g., for typing).
     */
    simulateInteraction(
      selector: string,
      interaction: 'click' | 'type' | 'hover',
      value?: string
    ): Chainable<Subject>;

    /**
     * Mock a component prop and verify its behavior.
     * @param component - The React component to test.
     * @param prop - The prop to mock.
     * @param value - The mock value for the prop.
     */
    mockComponentProp(
      component: React.ReactNode,
      prop: string,
      value: any
    ): Chainable<Subject>;

    /**
     * Verify the rendering of a specific component.
     * @param componentName - The name of the component.
     * @param selector - The CSS selector for the component.
     */
    verifyComponentRendering(
      componentName: string,
      selector: string
    ): Chainable<Subject>;

    /**
     * Test the lifecycle hooks of a component.
     * @param component - The React component to test.
     * @param hook - The lifecycle hook to verify.
     * @param callback - The function to call within the lifecycle.
     */
    testComponentLifecycle(
      component: React.ReactNode,
      hook: 'useEffect' | 'useState' | 'useContext',
      callback: () => void
    ): Chainable<Subject>;
  }

  /**
   * Additional options for mounting a component.
   */
  interface MountOptions {
    /**
     * Props to pass to the component.
     */
    props?: Record<string, any>;

    /**
     * Whether to wrap the component with a router for testing navigation.
     */
    withRouter?: boolean;

    /**
     * Whether to wrap the component with a context provider for testing state.
     */
    withContext?: boolean;

    /**
     * Initial router path (if `withRouter` is true).
     */
    initialPath?: string;
  }
}
