export interface PremiumFeatureProps {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  isRecommended?: boolean;
}

export interface PremiumFeatureAProps {
  title: string;
  description: string;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}

export interface PremiumFeatureBProps {
  featureName: string;
  details: string;
  enabled: boolean;
  onEnable: () => void;
  onDisable: () => void;
}

export interface PremiumFeatureCProps {
  heading: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}

export interface PremiumFeaturePricingProps {
  plans: PricingPlan[];
  onSubscribe: (planName: string) => void;
}
