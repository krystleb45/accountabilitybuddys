// Enhanced Auth Configuration
const authConfig = {
  tokenKey: "authToken", // Key for storing access tokens
  refreshTokenKey: "refreshToken", // Key for storing refresh tokens
  tokenExpiryKey: "tokenExpiry", // Key for storing token expiry time
  loginRedirect: "/dashboard",
  logoutRedirect: "/login",

  // Methods to handle Access Token
  getToken: (): string | null => localStorage.getItem(authConfig.tokenKey),
  setToken: (token: string): void => localStorage.setItem(authConfig.tokenKey, token),
  removeToken: (): void => localStorage.removeItem(authConfig.tokenKey),

  // Methods to handle Refresh Token
  getRefreshToken: (): string | null => localStorage.getItem(authConfig.refreshTokenKey),
  setRefreshToken: (token: string): void => localStorage.setItem(authConfig.refreshTokenKey, token),
  removeRefreshToken: (): void => localStorage.removeItem(authConfig.refreshTokenKey),

  // Token Expiry Handling
  getTokenExpiry: (): number | null => {
    const expiry = localStorage.getItem(authConfig.tokenExpiryKey);
    return expiry ? parseInt(expiry, 10) : null;
  },
  setTokenExpiry: (expiry: number): void => localStorage.setItem(authConfig.tokenExpiryKey, expiry.toString()),
  isTokenExpired: (): boolean => {
    const expiryTime = authConfig.getTokenExpiry();
    return expiryTime !== null && Date.now() >= expiryTime;
  },

  // Clear all Auth Data
  clearAuthData: (): void => {
    authConfig.removeToken();
    authConfig.removeRefreshToken();
    localStorage.removeItem(authConfig.tokenExpiryKey);
  },

  // OAuth Providers Configuration
  authProviders: {
    google: {
      clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || "",
      redirectUri: process.env.REACT_APP_GOOGLE_REDIRECT_URI || "",
      scope: "profile email", // Scope for OAuth
      responseType: "token", // Response type for OAuth flow
    },
    facebook: {
      clientId: process.env.REACT_APP_FACEBOOK_CLIENT_ID || "",
      redirectUri: process.env.REACT_APP_FACEBOOK_REDIRECT_URI || "",
      scope: "public_profile email", // Scope for OAuth
      responseType: "token", // Response type for OAuth flow
    },
  },

  // Utility: Check if Auth Provider is Configured
  isAuthProviderConfigured: (provider: keyof typeof authConfig.authProviders): boolean => {
    const config = authConfig.authProviders[provider];
    return Boolean(config.clientId && config.redirectUri);
  },
};

export default authConfig;
