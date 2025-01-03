/// <reference types="cypress" />

describe('DOM Traversal Methods', () => {
  beforeEach(() => {
    cy.visit('/traversal-page'); // Adjust URL to your application's page
  });

  it('should find the first element in a list', () => {
    cy.get('.item-list').children().first().should('have.class', 'first-item');
  });

  it('should find the last element in a list', () => {
    cy.get('.item-list').children().last().should('have.class', 'last-item');
  });

  it('should get a specific element by index', () => {
    cy.get('.item-list').children().eq(2).should('contain', 'Item 3');
  });

  it('should find the parent of an element', () => {
    cy.get('.child-element').parent().should('have.class', 'parent-element');
  });

  it('should find the next sibling element', () => {
    cy.get('.current-element').next().should('have.class', 'next-element');
  });

  it('should find the previous sibling element', () => {
    cy.get('.current-element').prev().should('have.class', 'previous-element');
  });

  it('should find all sibling elements', () => {
    cy.get('.sibling-element').siblings().should('have.length.greaterThan', 1);
  });
});
