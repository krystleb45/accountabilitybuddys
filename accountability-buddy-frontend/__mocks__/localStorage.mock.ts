/**
 * Mock implementation of localStorage for testing purposes.
 */

interface LocalStorageMock {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
  clear: () => void;
  getAllItems: () => Record<string, string>;
  mockStorageEvent: (key: string, newValue: string | null) => void;
}

const localStorageMock: LocalStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    /**
     * Retrieves the value associated with a given key.
     * @param key - The key of the item to retrieve.
     * @returns The value as a string, or null if the key does not exist.
     */
    getItem(key: string): string | null {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },

    /**
     * Stores a key-value pair in the mock localStorage.
     * @param key - The key to store.
     * @param value - The value to store.
     */
    setItem(key: string, value: string): void {
      if (value === undefined || value === null) {
        throw new Error('localStorage cannot store undefined or null values');
      }
      store[key] = value;
    },

    /**
     * Removes an item from the mock localStorage.
     * @param key - The key of the item to remove.
     */
    removeItem(key: string): void {
      delete store[key];
    },

    /**
     * Clears all items from the mock localStorage.
     */
    clear(): void {
      store = {};
    },

    /**
     * Retrieves all items in the mock localStorage (useful for debugging).
     * @returns An object containing all key-value pairs in localStorage.
     */
    getAllItems(): Record<string, string> {
      return { ...store };
    },

    /**
     * Mocks a storage event (useful for testing event listeners).
     * @param key - The key that changed.
     * @param newValue - The new value associated with the key, or null if removed.
     */
    mockStorageEvent(key: string, newValue: string | null): void {
      const event = new StorageEvent('storage', {
        key,
        oldValue: store[key] || null,
        newValue,
        storageArea: window.localStorage,
      });
      window.dispatchEvent(event);
    },
  };
})();

// Define `localStorage` as a non-writable, non-configurable property on `window`
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: false, // Mimics browser behavior
  configurable: false, // Prevents deletion or redefinition of localStorage
});

export default localStorageMock;
