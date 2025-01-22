// UserSubscriptionContext.tsx

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react';
import { SubscriptionPlan, User } from '@/types/User.types'; // Replace with actual types if available

interface UserSubscriptionContextType {
  user: User | null;
  subscriptionPlan: SubscriptionPlan | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateSubscription: (plan: SubscriptionPlan) => void;
}

const UserSubscriptionContext = createContext<
  UserSubscriptionContextType | undefined
>(undefined);

const UserSubscriptionProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] =
    useState<SubscriptionPlan | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    // Simulate fetching user and subscription data from storage or an API
    const storedUser = localStorage.getItem('user');
    const storedPlan = localStorage.getItem('subscriptionPlan');
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedPlan) setSubscriptionPlan(JSON.parse(storedPlan));
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setSubscriptionPlan(null);
    localStorage.removeItem('user');
    localStorage.removeItem('subscriptionPlan');
  };

  const updateSubscription = (plan: SubscriptionPlan) => {
    setSubscriptionPlan(plan);
    localStorage.setItem('subscriptionPlan', JSON.stringify(plan));
  };

  return (
    <UserSubscriptionContext.Provider
      value={{
        user,
        subscriptionPlan,
        isAuthenticated,
        login,
        logout,
        updateSubscription,
      }}
    >
      {children}
    </UserSubscriptionContext.Provider>
  );
};

const useUserSubscription = (): UserSubscriptionContextType => {
  const context = useContext(UserSubscriptionContext);
  if (!context) {
    throw new Error(
      'useUserSubscription must be used within a UserSubscriptionProvider'
    );
  }
  return context;
};

export { UserSubscriptionProvider, useUserSubscription };
