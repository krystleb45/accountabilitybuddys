import React from 'react';
import PropTypes from 'prop-types';

function SimpleComponent({ message }) {
  return (
    <p role="contentinfo" aria-live="polite" aria-atomic="true">
      {message}
    </p>
  );
}

SimpleComponent.propTypes = {
  message: PropTypes.string
};

SimpleComponent.defaultProps = {
  message: 'Simple Component'
};

export default SimpleComponent;
