/**
 * Mock implementation for simulating media query behavior in tests.
 */

type MediaQueryListener = (query: string) => void;

let currentMediaQuery = '';
const mockListeners: MediaQueryListener[] = [];

/**
 * Simulates setting the current media query.
 * @param query - The media query string to set (e.g., '(max-width: 768px)').
 */
export function setMediaQuery(query: string): void {
  currentMediaQuery = query;
  console.log(`[MediaQuery Mock] Current media query set to: ${query}`);
  notifyListeners(query);
}

/**
 * Gets the current media query.
 * @returns The current media query string.
 */
export function getMediaQuery(): string {
  console.log(`[MediaQuery Mock] Retrieved current media query: ${currentMediaQuery}`);
  return currentMediaQuery;
}

/**
 * Simulates adding a media query listener.
 * @param listener - A callback function to execute when the media query changes.
 */
export function addMediaQueryListener(listener: MediaQueryListener): void {
  if (typeof listener === 'function') {
    mockListeners.push(listener);
    console.log(`[MediaQuery Mock] Media query listener added`);
  } else {
    console.error(`[MediaQuery Mock] Listener must be a function`);
  }
}

/**
 * Simulates removing a media query listener.
 * @param listener - The callback function to remove.
 */
export function removeMediaQueryListener(listener: MediaQueryListener): void {
  const index = mockListeners.indexOf(listener);
  if (index !== -1) {
    mockListeners.splice(index, 1);
    console.log(`[MediaQuery Mock] Media query listener removed`);
  } else {
    console.log(`[MediaQuery Mock] Listener not found`);
  }
}

/**
 * Notifies all registered listeners of a media query change.
 * @param query - The new media query string.
 */
function notifyListeners(query: string): void {
  mockListeners.forEach((listener) => listener(query));
  console.log(`[MediaQuery Mock] Notified listeners of media query change to: ${query}`);
}

/**
 * Clears all media query listeners (useful for tests).
 */
export function clearMediaQueryListeners(): void {
  mockListeners.length = 0;
  console.log(`[MediaQuery Mock] All media query listeners cleared`);
}
