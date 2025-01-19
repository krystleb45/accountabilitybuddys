// ***********************************************************
// This example support/component.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// Read more here: https://on.cypress.io/configuration
// ***********************************************************

// Import the `mount` function from Cypress React library
import { mount } from 'cypress/react';

// Extend Cypress namespace to include the `mount` command
declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Mounts a React component for testing.
       * @param component - The React component to mount.
       * @param options - Options for customizing the mount behavior.
       */
      mount(component: React.ReactNode, options?: any): Chainable<Subject>;
    }
  }
}

// Register the `mount` command globally
Cypress.Commands.add('mount', mount);

// Example usage:
// cy.mount(<MyComponent />);
