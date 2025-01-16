/// <reference types="cypress" />

describe('Analytics Page Functionality', () => {
  before(() => {
    cy.login(); // Custom command for user authentication
  });

  it('should display analytics data', () => {
    cy.visit('/analytics');
    cy.contains('Analytics Overview').should('be.visible');
  });

  // Add more tests as needed
});
