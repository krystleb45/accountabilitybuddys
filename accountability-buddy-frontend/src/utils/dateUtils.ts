/**
 * Formats a date to a readable string format.
 *
 * @param date - The date to format (can be a string, Date object, or number timestamp).
 * @param locale - The locale for formatting (default is 'en-US').
 * @param options - Options for formatting the date (default: year, month, and day).
 * @returns The formatted date string.
 * @throws Error - Throws an error if the date is invalid.
 */
export const formatDate = (
  date: string | Date | number,
  locale: string = 'en-US',
  options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
): string => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date provided');
  }
  return parsedDate.toLocaleDateString(locale, options);
};

/**
 * Calculates the difference in days between two dates.
 *
 * @param startDate - The start date (can be a string, Date object, or number timestamp).
 * @param endDate - The end date (can be a string, Date object, or number timestamp).
 * @returns The difference in days as a positive integer.
 * @throws Error - Throws an error if either date is invalid.
 */
export const getDaysDifference = (
  startDate: string | Date | number,
  endDate: string | Date | number
): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error('Invalid date(s) provided');
  }

  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
};

/**
 * Checks if a given date is today.
 *
 * @param date - The date to check (can be a string, Date object, or number timestamp).
 * @returns True if the date is today, false otherwise.
 * @throws Error - Throws an error if the date is invalid.
 */
export const isToday = (date: string | Date | number): boolean => {
  const givenDate = new Date(date);
  if (isNaN(givenDate.getTime())) {
    throw new Error('Invalid date provided');
  }

  const today = new Date();
  return (
    givenDate.getFullYear() === today.getFullYear() &&
    givenDate.getMonth() === today.getMonth() &&
    givenDate.getDate() === today.getDate()
  );
};

/**
 * Adds days to a date and returns the new date.
 *
 * @param date - The initial date (can be a string, Date object, or number timestamp).
 * @param days - The number of days to add.
 * @returns The new date as a Date object.
 * @throws Error - Throws an error if the date is invalid.
 */
export const addDays = (date: string | Date | number, days: number): Date => {
  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) {
    throw new Error('Invalid date provided');
  }
  parsedDate.setDate(parsedDate.getDate() + days);
  return parsedDate;
};

/**
 * Checks if a date is in the past.
 *
 * @param date - The date to check (can be a string, Date object, or number timestamp).
 * @returns True if the date is in the past, false otherwise.
 * @throws Error - Throws an error if the date is invalid.
 */
export const isPastDate = (date: string | Date | number): boolean => {
  const givenDate = new Date(date);
  if (isNaN(givenDate.getTime())) {
    throw new Error('Invalid date provided');
  }
  return givenDate.getTime() < new Date().getTime();
};

/**
 * Checks if a date is in the future.
 *
 * @param date - The date to check (can be a string, Date object, or number timestamp).
 * @returns True if the date is in the future, false otherwise.
 * @throws Error - Throws an error if the date is invalid.
 */
export const isFutureDate = (date: string | Date | number): boolean => {
  const givenDate = new Date(date);
  if (isNaN(givenDate.getTime())) {
    throw new Error('Invalid date provided');
  }
  return givenDate.getTime() > new Date().getTime();
};
