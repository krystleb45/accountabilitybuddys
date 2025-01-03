// ***********************************************************
// This support/component.js file is processed and
// loaded automatically before your test files.
//
// It's a great place to configure global settings and
// behaviors that modify Cypress, especially for component testing.
//
// You can change the location of this file or disable
// automatic serving of support files with the
// 'supportFile' configuration option.
//
// Read more about configuration here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './custom-commands.js'; // Import your custom commands

// Import mount from Cypress for React component testing
import { mount } from 'cypress/react18'; // Adjust to your React version as necessary

// Extend Cypress with the mount command for testing components
Cypress.Commands.add('mount', (component, options) => {
  return mount(component, options); // Allow passing options for customization
});

// Example usage of the custom mount command:
// cy.mount(<MyComponent />);

// You can also add global configuration or utility functions here
// For example, setting up a global state or theme for your components
