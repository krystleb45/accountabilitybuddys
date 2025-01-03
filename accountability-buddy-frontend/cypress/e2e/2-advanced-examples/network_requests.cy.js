/// <reference types="cypress" />

describe('Network Requests in Cypress', () => {
  beforeEach(() => {
    cy.visit('/network-requests-page'); // Adjust URL to your application's page
  });

  it('should make a GET request and verify the response', () => {
    cy.intercept('GET', '/api/data', { fixture: 'example.json' }).as('getData');
    cy.get('.fetch-data-button').click();
    cy.wait('@getData').its('response.statusCode').should('eq', 200);
    cy.get('.data-display').should('contain', 'testuser');
  });

  it('should make a POST request and check the request body', () => {
    cy.intercept('POST', '/api/submit').as('postSubmit');
    cy.get('.submit-button').click();
    cy.wait('@postSubmit').its('request.body').should('include', { name: 'Cypress' });
  });

  it('should handle a network error gracefully', () => {
    cy.intercept('GET', '/api/error', { statusCode: 500 }).as('getError');
    cy.get('.fetch-error-button').click();
    cy.wait('@getError');
    cy.get('.error-message').should('contain', 'Server error occurred');
  });

  it('should modify the response of a network request', () => {
    cy.intercept('GET', '/api/data', (req) => {
      req.reply((res) => {
        res.body.data = 'Modified Data';
      });
    }).as('getModifiedData');
    cy.get('.fetch-data-button').click();
    cy.wait('@getModifiedData');
    cy.get('.data-display').should('contain', 'Modified Data');
  });
});
