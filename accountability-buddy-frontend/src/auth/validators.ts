// validators.ts

/**
 * Validates an email address format.
 * @param email - The email address to validate.
 * @returns True if the email is valid, otherwise false.
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates the strength of a password.
 * Ensures a minimum length of 8 characters, including at least one number, one uppercase letter, and one special character.
 * @param password - The password to validate.
 * @returns True if the password is strong, otherwise false.
 */
export const validatePasswordStrength = (password: string): boolean => {
  const strongPasswordRegex =
    /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
  return strongPasswordRegex.test(password);
};

/**
 * Compares two passwords to ensure they match.
 * @param password - The original password.
 * @param confirmPassword - The repeated password for confirmation.
 * @returns True if both passwords match, otherwise false.
 */
export const validatePasswordMatch = (
  password: string,
  confirmPassword: string
): boolean => {
  return password === confirmPassword;
};

/**
 * Validates a token (e.g., JWT or password reset token).
 * Ensures it is non-empty and follows a basic format (customize as needed).
 * @param token - The token to validate.
 * @returns True if the token is valid, otherwise false.
 */
export const validateToken = (token: string): boolean => {
  return typeof token === 'string' && token.trim().length > 0;
};
