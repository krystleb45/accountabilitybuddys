// ***********************************************************
// This file is processed and loaded automatically before your test files.
//
// It's a great place to put global configuration and behavior that modifies Cypress.
//
// You can change the location of this file or disable automatically serving support files
// with the 'supportFile' configuration option.
//
// Read more here: https://on.cypress.io/configuration
// ***********************************************************

// Import global commands
import './commands';
import './commands/custom-commands';

// Global setup for end-to-end tests
Cypress.on('window:before:load', (win) => {
  // Example: Mocking browser APIs or properties before the window loads
  cy.stub(win.console, 'log').callsFake((_msg) => {
    // Customize console log behavior if required
    // Uncomment to debug logs: console.log('Cypress intercepted:', msg);
  });
});

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (_err, _runnable) => {
  // Prevent failing tests on uncaught exceptions (use cautiously)
  // Example: Ignore specific known errors
  // if (err.message.includes('ResizeObserver loop limit exceeded')) {
  //   return false;
  // }
  return false;
});

// Set global timeouts for Cypress commands
Cypress.config('defaultCommandTimeout', 10000); // 10 seconds
Cypress.config('pageLoadTimeout', 30000); // 30 seconds

// Example: Define global aliases or reusable data
before(() => {
  // Setup reusable fixtures, mock data, or API intercepts
  cy.fixture('users.json').as('users'); // Load user data for use in tests
});
