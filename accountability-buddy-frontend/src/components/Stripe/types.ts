export interface BillingHistoryItem {
    id: string;
    date: string;
    description: string;
    amount: number; // Amount in cents
    status: 'paid' | 'pending' | 'failed';
  }
  // Represents subscription details for a user
export interface SubscriptionDetails {
  id: string; // Subscription ID
  planName: string; // Name of the subscription plan
  status: "active" | "canceled" | "past_due" | "incomplete" | "trialing"; // Subscription status
  nextBillingDate: string; // ISO date string for the next billing date
  createdAt: string; // ISO date string for subscription creation
  canceledAt?: string; // ISO date string if the subscription is canceled
}

// Represents a single item in the user's billing history
export interface BillingHistoryItem {
  id: string; // Unique ID for the billing history record
  date: string; // ISO date string of the transaction
  description: string; // Description of the transaction (e.g., "Monthly Plan Payment")
  amount: number; // Amount in cents
  status: "paid" | "pending" | "failed"; // Transaction status
}

// Represents a response for fetching subscription status
export interface SubscriptionStatusResponse {
  status: string; // Current subscription status (e.g., "active")
}

// Represents a response for fetching billing history
export interface BillingHistoryResponse {
  billingHistory: BillingHistoryItem[]; // List of billing history items
}

// Represents the payload for updating a subscription
export interface UpdateSubscriptionPayload {
  planId: string; // ID of the new plan to switch to
}

// Represents the payload for canceling a subscription
export interface CancelSubscriptionPayload {
  subscriptionId: string; // ID of the subscription to cancel
}
