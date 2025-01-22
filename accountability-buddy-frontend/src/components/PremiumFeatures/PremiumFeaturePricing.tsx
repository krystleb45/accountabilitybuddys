import React from "react";
import "./PremiumFeaturePricing.module.css";

interface PricingPlan {
  name: string;
  price: string;
  features: string[];
  isRecommended?: boolean;
}

interface PremiumFeaturePricingProps {
  plans: PricingPlan[];
  onSubscribe: (planName: string) => void;
}

const PremiumFeaturePricing: React.FC<PremiumFeaturePricingProps> = ({
  plans,
  onSubscribe,
}) => {
  return (
    <div className="premium-feature-pricing">
      <h2>Choose Your Plan</h2>
      <div className="pricing-plans">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`pricing-plan ${plan.isRecommended ? "recommended" : ""}`}
          >
            <h3>{plan.name}</h3>
            <p className="price">{plan.price}</p>
            <ul>
              {plan.features.map((feature, index) => (
                <li key={index}>{feature}</li>
              ))}
            </ul>
            <button onClick={() => onSubscribe(plan.name)} className="subscribe-button">
              Subscribe
            </button>
            {plan.isRecommended && <span className="badge">Recommended</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PremiumFeaturePricing;
