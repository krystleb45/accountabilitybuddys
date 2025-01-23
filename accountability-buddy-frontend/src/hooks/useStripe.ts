import { useState, useCallback } from 'react';
import {
  SubscriptionDetails,
  BillingHistoryItem,
  UpdateSubscriptionPayload,
} from 'src/components/Stripe/types';
import axios from 'axios';

/**
 * Custom hook to manage Stripe subscription and billing.
 *
 * Provides utilities for fetching subscription details, billing history,
 * updating subscription plans, and canceling subscriptions.
 *
 * @returns An object containing subscription data, billing history, loading state,
 * error state, and methods to interact with the Stripe API.
 */
export const useStripe = () => {
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(
    null
  );
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch subscription details
  const fetchSubscriptionDetails = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<SubscriptionDetails>(
        '/api/stripe/subscription-details'
      );
      setSubscription(response.data);
    } catch (err: unknown) {
      setError('Failed to fetch subscription details. Please try again.');
      console.error('Error fetching subscription details:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch billing history
  const fetchBillingHistory = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get<{
        billingHistory: BillingHistoryItem[];
      }>('/api/stripe/billing-history');
      setBillingHistory(response.data.billingHistory);
    } catch (err: unknown) {
      setError('Failed to fetch billing history. Please try again.');
      console.error('Error fetching billing history:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update subscription plan
  const updateSubscription = useCallback(
    async (payload: UpdateSubscriptionPayload) => {
      setLoading(true);
      setError(null);

      try {
        await axios.post('/api/stripe/update-subscription', payload);
        await fetchSubscriptionDetails(); // Refresh subscription details after update
      } catch (err: unknown) {
        setError('Failed to update subscription. Please try again.');
        console.error('Error updating subscription:', err);
      } finally {
        setLoading(false);
      }
    },
    [fetchSubscriptionDetails]
  );

  // Cancel subscription
  const cancelSubscription = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await axios.post('/api/stripe/cancel-subscription');
      setSubscription(null); // Clear subscription details after cancellation
    } catch (err: unknown) {
      setError('Failed to cancel subscription. Please try again.');
      console.error('Error canceling subscription:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    subscription,
    billingHistory,
    loading,
    error,
    fetchSubscriptionDetails,
    fetchBillingHistory,
    updateSubscription,
    cancelSubscription,
    clearError,
  };
};
