/// <reference types="cypress" />

describe('User Preferences Management', () => {
  before(() => {
    cy.login(); // Custom command for user login
  });

  beforeEach(() => {
    cy.visit('/profile/preferences');
  });

  it('should load the user preferences page', () => {
    cy.contains(/user preferences/i).should('be.visible');
  });

  it('should update a preference successfully', () => {
    cy.get('input[name="emailNotifications"]').check();
    cy.get('button[aria-label="Save Preferences"]').click();
    
    // Check for a success message
    cy.contains(/preferences updated successfully/i).should('be.visible');
  });

  it('should show an error message if preferences update fails', () => {
    // Simulate a server error (you may need to mock this in your app)
    cy.intercept('POST', '/api/preferences', { statusCode: 500, body: { error: 'Update failed' } });
    
    cy.get('button[aria-label="Save Preferences"]').click();
    cy.contains(/update failed/i).should('be.visible');
  });

  // Add more tests as needed for additional preference options
});
