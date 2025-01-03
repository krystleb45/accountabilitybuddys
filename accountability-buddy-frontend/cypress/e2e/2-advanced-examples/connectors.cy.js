/// <reference types="cypress" />

describe('Connectors in Cypress', () => {
  beforeEach(() => {
    cy.visit('/connectors-page'); // Adjust URL to your application's page
  });

  it('should use .each() to iterate over elements', () => {
    cy.get('.item-list .item').each(($el, index) => {
      cy.wrap($el).should('have.class', 'item');
      cy.log(`Item ${index + 1}: ${$el.text()}`);
    });
  });

  it('should use .spread() to work with an array', () => {
    cy.wrap([1, 2, 3]).spread((a, b, c) => {
      expect(a).to.equal(1);
      expect(b).to.equal(2);
      expect(c).to.equal(3);
    });
  });

  it('should use .then() to chain assertions', () => {
    cy.get('.user-info').then(($info) => {
      const name = $info.find('.name').text();
      const age = $info.find('.age').text();
      expect(name).to.equal('John Doe');
      expect(age).to.equal('30');
    });
  });
});
