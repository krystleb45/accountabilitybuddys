import axios from 'axios';
import {
  SubscriptionDetails,
  BillingHistoryItem,
  UpdateSubscriptionPayload,
} from 'src/components/Subscriptions/types'; // Adjust the import path if necessary

// Fetch subscription details
export const fetchSubscriptionDetails =
  async (): Promise<SubscriptionDetails> => {
    try {
      const response = await axios.get<SubscriptionDetails>(
        '/api/subscription/details'
      ); // Adjust API endpoint
      return response.data;
    } catch (error: any) {
      console.error('Error fetching subscription details:', error);
      throw new Error(
        'Failed to fetch subscription details. Please try again.'
      );
    }
  };

// Fetch billing history
export const fetchBillingHistory = async (): Promise<BillingHistoryItem[]> => {
  try {
    const response = await axios.get<{ billingHistory: BillingHistoryItem[] }>(
      '/api/subscription/billing-history'
    ); // Adjust API endpoint
    return response.data.billingHistory;
  } catch (error: any) {
    console.error('Error fetching billing history:', error);
    throw new Error('Failed to fetch billing history. Please try again.');
  }
};

// Update subscription plan
export const updateSubscription = async (
  payload: UpdateSubscriptionPayload
): Promise<void> => {
  try {
    await axios.post('/api/subscription/update', payload); // Adjust API endpoint
  } catch (error: any) {
    console.error('Error updating subscription:', error);
    throw new Error('Failed to update subscription. Please try again.');
  }
};

// Cancel subscription
export const cancelSubscription = async (): Promise<void> => {
  try {
    await axios.post('/api/subscription/cancel'); // Adjust API endpoint
  } catch (error: any) {
    console.error('Error canceling subscription:', error);
    throw new Error('Failed to cancel subscription. Please try again.');
  }
};

// Format a subscription status into a user-friendly string
export const formatSubscriptionStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    active: 'Active',
    canceled: 'Canceled',
    past_due: 'Past Due',
    incomplete: 'Incomplete',
    trialing: 'Trialing',
  };
  return statusMap[status] || 'Unknown';
};

// Format billing amounts from cents to dollars
export const formatAmount = (amountInCents: number): string => {
  return `$${(amountInCents / 100).toFixed(2)}`;
};

// Format an ISO date string to a readable date
export const formatDate = (isoDate: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return new Date(isoDate).toLocaleDateString(undefined, options);
};

// Export all utilities
export default {
  fetchSubscriptionDetails,
  fetchBillingHistory,
  updateSubscription,
  cancelSubscription,
  formatSubscriptionStatus,
  formatAmount,
  formatDate,
};
