// ButtonUtils.ts

/**
 * Utility function to combine multiple class names into a single string.
 * Handles conditional class names gracefully.
 * @param classes - An array of class names (strings or undefined).
 * @returns A single string with all valid class names joined by a space.
 */
export const combineClassNames = (
  ...classes: (string | undefined)[]
): string => {
  return classes.filter(Boolean).join(' ');
};

/**
 * Utility function to generate a unique identifier for buttons.
 * Useful for testing or dynamic button IDs.
 * @param prefix - A prefix for the identifier.
 * @returns A unique identifier string.
 */
export const generateButtonId = (prefix: string = 'button'): string => {
  return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Constants for default button values.
 */
export const BUTTON_VARIANTS = ['primary', 'secondary', 'outline'] as const;
export const BUTTON_SIZES = ['small', 'medium', 'large'] as const;

/**
 * Type definitions for button variants and sizes.
 */
export type ButtonVariant = (typeof BUTTON_VARIANTS)[number];
export type ButtonSize = (typeof BUTTON_SIZES)[number];

/**
 * Utility function to determine if a given value is a valid button variant.
 * @param variant - The variant to check.
 * @returns True if the variant is valid; otherwise, false.
 */
export const isValidButtonVariant = (
  variant: string
): variant is ButtonVariant => {
  return BUTTON_VARIANTS.includes(variant as ButtonVariant);
};

/**
 * Utility function to determine if a given value is a valid button size.
 * @param size - The size to check.
 * @returns True if the size is valid; otherwise, false.
 */
export const isValidButtonSize = (size: string): size is ButtonSize => {
  return BUTTON_SIZES.includes(size as ButtonSize);
};
