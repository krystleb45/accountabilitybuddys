// Notification Configuration
const notificationConfig = {
    // Default notification settings
    defaultDuration: 5000, // Duration in milliseconds
    position: 'top-right', // Default position
    
    // Notification Types
    types: {
      success: {
        duration: 3000,
        style: { backgroundColor: '#4caf50', color: '#ffffff' },
        icon: '✔️',
      },
      error: {
        duration: 7000,
        style: { backgroundColor: '#f44336', color: '#ffffff' },
        icon: '❌',
      },
      info: {
        duration: 5000,
        style: { backgroundColor: '#2196f3', color: '#ffffff' },
        icon: 'ℹ️',
      },
      warning: {
        duration: 6000,
        style: { backgroundColor: '#ff9800', color: '#ffffff' },
        icon: '⚠️',
      },
    },
  
    // Function to get config for a specific type of notification
    getConfig: function (type) {
      return this.types[type] || {
        duration: this.defaultDuration,
        style: { backgroundColor: '#333', color: '#fff' },
        icon: '🔔',
      };
    },
  
    // Function to customize global notification settings
    setGlobalConfig: function ({ duration, position }) {
      if (duration) this.defaultDuration = duration;
      if (position) this.position = position;
    },
  };
  
  // Example Usage:
  // const successConfig = notificationConfig.getConfig('success');
  // notificationConfig.setGlobalConfig({ duration: 4000, position: 'bottom-left' });
  
  export default notificationConfig;
  