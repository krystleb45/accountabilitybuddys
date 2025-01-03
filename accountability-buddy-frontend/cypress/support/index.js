// Import commands.js using ES2015 syntax:
import './commands';

// Alternatively you can use CommonJS syntax:
// require('./commands');

// Custom global configuration and behavior for Cypress
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing the test on uncaught exceptions
  // Customize this logic based on your error-handling requirements
  return false;
});

// Set default timeouts for all Cypress commands
Cypress.config('defaultCommandTimeout', 10000);
Cypress.config('pageLoadTimeout', 20000);

// Custom event listeners or setup logic can be added here
