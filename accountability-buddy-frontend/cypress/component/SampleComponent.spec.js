/// <reference types="cypress" />

describe('Sample Component Test', () => {
    it('renders the component correctly', () => {
      // Example test for a sample component
      cy.mount(<SampleComponent />);
      cy.get('.sample-class').should('exist');
    });
  });
  