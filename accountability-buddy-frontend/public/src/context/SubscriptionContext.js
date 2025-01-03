import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';

// Create Subscription Context
const SubscriptionContext = createContext();

// Custom hook to use SubscriptionContext
export const useSubscription = () => useContext(SubscriptionContext);

// Default subscription state
const defaultSubscription = {
  isSubscribed: false,
  plan: 'free', // Example: 'free', 'basic', 'premium'
  expiryDate: null, // Stores the expiration date of the subscription
};

// Subscription Provider component
export const SubscriptionProvider = ({ children }) => {
  const [subscription, setSubscription] = useState(() => {
    const savedSubscription = localStorage.getItem('userSubscription');
    return savedSubscription ? JSON.parse(savedSubscription) : defaultSubscription;
  });

  // Subscribe to a specific plan
  const subscribe = useCallback((plan, durationInDays) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + durationInDays);

    const newSubscription = {
      isSubscribed: true,
      plan,
      expiryDate: expiryDate.toISOString(),
    };

    setSubscription(newSubscription);
    localStorage.setItem('userSubscription', JSON.stringify(newSubscription));
  }, []);

  // Unsubscribe and reset to default
  const unsubscribe = useCallback(() => {
    setSubscription(defaultSubscription);
    localStorage.removeItem('userSubscription');
  }, []);

  // Check if the subscription is expired
  const isSubscriptionExpired = useCallback(() => {
    if (!subscription.expiryDate) return false;
    return new Date(subscription.expiryDate) < new Date();
  }, [subscription.expiryDate]);

  // Effect to handle expired subscriptions
  useEffect(() => {
    if (subscription.isSubscribed && isSubscriptionExpired()) {
      unsubscribe();
    }
  }, [subscription, isSubscriptionExpired, unsubscribe]);

  return (
    <SubscriptionContext.Provider value={{ subscription, subscribe, unsubscribe, isSubscriptionExpired }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext;
