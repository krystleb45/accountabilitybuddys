import React, { useState } from 'react';
import { trackEvent, trackConversion } from 'src/services/googleAnalytics';
import StripeCheckout from '../Stripe/StripeCheckout'; // Import the StripeCheckout component
import './PremiumFeatures.css';

const PremiumFeatures: React.FC = () => {
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [showPayment, setShowPayment] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

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
  const handlePaymentFailure = () => {
    alert('Payment failed. Please try again.');
    setLoading(false); // Reset loading state
  };

  return (
    <div className="premium-features">
      <h2>Premium Features</h2>
      {isPremium ? (
        <p>
          Thank you for being a Premium member! Enjoy your exclusive features.
        </p>
      ) : (
        <>
          <p>
            Upgrade to Premium to unlock all features and enhance your
            experience.
          </p>
          <button onClick={handleUpgradeClick} disabled={loading}>
            {loading ? 'Loading...' : 'Upgrade to Premium'}
          </button>
          {showPayment && (
            <StripeCheckout
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentFailure} // Handle errors
              setLoading={setLoading} // Pass the setLoading state
            />
          )}
        </>
      )}
    </div>
  );
};

export default PremiumFeatures;
