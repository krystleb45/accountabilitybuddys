/**
 * Mock implementation of the Notification API for testing purposes.
 */

type NotificationOptions = {
  body?: string;
  icon?: string;
  [key: string]: any;
};

type MockNotificationInstance = {
  title: string;
  options: NotificationOptions;
  addEventListener: jest.Mock;
  removeEventListener: jest.Mock;
  dispatchEvent: jest.Mock;
  close: jest.Mock;
  onclick: jest.Mock | null;
  onclose: jest.Mock | null;
};

const notificationMock = {
  // Default permission is 'granted'
  permission: 'granted' as NotificationPermission,

  /**
   * Simulates the requestPermission method.
   * @returns A promise that resolves with the permission.
   */
  requestPermission: jest.fn(() =>
    Promise.resolve('granted' as NotificationPermission)
  ),

  /**
   * Simulates the Notification constructor.
   * @param title - The title of the notification.
   * @param options - Additional options for the notification.
   * @returns A simulated notification instance.
   */
  createNotification: jest.fn(function (
    title: string,
    options: NotificationOptions = {}
  ): MockNotificationInstance {
    if (notificationMock.permission === 'denied') {
      throw new Error('Notification permission has been denied');
    }

    // Return an object that simulates a notification instance with event handlers
    return {
      title,
      options,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      close: jest.fn(), // Simulate the close method
      onclick: null, // Simulate click event handler
      onclose: null, // Simulate close event handler
    };
  }),

  /**
   * Helper method to mock permission changes for tests.
   * @param newPermission - The new permission to set.
   */
  mockPermission: (newPermission: NotificationPermission): void => {
    notificationMock.permission = newPermission;
  },
};

// Define global Notification object
(global as any).Notification = notificationMock;

export default notificationMock;
