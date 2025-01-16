// __mocks__/cookie.mock.ts

interface CookieOptions {
  value: string;
  expires?: string;
  path?: string;
  [key: string]: unknown; // Allow for additional optional properties
}

const mockCookies: Record<string, CookieOptions> = {};

/**
 * Sets a cookie in the mock storage.
 * @param name - The name of the cookie.
 * @param value - The value of the cookie.
 * @param options - Optional settings for the cookie (e.g., expires, path).
 */
function setCookie(name: string, value: string, options: Partial<CookieOptions> = {}): void {
  const cookieOptions: CookieOptions = {
    value,
    ...options,
    expires: options.expires ? new Date(options.expires).toUTCString() : undefined,
  };
  mockCookies[name] = cookieOptions;
  console.log(`[Cookie Mock] Cookie set: ${name}=${value}`, cookieOptions);
}

/**
 * Gets a cookie value by name.
 * @param name - The name of the cookie.
 * @returns The cookie value, or null if not found.
 */
function getCookie(name: string): string | null {
  const cookie = mockCookies[name];
  if (cookie) {
    console.log(`[Cookie Mock] Retrieved cookie: ${name}=${cookie.value}`);
    return cookie.value;
  }
  console.log(`[Cookie Mock] Cookie not found: ${name}`);
  return null;
}

/**
 * Deletes a cookie by name.
 * @param name - The name of the cookie to delete.
 */
function deleteCookie(name: string): void {
  if (mockCookies[name]) {
    delete mockCookies[name];
    console.log(`[Cookie Mock] Cookie deleted: ${name}`);
  } else {
    console.log(`[Cookie Mock] Attempted to delete non-existent cookie: ${name}`);
  }
}

/**
 * Gets all cookies as a key-value object.
 * @returns An object representing all cookies.
 */
function getAllCookies(): Record<string, string> {
  console.log(`[Cookie Mock] Retrieved all cookies:`, mockCookies);
  return Object.keys(mockCookies).reduce((acc, key) => {
    acc[key] = mockCookies[key].value;
    return acc;
  }, {} as Record<string, string>);
}

/**
 * Resets all cookies (useful for tests).
 */
function resetCookies(): void {
  Object.keys(mockCookies).forEach((key) => {
    delete mockCookies[key];
  });
  console.log(`[Cookie Mock] All cookies cleared`);
}

// Export mock functions
export {
  setCookie,
  getCookie,
  deleteCookie,
  getAllCookies,
  resetCookies,
};
