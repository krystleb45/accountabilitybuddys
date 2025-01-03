/// <reference types="cypress" />

describe('Friend Connection Features', () => {
  before(() => {
    cy.login(); // Custom command for authentication
  });

  beforeEach(() => {
    cy.visit('/friends');
  });

  it('should display friend connection options', () => {
    cy.contains(/connect with friends/i).should('be.visible');
  });

  it('should send a friend request', () => {
    cy.get('button[aria-label="Add Friend"]').first().click();
    cy.contains(/friend request sent/i).should('be.visible'); // Adjust the message as necessary
  });

  it('should display received friend requests', () => {
    cy.contains(/received friend requests/i).should('be.visible');
    cy.get('.friend-request-item').should('have.length.greaterThan', 0); // Adjust selector as needed
  });

  it('should accept a friend request', () => {
    cy.get('button[aria-label="Accept Friend Request"]').first().click();
    cy.contains(/friend request accepted/i).should('be.visible'); // Adjust the message as necessary
  });

  // Add more tests for features like rejecting requests or viewing a friend list
});
