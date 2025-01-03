const notificationMock = {
  // Default permission is 'granted'
  permission: "granted",

  // Simulate the requestPermission method
  requestPermission: jest.fn(() => Promise.resolve("granted")),

  // Simulate the Notification constructor
  createNotification: jest.fn(function (title, options = {}) {
    if (notificationMock.permission === "denied") {
      throw new Error("Notification permission has been denied");
    }

    // Return an object that simulates a notification instance with event handlers
    return {
      title,
      options,
      // Simulated event listeners
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
      close: jest.fn(), // Simulate the close method
      onclick: jest.fn(), // Simulate click event handler
      onclose: jest.fn(), // Simulate close event handler
    };
  }),

  // Helper method to mock permission changes for tests
  mockPermission: (newPermission) => {
    notificationMock.permission = newPermission;
  },
};

// Define global Notification object
global.Notification = notificationMock;
