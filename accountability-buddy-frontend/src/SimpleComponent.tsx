import React from "react";

interface SimpleComponentProps {
  message?: string;
}

const SimpleComponent: React.FC<SimpleComponentProps> = ({ message = "Simple Component" }) => {
  return (
    <p role="contentinfo" aria-live="polite" aria-atomic="true">
      {message}
    </p>
  );
};

export default SimpleComponent;
