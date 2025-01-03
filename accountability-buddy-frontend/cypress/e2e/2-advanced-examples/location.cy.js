/// <reference types="cypress" />

describe('Location Methods in Cypress', () => {
  beforeEach(() => {
    cy.visit('/location-page'); // Adjust URL to your application's page
  });

  it('should get the current URL', () => {
    cy.url().should('include', '/location-page');
  });

  it('should get and assert the window location properties', () => {
    cy.location().should((loc) => {
      expect(loc.pathname).to.eq('/location-page');
      expect(loc.host).to.eq('localhost:8080'); // Adjust as needed for your environment
      expect(loc.protocol).to.eq('http:');
    });
  });

  it('should reload the page and verify the location', () => {
    cy.reload();
    cy.location('pathname').should('eq', '/location-page');
  });

  it('should navigate to a different page and assert the location', () => {
    cy.get('.navigate-button').click();
    cy.location('pathname').should('include', '/new-location');
  });
});
