import React, { useState } from 'react';
import { useStripe } from 'src/hooks/useStripe'; // Custom hook for subscription logic
import './SubscriptionActions.css'; // Optional CSS module for styling

const SubscriptionActions: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { subscription, updateSubscription, cancelSubscription } = useStripe();

  const handleUpgrade = async (planId: string) => {
    setLoading(true);
    setError(null);

    try {
      await updateSubscription({ planId });
      alert('Subscription upgraded successfully!');
    } catch (err: unknown) {
      setError('Failed to upgrade subscription. Please try again.');
      console.error('Upgrade error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await cancelSubscription();
      alert('Subscription canceled successfully.');
    } catch (err: unknown) {
      setError('Failed to cancel subscription. Please try again.');
      console.error('Cancel error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="subscription-actions">
      <h3>Manage Your Subscription</h3>
      {subscription ? (
        <div>
          <p>
            <strong>Current Plan:</strong> {subscription.planName}
          </p>
          <p>
            <strong>Status:</strong> {subscription.status}
          </p>
          <div className="actions">
            <button
              onClick={() => handleUpgrade('new-plan-id')}
              disabled={loading}
              className="action-button upgrade-button"
            >
              Upgrade Plan
            </button>
            <button
              onClick={handleCancel}
              disabled={loading}
              className="action-button cancel-button"
            >
              Cancel Subscription
            </button>
          </div>
          {error && <p className="error">{error}</p>}
        </div>
      ) : (
        <p>You currently do not have an active subscription.</p>
      )}
    </div>
  );
};

export default SubscriptionActions;
