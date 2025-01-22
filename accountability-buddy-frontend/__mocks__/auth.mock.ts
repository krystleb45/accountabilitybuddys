// __mocks__/auth.mock.ts

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

let mockAuthState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};

/**
 * Mock function to simulate login.
 * @param username - The username of the user.
 * @param password - The user's password.
 * @returns A Promise that resolves to a mock user object on success.
 */
function login(username: string, password: string): Promise<User> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === 'testuser' && password === 'password123') {
        mockAuthState = {
          isAuthenticated: true,
          user: { id: 1, username: 'testuser', email: 'testuser@example.com' },
          token: 'mock-jwt-token',
        };
        console.log(`[Auth Mock] User logged in: ${username}`);
        resolve(mockAuthState.user as User);
      } else {
        console.error(`[Auth Mock] Invalid login credentials`);
        reject(new Error('Invalid username or password'));
      }
    }, 100); // Simulate network latency
  });
}

/**
 * Mock function to simulate logout.
 * @returns A Promise that resolves when logout is complete.
 */
function logout(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => {
      mockAuthState = {
        isAuthenticated: false,
        user: null,
        token: null,
      };
      console.log(`[Auth Mock] User logged out`);
      resolve();
    }, 100);
  });
}

/**
 * Mock function to check authentication status.
 * @returns Whether the user is authenticated.
 */
function isAuthenticated(): boolean {
  console.log(
    `[Auth Mock] Authentication status: ${mockAuthState.isAuthenticated}`
  );
  return mockAuthState.isAuthenticated;
}

/**
 * Mock function to get the authenticated user's details.
 * @returns The authenticated user's details, or null if not authenticated.
 */
function getUser(): User | null {
  console.log(`[Auth Mock] Retrieved user:`, mockAuthState.user);
  return mockAuthState.user;
}

/**
 * Mock function to get the authentication token.
 * @returns The authentication token, or null if not authenticated.
 */
function getToken(): string | null {
  console.log(`[Auth Mock] Retrieved token: ${mockAuthState.token}`);
  return mockAuthState.token;
}

/**
 * Mock function to reset authentication state (useful for tests).
 */
function resetAuthState(): void {
  mockAuthState = {
    isAuthenticated: false,
    user: null,
    token: null,
  };
  console.log(`[Auth Mock] Authentication state reset`);
}

// Export mock functions
export { login, logout, isAuthenticated, getUser, getToken, resetAuthState };
