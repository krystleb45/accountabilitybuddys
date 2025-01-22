// src/utils/stringUtils.ts

/**
 * Trims whitespace from both ends of a string.
 *
 * @param str - The string to trim.
 * @returns The trimmed string.
 * @throws Throws an error if the input is not a string.
 */
export const trimString = (str: string): string => {
  if (typeof str !== "string") {
    throw new Error("Input must be a string.");
  }
  return str.trim();
};

/**
 * Capitalizes the first letter of each word in a string.
 *
 * @param str - The string to capitalize.
 * @returns The capitalized string.
 * @throws Throws an error if the input is not a string.
 */
export const capitalizeWords = (str: string): string => {
  if (typeof str !== "string") {
    throw new Error("Input must be a string.");
  }
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Converts a string to kebab-case.
 *
 * @param str - The string to convert.
 * @returns The kebab-cased string.
 * @throws Throws an error if the input is not a string.
 */
export const toKebabCase = (str: string): string => {
  if (typeof str !== "string") {
    throw new Error("Input must be a string.");
  }
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/[^\w-]+/g, ""); // Remove all non-word chars
};

/**
 * Converts a string to camelCase.
 *
 * @param str - The string to convert.
 * @returns The camelCased string.
 * @throws Throws an error if the input is not a string.
 */
export const toCamelCase = (str: string): string => {
  if (typeof str !== "string") {
    throw new Error("Input must be a string.");
  }
  return str
    .trim()
    .toLowerCase()
    .split(" ")
    .map((word, index) =>
      index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join("");
};

/**
 * Checks if a string is a valid email address.
 *
 * @param email - The string to check.
 * @returns True if the string is a valid email, false otherwise.
 */
export const isValidEmail = (email: string): boolean => {
  if (typeof email !== "string") {
    throw new Error("Input must be a string.");
  }
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for email validation
  return regex.test(email);
};

/**
 * Truncates a string to a specified length, adding an ellipsis if necessary.
 *
 * @param str - The string to truncate.
 * @param maxLength - The maximum allowed length.
 * @returns The truncated string with an ellipsis if it exceeds maxLength.
 * @throws Throws an error if the input is not a string or maxLength is invalid.
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (typeof str !== "string") {
    throw new Error("Input must be a string.");
  }
  if (typeof maxLength !== "number" || maxLength < 0) {
    throw new Error("maxLength must be a non-negative number.");
  }
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
};

/**
 * Converts a string to snake_case.
 *
 * @param str - The string to convert.
 * @returns The snake_cased string.
 * @throws Throws an error if the input is not a string.
 */
export const toSnakeCase = (str: string): string => {
  if (typeof str !== "string") {
    throw new Error("Input must be a string.");
  }
  return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/[^\w_]+/g, ""); // Remove all non-word chars
};

export default {
  trimString,
  capitalizeWords,
  toKebabCase,
  toCamelCase,
  isValidEmail,
  truncateString,
  toSnakeCase,
};
