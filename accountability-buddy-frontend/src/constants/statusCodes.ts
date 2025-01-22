// HTTP Status Codes

export const STATUS_CODES = {
    SUCCESS: {
      OK: 200, // Request succeeded
      CREATED: 201, // Resource created successfully
      NO_CONTENT: 204, // Request succeeded, no content returned
    },
    REDIRECTION: {
      MOVED_PERMANENTLY: 301, // Resource moved permanently
      FOUND: 302, // Resource found but temporarily redirected
      NOT_MODIFIED: 304, // Resource not modified
    },
    CLIENT_ERROR: {
      BAD_REQUEST: 400, // Invalid request from the client
      UNAUTHORIZED: 401, // Authentication required
      FORBIDDEN: 403, // Client does not have access rights
      NOT_FOUND: 404, // Resource not found
      CONFLICT: 409, // Conflict in the request
      UNPROCESSABLE_ENTITY: 422, // Validation error in the request
    },
    SERVER_ERROR: {
      INTERNAL_SERVER_ERROR: 500, // General server error
      NOT_IMPLEMENTED: 501, // Server functionality not implemented
      SERVICE_UNAVAILABLE: 503, // Server is temporarily unavailable
      GATEWAY_TIMEOUT: 504, // Server acting as a gateway timed out
    },
  };
  
  // Example Usage:
  // STATUS_CODES.SUCCESS.OK -> 200
  // STATUS_CODES.CLIENT_ERROR.NOT_FOUND -> 404
  