import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import './Modal.css';

const Modal = ({ title, content, isVisible, onClose, customClass = '' }) => {
  const modalRef = useRef(null);

  // Close modal on 'Escape' key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isVisible) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, onClose]);

  // Focus on the modal when visible
  useEffect(() => {
    if (isVisible && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={`modal ${customClass}`} ref={modalRef} tabIndex="-1">
        <h2 id="modal-title">{title}</h2>
        <div className="modal-content">{content}</div>
        <button className="close-button" onClick={onClose} aria-label="Close Modal">
          Close
        </button>
      </div>
    </div>
  );
};

// PropTypes for Modal
Modal.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.node.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  customClass: PropTypes.string
};

export default Modal;
