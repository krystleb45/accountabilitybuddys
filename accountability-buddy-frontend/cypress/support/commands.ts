/// <reference types="cypress" />

// ***********************************************
// Custom Commands
// ***********************************************

/**
 * Custom command to log in a user.
 * @param email - The user's email address.
 * @param password - The user's password.
 */
Cypress.Commands.add("login", (email: string, password: string) => {
    cy.visit("/login");
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.contains(/dashboard/i).should("be.visible"); // Verify login success
  });
  
  /**
   * Custom command to drag an element.
   * @param subject - The CSS selector for the element to drag.
   * @param options - Optional options for the drag action.
   */
  Cypress.Commands.add("drag", { prevSubject: "element" }, (subject, options) => {
    cy.wrap(subject)
      .trigger("mousedown", { which: 1 })
      .trigger("mousemove", { clientX: options?.x || 100, clientY: options?.y || 100 })
      .trigger("mouseup");
  });
  
  /**
   * Custom command to dismiss a modal or alert.
   * @param subject - The CSS selector for the element to dismiss.
   */
  Cypress.Commands.add("dismiss", { prevSubject: "optional" }, (subject) => {
    if (subject) {
      cy.wrap(subject).click();
    } else {
      cy.get('button[aria-label="Close"]').click(); // Default dismiss button
    }
  });
  
  /**
   * Custom command to simulate API failure for a specific endpoint.
   * @param endpoint - The API endpoint to intercept.
   */
  Cypress.Commands.add("simulateApiFailure", (endpoint: string) => {
    cy.intercept(endpoint, { statusCode: 500, body: { error: "Internal Server Error" } }).as("apiFailure");
  });
  
  /**
   * Custom command to verify the presence of a toast message.
   * @param message - The message text to verify.
   */
  Cypress.Commands.add("verifyToastMessage", (message: string) => {
    cy.get(".toast-message").should("be.visible").and("contain.text", message);
  });
  
  /**
   * Custom command to reset the application's state.
   */
  Cypress.Commands.add("resetAppState", () => {
    cy.request("POST", "/api/reset"); // Adjust the endpoint as per your backend setup
    cy.reload();
  });
  
  /**
   * Custom command to wait for an element to be visible.
   * @param selector - The element's CSS selector.
   * @param timeout - Maximum wait time (default: 5000ms).
   */
  Cypress.Commands.add("waitForElement", (selector: string, timeout = 5000) => {
    cy.get(selector, { timeout }).should("be.visible");
  });
  
  /**
   * Custom command to handle file uploads.
   * @param selector - The CSS selector for the file input element.
   * @param fileName - The name of the file to upload (located in `cypress/fixtures`).
   */
  Cypress.Commands.add("uploadFile", (selector: string, fileName: string) => {
    cy.get(selector).attachFile(fileName);
  });
  
  /**
   * Custom command to verify the presence of a confirmation dialog.
   * @param message - The expected confirmation message.
   */
  Cypress.Commands.add("verifyConfirmationDialog", (message: string) => {
    cy.contains(".confirmation-dialog", message).should("be.visible");
  });
  
  /**
   * Overwrite the default `visit` command to include logging.
   * @param originalFn - The original `visit` function.
   * @param url - The URL to visit.
   * @param options - Additional options for visiting the URL.
   */
  Cypress.Commands.overwrite("visit", (originalFn, url, options) => {
    cy.log(`Visiting URL: ${url}`);
    return originalFn(url, options);
  });
  