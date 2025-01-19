import React from 'react';
import './SampleComponent.css'; // Optional: Include a CSS file for styling

const SampleComponent: React.FC = () => {
  return (
    <div className="sample-container">
      <h1 className="sample-title">Sample Component</h1>
      <p className="sample-description">
        This is a simple React component used for Cypress testing.
      </p>
      <button className="sample-button" onClick={() => alert('Button Clicked!')}>
        Click Me
      </button>
    </div>
  );
};

export default SampleComponent;
