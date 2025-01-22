/// <reference types="cypress" />

// Custom Commands for Payments Section

/**
 * Navigate to the Payments page.
 */
Cypress.Commands.add('navigateToPayments', () => {
  cy.visit('/payments');
  cy.contains(/payment management/i).should('be.visible');
});

/**
 * Simulate a successful payment.
 * @param amount - The payment amount.
 * @param method - The payment method (e.g., 'credit card', 'PayPal').
 */
Cypress.Commands.add(
  'simulateSuccessfulPayment',
  (amount: number, method: string) => {
    cy.intercept('POST', '/api/payments/submit', {
      statusCode: 200,
      body: { message: 'Payment successful', amount, method },
    }).as('successfulPayment');

    // Fill out payment form
    cy.get('input[name="amount"]').clear().type(amount.toString());
    cy.get(`select[name="paymentMethod"]`).select(method);
    cy.get('button[aria-label="Submit Payment"]').click();

    // Wait for the API response and verify success
    cy.wait('@successfulPayment');
    cy.contains(/payment successful/i).should('be.visible');
  }
);

/**
 * Simulate a failed payment.
 * @param errorMessage - The error message to display.
 */
Cypress.Commands.add('simulateFailedPayment', (errorMessage: string) => {
  cy.intercept('POST', '/api/payments/submit', {
    statusCode: 500,
    body: { error: errorMessage },
  }).as('failedPayment');

  // Attempt to submit payment
  cy.get('button[aria-label="Submit Payment"]').click();

  // Wait for the API response and verify error
  cy.wait('@failedPayment');
  cy.contains(errorMessage).should('be.visible');
});

/**
 * Verify the payment history is displayed correctly.
 * @param payments - An array of payment history objects.
 */
Cypress.Commands.add(
  'verifyPaymentHistory',
  (
    payments: Array<{
      id: number;
      date: string;
      amount: number;
      method: string;
    }>
  ) => {
    cy.intercept('GET', '/api/payments/history', {
      statusCode: 200,
      body: payments,
    }).as('getPaymentHistory');

    // Reload and verify the payment history
    cy.reload();
    cy.wait('@getPaymentHistory');

    payments.forEach(({ date, amount, method }) => {
      cy.contains('.payment-history-item', date).should('be.visible');
      cy.contains('.payment-history-item', `$${amount.toFixed(2)}`).should(
        'be.visible'
      );
      cy.contains('.payment-history-item', method).should('be.visible');
    });
  }
);

/**
 * Simulate payment method validation errors.
 * @param field - The field to validate (e.g., 'amount', 'paymentMethod').
 * @param errorMessage - The validation error message.
 */
Cypress.Commands.add(
  'simulatePaymentValidationError',
  (field: string, errorMessage: string) => {
    cy.get(`input[name="${field}"], select[name="${field}"]`).focus().blur();
    cy.contains(errorMessage).should('be.visible');
  }
);

/**
 * Mock and validate available payment methods.
 * @param methods - An array of available payment methods.
 */
Cypress.Commands.add('mockPaymentMethods', (methods: Array<string>) => {
  cy.intercept('GET', '/api/payments/methods', {
    statusCode: 200,
    body: methods,
  }).as('getPaymentMethods');

  // Reload and verify the payment methods
  cy.reload();
  cy.wait('@getPaymentMethods');

  methods.forEach((method) => {
    cy.get('select[name="paymentMethod"]').should('contain', method);
  });
});

/**
 * Simulate a refund process.
 * @param refundId - The ID of the payment to refund.
 */
Cypress.Commands.add('simulateRefund', (refundId: number) => {
  cy.intercept('POST', `/api/payments/refund/${refundId}`, {
    statusCode: 200,
    body: { message: 'Refund successful', refundId },
  }).as('refundPayment');

  // Click the refund button for the specific payment
  cy.get(`button[aria-label="Refund Payment ${refundId}"]`).click();

  // Verify the refund success message
  cy.wait('@refundPayment');
  cy.contains(/refund successful/i).should('be.visible');
});
