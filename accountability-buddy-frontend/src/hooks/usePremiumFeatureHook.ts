import { useState, useCallback } from "react";

/**
 * Interface for a Premium Feature.
 */
interface PremiumFeature {
  id: string;
  name: string;
  isActive: boolean;
}

/**
 * Custom hook to manage premium features.
 *
 * @param initialFeatures - Array of initial premium features.
 * @returns An object containing the features state and methods to manage them.
 */
const usePremiumFeatureHook = (initialFeatures: PremiumFeature[]) => {
  const [features, setFeatures] = useState<PremiumFeature[]>(initialFeatures);

  // Toggle the active state of a feature by ID
  const toggleFeature = useCallback((id: string): void => {
    setFeatures((prevFeatures) =>
      prevFeatures.map((feature) =>
        feature.id === id ? { ...feature, isActive: !feature.isActive } : feature
      )
    );
  }, []);

  // Activate a feature by ID
  const activateFeature = useCallback((id: string): void => {
    setFeatures((prevFeatures) =>
      prevFeatures.map((feature) =>
        feature.id === id ? { ...feature, isActive: true } : feature
      )
    );
  }, []);

  // Deactivate a feature by ID
  const deactivateFeature = useCallback((id: string): void => {
    setFeatures((prevFeatures) =>
      prevFeatures.map((feature) =>
        feature.id === id ? { ...feature, isActive: false } : feature
      )
    );
  }, []);

  // Check if a feature is active by ID
  const isFeatureActive = useCallback(
    (id: string): boolean => {
      const feature = features.find((feature) => feature.id === id);
      return feature ? feature.isActive : false;
    },
    [features]
  );

  // Get all active features
  const getActiveFeatures = useCallback(
    (): PremiumFeature[] => features.filter((feature) => feature.isActive),
    [features]
  );

  return {
    features,
    toggleFeature,
    activateFeature,
    deactivateFeature,
    isFeatureActive,
    getActiveFeatures,
  };
};

export default usePremiumFeatureHook;
export type { PremiumFeature };
