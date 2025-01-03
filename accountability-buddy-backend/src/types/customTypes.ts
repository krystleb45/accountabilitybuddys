// src/types/customTypes.ts

// User type definition
export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash?: string; // Optional for scenarios excluding password
}

// Token payload type for JWT
export interface TokenPayload {
  id: string;
  email: string;
  iat: number; // Issued at
  exp: number; // Expiry
}

// Redis client configuration
export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
}
