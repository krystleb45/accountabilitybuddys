/// <reference types="cypress" />

describe('Navigation Methods', () => {
  beforeEach(() => {
    cy.visit('/navigation-page'); // Adjust URL to your application's page
  });

  it('should navigate to a different page using a link', () => {
    cy.get('.navigate-link').click();
    cy.url().should('include', '/new-page');
    cy.get('.new-page-header').should('be.visible');
  });

  it('should go back to the previous page', () => {
    cy.get('.navigate-link').click();
    cy.go('back');
    cy.url().should('include', '/navigation-page');
  });

  it('should go forward to the next page', () => {
    cy.get('.navigate-link').click();
    cy.go('back');
    cy.go('forward');
    cy.url().should('include', '/new-page');
  });

  it('should reload the current page', () => {
    cy.reload();
    cy.get('.navigation-header').should('contain', 'Navigation Page');
  });
});
