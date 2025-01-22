/// <reference types="cypress" />

// Custom Commands for Military Support Section

/**
 * Navigate to the Military Support page.
 */
Cypress.Commands.add('navigateToMilitarySupport', () => {
  cy.visit('/military-support');
  cy.contains(/military support/i).should('be.visible');
});

/**
 * Send a message in the Military Support chatroom.
 * @param message - The message to send.
 */
Cypress.Commands.add('sendMessageInChatroom', (message: string) => {
  cy.get('textarea[aria-label="Chat Input"]').type(message);
  cy.get('button[aria-label="Send Message"]').click();
  cy.contains('.chat-message', message).should('be.visible');
});

/**
 * Verify that a disclaimer is displayed on the Military Support page.
 * @param text - The expected disclaimer text.
 */
Cypress.Commands.add('verifyDisclaimer', (text: string) => {
  cy.get('.disclaimer').should('be.visible').contains(text);
});

/**
 * Clear the chatroom history.
 */
Cypress.Commands.add('clearChatHistory', () => {
  cy.get('button[aria-label="Clear Chat"]').click();
  cy.contains(/are you sure you want to clear the chat/i).should('be.visible');
  cy.get('button[aria-label="Confirm Clear"]').click();
  cy.get('.chat-message').should('not.exist');
});

/**
 * Mock loading existing messages in the chatroom.
 * @param messages - An array of chat messages to mock.
 */
Cypress.Commands.add(
  'mockChatMessages',
  (messages: Array<{ id: number; sender: string; message: string }>) => {
    cy.intercept('GET', '/api/military-support/messages', {
      statusCode: 200,
      body: messages,
    }).as('getMessages');
    cy.reload();
    cy.wait('@getMessages');
    messages.forEach((msg) => {
      cy.contains('.chat-message', msg.message).should('be.visible');
    });
  }
);

/**
 * Mock and validate external resource links on the Military Support page.
 * @param resources - An array of resources with names and URLs.
 */
Cypress.Commands.add(
  'verifyResourceLinks',
  (resources: Array<{ name: string; url: string }>) => {
    resources.forEach(({ name, url }) => {
      cy.contains('a', name)
        .should('have.attr', 'href', url)
        .and('have.attr', 'target', '_blank');
    });
  }
);

/**
 * Simulate and verify access control for the Military Support section.
 * @param role - The user role (e.g., 'military', 'non-military').
 */
Cypress.Commands.add('mockAccessControl', (role: string) => {
  cy.intercept('GET', '/api/user/role', {
    statusCode: role === 'military' ? 200 : 403,
    body:
      role === 'military' ? { role: 'military' } : { error: 'Access denied' },
  }).as('getUserRole');
  cy.reload();
  cy.wait('@getUserRole');

  if (role === 'military') {
    cy.contains(/welcome military member/i).should('be.visible');
  } else {
    cy.contains(/access denied/i).should('be.visible');
  }
});

/**
 * Notify the user of new messages.
 * @param hasNewMessages - Whether new messages are available.
 */
Cypress.Commands.add(
  'mockNewMessageNotification',
  (hasNewMessages: boolean) => {
    cy.intercept('GET', '/api/military-support/new-messages', {
      statusCode: 200,
      body: { hasNewMessages },
    }).as('checkNewMessages');

    cy.wait('@checkNewMessages');

    if (hasNewMessages) {
      cy.get('.new-message-notification')
        .should('be.visible')
        .and('contain.text', 'You have new messages');
    } else {
      cy.get('.new-message-notification').should('not.exist');
    }
  }
);
