/// <reference types="cypress" />
/// <reference types="cypress-file-upload" />

// Define the Chainable interface augmentation properly
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Simulate an API request failure.
       * @param endpoint - The API endpoint to intercept.
       */
      simulateApiFailure(endpoint: string): Chainable<void>;

      /**
       * Overwrite local storage clearing functionality.
       */
      clearLocalStorage(): Chainable<void>;

      /**
       * Wait for a specific element to be visible.
       * @param selector - The element's CSS selector.
       * @param timeout - Maximum time to wait for the element (default: 5000 ms).
       */
      waitForElement(selector: string, timeout?: number): Chainable<void>;

      /**
       * Assert that an element contains specific text.
       * @param selector - The element's CSS selector.
       * @param expectedText - The text to assert.
       */
      assertText(selector: string, expectedText: string): Chainable<void>;

      /**
       * Log in a user with email and password.
       * @param email - The user's email address.
       * @param password - The user's password.
       */
      loginAs(email: string, password: string): Chainable<void>;

      /**
       * Drag an element.
       * @param options - Dragging options (x, y coordinates).
       */
      drag(options?: { x?: number; y?: number }): Chainable<void>;

      /**
       * Dismiss a modal or alert.
       * @param subject - The element to dismiss.
       */
      dismiss(subject?: string): Chainable<void>;

      /**
       * Verify a toast message is displayed.
       * @param message - The message text.
       */
      verifyToastMessage(message: string): Chainable<void>;

      /**
       * Reset the application's state.
       */
      resetAppState(): Chainable<void>;

      /**
       * Handle file uploads.
       * @param selector - The file input element selector.
       * @param fileName - The name of the file to upload.
       */
      uploadFile(selector: string, fileName: string): Chainable<void>;

      /**
       * Verify a confirmation dialog is displayed.
       * @param message - The expected message in the confirmation dialog.
       */
      verifyConfirmationDialog(message: string): Chainable<void>;

      /**
       * Mock loading existing messages in the chatroom.
       * @param messages - An array of chat messages to mock.
       */
      mockChatMessages(
        messages: Array<{ id: number; sender: string; message: string }>
      ): Chainable<void>;

      /**
       * Navigate to the Payments page.
       */
      navigateToPayments(): Chainable<void>;

      /**
       * Simulate a successful payment.
       * @param amount - The payment amount.
       * @param method - The payment method (e.g., 'credit card', 'PayPal').
       */
      simulateSuccessfulPayment(
        amount: number,
        method: string
      ): Chainable<void>;

      /**
       * Simulate payment method validation errors.
       * @param field - The field to validate (e.g., 'amount', 'paymentMethod').
       * @param errorMessage - The validation error message.
       */
      simulatePaymentValidationError(
        field: string,
        errorMessage: string
      ): Chainable<void>;
    }
  }
}

// Ensure the file is treated as a module by exporting an empty object
export {};
