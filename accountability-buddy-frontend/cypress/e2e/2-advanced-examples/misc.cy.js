/// <reference types="cypress" />

describe('Miscellaneous Cypress Tests', () => {
  beforeEach(() => {
    cy.visit('/misc-page'); // Adjust URL to your application's page
  });

  it('should handle unhandled exceptions gracefully', () => {
    Cypress.on('uncaught:exception', (err, runnable) => {
      // Prevent Cypress from failing the test
      return false;
    });
    cy.get('.trigger-exception').click();
  });

  it('should use Cypress.screenshot to capture a screenshot', () => {
    cy.screenshot('misc-page-screenshot');
    cy.get('.screenshot-message').should('be.visible');
  });

  it('should use cy.wrap to work with a JavaScript object', () => {
    const obj = { name: 'Cypress', type: 'Test' };
    cy.wrap(obj).should('have.property', 'name', 'Cypress');
  });

  it('should assert on the contents of an iframe', () => {
    cy.get('iframe').then(($iframe) => {
      const $body = $iframe.contents().find('body');
      cy.wrap($body).find('.iframe-content').should('contain', 'Iframe Loaded');
    });
  });
});
