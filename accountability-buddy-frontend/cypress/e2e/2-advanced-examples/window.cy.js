/// <reference types="cypress" />

describe('Window Object Methods in Cypress', () => {
  beforeEach(() => {
    cy.visit('/window-page'); // Adjust URL to your application's page
  });

  it('should get the window object and assert properties', () => {
    cy.window().should('have.property', 'location');
    cy.window().its('location.href').should('include', '/window-page');
  });

  it('should get the document object and assert properties', () => {
    cy.document().should('have.property', 'contentType').and('eq', 'text/html');
  });

  it('should get the title of the page using the document object', () => {
    cy.title().should('include', 'Window Page');
  });

  it('should use cy.reload() to reload the page', () => {
    cy.reload();
    cy.url().should('include', '/window-page');
  });

  it('should use cy.go() to navigate the browser history', () => {
    cy.visit('/another-page');
    cy.go('back');
    cy.url().should('include', '/window-page');
    cy.go('forward');
    cy.url().should('include', '/another-page');
  });
});
