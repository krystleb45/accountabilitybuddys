const sessionStorageMock = (function () {
  let store = {};

  return {
    getItem(key: PropertyKey) {
      return store.hasOwnProperty(key) ? store[key] : null;
    },
    setItem(
      key: string | number,
      value: { toString: () => any } | null | undefined
    ) {
      if (value === undefined || value === null) {
        throw new Error('sessionStorage cannot store undefined or null values');
      }
      store[key] = value.toString();
    },
    removeItem(key: string | number) {
      delete store[key];
    },
    clear() {
      store = {};
    },
    key(index: string | number) {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
    get length() {
      return Object.keys(store).length;
    },
    // Optional: helper function to reset sessionStorage (useful for testing setup)
    mockClear() {
      store = {};
    },
  };
})();

// Define sessionStorage as a non-configurable, non-writable property
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
  writable: false, // Prevents reassignment
  configurable: false, // Prevents reconfiguration
});
