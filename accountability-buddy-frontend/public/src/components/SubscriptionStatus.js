import React, { useEffect, useState, useCallback } from 'react';
import { getSubscriptionStatus } from '../services/subscriptionService';
import './SubscriptionStatus.css'; // Optional CSS for styling

const SubscriptionStatus = () => {
  const [status, setStatus] = useState('loading');  // 'loading', 'error', 'success'
  const [subscriptionStatus, setSubscriptionStatus] = useState('');
  const [error, setError] = useState('');

  const fetchStatus = useCallback(async () => {
    setError('');
    setStatus('loading');

    try {
      const result = await getSubscriptionStatus();
      setSubscriptionStatus(result.status || 'No active subscription');
      setStatus('success');
    } catch (err) {
      console.error('Error fetching subscription status:', err);
      setError('Failed to fetch subscription status. Please try again.');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  return (
    <div className="subscription-status" role="region" aria-live="polite">
      <h2>Your Subscription Status</h2>

      {status === 'loading' && (
        <p className="loading-message" aria-busy="true">
          Loading your subscription status...
        </p>
      )}

      {status === 'success' && (
        <p className="success-message" aria-live="polite">
          {subscriptionStatus}
        </p>
      )}

      {status === 'error' && (
        <div className="error-container">
          <p className="error-message" role="alert" aria-live="assertive">
            {error}
          </p>
          <button 
            onClick={fetchStatus} 
            className="retry-button"
            disabled={status === 'loading'}
            aria-label="Retry fetching subscription status"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};

export default SubscriptionStatus;
