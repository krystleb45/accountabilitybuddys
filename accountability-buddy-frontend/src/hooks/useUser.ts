import { useContext, useCallback } from "react";
import { useUserSubscription } from "../context/data/UserSubscriptionContext";
import { User, SubscriptionPlan } from "../types/User.types"; // Import centralized User type

/**
 * Custom hook for accessing and managing user-related data.
 *
 * Provides access to the current user, subscription details, and authentication state.
 */
const useUser = (): {
  user: User | null;
  subscriptionPlan: SubscriptionPlan | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateSubscription: (plan: SubscriptionPlan) => void;
} => {
  const context = useUserSubscription();

  if (!context) {
    throw new Error("useUser must be used within a UserSubscriptionProvider");
  }

  const { user, subscriptionPlan, isAuthenticated, login, logout, updateSubscription } = context;

  return {
    user,
    subscriptionPlan,
    isAuthenticated,
    login,
    logout,
    updateSubscription,
  };
};

export default useUser;
