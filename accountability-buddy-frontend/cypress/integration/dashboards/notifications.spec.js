/// <reference types="cypress" />

describe('Dashboard Notifications', () => {
  before(() => {
    cy.login(); // Custom login command for authentication
  });

  beforeEach(() => {
    cy.visit('/dashboard/notifications');
  });

  it('should display the notifications page header', () => {
    cy.contains(/notifications/i).should('be.visible');
  });

  it('should show a list of notifications', () => {
    cy.get('.notification-item').should('have.length.greaterThan', 0); // Adjust selector based on your app's structure
  });

  it('should mark a notification as read when clicked', () => {
    cy.get('.notification-item').first().click();
    cy.get('.notification-item.read').should('exist'); // Adjust based on your app's implementation
  });

  it('should load more notifications when "Load More" is clicked', () => {
    cy.contains(/load more/i).click();
    cy.get('.notification-item').should('have.length.greaterThan', 5); // Adjust number as needed
  });

  // Add more tests as necessary for different notification scenarios
});
