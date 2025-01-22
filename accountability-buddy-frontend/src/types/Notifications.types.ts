/**
 * Represents a single notification.
 */
export interface Notification {
    /** Unique identifier for the notification. */
    id: string;
  
    /** Title or subject of the notification. */
    title: string;
  
    /** Detailed message of the notification. */
    message: string;
  
    /** Type of notification (e.g., "info", "success", "error", "warning"). */
    type: "info" | "success" | "error" | "warning";
  
    /** ISO timestamp indicating when the notification was created. */
    timestamp: string;
  
    /** Whether the notification has been read. */
    isRead: boolean;
  
    /** URL for related action (optional). */
    actionUrl?: string;
  
    /** Metadata for additional details (optional). */
    metadata?: Record<string, any>;
  }
  
  /**
   * Represents a group of notifications.
   */
  export interface NotificationGroup {
    /** Title of the notification group (e.g., "System Alerts"). */
    groupTitle: string;
  
    /** Array of notifications in this group. */
    notifications: Notification[];
  
    /** Indicates whether all notifications in the group are read. */
    allRead: boolean;
  }
  
  /**
   * Represents the response for fetching notifications from the API.
   */
  export interface NotificationResponse {
    /** Total number of notifications. */
    total: number;
  
    /** Current page of notifications (for paginated responses). */
    page: number;
  
    /** Number of notifications per page. */
    perPage: number;
  
    /** Array of notifications for the current page. */
    notifications: Notification[];
  
    /** Total number of unread notifications. */
    unreadCount: number;
  }
  
  /**
   * Represents settings or preferences for notifications.
   */
  export interface NotificationPreferences {
    /** Whether to receive email notifications. */
    emailNotifications: boolean;
  
    /** Whether to receive push notifications. */
    pushNotifications: boolean;
  
    /** Whether to receive in-app notifications. */
    inAppNotifications: boolean;
  
    /** Preferred notification types (e.g., "info", "error"). */
    preferredTypes?: ("info" | "success" | "error" | "warning")[];
  }
  