import React from 'react';
import './PremiumFeatureA.module.css';

interface PremiumFeatureAProps {
  title: string;
  description: string;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}

const PremiumFeatureA: React.FC<PremiumFeatureAProps> = ({
  title,
  description,
  isActive,
  onActivate,
  onDeactivate,
}) => {
  return (
    <div className={`premium-feature-a ${isActive ? 'active' : 'inactive'}`}>
      <h3>{title}</h3>
      <p>{description}</p>
      {isActive ? (
        <button onClick={onDeactivate} className="deactivate-button">
          Deactivate
        </button>
      ) : (
        <button onClick={onActivate} className="activate-button">
          Activate
        </button>
      )}
    </div>
  );
};

export default PremiumFeatureA;
