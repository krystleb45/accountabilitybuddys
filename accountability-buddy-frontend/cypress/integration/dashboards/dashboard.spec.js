/// <reference types="cypress" />

describe('Dashboard Functionality', () => {
  before(() => {
    cy.login(); // Custom command for user login
  });

  beforeEach(() => {
    cy.visit('/dashboard');
  });

  it('should load the dashboard and display a welcome message', () => {
    cy.contains(/welcome to your dashboard/i).should('be.visible');
  });

  it('should display the user\'s name if logged in', () => {
    cy.get('.user-name').should('be.visible').and('not.be.empty'); // Adjust the selector as needed
  });

  it('should show recent activities', () => {
    cy.contains(/recent activities/i).should('be.visible');
    cy.get('.activity-item').should('have.length.greaterThan', 0); // Adjust based on your app's structure
  });

  it('should load notifications if available', () => {
    cy.contains(/notifications/i).should('be.visible');
    cy.get('.notification-item').should('exist'); // Adjust the selector as needed
  });

  // Add more tests as necessary for dashboard features
});
