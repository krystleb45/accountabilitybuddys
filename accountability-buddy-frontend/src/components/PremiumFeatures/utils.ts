export const validatePremiumFeature = (
  feature: string,
  allowedFeatures: string[]
): boolean => {
  return allowedFeatures.includes(feature);
};

export const formatPrice = (price: string): string => {
  // Add logic to format price if needed, e.g., ensuring $ symbol
  return price.startsWith('$') ? price : `$${price}`;
};

export const recommendPlan = (
  plans: { name: string; isRecommended?: boolean }[]
): string | null => {
  const recommendedPlan = plans.find((plan) => plan.isRecommended);
  return recommendedPlan ? recommendedPlan.name : null;
};

export const toggleFeatureState = (
  featureState: boolean,
  onActivate: () => void,
  onDeactivate: () => void
): void => {
  if (featureState) {
    onDeactivate();
  } else {
    onActivate();
  }
};
