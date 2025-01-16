// Auth Configuration
const authConfig = {
  tokenKey: "authToken", // Updated key for better clarity
  refreshTokenKey: "refreshToken", // Added key for storing refresh tokens
  tokenExpiryKey: "tokenExpiry", // Added key to store token expiry time
  loginRedirect: "/dashboard",
  logoutRedirect: "/login",

  // Function to get stored tokens from localStorage
  getToken: () => localStorage.getItem(authConfig.tokenKey),
  setToken: (token) => localStorage.setItem(authConfig.tokenKey, token),
  removeToken: () => localStorage.removeItem(authConfig.tokenKey),

  // Refresh Token Methods
  getRefreshToken: () => localStorage.getItem(authConfig.refreshTokenKey),
  setRefreshToken: (token) =>
    localStorage.setItem(authConfig.refreshTokenKey, token),
  removeRefreshToken: () => localStorage.removeItem(authConfig.refreshTokenKey),

  // Token Expiry Handling
  getTokenExpiry: () =>
    parseInt(localStorage.getItem(authConfig.tokenExpiryKey), 10),
  setTokenExpiry: (expiry) =>
    localStorage.setItem(authConfig.tokenExpiryKey, expiry.toString()),
  isTokenExpired: () => {
    const expiryTime = authConfig.getTokenExpiry();
    return expiryTime && Date.now() >= expiryTime;
  },

  // OAuth Providers Configuration
  authProviders: {
    google: {
      clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID || "",
      redirectUri: process.env.REACT_APP_GOOGLE_REDIRECT_URI || "",
      scope: "profile email", // Added scope for OAuth
      responseType: "token", // Added response type for OAuth flow
    },
    facebook: {
      clientId: process.env.REACT_APP_FACEBOOK_CLIENT_ID || "",
      redirectUri: process.env.REACT_APP_FACEBOOK_REDIRECT_URI || "",
      scope: "public_profile email",
      responseType: "token",
    },
  },
};

export default authConfig;
