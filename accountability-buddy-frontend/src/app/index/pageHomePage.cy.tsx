import React from 'react';
import HomePage from './page';

describe('<HomePage />', () => {
  it('renders without crashing', () => {
    // Ensure the HomePage component mounts successfully
    cy.mount(<HomePage />);
  });

  it('displays the welcome message', () => {
    cy.mount(<HomePage />);
    cy.contains('Welcome').should('exist');
  });

  it('displays navigation links', () => {
    cy.mount(<HomePage />);
    cy.get('a').should('have.length.at.least', 1);
  });
});
