const localStorageMock = (function () {
  let store = {};

  return {
    getItem(key) {
      return store.hasOwnProperty(key) ? store[key] : null;
    },
    setItem(key, value) {
      if (value === undefined || value === null) {
        throw new Error("localStorage cannot store undefined or null values");
      }
      store[key] = value.toString();
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    },
    // Helper function to get the entire store (useful for debugging)
    getAllItems() {
      return { ...store };
    },
    // Helper function to mock a storage event (optional, for testing)
    mockStorageEvent(key, newValue) {
      const event = new Event("storage");
      event.key = key;
      event.newValue = newValue;
      event.oldValue = store[key] || null;
      event.storageArea = store;
      window.dispatchEvent(event);
    },
  };
})();

// Define localStorage as a non-configurable, non-writable property
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: false, // Mimics browser behavior
  configurable: false, // Prevents deletion or redefinition of localStorage
});
