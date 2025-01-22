// Represents the details of a user's subscription
export interface SubscriptionDetails {
  id: string; // Unique identifier for the subscription
  planName: string; // Name of the subscription plan (e.g., "Pro Plan")
  status: 'active' | 'canceled' | 'past_due' | 'incomplete' | 'trialing'; // Current subscription status
  nextBillingDate?: string; // Next billing date as an ISO string (if applicable)
  createdAt: string; // Subscription creation date as an ISO string
  canceledAt?: string; // Date the subscription was canceled, if applicable
}

// Represents a single item in the billing history
export interface BillingHistoryItem {
  id: string; // Unique identifier for the billing history item
  date: string; // Date of the billing transaction as an ISO string
  description: string; // Description of the transaction (e.g., "Monthly Plan Payment")
  amount: number; // Transaction amount in cents (e.g., 1099 for $10.99)
  status: 'paid' | 'pending' | 'failed'; // Transaction status
}

// Represents the response from the backend when fetching subscription details
export interface SubscriptionDetailsResponse {
  subscription: SubscriptionDetails | null; // Subscription details or null if no subscription exists
}

// Represents the response from the backend when fetching billing history
export interface BillingHistoryResponse {
  billingHistory: BillingHistoryItem[]; // Array of billing history items
}

// Payload for updating a subscription
export interface UpdateSubscriptionPayload {
  planId: string; // ID of the new plan to switch to
}

// Payload for canceling a subscription
export interface CancelSubscriptionPayload {
  subscriptionId: string; // ID of the subscription to cancel
}

// Represents the response when fetching subscription status
export interface SubscriptionStatusResponse {
  status: string; // Current subscription status (e.g., "active", "canceled")
}
