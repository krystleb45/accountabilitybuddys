// src/utils/localStorageUtils.js

/**
 * Saves an item to local storage.
 *
 * @param {string} key - The key under which to store the value.
 * @param {any} value - The value to store. Will be serialized as JSON.
 * @throws {Error} - Throws an error if the value is not serializable.
 */
export const saveToLocalStorage = (key, value) => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      throw new Error(`Could not save to local storage: ${error.message}`);
    }
  };
  
  /**
   * Retrieves an item from local storage.
   *
   * @param {string} key - The key to retrieve the value from.
   * @returns {any|null} - The parsed value from local storage, or null if not found.
   * @throws {Error} - Throws an error if the stored value is not valid JSON.
   */
  export const getFromLocalStorage = (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      throw new Error(`Could not retrieve from local storage: ${error.message}`);
    }
  };
  
  /**
   * Removes an item from local storage.
   *
   * @param {string} key - The key of the item to remove.
   */
  export const removeFromLocalStorage = (key) => {
    localStorage.removeItem(key);
  };
  
  /**
   * Clears all items from local storage.
   */
  export const clearLocalStorage = () => {
    localStorage.clear();
  };
  
  /**
   * Checks if an item exists in local storage.
   *
   * @param {string} key - The key to check for existence.
   * @returns {boolean} - True if the item exists, false otherwise.
   */
  export const existsInLocalStorage = (key) => {
    return localStorage.getItem(key) !== null;
  };
  