// __mocks__/environment.ts

const mockEnvironmentVariables: Record<string, string> = {};

/**
 * Sets an environment variable in the mock storage.
 * @param {string} key - The name of the environment variable.
 * @param {string} value - The value of the environment variable.
 * @returns {void} - No return value.
 */
function setEnvironmentVariable(key: string, value: string): void {
  mockEnvironmentVariables[key] = value;
  console.log(`[Environment Mock] Environment variable set: ${key}=${value}`);
}

/**
 * Gets the value of an environment variable.
 * @param {string} key - The name of the environment variable.
 * @returns {string | null} - The value of the environment variable, or null if not set.
 */
function getEnvironmentVariable(key: string): string | null {
  const value = mockEnvironmentVariables[key] || null;
  console.log(
    `[Environment Mock] Retrieved environment variable: ${key}=${value}`
  );
  return value;
}

/**
 * Deletes an environment variable from the mock storage.
 * @param {string} key - The name of the environment variable to delete.
 * @returns {void} - No return value.
 */
function deleteEnvironmentVariable(key: string): void {
  if (key in mockEnvironmentVariables) {
    delete mockEnvironmentVariables[key];
    console.log(`[Environment Mock] Environment variable deleted: ${key}`);
  } else {
    console.log(
      `[Environment Mock] Attempted to delete non-existent variable: ${key}`
    );
  }
}

/**
 * Retrieves all environment variables as a key-value object.
 * @returns {Record<string, string>} - An object representing all mock environment variables.
 */
function getAllEnvironmentVariables(): Record<string, string> {
  console.log(
    `[Environment Mock] Retrieved all environment variables:`,
    mockEnvironmentVariables
  );
  return { ...mockEnvironmentVariables };
}

/**
 * Resets all environment variables (useful for tests).
 * @returns {void} - No return value.
 */
function resetEnvironmentVariables(): void {
  Object.keys(mockEnvironmentVariables).forEach(
    (key) => delete mockEnvironmentVariables[key]
  );
  console.log(`[Environment Mock] All environment variables cleared`);
}

// Export mock functions
export {
  setEnvironmentVariable,
  getEnvironmentVariable,
  deleteEnvironmentVariable,
  getAllEnvironmentVariables,
  resetEnvironmentVariables,
};
