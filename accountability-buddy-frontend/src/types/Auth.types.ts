/**
 * Represents the structure of an authentication token.
 */
export interface AuthToken {
    /** The JWT token string used for authentication. */
    token: string;
  
    /** The expiration timestamp of the token (in Unix format). */
    expiresAt: number;
  
    /** The type of token (e.g., "Bearer"). */
    type?: string;
  }
  
  /**
   * Represents the structure of a decoded JWT payload.
   */
  export interface DecodedJwtPayload {
    /** The user ID associated with the token. */
    sub: string;
  
    /** The expiration timestamp of the token (in Unix format). */
    exp: number;
  
    /** The issued-at timestamp (in Unix format). */
    iat?: number;
  
    /** The issuer of the token. */
    iss?: string;
  
    /** The audience for which the token is intended. */
    aud?: string | string[];
  }
  
  /**
   * Represents the data required for user login.
   */
  export interface LoginCredentials {
    /** The user's email address. */
    email: string;
  
    /** The user's password. */
    password: string;
  }
  
  /**
   * Represents the data required for user registration.
   */
  export interface RegistrationData {
    /** The user's full name. */
    name: string;
  
    /** The user's email address. */
    email: string;
  
    /** The user's password. */
    password: string;
  
    /** Additional fields for registration. */
    [key: string]: any;
  }
  
  /**
   * Represents the structure of the authenticated user's information.
   */
  export interface AuthenticatedUser {
    /** The unique ID of the user. */
    id: string;
  
    /** The full name of the user. */
    name: string;
  
    /** The email address of the user. */
    email: string;
  
    /** The user's assigned role (e.g., "admin", "user"). */
    role: string;
  
    /** Additional user-related fields. */
    [key: string]: any;
  }
  
  /**
   * Represents the structure of a login response.
   */
  export interface LoginResponse {
    /** The authentication token. */
    token: AuthToken;
  
    /** The authenticated user's information. */
    user: AuthenticatedUser;
  }
  
  /**
   * Represents the structure of a registration response.
   */
  export interface RegistrationResponse {
    /** The registered user's information. */
    user: AuthenticatedUser;
  
    /** The authentication token, if provided upon registration. */
    token?: AuthToken;
  }
  
  /**
   * Represents a response for refreshing the token.
   */
  export interface TokenRefreshResponse {
    /** The new authentication token. */
    token: AuthToken;
  }
  