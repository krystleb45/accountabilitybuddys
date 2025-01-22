/**
 * Utility functions for interacting with local storage in a safe and consistent manner.
 */

/**
 * Utility to log error messages safely.
 * @param error - The error to log.
 */
const logError = (error: unknown): void => {
  if (error instanceof Error) {
    console.error(`Error: ${error.message}`);
  } else {
    console.error(`Unexpected error: ${error}`);
  }
};

/**
 * Saves an item to local storage.
 *
 * @param key - The key under which to store the value.
 * @param value - The value to store. Will be serialized as JSON.
 */
export const saveToLocalStorage = (key: string, value: any): void => {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
  } catch (error) {
    logError(error);
    throw new Error('Failed to save to local storage.');
  }
};

/**
 * Retrieves an item from local storage.
 *
 * @param key - The key to retrieve the value from.
 * @returns The parsed value from local storage, or null if not found.
 */
export const getFromLocalStorage = <T = any>(key: string): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  } catch (error) {
    logError(error);
    throw new Error('Failed to retrieve from local storage.');
  }
};

/**
 * Removes an item from local storage.
 *
 * @param key - The key of the item to remove.
 */
export const removeFromLocalStorage = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    logError(error);
  }
};

/**
 * Clears all items from local storage.
 */
export const clearLocalStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    logError(error);
  }
};

/**
 * Checks if an item exists in local storage.
 *
 * @param key - The key to check for existence.
 * @returns True if the item exists, false otherwise.
 */
export const existsInLocalStorage = (key: string): boolean => {
  try {
    return localStorage.getItem(key) !== null;
  } catch (error) {
    logError(error);
    return false;
  }
};

/**
 * Updates an existing item in local storage by merging the new value with the current value.
 *
 * @param key - The key of the item to update.
 * @param newValue - The new value to merge with the existing value.
 */
export const updateLocalStorage = (key: string, newValue: any): void => {
  try {
    const existingValue = getFromLocalStorage<any>(key);
    const updatedValue = existingValue
      ? { ...existingValue, ...newValue }
      : newValue;
    saveToLocalStorage(key, updatedValue);
  } catch (error) {
    logError(error);
    throw new Error('Failed to update local storage.');
  }
};

/**
 * Retrieves all keys currently stored in local storage.
 *
 * @returns An array of all keys in local storage.
 */
export const getAllKeysFromLocalStorage = (): string[] => {
  try {
    return Object.keys(localStorage);
  } catch (error) {
    logError(error);
    return [];
  }
};
