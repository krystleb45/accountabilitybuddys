/// <reference types="cypress" />

describe('Querying Elements in Cypress', () => {
  beforeEach(() => {
    cy.visit('/querying-page'); // Adjust URL to your application's page
  });

  it('should get elements by class name', () => {
    cy.get('.query-button').should('contain', 'Button Text');
  });

  it('should find elements within a specific section', () => {
    cy.get('.query-container').find('.query-item').should('have.length', 3);
  });

  it('should check if an element contains specific text', () => {
    cy.contains('Specific Text').should('be.visible');
  });

  it('should use cy.within() to limit the scope of querying', () => {
    cy.get('.form-section').within(() => {
      cy.get('input[name="username"]').type('testuser');
      cy.get('input[name="password"]').type('password123');
    });
  });

  it('should use cy.root() to access the root element of the DOM', () => {
    cy.root().should('match', 'html');
  });
});
