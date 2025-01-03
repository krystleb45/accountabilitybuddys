import { Response } from "express";

interface ErrorDetail {
  field: string;
  message: string;
}

interface ApiResponse<T = Record<string, unknown>> {
  success: boolean;
  message: string;
  data?: T;
  errors?: ErrorDetail[];
}

/**
 * Standardized response for success.
 */
export const successResponse = <T>(
  res: Response,
  message: string = "Operation successful",
  data: T = {} as T,
  statusCode: number = 200,
): Response<ApiResponse<T>> => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

/**
 * Standardized response for failure.
 */
export const errorResponse = (
  res: Response,
  message: string = "Operation failed",
  statusCode: number = 400,
  errors: ErrorDetail[] = [],
): Response<ApiResponse<null>> => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: formatErrors(errors),
  });
};

/**
 * Standardized response for validation errors.
 */
export const validationErrorResponse = (
  res: Response,
  errors: ErrorDetail[] = [],
  message: string = "Validation failed",
  statusCode: number = 422,
): Response<ApiResponse<null>> => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors: formatErrors(errors),
  });
};

/**
 * Response for unauthorized access.
 */
export const unauthorizedResponse = (
  res: Response,
  message: string = "Unauthorized access",
): Response<ApiResponse<null>> => {
  return res.status(401).json({
    success: false,
    message,
  });
};

/**
 * Response for forbidden access.
 */
export const forbiddenResponse = (
  res: Response,
  message: string = "Access forbidden",
): Response<ApiResponse<null>> => {
  return res.status(403).json({
    success: false,
    message,
  });
};

/**
 * Response for not found.
 */
export const notFoundResponse = (
  res: Response,
  message: string = "Resource not found",
): Response<ApiResponse<null>> => {
  return res.status(404).json({
    success: false,
    message,
  });
};

/**
 * Internal server error response.
 */
export const serverErrorResponse = (
  res: Response,
  message: string = "Internal server error",
  statusCode: number = 500,
): Response<ApiResponse<null>> => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

/**
 * Helper function to format errors.
 */
const formatErrors = (errors: ErrorDetail[]): ErrorDetail[] => {
  return errors.map((error) => ({
    field: error.field || "general",
    message: error.message || "An error occurred",
  }));
};
