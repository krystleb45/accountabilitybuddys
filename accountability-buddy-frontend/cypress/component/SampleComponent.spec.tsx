/// <reference types="cypress" />
import React from 'react';
import SampleComponent from '../../src/components/SampleCompnent/SampleComponent'; // Adjust the import path as necessary

describe('Sample Component Test', () => {
  it('renders the component correctly', () => {
    // Mount the SampleComponent
    cy.mount(<SampleComponent />);

    // Verify that an element with the class 'sample-class' exists
    cy.get('.sample-class').should('exist');
  });
});
