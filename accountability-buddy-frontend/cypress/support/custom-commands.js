// Additional Custom Commands for Cypress

// Command to simulate API request failure
Cypress.Commands.add('simulateApiFailure', (endpoint) => {
  cy.intercept(endpoint, { forceNetworkError: true }).as('apiFailure');
});

Cypress.Commands.overwrite('clearLocalStorage', () => {
  window.localStorage.clear();
});


// Command to wait for a specific element to be visible
Cypress.Commands.add('waitForElement', (selector, timeout = 5000) => {
  cy.get(selector, { timeout }).should('be.visible');
});

// Command to assert that an element contains specific text
Cypress.Commands.add('assertText', (selector, expectedText) => {
  cy.get(selector).should('have.text', expectedText);
});

// You can add more utility commands as needed
