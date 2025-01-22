/// <reference types="cypress" />
/// <reference types="cypress-file-upload" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Simulate an API request failure.
     * @param endpoint - The API endpoint to intercept.
     */
    simulateApiFailure(endpoint: string): Chainable<Subject>;

    /**
     * Overwrite local storage clearing functionality.
     */
    clearLocalStorage(): Chainable<Subject>;

    /**
     * Wait for a specific element to be visible.
     * @param selector - The element's CSS selector.
     * @param timeout - Maximum time to wait for the element (default: 5000 ms).
     */
    waitForElement(selector: string, timeout?: number): Chainable<Subject>;

    /**
     * Assert that an element contains specific text.
     * @param selector - The element's CSS selector.
     * @param expectedText - The text to assert.
     */
    assertText(selector: string, expectedText: string): Chainable<Subject>;

    /**
     * Log in a user with email and password.
     * @param email - The user's email address.
     * @param password - The user's password.
     */
    loginAs(email: string, password: string): Chainable<Subject>;

    /**
     * Log in a user using default login logic.
     * @param email - The user's email address.
     * @param password - The user's password.
     */
    login(email: string, password: string): Chainable<Subject>;

    /**
     * Drag an element.
     * @param options - Dragging options (x, y coordinates).
     */
    drag(options?: { x?: number; y?: number }): Chainable<Subject>;

    /**
     * Dismiss a modal or alert.
     * @param subject - The element to dismiss.
     */
    dismiss(subject?: string): Chainable<Subject>;

    /**
     * Verify a toast message is displayed.
     * @param message - The message text.
     */
    verifyToastMessage(message: string): Chainable<Subject>;

    /**
     * Reset the application's state.
     */
    resetAppState(): Chainable<Subject>;

    /**
     * Handle file uploads.
     * @param selector - The file input element selector.
     * @param fileName - The name of the file to upload.
     */
    uploadFile(selector: string, fileName: string): Chainable<Subject>;

    /**
     * Verify a confirmation dialog is displayed.
     * @param message - The expected message in the confirmation dialog.
     */
    verifyConfirmationDialog(message: string): Chainable<Subject>;

    /**
     * Overwrite the default `visit` command to include logging.
     * @param url - The URL to visit.
     * @param options - Additional options for visiting the URL.
     */
    visit(
      url: string,
      options?: Partial<Cypress.VisitOptions>
    ): Chainable<Subject>;

    /**
     * Navigate to the Military Support page.
     */
    navigateToMilitarySupport(): Chainable<Subject>;

    /**
     * Send a message in the Military Support chatroom.
     * @param message - The message to send.
     */
    sendMessageInChatroom(message: string): Chainable<Subject>;

    /**
     * Verify that a disclaimer is displayed on the Military Support page.
     * @param text - The expected disclaimer text.
     */
    verifyDisclaimer(text: string): Chainable<Subject>;

    /**
     * Clear the chatroom history.
     */
    clearChatHistory(): Chainable<Subject>;

    /**
     * Mock loading existing messages in the chatroom.
     * @param messages - An array of chat messages to mock.
     */
    mockChatMessages(
      messages: Array<{ id: number; sender: string; message: string }>
    ): Chainable<Subject>;

    /**
     * Mock and validate external resource links on the Military Support page.
     * @param resources - An array of resources with names and URLs.
     */
    verifyResourceLinks(
      resources: Array<{ name: string; url: string }>
    ): Chainable<Subject>;

    /**
     * Simulate and verify access control for the Military Support section.
     * @param role - The user role (e.g., 'military', 'non-military').
     */
    mockAccessControl(role: string): Chainable<Subject>;

    /**
     * Notify the user of new messages.
     * @param hasNewMessages - Whether new messages are available.
     */
    mockNewMessageNotification(hasNewMessages: boolean): Chainable<Subject>;

    /**
     * Navigate to the Payments page.
     */
    navigateToPayments(): Chainable<Subject>;

    /**
     * Simulate a successful payment.
     * @param amount - The payment amount.
     * @param method - The payment method (e.g., 'credit card', 'PayPal').
     */
    simulateSuccessfulPayment(
      amount: number,
      method: string
    ): Chainable<Subject>;

    /**
     * Simulate a failed payment.
     * @param errorMessage - The error message to display.
     */
    simulateFailedPayment(errorMessage: string): Chainable<Subject>;

    /**
     * Verify the payment history is displayed correctly.
     * @param payments - An array of payment history objects.
     */
    verifyPaymentHistory(
      payments: Array<{
        id: number;
        date: string;
        amount: number;
        method: string;
      }>
    ): Chainable<Subject>;

    /**
     * Simulate payment method validation errors.
     * @param field - The field to validate (e.g., 'amount', 'paymentMethod').
     * @param errorMessage - The validation error message.
     */
    simulatePaymentValidationError(
      field: string,
      errorMessage: string
    ): Chainable<Subject>;

    /**
     * Mock and validate available payment methods.
     * @param methods - An array of available payment methods.
     */
    mockPaymentMethods(methods: Array<string>): Chainable<Subject>;

    /**
     * Simulate a refund process.
     * @param refundId - The ID of the payment to refund.
     */
    simulateRefund(refundId: number): Chainable<Subject>;
  }
}
