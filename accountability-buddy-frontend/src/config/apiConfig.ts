// Centralized API Endpoints

interface ApiEndpoints {
  AUTH: {
    LOGIN: string;
    REGISTER: string;
    LOGOUT: string;
    REFRESH_TOKEN: string;
  };
  USER: {
    GET_USER: string;
    UPDATE_USER: string;
    DELETE_USER: string;
    CHANGE_PASSWORD: string;
  };
  TASKS: {
    GET_TASKS: string;
    CREATE_TASK: string;
    UPDATE_TASK: string;
    DELETE_TASK: string;
    GET_TASK_BY_ID: string;
  };
  [key: string]: {
    [key: string]: string;
  };
}

const API_ENDPOINTS: ApiEndpoints = {
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
};

// Helper function to get full URL with dynamic parameters and query strings
const getApiUrl = (
  endpoint: string,
  params: Record<string, string | number> = {},
  queryParams: Record<string, string | number> = {}
): string => {
  try {
    if (!endpoint) {
      throw new Error("Endpoint is undefined or empty");
    }

    let url = `${process.env.REACT_APP_API_BASE_URL || "http://localhost:5000"}${endpoint}`;

    // Replace placeholders in the URL (e.g., ':taskId')
    for (const [key, value] of Object.entries(params)) {
      url = url.replace(`:${key}`, encodeURIComponent(value.toString()));
    }

    // Append query parameters to the URL
    const queryString = new URLSearchParams(
      Object.entries(queryParams).reduce((acc, [key, value]) => {
        acc[key] = value.toString();
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    if (queryString) {
      url += `?${queryString}`;
    }

    return url;
  } catch (error) {
    console.error("Error generating API URL:", error);
    return "";
  }
};

// Enhanced Example Usage with TypeScript
// const url = getApiUrl(API_ENDPOINTS.TASKS.GET_TASK_BY_ID, { taskId: 123 }, { sort: 'asc', limit: 10 });

export { API_ENDPOINTS, getApiUrl };
