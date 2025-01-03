import React, { useState, useEffect } from 'react';
import { getSubscriptionStatus, createSubscriptionSession } from '../services/subscriptionService';
import './SubscriptionPage.css'; // Custom styles for the subscription page

const SubscriptionPage = () => {
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Fetch the user's current subscription status on component mount
    const fetchSubscriptionStatus = async () => {
      try {
        setError(''); // Clear any previous errors
        const status = await getSubscriptionStatus();
        setSubscriptionStatus(status);
      } catch (err) {
        console.error('Error fetching subscription status:', err);
        setError('Failed to fetch subscription status. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionStatus();
  }, []);

  // Handle subscription creation
  const handleSubscribe = async () => {
    setProcessing(true);
    try {
      const session = await createSubscriptionSession();
      if (session.url) {
        window.location.href = session.url; // Redirect to the subscription checkout page
      } else {
        setError('Failed to create a subscription session. Please try again.');
      }
    } catch (err) {
      console.error('Error creating subscription session:', err);
      setError('An error occurred while creating a subscription session.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="subscription-page" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Subscription</h1>

      {loading && (
        <div className="loading" aria-busy="true" aria-live="polite" style={{ textAlign: 'center', margin: '20px' }}>
          <p>Loading your subscription status...</p>
        </div>
      )}

      {error && (
        <div className="error-message" role="alert" style={{ color: 'red', margin: '20px 0' }}>
          {error}
        </div>
      )}

      {!loading && subscriptionStatus && (
        <div className="subscription-status" style={{ margin: '20px 0' }}>
          <p>
            Current Status: <strong>{subscriptionStatus.active ? 'Active' : 'Inactive'}</strong>
          </p>
          {subscriptionStatus.active ? (
            <p style={{ color: 'green' }}>Thank you for being a premium member!</p>
          ) : (
            <p style={{ color: 'orange' }}>Your subscription is not active. Consider subscribing to access premium features.</p>
          )}
        </div>
      )}

      {!loading && !subscriptionStatus?.active && (
        <button
          onClick={handleSubscribe}
          disabled={processing}
          style={{
            padding: '10px 20px',
            fontSize: '1rem',
            cursor: 'pointer',
            border: 'none',
            backgroundColor: '#007bff',
            color: '#fff',
            borderRadius: '5px',
          }}
        >
          {processing ? 'Processing...' : 'Subscribe Now'}
        </button>
      )}
    </div>
  );
};

export default SubscriptionPage;
