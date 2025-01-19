import React from 'react';
import Navbar from '../../src/components/Navbar/Navbar';

describe('<Navbar />', () => {
  it('renders the Navbar component', () => {
    cy.mount(<Navbar />);

    // Verify the Navbar contains key elements
    cy.get('nav').should('be.visible');
    cy.contains('Home').should('exist');
    cy.contains('About').should('exist');
  });
});
