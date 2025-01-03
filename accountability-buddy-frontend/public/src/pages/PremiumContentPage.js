import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSubscriptionStatus } from '../services/subscriptionService';
import './PremiumContentPage.css'; // Import the CSS for spinner and other styles

const PremiumContentPage = () => {
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [redirectCountdown, setRedirectCountdown] = useState(3); // Countdown for redirect
  const navigate = useNavigate();

  // Check subscription status on component mount
  useEffect(() => {
    const checkSubscription = async () => {
      setLoading(true);
      setError('');
      try {
        const status = await getSubscriptionStatus();
        setSubscriptionActive(status.active);
      } catch (err) {
        console.error('Failed to fetch subscription status:', err);
        setError('Failed to verify subscription. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    checkSubscription();
  }, []);

  // Start countdown if the subscription is inactive
  useEffect(() => {
    if (!subscriptionActive && !loading) {
      const countdownInterval = setInterval(() => {
        setRedirectCountdown((prevCountdown) => {
          if (prevCountdown === 1) {
            clearInterval(countdownInterval);
            navigate('/subscribe'); // Redirect after countdown
          }
          return prevCountdown - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [subscriptionActive, loading, navigate]);

  return (
    <div className="premium-content-page" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Premium Content</h1>

      {loading && (
        <div className="loading" aria-busy="true" aria-live="polite" style={{ textAlign: 'center', margin: '20px' }}>
          <p>Loading subscription status...</p>
        </div>
      )}

      {error && (
        <div className="error-message" role="alert" style={{ color: 'red', margin: '20px 0' }}>
          {error}
        </div>
      )}

      {!loading && subscriptionActive && (
        <div className="premium-content" style={{ marginTop: '20px' }}>
          <h2>Welcome to Premium Content!</h2>
          <p>You now have access to all the exclusive features and content available to premium members.</p>
        </div>
      )}

      {!loading && !subscriptionActive && (
        <div className="redirect-message" style={{ marginTop: '20px' }}>
          <p>
            You do not have an active subscription. Redirecting to the subscription page in{' '}
            <strong>{redirectCountdown}</strong> seconds...
          </p>
        </div>
      )}
    </div>
  );
};

export default PremiumContentPage;
