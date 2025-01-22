// src/utils/numberUtils.ts

/**
 * Rounds a number to a specified number of decimal places.
 *
 * @param num - The number to round.
 * @param decimalPlaces - The number of decimal places to round to.
 * @returns The rounded number.
 * @throws Throws an error if the input is not a valid number or decimal places is not a non-negative integer.
 */
export const roundToDecimal = (num: number, decimalPlaces: number): number => {
  if (typeof num !== "number" || isNaN(num)) {
    throw new Error("Input must be a valid number.");
  }
  if (!Number.isInteger(decimalPlaces) || decimalPlaces < 0) {
    throw new Error("Decimal places must be a non-negative integer.");
  }
  return Number(num.toFixed(decimalPlaces));
};

/**
 * Formats a number as currency.
 *
 * @param num - The number to format.
 * @param locale - The locale to use for formatting (default is 'en-US').
 * @param currency - The currency to use for formatting (default is 'USD').
 * @returns The formatted currency string.
 * @throws Throws an error if the input is not a valid number.
 */
export const formatCurrency = (
  num: number,
  locale: string = "en-US",
  currency: string = "USD"
): string => {
  if (typeof num !== "number" || isNaN(num)) {
    throw new Error("Input must be a valid number.");
  }
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(num);
};

/**
 * Checks if a number is even.
 *
 * @param num - The number to check.
 * @returns True if the number is even, false otherwise.
 * @throws Throws an error if the input is not a valid number.
 */
export const isEven = (num: number): boolean => {
  if (typeof num !== "number" || isNaN(num)) {
    throw new Error("Input must be a valid number.");
  }
  return num % 2 === 0;
};

/**
 * Checks if a number is odd.
 *
 * @param num - The number to check.
 * @returns True if the number is odd, false otherwise.
 * @throws Throws an error if the input is not a valid number.
 */
export const isOdd = (num: number): boolean => {
  if (typeof num !== "number" || isNaN(num)) {
    throw new Error("Input must be a valid number.");
  }
  return num % 2 !== 0;
};

/**
 * Generates a random number between a specified range (inclusive).
 *
 * @param min - The minimum value of the range.
 * @param max - The maximum value of the range.
 * @returns A random number between min and max.
 * @throws Throws an error if min is greater than max or inputs are not valid numbers.
 */
export const getRandomNumber = (min: number, max: number): number => {
  if (typeof min !== "number" || typeof max !== "number" || isNaN(min) || isNaN(max)) {
    throw new Error("Both min and max must be valid numbers.");
  }
  if (min > max) {
    throw new Error("Minimum value cannot be greater than maximum value.");
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Calculates the percentage of a value.
 *
 * @param value - The current value.
 * @param total - The total value.
 * @returns The percentage of the value out of the total.
 * @throws Throws an error if the inputs are not valid numbers or total is zero.
 */
export const calculatePercentage = (value: number, total: number): number => {
  if (
    typeof value !== "number" ||
    typeof total !== "number" ||
    isNaN(value) ||
    isNaN(total)
  ) {
    throw new Error("Both value and total must be valid numbers.");
  }
  if (total === 0) {
    throw new Error("Total cannot be zero.");
  }
  return (value / total) * 100;
};

/**
 * Converts a number to a formatted string with commas.
 *
 * @param num - The number to format.
 * @returns The formatted string with commas.
 * @throws Throws an error if the input is not a valid number.
 */
export const formatWithCommas = (num: number): string => {
  if (typeof num !== "number" || isNaN(num)) {
    throw new Error("Input must be a valid number.");
  }
  return num.toLocaleString();
};

export default {
  roundToDecimal,
  formatCurrency,
  isEven,
  isOdd,
  getRandomNumber,
  calculatePercentage,
  formatWithCommas,
};
