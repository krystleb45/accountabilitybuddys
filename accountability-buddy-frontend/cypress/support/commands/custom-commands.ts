// Additional Custom Commands for Cypress

// Command to simulate API request failure
Cypress.Commands.add("simulateApiFailure", (endpoint: string) => {
  cy.intercept(endpoint, { forceNetworkError: true }).as("apiFailure");
});

// Overwrite the default clearLocalStorage command
Cypress.Commands.overwrite("clearLocalStorage", () => {
  window.localStorage.clear();
});

// Command to wait for a specific element to be visible
Cypress.Commands.add("waitForElement", (selector: string, timeout = 5000) => {
  cy.get(selector, { timeout }).should("be.visible");
});

// Command to assert that an element contains specific text
Cypress.Commands.add("assertText", (selector: string, expectedText: string) => {
  cy.get(selector).should("have.text", expectedText);
});

// Command to log in a user
Cypress.Commands.add("loginAs", (email: string, password: string) => {
  cy.visit("/login");
  cy.get("#email").type(email);
  cy.get("#password").type(password);
  cy.get("#login-button").click();
});
