/// <reference types="cypress" />

describe('User Profile Page', () => {
  before(() => {
    cy.login(); // Custom command for user login
  });

  beforeEach(() => {
    cy.visit('/profile');
  });

  it('should display the user profile information', () => {
    cy.contains(/profile information/i).should('be.visible');
  });

  it('should update the user\'s profile successfully', () => {
    cy.get('input[name="name"]').clear().type('Updated Name');
    cy.get('input[name="email"]').clear().type('updated@example.com');
    cy.get('button[aria-label="Save Changes"]').click();

    // Check for a success message
    cy.contains(/profile updated successfully/i).should('be.visible');
  });

  it('should show an error message if the update fails', () => {
    // Simulate a server error (you may need to mock this in your app)
    cy.intercept('PUT', '/api/profile', { statusCode: 500, body: { error: 'Update failed' } });

    cy.get('button[aria-label="Save Changes"]').click();
    cy.contains(/update failed/i).should('be.visible');
  });

  // Add more tests as necessary, e.g., for profile picture upload
});
