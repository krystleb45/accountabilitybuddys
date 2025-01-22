/**
 * Represents a subscription plan.
 */
export interface SubscriptionPlan {
    /** Unique identifier for the subscription plan. */
    id: string;
  
    /** Name of the subscription plan (e.g., "Basic", "Pro"). */
    name: string;
  
    /** Description of the subscription plan. */
    description: string;
  
    /** Monthly cost of the subscription plan (in cents). */
    monthlyCost: number;
  
    /** Annual cost of the subscription plan (in cents, optional). */
    annualCost?: number;
  
    /** List of features included in the subscription plan. */
    features: string[];
  
    /** Indicates if the plan is currently active or deprecated. */
    isActive: boolean;
  
    /** Date when the plan was created (ISO format). */
    createdAt: string;
  
    /** Date when the plan was last updated (ISO format, optional). */
    updatedAt?: string;
  }
  
  /**
   * Represents the status of a user's subscription.
   */
  export interface SubscriptionStatus {
    /** Status of the subscription (e.g., "active", "inactive", "canceled"). */
    status: "active" | "inactive" | "canceled";
  
    /** Unique identifier for the current subscription plan. */
    planId: string;
  
    /** Name of the current subscription plan. */
    planName: string;
  
    /** Start date of the subscription (ISO format). */
    startDate: string;
  
    /** End date of the subscription (ISO format, optional for recurring). */
    endDate?: string;
  
    /** Indicates if the subscription is currently in a trial period. */
    isTrial: boolean;
  
    /** Number of days remaining in the trial period (optional). */
    trialDaysRemaining?: number;
  
    /** Date when the subscription was last updated (ISO format). */
    updatedAt?: string;
  }
  
  /**
   * Represents user preferences or metadata for subscriptions.
   */
  export interface SubscriptionPreferences {
    /** Indicates if the user has opted for auto-renewal. */
    autoRenew: boolean;
  
    /** Preferred payment method (e.g., "credit_card", "paypal"). */
    paymentMethod: "credit_card" | "paypal" | "bank_transfer";
  
    /** List of email notifications the user has opted into (optional). */
    emailNotifications?: string[];
  
    /** Metadata for storing additional preferences or data. */
    metadata?: Record<string, any>;
  }
  
  /**
   * Represents the response from the subscription API.
   */
  export interface SubscriptionResponse {
    /** Total number of subscription plans available. */
    totalPlans: number;
  
    /** Array of subscription plans. */
    plans: SubscriptionPlan[];
  
    /** Current subscription status of the user. */
    userSubscriptionStatus?: SubscriptionStatus;
  }
  