import React, { useEffect, useState } from 'react';
import {
  fetchSubscriptionDetails,
  updateSubscription,
  cancelSubscription,
} from 'src/utils/stripeHelpers'; // Utility functions
import { SubscriptionDetails } from './types'; // Type definitions
import styles from './Stripe.module.css'; // CSS module for styling

const ManageSubscription: React.FC = () => {
  const [subscription, setSubscription] = useState<SubscriptionDetails | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    const getSubscriptionDetails = async () => {
      try {
        setLoading(true);
        const details = await fetchSubscriptionDetails(); // Fetch current subscription details
        setSubscription(details);
        setError(null);
      } catch (err: any) {
        setError('Failed to load subscription details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    getSubscriptionDetails();
  }, []);

  const handleUpdateSubscription = async (planId: string) => {
    try {
      setUpdating(true);
      await updateSubscription({ planId }); // Update subscription plan
      const updatedDetails = await fetchSubscriptionDetails();
      setSubscription(updatedDetails);
    } catch (err: any) {
      setError('Failed to update subscription. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handleCancelSubscription = async () => {
    try {
      setUpdating(true);
      await cancelSubscription(); // Cancel subscription
      setSubscription(null);
    } catch (err: any) {
      setError('Failed to cancel subscription. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <p className={styles.loading}>Loading subscription details...</p>;
  }

  if (error) {
    return <p className={styles.error}>{error}</p>;
  }

  return (
    <div className={styles.subscriptionContainer}>
      <h2 className={styles.heading}>Manage Your Subscription</h2>
      {!subscription ? (
        <p className={styles.noSubscription}>
          You don't have an active subscription.
        </p>
      ) : (
        <div>
          <p>
            <strong>Plan:</strong> {subscription.planName}
          </p>
          <p>
            <strong>Status:</strong> {subscription.status}
          </p>
          <p>
            <strong>Next Billing Date:</strong>{' '}
            {new Date(subscription.nextBillingDate).toLocaleDateString()}
          </p>
          <div className={styles.actions}>
            <button
              className={styles.button}
              onClick={() => handleUpdateSubscription('new-plan-id')} // Replace 'new-plan-id' with the appropriate plan ID
              disabled={updating}
            >
              Upgrade/Downgrade Plan
            </button>
            <button
              className={`${styles.button} ${styles.cancelButton}`}
              onClick={handleCancelSubscription}
              disabled={updating}
            >
              Cancel Subscription
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageSubscription;
