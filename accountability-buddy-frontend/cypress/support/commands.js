// cypress/support/commands.js

// Custom command to log in the user
Cypress.Commands.add('login', () => {
  // Check if the API URL environment variable is set
  const apiUrl = Cypress.env('API_URL');
  if (!apiUrl) {
    throw new Error('API_URL environment variable is not set in Cypress configuration.');
  }

  // Example login logic using a POST request to your API
  cy.request('POST', `${apiUrl}/auth/login`, {
    username: 'testuser',
    password: 'password123',
  }).then((resp) => {
    if (resp.status !== 200) {
      throw new Error('Failed to log in: Invalid response status');
    }

    // Set authentication cookies or tokens
    cy.setCookie('authToken', resp.body.token);
  });
});
