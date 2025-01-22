// Centralized Error Configuration

// Enum for standard HTTP status codes
export enum HttpStatusCodes {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500,
    SERVICE_UNAVAILABLE = 503,
  }
  
  // Custom Error Messages for Common Scenarios
  export const ErrorMessages = {
    GENERAL: {
      UNKNOWN_ERROR: "An unknown error occurred. Please try again.",
      NETWORK_ERROR: "Network error. Please check your connection.",
    },
    AUTH: {
      LOGIN_FAILED: "Invalid email or password.",
      UNAUTHORIZED: "You are not authorized to perform this action.",
      SESSION_EXPIRED: "Your session has expired. Please log in again.",
    },
    USER: {
      NOT_FOUND: "User not found.",
      UPDATE_FAILED: "Failed to update user information.",
    },
    TASKS: {
      NOT_FOUND: "Task not found.",
      CREATE_FAILED: "Failed to create task. Please try again.",
      DELETE_FAILED: "Failed to delete task. Please try again.",
    },
    SERVER: {
      INTERNAL_ERROR: "A server error occurred. Please try again later.",
      MAINTENANCE: "The system is currently under maintenance. Please try again later.",
    },
  };
  
  // Utility Function to Map Status Codes to Error Messages
  export const getErrorMessage = (
    statusCode: number,
    defaultError: string = ErrorMessages.GENERAL.UNKNOWN_ERROR
  ): string => {
    switch (statusCode) {
      case HttpStatusCodes.BAD_REQUEST:
        return "The request was invalid. Please check your input.";
      case HttpStatusCodes.UNAUTHORIZED:
        return ErrorMessages.AUTH.UNAUTHORIZED;
      case HttpStatusCodes.FORBIDDEN:
        return "You do not have permission to access this resource.";
      case HttpStatusCodes.NOT_FOUND:
        return "The requested resource could not be found.";
      case HttpStatusCodes.CONFLICT:
        return "A conflict occurred. Please try again.";
      case HttpStatusCodes.INTERNAL_SERVER_ERROR:
        return ErrorMessages.SERVER.INTERNAL_ERROR;
      case HttpStatusCodes.SERVICE_UNAVAILABLE:
        return ErrorMessages.SERVER.MAINTENANCE;
      default:
        return defaultError;
    }
  };
  
  // Example Usage
  // const errorMessage = getErrorMessage(404);
  // console.log(errorMessage); // Output: "The requested resource could not be found."
  
  export default { HttpStatusCodes, ErrorMessages, getErrorMessage };
  