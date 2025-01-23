/**
 * Represents a user profile in the application.
 */
export interface UserProfile {
  /** Unique identifier for the user. */
  id: string;

  /** Full name of the user. */
  name: string;

  /** Unique username for the user. */
  username: string;

  /** Email address of the user. */
  email: string;

  /** URL of the user's profile picture (optional). */
  profilePictureUrl?: string;

  /** Role of the user (e.g., "admin", "user"). */
  role?: 'admin' | 'user';

  /** Date when the user joined (ISO string). */
  joinedAt?: string;

  /** Indicates if the user is active or deactivated. */
  isActive?: boolean;

  /** Metadata for additional custom fields (optional). */
  metadata?: Record<string, unknown>;
}

/**
 * Represents a user in the application (extends UserProfile for shared fields).
 */
export interface User extends UserProfile {
  /** ID of the subscription plan the user is enrolled in (optional). */
  subscriptionId?: string;
}

/**
 * Represents a subscription plan available in the application.
 */
export interface SubscriptionPlan {
  /** Unique identifier for the subscription plan. */
  id: string;

  /** Name of the subscription plan (e.g., "Premium", "Basic"). */
  name: string;

  /** Price of the subscription plan in cents (to avoid floating-point errors). */
  price: number;

  /** List of features included in the subscription plan. */
  features: string[];

  /** Indicates if the plan is a free tier. */
  isFreeTier?: boolean;

  /** Indicates the billing cycle (e.g., "monthly", "yearly"). */
  billingCycle?: 'monthly' | 'yearly';

  /** Additional metadata or custom fields for the subscription plan. */
  metadata?: Record<string, unknown>;
}

/**
 * Represents the user's subscription details.
 */
export interface UserSubscription {
  /** The current subscription plan. */
  plan: SubscriptionPlan;

  /** Date when the subscription started (ISO string). */
  startDate: string;

  /** Date when the subscription will renew or expire (ISO string). */
  renewalDate: string;

  /** Status of the subscription (e.g., "active", "inactive", "canceled"). */
  status: 'active' | 'inactive' | 'canceled';

  /** Payment method associated with the subscription. */
  paymentMethod?: string;

  /** Metadata for additional custom fields (optional). */
  metadata?: Record<string, unknown>;
}
