import React from "react";
import "./PremiumFeatureB.module.css";

interface PremiumFeatureBProps {
  featureName: string;
  details: string;
  enabled: boolean;
  onEnable: () => void;
  onDisable: () => void;
}

const PremiumFeatureB: React.FC<PremiumFeatureBProps> = ({
  featureName,
  details,
  enabled,
  onEnable,
  onDisable,
}) => {
  return (
    <div className={`premium-feature-b ${enabled ? "enabled" : "disabled"}`}>
      <h3>{featureName}</h3>
      <p>{details}</p>
      <div className="action-buttons">
        {enabled ? (
          <button onClick={onDisable} className="disable-button">
            Disable
          </button>
        ) : (
          <button onClick={onEnable} className="enable-button">
            Enable
          </button>
        )}
      </div>
    </div>
  );
};

export default PremiumFeatureB;
