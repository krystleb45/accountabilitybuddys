import React, { createContext, useState, useContext, useCallback, useEffect, ReactNode } from "react";

// Define the shape of the subscription state
interface Subscription {
  isSubscribed: boolean;
  plan: "free" | "basic" | "premium"; // Example subscription plans
  expiryDate: string | null; // Expiry date as an ISO string or null
}

// Define the shape of the SubscriptionContext
interface SubscriptionContextType {
  subscription: Subscription;
  subscribe: (plan: "free" | "basic" | "premium", durationInDays: number) => void;
  unsubscribe: () => void;
  isSubscriptionExpired: () => boolean;
}

// Create SubscriptionContext with the appropriate type
const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Custom hook to use SubscriptionContext
export const useSubscription = (): SubscriptionContextType => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
};

// Default subscription state
const defaultSubscription: Subscription = {
  isSubscribed: false,
  plan: "free",
  expiryDate: null,
};

// SubscriptionProvider component props
interface SubscriptionProviderProps {
  children: ReactNode;
}

// Subscription Provider component
export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const [subscription, setSubscription] = useState<Subscription>(() => {
    const savedSubscription = localStorage.getItem("userSubscription");
    return savedSubscription
      ? JSON.parse(savedSubscription)
      : defaultSubscription;
  });

  // Subscribe to a specific plan
  const subscribe = useCallback((plan: "free" | "basic" | "premium", durationInDays: number) => {
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + durationInDays);

    const newSubscription: Subscription = {
      isSubscribed: true,
      plan,
      expiryDate: expiryDate.toISOString(),
    };

    setSubscription(newSubscription);
    localStorage.setItem("userSubscription", JSON.stringify(newSubscription));
  }, []);

  // Unsubscribe and reset to default
  const unsubscribe = useCallback(() => {
    setSubscription(defaultSubscription);
    localStorage.removeItem("userSubscription");
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
    <SubscriptionContext.Provider
      value={{ subscription, subscribe, unsubscribe, isSubscriptionExpired }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export default SubscriptionContext;
