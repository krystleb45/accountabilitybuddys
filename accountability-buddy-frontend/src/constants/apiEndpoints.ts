// API Endpoints Configuration

export const API_ENDPOINTS = {
    AUTH: {
      LOGIN: "/auth/login",
      REGISTER: "/auth/register",
      LOGOUT: "/auth/logout",
      REFRESH_TOKEN: "/auth/refresh-token",
    },
    USER: {
      GET_PROFILE: "/user/profile",
      UPDATE_PROFILE: "/user/update",
      DELETE_ACCOUNT: "/user/delete",
      CHANGE_PASSWORD: "/user/change-password",
    },
    TASKS: {
      GET_ALL_TASKS: "/tasks",
      CREATE_TASK: "/tasks/create",
      UPDATE_TASK: "/tasks/update",
      DELETE_TASK: "/tasks/delete",
      GET_TASK_BY_ID: "/tasks/:taskId",
    },
    NOTIFICATIONS: {
      GET_ALL: "/notifications",
      MARK_AS_READ: "/notifications/read",
      DELETE_NOTIFICATION: "/notifications/delete",
    },
    ADMIN: {
      GET_DASHBOARD_STATS: "/admin/stats",
      MANAGE_USERS: "/admin/users",
      MANAGE_TASKS: "/admin/tasks",
    },
    FILES: {
      UPLOAD: "/files/upload",
      DOWNLOAD: "/files/download/:fileId",
      DELETE: "/files/delete/:fileId",
    },
  };
  
  // Example Usage:
  // API_ENDPOINTS.AUTH.LOGIN -> '/auth/login'
  // API_ENDPOINTS.TASKS.GET_TASK_BY_ID.replace(':taskId', '123') -> '/tasks/123'