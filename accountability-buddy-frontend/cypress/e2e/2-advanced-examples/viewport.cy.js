/// <reference types="cypress" />

describe('Viewport Management in Cypress', () => {
  beforeEach(() => {
    cy.visit('/viewport-page'); // Adjust URL to your application's page
  });

  it('should set the viewport size to 320x480', () => {
    cy.viewport(320, 480);
    cy.get('.mobile-view').should('be.visible');
  });

  it('should set the viewport size to 1024x768 for a tablet view', () => {
    cy.viewport(1024, 768);
    cy.get('.tablet-view').should('be.visible');
  });

  it('should set the viewport to a predefined size: "macbook-15"', () => {
    cy.viewport('macbook-15');
    cy.get('.desktop-view').should('be.visible');
  });

  it('should adjust the viewport orientation to portrait', () => {
    cy.viewport(375, 812, { orientation: 'portrait' });
    cy.get('.portrait-view').should('be.visible');
  });

  it('should adjust the viewport orientation to landscape', () => {
    cy.viewport(812, 375, { orientation: 'landscape' });
    cy.get('.landscape-view').should('be.visible');
  });
});
