/**
 * Represents the structure of a standard API error response.
 */
export interface ApiError {
  /** The error code returned by the API (e.g., HTTP status code or custom code). */
  code: string | number;

  /** A short, human-readable message describing the error. */
  message: string;

  /** Additional details about the error (optional). */
  details?: string;

  /** Any field-specific validation errors (optional). */
  validationErrors?: ValidationError[];
}

/**
 * Represents a field-specific validation error.
 */
export interface ValidationError {
  /** The field name where the error occurred. */
  field: string;

  /** A human-readable message describing the validation error. */
  message: string;
}

/**
 * Represents the structure of an application error.
 */
export interface AppError {
  /** A unique identifier for the error (e.g., UUID or timestamp). */
  id?: string;

  /** A short title or summary of the error. */
  title: string;

  /** A detailed description of the error. */
  description?: string;

  /** The severity level of the error (e.g., "info", "warning", "error"). */
  severity: 'info' | 'warning' | 'error';

  /** Any additional metadata related to the error (optional). */
  metadata?: Record<string, any>;
}

/**
 * Represents an error caused by a network issue.
 */
export interface NetworkError {
  /** The error message describing the network issue. */
  message: string;

  /** The status code returned by the server (if available). */
  statusCode?: number;

  /** The URL of the failed network request. */
  url?: string;

  /** Additional details about the network error (optional). */
  details?: string;
}

/**
 * Represents an error caused by user input or actions.
 */
export interface UserInputError {
  /** The field(s) where the error occurred. */
  fields: string[];

  /** A message describing the issue with the user input. */
  message: string;

  /** Suggestions for resolving the error (optional). */
  suggestions?: string[];
}

/**
 * Represents a global error handler configuration.
 */
export interface GlobalErrorHandlerConfig {
  /** Whether to log the error to the console. */
  logToConsole?: boolean;

  /** Whether to report the error to an external monitoring service. */
  reportToMonitoring?: boolean;

  /** A custom callback to handle errors. */
  customHandler?: (error: AppError | ApiError | NetworkError) => void;
}
