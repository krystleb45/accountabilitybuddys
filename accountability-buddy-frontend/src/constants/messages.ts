// Consolidated messages.ts - Common error, success, notification, and UI messages

export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network error occurred. Please try again.",
  UNAUTHORIZED: "You are not authorized to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  FORBIDDEN: "You do not have permission to access this resource.",
  SERVER_ERROR: "A server error occurred. Please try again later.",
  VALIDATION_ERROR: "Some fields have invalid inputs. Please check and try again.",
};

export const SUCCESS_MESSAGES = {
  REGISTER_SUCCESS: "Registration successful!",
  LOGIN_SUCCESS: "Login successful!",
  LOGOUT_SUCCESS: "Logout successful!",
  TASK_CREATED: "Task created successfully!",
  PROFILE_UPDATED: "Profile updated successfully!",
};

export const NOTIFICATION_MESSAGES = {
  DEFAULT_SUCCESS: "Operation completed successfully!",
  DEFAULT_ERROR: "An error occurred. Please try again.",
  NEW_NOTIFICATION: "You have a new notification.",
  ALL_MARKED_AS_READ: "All notifications marked as read.",
};

export const UI_MESSAGES = {
  LOADING: "Loading, please wait...",
  EMPTY_STATE: "No data available.",
  SEARCH_PLACEHOLDER: "Search...",
  NO_RESULTS_FOUND: "No results found.",
  CONFIRM_DELETE: "Are you sure you want to delete this item?",
};
