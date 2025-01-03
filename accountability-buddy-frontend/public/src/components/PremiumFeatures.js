import React, { useState } from 'react';
import { trackEvent, trackConversion } from '../analytics/googleAnalytics';
import StripeCheckout from './payments/StripeCheckout'; // Import the StripeCheckout component
import './PremiumFeatures.css';

const PremiumFeatures = () => {
  const [isPremium, setIsPremium] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle user clicking the upgrade button
  const handleUpgradeClick = () => {
    setShowPayment(true);
    trackEvent({ category: 'Button Click', action: 'Clicked Upgrade Button' }); // Track upgrade click
  };

  // Handle successful payment
  const handlePaymentSuccess = () => {
    setIsPremium(true); // Mark user as premium
    trackConversion('Upgrade', 'User upgraded to Premium'); // Track conversion
    alert('Congratulations! You have upgraded to Premium.');
    setShowPayment(false); // Hide payment form
  };

  // Handle failed payment
  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    alert('Payment failed. Please try again.');
  };

  return (
    <div className="premium-features" role="region" aria-label="Premium Features">
      <h3 className="premium-title">Unlock Premium Features</h3>

      {isPremium ? (
        <div className="premium-content" role="region" aria-label="Premium Content">
          <p><strong>Welcome to Premium!</strong> You now have access to:</p>
          <ul>
            <li>Advanced analytics for better insights</li>
            <li>Personalized coaching and mentoring</li>
            <li>Exclusive communities and forums</li>
            <li>Priority support and early access to new features</li>
          </ul>
        </div>
      ) : (
        <div className="upgrade-prompt" role="region" aria-label="Upgrade Prompt">
          <p>Upgrade to access personalized coaching, advanced analytics, and exclusive communities.</p>
          {showPayment ? (
            <StripeCheckout
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
              loading={setLoading}
            />
          ) : (
            <button
              onClick={handleUpgradeClick}
              className="upgrade-button"
              disabled={loading}
              aria-busy={loading}
              aria-label="Upgrade to Premium"
            >
              {loading ? 'Processing...' : 'Upgrade Now'}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default PremiumFeatures;
