import React from 'react';
import './PremiumFeatureC.module.css';

interface PremiumFeatureCProps {
  heading: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}

const PremiumFeatureC: React.FC<PremiumFeatureCProps> = ({
  heading,
  description,
  active,
  onToggle,
}) => {
  return (
    <div className={`premium-feature-c ${active ? 'active' : 'inactive'}`}>
      <h3>{heading}</h3>
      <p>{description}</p>
      <button onClick={onToggle} className="toggle-button">
        {active ? 'Deactivate' : 'Activate'}
      </button>
    </div>
  );
};

export default PremiumFeatureC;
