/// <reference types="cypress" />

describe('Aliasing in Cypress', () => {
  beforeEach(() => {
    cy.visit('/aliasing-page'); // Adjust URL to your application's page
  });

  it('should alias a DOM element and reuse it', () => {
    cy.get('.alias-element').as('myElement');
    cy.get('@myElement').should('be.visible');
    cy.get('@myElement').click();
    cy.get('@myElement').should('have.class', 'clicked');
  });

  it('should alias an API route and wait for it', () => {
    cy.intercept('GET', '/api/data').as('getData');
    cy.get('.fetch-data-button').click();
    cy.wait('@getData').its('response.statusCode').should('eq', 200);
    cy.get('.data-display').should('contain', 'Data Loaded');
  });
});
