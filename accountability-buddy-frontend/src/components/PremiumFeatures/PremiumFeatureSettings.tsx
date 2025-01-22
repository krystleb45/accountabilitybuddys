import React from "react";
import "./PremiumFeatureSettings.module.css";

interface PremiumFeatureSettingsProps {
  features: {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
  }[];
  onToggleFeature: (id: string) => void;
}

const PremiumFeatureSettings: React.FC<PremiumFeatureSettingsProps> = ({
  features,
  onToggleFeature,
}) => {
  return (
    <div className="premium-feature-settings" role="region" aria-labelledby="premium-feature-settings-header">
      <h2 id="premium-feature-settings-header">Premium Feature Settings</h2>
      <ul className="feature-list">
        {features.map((feature) => (
          <li
            key={feature.id}
            className={`feature-item ${feature.isActive ? "active" : "inactive"}`}
          >
            <div className="feature-details">
              <h3 className="feature-name">{feature.name}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
            <button
              onClick={() => onToggleFeature(feature.id)}
              className={
                feature.isActive ? "deactivate-button" : "activate-button"
              }
              aria-label={
                feature.isActive
                  ? `Deactivate ${feature.name}`
                  : `Activate ${feature.name}`
              }
            >
              {feature.isActive ? "Deactivate" : "Activate"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PremiumFeatureSettings;
