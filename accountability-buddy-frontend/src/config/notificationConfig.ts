// Enhanced Notification Configuration
interface NotificationType {
  duration: number;
  style: {
    backgroundColor: string;
    color: string;
  };
  icon: string;
}

interface NotificationConfig {
  defaultDuration: number;
  position:
    | 'top-left'
    | 'top-right'
    | 'bottom-left'
    | 'bottom-right'
    | 'center';
  types: Record<string, NotificationType>;
  getConfig: (type: string) => NotificationType;
  setGlobalConfig: (config: { duration?: number; position?: string }) => void;
}

const notificationConfig: NotificationConfig = {
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
  getConfig: function (type: string): NotificationType {
    return (
      this.types[type] || {
        duration: this.defaultDuration,
        style: { backgroundColor: '#333', color: '#fff' },
        icon: '🔔',
      }
    );
  },

  // Function to customize global notification settings
  setGlobalConfig: function ({
    duration,
    position,
  }: {
    duration?: number;
    position?: string;
  }): void {
    if (duration) this.defaultDuration = duration;
    if (
      position &&
      [
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
        'center',
      ].includes(position)
    ) {
      this.position = position as NotificationConfig['position'];
    }
  },
};

// Example Usage:
// const successConfig = notificationConfig.getConfig('success');
// notificationConfig.setGlobalConfig({ duration: 4000, position: 'bottom-left' });

export default notificationConfig;
