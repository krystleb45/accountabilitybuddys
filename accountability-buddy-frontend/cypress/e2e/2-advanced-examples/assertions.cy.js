/// <reference types="cypress" />

describe('Assertions in Cypress', () => {
  beforeEach(() => {
    cy.visit('/assertions-page'); // Adjust URL to your application's page
  });

  it('should assert on the text content of an element', () => {
    cy.get('.assertion-text').should('have.text', 'This is the expected text');
  });

  it('should assert that an element is visible', () => {
    cy.get('.visible-element').should('be.visible');
  });

  it('should assert that an element is not visible', () => {
    cy.get('.hidden-element').should('not.be.visible');
  });

  it('should assert the value of an input field', () => {
    cy.get('input[name="username"]').type('testuser');
    cy.get('input[name="username"]').should('have.value', 'testuser');
  });

  it('should assert that an element has a specific class', () => {
    cy.get('.button').should('have.class', 'primary');
  });

  it('should use multiple assertions in one test', () => {
    cy.get('.multi-assert').should(($element) => {
      expect($element).to.have.class('active');
      expect($element).to.have.attr('aria-label', 'Active Element');
      expect($element.text()).to.equal('Active Text');
    });
  });
});
