// This file is processed and loaded automatically before your test files.
// It's a great place to put global configuration and behavior that modifies Cypress.

// Import custom commands
import './commands';
import './custom-commands';

// Global setup for end-to-end tests
Cypress.on('window:before:load', (win) => {
  // Stub out any necessary functions or properties before the window loads
  // For example, mocking browser APIs if needed
  cy.stub(win.console, 'log').callsFake((msg) => {
    // Customize console log behavior if required
  });
});

// Setting up default behavior for uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  return false;
});

// Additional global configurations can be added as needed
