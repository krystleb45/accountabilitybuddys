// Centralized API Endpoints
const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
  },
  USER: {
    GET_USER: "/user",
    UPDATE_USER: "/user/update",
    DELETE_USER: "/user/delete",
    CHANGE_PASSWORD: "/user/change-password",
  },
  TASKS: {
    GET_TASKS: "/tasks",
    CREATE_TASK: "/tasks/create",
    UPDATE_TASK: "/tasks/update",
    DELETE_TASK: "/tasks/delete",
    GET_TASK_BY_ID: "/tasks/:taskId",
  },
  // Add more groups and endpoints as needed
};

// Helper function to get full URL with dynamic parameters and query strings
const getApiUrl = (endpoint, params = {}, queryParams = {}) => {
  // Validate endpoint existence
  if (!endpoint) {
    console.error("Undefined endpoint:", endpoint);
    return "";
  }

  let url = `${process.env.REACT_APP_API_BASE_URL || "http://localhost:5000"}${endpoint}`;

  // Replace placeholders in the URL (e.g., ':taskId')
  for (const [key, value] of Object.entries(params)) {
    url = url.replace(`:${key}`, value);
  }

  // Append query parameters to the URL
  const queryString = new URLSearchParams(queryParams).toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  return url;
};

// Example usage:
// getApiUrl(API_ENDPOINTS.TASKS.GET_TASK_BY_ID, { taskId: 123 }, { sort: 'asc', limit: 10 });

export { API_ENDPOINTS, getApiUrl };
